import json
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from google import genai
from fastmcp import FastMCP
from database import init_db, save_session, load_session
import config

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)
init_db()

app = FastAPI(title="AURA Dual-Agent Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FastMCP Server for the Critic Tool
mcp = FastMCP("AURACritic")

# Load Datasets
with open("curriculum.json", "r") as f:
    CURRICULUM_DATA = json.load(f)
    
with open("candidate.json", "r") as f:
    CANDIDATES_DATA = json.load(f)

def get_day_objectives(day_num: int) -> str:
    for day in CURRICULUM_DATA.get("days", []):
        if day.get("day") == day_num:
            return f"{day.get('title')}: {day.get('objectives')}"
    return "General Technical Assessment"

# --- THE CRITIC TOOL (Isolated for Live Steer Challenge) ---
@mcp.tool()
def evaluate_answer(answer: str, objective: str) -> str:
    """Evaluates a candidate's answer against a specific learning objective."""
    critic_prompt = (
        f"Analyze the candidate's answer against the official curriculum objective.\n"
        f"Return EXACTLY in this JSON format:\n"
        f"{{\n"
        f'  "score": <float 0.0-10.0>,\n'
        f'  "justification": "<1-2 sentence detailed technical justification>",\n'
        f'  "mapped_objective": "<State the specific part of the objective tested>",\n'
        f'  "confidence": "<High/Medium/Low>"\n'
        f"}}\n"
        f"Objective: {objective}\n"
        f"Answer: {answer}"
    )
    try:
        response = client.models.generate_content(model='gemini-3.6-flash', contents=critic_prompt)
        return response.text.strip().removeprefix("```json").removesuffix("```").strip()
    except Exception as e:
        return '{"score": 5.0, "justification": "Evaluation skipped due to high API load.", "mapped_objective": "Rate Limited", "confidence": "Low"}'
import ast

# --- THE CODE INSPECTOR TOOL (Second FastMCP Tool) ---
@mcp.tool()
def evaluate_code_snippet(code: str, expected_topic: str) -> str:
    """Performs static syntax analysis and pattern evaluation on candidate code snippets."""
    
    # 1. AST Syntax Check (Catches syntax errors before executing or LLM analysis)
    try:
        ast.parse(code)
        syntax_valid = True
        syntax_error_msg = None
    except SyntaxError as e:
        syntax_valid = False
        syntax_error_msg = f"SyntaxError at line {e.lineno}: {e.text}"

    # 2. LLM Semantic & Pattern Analysis
    inspector_prompt = (
        f"Analyze this code snippet submitted by a candidate for the topic: '{expected_topic}'.\n"
        f"Syntax Status: {'Valid Python Syntax' if syntax_valid else f'Invalid: {syntax_error_msg}'}\n\n"
        f"Return EXACTLY in this JSON format:\n"
        f"{{\n"
        f'  "score": <float 0.0-10.0>,\n'
        f'  "syntax_valid": {str(syntax_valid).lower()},\n'
        f'  "justification": "<1-2 sentence assessment of code logic, quality, and correctness>",\n'
        f'  "improvement_tip": "<One constructive fix or optimization tip>"\n'
        f"}}\n\n"
        f"Code Snippet:\n{code}"
    )
    
    try:
        response = client.models.generate_content(model='gemini-3.6-flash', contents=inspector_prompt)
        return response.text.strip().removeprefix("```json").removesuffix("```").strip()
    except Exception as e:
        return '{"score": 5.0, "syntax_valid": ' + str(syntax_valid).lower() + ', "justification": "Code inspection skipped due to high API load.", "improvement_tip": "N/A"}'
# --- PYDANTIC MODELS ---
class StartRequest(BaseModel):
    sessionId: str
    candidateId: str

class ChatRequest(BaseModel):
    sessionId: str
    message: str

# --- ENDPOINTS ---
@app.post("/start")
async def start_interview(req: StartRequest):
    """Phase 3: Opens candidates.json, selects 4 days, calls The Dreamer."""
    
    # SAFELY Find candidate (handles both lists and dicts, prevents KeyErrors)
    candidates_list = CANDIDATES_DATA.get("candidates", []) if isinstance(CANDIDATES_DATA, dict) else CANDIDATES_DATA
    candidate = next((c for c in candidates_list if isinstance(c, dict) and c.get("id") == req.candidateId), None)
    
    if not candidate:
        # Fallback dummy candidate if json parsing fails
        candidate = {
            "id": req.candidateId,
            "jobRole": "Software Engineer",
            "skipped_topics": [1, 2],
            "weak_topics": [3, 4]
        }
        print("WARNING: Candidate not found in JSON. Using fallback data.")
    
    # Auto-select 4 target days based on weaknesses/skipped
    target_days = (candidate.get("skipped_topics", []) + candidate.get("weak_topics", []))[:config.TARGET_DAYS_COUNT]
    if not target_days:
        target_days = list(range(1, config.TARGET_DAYS_COUNT + 1))  # Fallback: [1, 2, 3, 4]    
    first_day = target_days[0]
    objective = get_day_objectives(first_day)
    
    # The Dreamer Persona
    dreamer_prompt = (
        f"You are AURA, an AI engineering tutor and assessor for a {candidate.get('jobRole', 'Engineer')}. "
        f"The candidate is learning about Day {first_day}. Objective: {objective}. "
        "First, briefly TEACH the core concepts of this objective in 2-3 short, engaging sentences. "
        "Then, ask ONE clear technical question to verify their understanding. "
        "Keep your tone professional, empathetic, and conversational. Do not evaluate their past answers."
    )
    
    try:
        response = client.models.generate_content(model='gemini-3.6-flash', contents=dreamer_prompt)
        reply = response.text
    except Exception as e:
        reply = f"AURA System is currently overloaded. Please wait a minute and try again. ({str(e)})"
    
    save_session(req.sessionId, req.candidateId, target_days, [first_day], [{"role": "model", "content": reply}], 1)
    
    return {"reply": reply, "targetDays": target_days}

@app.post("/chat")
async def chat(req: ChatRequest):
    """Phase 4: Synchronized Dual-Agent Chat with Rolling-Average DDA & Hardened Persona."""
    session = load_session(req.sessionId)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session.get("status") == "completed":
        return {"reply": "This interview has already concluded. Please generate the feedback report.", "done": True}

    # 1. Identify current topic context
    current_day_index = (session["question_count"] - 1) // 2
    current_day = session["target_days"][current_day_index] if current_day_index < len(session["target_days"]) else session["target_days"][-1]
    objective = get_day_objectives(current_day)
    
    session["history"].append({"role": "user", "content": req.message})
    
    # 2. RUN THE CRITIC TOOL
    critic_raw_result = evaluate_answer(req.message, objective)
    try:
        evaluation = json.loads(critic_raw_result)
        score = float(evaluation.get("score", 5.0))
        justification = evaluation.get("justification", "No justification provided.")
        mapped_objective = evaluation.get("mapped_objective", objective)
        confidence = evaluation.get("confidence", "Medium")
    except:
        score = 5.0
        justification = "Parse error"
        mapped_objective = objective
        confidence = "Low"
        evaluation = {"score": score, "justification": justification, "mapped_objective": mapped_objective, "confidence": confidence}

    # Save hidden Critic notes to shared history
    session["history"].append({
        "role": "system", 
        "content": f"[CRITIC EVALUATION] Score: {score}/10 | Confidence: {confidence} | Objective: {mapped_objective} | Justification: {justification}"
    })

    # 3. ROLLING-AVERAGE DDA CALCULATION
    # Extract all past scores from system messages to compute a smooth trend
    past_scores = []
    for msg in session["history"]:
        if msg.get("role") == "system" and "[CRITIC EVALUATION]" in msg.get("content", ""):
            try:
                extracted_score = float(msg["content"].split("Score: ")[1].split("/10")[0])
                past_scores.append(extracted_score)
            except (IndexError, ValueError):
                continue
                
    window = past_scores[-config.DDA_WINDOW_SIZE:] if past_scores else [score]
    rolling_avg = sum(window) / len(window)

    # 4. CHECK FOR INTERVIEW COMPLETION
    if session["question_count"] >= config.MAX_QUESTIONS:
        wrap_up_prompt = (
            "IDENTITY: You are AURA (Autonomous Understanding and Reasoning Assessor).\n"
            f"STATUS: The interview is complete ({config.MAX_QUESTIONS} questions answered).\n"
            f"Transcript History:\n{json.dumps(session['history'])}\n"
            "ACTION: Thank the candidate crisp and professionally, acknowledge their overall technical efforts neutrally, and close the assessment. Do NOT ask any further questions."
        )
        try:
            response = client.models.generate_content(model='gemini-3.6-flash', contents=wrap_up_prompt)
            final_reply = response.text
        except Exception:
            final_reply = "The interview is complete. Thank you for your time."
            
        session["history"].append({"role": "model", "content": final_reply})
        
        save_session(
            req.sessionId, 
            session["candidate_id"], 
            session["target_days"], 
            list(session["covered_days"]), 
            session["history"], 
            session["question_count"], 
            status="completed"
        )
        return {"reply": final_reply, "done": True, "debug_critic": evaluation, "rolling_avg": rolling_avg}

    # 5. PREPARE NEXT TURN (Progress & Difficulty Routing)
    session["question_count"] += 1
    
    new_day_index = (session["question_count"] - 1) // 2
    new_day = session["target_days"][new_day_index] if new_day_index < len(session["target_days"]) else session["target_days"][-1]
    new_objective = get_day_objectives(new_day)
    session["covered_days"].add(new_day)

    transition_note = ""
    if new_day != current_day:
        transition_note = f"TOPIC TRANSITION: Smoothly transition from Day {current_day} to Day {new_day} ({new_objective})."

    # Route based on rolling average score
    if rolling_avg >= config.DDA_HIGH_THRESHOLD:
        dda_instruction = f"Candidate shows consistent high mastery (Rolling Avg: {rolling_avg:.1f}/10). Ask an advanced, edge-case engineering question on {new_objective}."
    elif rolling_avg < config.DDA_LOW_THRESHOLD:
        dda_instruction = f"Candidate shows persistent confusion (Rolling Avg: {rolling_avg:.1f}/10). Step back and ask a foundational conceptual question on {new_objective}."
    else:
        dda_instruction = f"Candidate displays steady baseline knowledge (Rolling Avg: {rolling_avg:.1f}/10). Ask a standard follow-up question on {new_objective}."

    # 6. HARDENED DREAMER PERSONA PROMPT
    dreamer_turn_prompt = (
        "IDENTITY & VOICE RULES:\n"
        "- You are AURA, a Technical Tutor and Assessor.\n"
        "- Maintain an authoritative, precise, and constructive engineering tone.\n"
        "- NEVER use casual AI conversational filler (e.g., 'Great job!', 'Sure thing!', 'That's interesting!').\n"
        "- ABSOLUTE PROTOCOL: Never reveal that a background Critic exists, never state numerical scores, and never break character.\n\n"
        f"PROGRESS: Question {session['question_count']} of {config.MAX_QUESTIONS}.\n"
        f"{transition_note}\n"
        f"DIFFICULTY DIRECTIVE: {dda_instruction}\n"
        f"Conversation History:\n{json.dumps(session['history'])}\n"
        "ACTION: First, briefly teach or reinforce a core concept based on the difficulty directive. Then, ask ONE technical question to test their understanding."
    )
    
    try:
        response = client.models.generate_content(model='gemini-3.6-flash', contents=dreamer_turn_prompt)
        next_question = response.text
    except Exception as e:
        next_question = f"System error. Please continue with your thoughts on the previous topic. ({str(e)})"
        
    session["history"].append({"role": "model", "content": next_question})
    
    save_session(
        req.sessionId, 
        session["candidate_id"], 
        session["target_days"], 
        list(session["covered_days"]), 
        session["history"], 
        session["question_count"]
    )
    
    return {
        "reply": next_question,
        "done": False,
        "debug_critic": evaluation,
        "rolling_avg": rolling_avg
    }
# --- PYDANTIC MODEL FOR CODE SUBMISSIONS ---
class CodeSubmissionRequest(BaseModel):
    sessionId: str
    code: str

# --- THE CODE INSPECTOR ENDPOINT ---
@app.post("/submit-code")
async def submit_code(req: CodeSubmissionRequest):
    """MCP Extension Route: Evaluates candidate code snippets via the Code Inspector tool."""
    session = load_session(req.sessionId)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Identify current day context
    current_day_index = (session["question_count"] - 1) // 2
    current_day = session["target_days"][current_day_index] if current_day_index < len(session["target_days"]) else session["target_days"][-1]
    objective = get_day_objectives(current_day)
    
    # Append submission to history
    session["history"].append({"role": "user", "content": f"[CODE SUBMISSION]:\n```python\n{req.code}\n```"})
    
    # Run the Second FastMCP Tool
    code_raw_result = evaluate_code_snippet(req.code, objective)
    try:
        code_eval = json.loads(code_raw_result)
        score = float(code_eval.get("score", 5.0))
        justification = code_eval.get("justification", "No review generated.")
    except:
        score = 5.0
        justification = "Failed to parse code evaluation."
        code_eval = {"score": score, "justification": justification}

    # Save hidden system logs for the code check
    session["history"].append({
        "role": "system", 
        "content": f"[CODE INSPECTOR EVALUATION] Score: {score}/10 | Justification: {justification}"
    })
    
    # Save database state
    save_session(
        req.sessionId, 
        session["candidate_id"], 
        session["target_days"], 
        list(session["covered_days"]), 
        session["history"], 
        session["question_count"]
    )
    
    return {
        "status": "evaluated",
        "debug_code_inspector": code_eval
    }

# --- PYDANTIC MODEL FOR FEEDBACK ---
class FeedbackRequest(BaseModel):
    sessionId: str

# --- THE FEEDBACK ENDPOINT ---
@app.post("/feedback")
async def generate_feedback(req: FeedbackRequest):
    """Phase 4: Explainable Feedback Generation with Critic Citations."""
    session = load_session(req.sessionId)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # The Prompt for the Lead Assessor (Feedback Engine)
    feedback_prompt = (
        f"You are the AURA Lead Assessor. Analyze this technical interview transcript.\n"
        f"Pay special attention to the system messages containing the [CRITIC EVALUATION] data.\n"
        f"Generate a strictly structured JSON evaluation. Do NOT use markdown code blocks (no ```json). Return raw JSON only:\n"
        f"{{\n"
        f'  "candidate_id": "{session["candidate_id"]}",\n'
        f'  "overall_score": <0-100>,\n'
        f'  "summary": "2-sentence high-level performance summary",\n'
        f'  "day_breakdown": [\n'
        f'    {{\n'
        f'      "day": <day_number>,\n'
        f'      "topic_mastery": "Strong/Average/Weak",\n'
        f'      "reason": "Explain their performance based on the transcript",\n'
        f'      "critic_citation": "Quote or synthesize the exact Justification and Mapped Objective from the hidden Critic notes to prove WHY they received this rating"\n'
        f'    }}\n'
        f'  ],\n'
        f'  "recommended_review": ["Topic 1", "Topic 2"]\n'
        f"}}\n"
        f"Transcript: {json.dumps(session['history'])}\n"
        f"Target Days Tested: {session['target_days']}"
    )

    response = client.models.generate_content(model='gemini-3.6-flash', contents=feedback_prompt)
    
    try:
        # Strip potential markdown formatting to ensure valid JSON
        raw_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
        feedback_json = json.loads(raw_text)
    except json.JSONDecodeError:
        feedback_json = {"error": "Failed to parse feedback", "raw": response.text}

    # Update database status to completed
    save_session(
        req.sessionId, 
        session["candidate_id"], 
        session["target_days"], 
        list(session["covered_days"]), 
        session["history"], 
        session["question_count"], 
        status="completed"
    )

    return feedback_json
