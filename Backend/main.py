import json
import os
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from google import genai
from state_manager import session_store

# 1. Load the environment variables from the .env file
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI(title="AURA AI Interview Agent")

# 2. Initialize the client securely
client = genai.Client(api_key=API_KEY)

# Safely load curriculum
try:
    with open("curriculum.json", "r") as f:
        CURRICULUM_DATA = json.load(f)
except Exception as e:
    CURRICULUM_DATA = {"days": []}
    print(f"CRITICAL WARNING: Could not load curriculum.json - {e}")

def get_day_objectives(day_num: int) -> Dict[str, Any]:
    for day in CURRICULUM_DATA.get("days", []):
        if day.get("day") == day_num:
            return day
    return {}

class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[Dict[str, Any]] = None
    message: Optional[str] = None

@app.post("/api/interview")
async def handle_interview(req: InterviewRequest):
    try:
        # START INTERVIEW
        if req.candidate is not None:
            session = session_store.get_or_create(req.sessionId, req.candidate)
            first_target_day = session.target_days[0]
            day_info = get_day_objectives(first_target_day)
            session.covered_days.add(first_target_day)
            session.question_count += 1

            system_prompt = (
                f"You are conducting a professional technical interview for a {req.candidate['member']['jobRole']}. "
                f"Focus on Curriculum Day {first_target_day}: '{day_info.get('title')}'. "
                f"Learning objectives for this day: {day_info.get('objectives')}. "
                f"Ask a precise, welcoming technical opening question testing these concepts."
            )

            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=system_prompt + "\n\nUser: Begin the interview."
            )

            welcome_reply = response.text
            session.history.append({"role": "model", "content": welcome_reply})
            return {"reply": welcome_reply, "done": False}

        # Retrieve existing session
        try:
            session = session_store.get_or_create(req.sessionId)
        except ValueError:
            raise HTTPException(status_code=400, detail="Session not initialized.")

        # Add user's new message to history
        if req.message:
            session.history.append({"role": "user", "content": req.message})

        # END INTERVIEW & GENERATE DYNAMIC FEEDBACK
        if session.question_count >= 8 and len(session.covered_days) >= 4:
            session.is_completed = True

            feedback_prompt = (
                f"Analyze this full interview transcript.\n"
                f"Generate a structured JSON evaluation matching this exact format. Do not use markdown blocks, return ONLY raw JSON:\n"
                f"{{\n"
                f'  "summary": "High-level performance summary",\n'
                f'  "strengths": ["Strength 1", "Strength 2"],\n'
                f'  "gaps": ["Gap 1", "Gap 2"],\n'
                f'  "next": ["Next Step 1", "Next Step 2"]\n'
                f"}}\n"
                f"Transcript: {json.dumps(session.history)}"
            )

            feedback_response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=feedback_prompt
            )

            try:
                raw_text = feedback_response.text.strip().removeprefix("```json").removesuffix("```").strip()
                feedback_json = json.loads(raw_text)
            except json.JSONDecodeError:
                feedback_json = {"error": "Failed to parse feedback", "raw": feedback_response.text}

            return {
                "reply": "Thank you for completing the technical assessment. Your evaluation is complete.",
                "done": True,
                "feedback": feedback_json
            }

        # CONVERSATION TURN & DYNAMIC FOLLOW-UP
        session.question_count += 1
        next_day_index = (session.question_count - 1) // 2
        
        if next_day_index < len(session.target_days):
            current_day = session.target_days[next_day_index]
        else:
            current_day = session.target_days[-1]

        session.covered_days.add(current_day)
        day_info = get_day_objectives(current_day)

        turn_system_prompt = (
            f"You are conducting a technical interview. Current Question #{session.question_count}.\n"
            f"Target Topic: Day {current_day} - '{day_info.get('title')}'\n"
            f"Objectives: {day_info.get('objectives')}\n"
            f"Instructions:\n"
            f"1. Evaluate the candidate's previous response briefly and naturally.\n"
            f"2. Ask a logical follow-up or pivot to a new technical question from Day {current_day}.\n"
            f"3. Keep your response concise, professional, and conversational.\n\n"
            f"Conversation History:\n{json.dumps(session.history)}"
        )

        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=turn_system_prompt
        )

        agent_reply = response.text
        session.history.append({"role": "model", "content": agent_reply})
        return {"reply": agent_reply, "done": False}

    except Exception as e:
        error_details = traceback.format_exc()
        print(f"BACKEND CRASH:\n{error_details}")
        return {"reply": f"SYSTEM ERROR: {str(e)}", "done": True, "error_trace": error_details}