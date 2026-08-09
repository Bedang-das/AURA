import json
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from google import genai
from mcp.server.fastmcp import FastMCP # Ensure you ran: pip install mcp
from database import init_db, save_session, load_session

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)
init_db()

app = FastAPI(title="AURA Dual-Agent Engine")

# Initialize FastMCP Server for the Critic Tool
mcp = FastMCP("AURACritic")

# Load Datasets
with open("curriculum.json", "r") as f:
    CURRICULUM_DATA = json.load(f)
    
with open("candidates.json", "r") as f:
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
        f"Compare the candidate's answer to this official curriculum objective. "
        f"Score it from 0-10. Return EXACTLY in this JSON format: "
        f"{{\"score\": 8, \"reason\": \"1-sentence reason here.\"}}\n"
        f"Objective: {objective}\n"
        f"Answer: {answer}"
    )
    # The tool executes its own fast LLM check
    response = client.models.generate_content(model='gemini-3.6-flash', contents=critic_prompt)
    return response.text.strip().removeprefix("```json").removesuffix("```").strip()

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
    target_days = (candidate.get("skipped_topics", []) + candidate.get("weak_topics", []))[:4]
    
    if not target_days:
        target_days = [1, 2, 3, 4] # Fallback
        
    first_day = target_days[0]
    objective = get_day_objectives(first_day)
    
    # The Dreamer Persona
    dreamer_prompt = (
        f"You are AURA, a senior AI engineering manager conducting a technical interview for a {candidate.get('jobRole', 'Engineer')}. "
        "Ask one question at a time. Keep your tone professional, empathetic, and conversational. "
        "Never evaluate the technical accuracy of the answer yourself. "
        f"The candidate needs to be tested on Day {first_day}. Here is the learning objective: {objective}. "
        "Generate a conversational interview question testing this."
    )
    
    response = client.models.generate_content(model='gemini-3.6-flash', contents=dreamer_prompt)
    q1 = response.text
    
    save_session(req.sessionId, req.candidateId, target_days, [first_day], [{"role": "model", "content": q1}], 1)
    
    return {"reply": q1, "targetDays": target_days}

@app.post("/chat")
async def chat(req: ChatRequest):
    """Phase 4: Synchronized Dual-Agent Chat Loop with Progress Tracking."""
    session = load_session(req.sessionId)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session.get("status") == "completed":
        return {"reply": "This interview has already concluded. Please generate the feedback report.", "done": True}

    # 1. Identify the topic they just answered
    current_day_index = (session["question_count"] - 1) // 2
    current_day = session["target_days"][current_day_index] if current_day_index < len(session["target_days"]) else session["target_days"][-1]
    objective = get_day_objectives(current_day)
    
    # Save the user's answer
    session["history"].append({"role": "user", "content": req.message})
    
    # 2. RUN THE CRITIC
    critic_raw_result = evaluate_answer(req.message, objective)
    try:
        evaluation = json.loads(critic_raw_result)
        score = int(evaluation.get("score", 5))
        reason = evaluation.get("reason", "No reason provided.")
    except:
        score = 5
        reason = "Parse error"
        evaluation = {"score": score, "reason": reason}

    # 🌟 SYNCHRONY MAGIC: Inject Critic's notes into the shared history!
    # The user never sees this, but the Dreamer and the Feedback engine will read it.
    session["history"].append({
        "role": "system", 
        "content": f"[CRITIC EVALUATION FOR PREVIOUS ANSWER]: Scored {score}/10. Reason: {reason}"
    })

    # 3. CHECK FOR INTERVIEW END
    if session["question_count"] >= 8:
        wrap_up_prompt = (
            "IDENTITY: You are AURA.\n"
            "STATUS: The interview is now complete (8 questions answered).\n"
            f"Conversation History:\n{json.dumps(session['history'])}\n"
            "ACTION: Thank the candidate for their time, briefly acknowledge their overall performance based on the critic notes, and gracefully end the interview. Do NOT ask any more technical questions."
        )
        response = client.models.generate_content(model='gemini-3.6-flash', contents=wrap_up_prompt)
        final_reply = response.text
        session["history"].append({"role": "model", "content": final_reply})
        
        save_session(req.sessionId, session["candidate_id"], session["target_days"], list(session["covered_days"]), session["history"], session["question_count"], status="completed")
        return {"reply": final_reply, "done": True, "debug_critic": evaluation}

    # 4. PREPARE NEXT TURN (Progress & DDA)
    session["question_count"] += 1
    
    # Check if we are moving to a new day/topic
    new_day_index = (session["question_count"] - 1) // 2
    new_day = session["target_days"][new_day_index] if new_day_index < len(session["target_days"]) else session["target_days"][-1]
    new_objective = get_day_objectives(new_day)
    session["covered_days"].add(new_day)

    # Tell the Dreamer if it needs to pivot topics
    transition_note = ""
    if new_day != current_day:
        transition_note = f"TOPIC SHIFT: You are now transitioning from Day {current_day} to Day {new_day} ({new_objective}). Acknowledge the transition naturally."

    if score >= 8:
        dda_instruction = f"The candidate is doing great. Ask a highly advanced edge-case question on {new_objective}."
    elif score < 5:
        dda_instruction = f"The candidate is struggling. Ask a simpler, foundational question on {new_objective}."
    else:
        dda_instruction = f"The candidate has standard knowledge. Ask a normal follow-up question on {new_objective}."

    # 5. RUN THE DREAMER
    dreamer_turn_prompt = (
        f"IDENTITY: You are AURA, a senior AI engineering manager.\n"
        f"PROGRESS: You are on Question {session['question_count']} out of 8.\n"
        f"{transition_note}\n"
        f"DDA INSTRUCTION: {dda_instruction}\n"
        f"Conversation History:\n{json.dumps(session['history'])}\n"
        f"ACTION: Generate the next conversational interview question. NEVER mention the Critic, the scores, or that you are an AI."
    )
    
    response = client.models.generate_content(model='gemini-3.6-flash', contents=dreamer_turn_prompt)
    next_question = response.text
    session["history"].append({"role": "model", "content": next_question})
    
    save_session(req.sessionId, session["candidate_id"], session["target_days"], list(session["covered_days"]), session["history"], session["question_count"])
    
    return {
        "reply": next_question,
        "done": False,
        "debug_critic": evaluation
    }