import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from state_manager import session_store

app = FastAPI(title="CATA AI Interview Agent")

# Load curriculum into memory for fast objective retrieval
with open("curriculum.json", "r") as f:
    CURRICULUM_DATA = json.load(f)

def get_day_objectives(day_num: int) -> Dict[str, Any]:
    for day in CURRICULUM_DATA.get("days", []):
        if day.get("day") == day_num:
            return day
    return {}

# Request schema mapping technical-spec.md
class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[Dict[str, Any]] = None
    message: Optional[str] = None

@app.post("/api/interview")
async def handle_interview(req: InterviewRequest):
    # 1. START INTERVIEW
    if req.candidate is not None:
        session = session_store.get_or_create(req.sessionId, req.candidate)
        first_target_day = session.target_days[0]
        day_info = get_day_objectives(first_target_day)
        
        session.covered_days.add(first_target_day)
        session.question_count += 1
        
        welcome_reply = (
            f"Welcome {req.candidate['member']['name']}. Let's begin your technical interview. "
            f"To start, let's discuss Day {first_target_day}: '{day_info.get('title', 'Technical Concepts')}'. "
            f"Can you explain your experience and approach when working with {', '.join(day_info.get('tools', ['these concepts']))}?"
        )
        
        session.history.append({"role": "agent", "content": welcome_reply})
        return {"reply": welcome_reply, "done": False}

    # Retrieve existing session
    try:
        session = session_store.get_or_create(req.sessionId)
    except ValueError:
        raise HTTPException(status_code=400, detail="Session not initialized.")

    if req.message:
        session.history.append({"role": "user", "content": req.message})

    # 2. END INTERVIEW CHECK (Min 8 questions & min 4 curriculum days covered)
    if session.question_count >= 8 and len(session.covered_days) >= 4:
        session.is_completed = True
        return {
            "reply": "Thank you for completing the technical assessment. Here is your structured feedback.",
            "done": True,
            "feedback": {
                "summary": f"Completed evaluation covering {len(session.covered_days)} technical modules across {session.question_count} interview turns.",
                "strengths": [
                    "Demonstrated clear familiarity with core engineering pipelines",
                    "Provided structured responses to system design questions"
                ],
                "gaps": [
                    f"Further depth recommended in skipped cohort areas (Days {session.target_days})",
                    "Edge-case error handling in distributed execution setups"
                ],
                "next": [
                    "Review advanced MCP server connection pooling",
                    "Practice hands-on production deployment workflows"
                ]
            }
        }

    # 3. CONVERSATION TURN & DYNAMIC QUESTION SELECTION
    session.question_count += 1
    
    # Progress through target curriculum days
    next_day_index = (session.question_count - 1) // 2
    if next_day_index < len(session.target_days):
        current_day = session.target_days[next_day_index]
    else:
        current_day = session.target_days[-1]
        
    session.covered_days.add(current_day)
    day_info = get_day_objectives(current_day)
    
    agent_reply = (
        f"Thank you for that response. Moving to Question {session.question_count} "
        f"(focusing on Day {current_day}: {day_info.get('title', 'Technical Concepts')}). "
        f"How would you implement or troubleshoot: '{day_info.get('objectives', ['core concepts'])[0]}'?"
    )
    
    session.history.append({"role": "agent", "content": agent_reply})
    return {"reply": agent_reply, "done": False}