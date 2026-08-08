import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# In a real environment, you would use:
# from mcp.server.fastmcp import FastMCP
# mcp = FastMCP("InterviewServer")

app = FastAPI(title="APEX AURA Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Curriculum
CURRICULUM_PATH = os.path.join(os.path.dirname(__file__), "data", "curriculum.json")
def load_curriculum():
    with open(CURRICULUM_PATH, "r") as f:
        return json.load(f)

# Mocking FastMCP Tool Decorator for Hackathon Standalone Server
# In a real FastMCP setup, these would be @mcp.tool()
class MCPMock:
    def __init__(self):
        self.tools = {}
    def tool(self):
        def decorator(func):
            self.tools[func.__name__] = func
            return func
        return decorator

mcp = MCPMock()

@mcp.tool()
def generate_dpp(day_id: int):
    curriculum = load_curriculum()
    day_key = f"day{day_id}"
    if day_key not in curriculum:
        return {"error": "Day not found in curriculum"}
    return curriculum[day_key]["dpp_questions"]

@mcp.tool()
def evaluate_interview_response(candidate_answer: str, topic: str):
    curriculum = load_curriculum()
    # Simple Mock evaluation - Critic logic
    # In reality, Critic uses an LLM to evaluate against curriculum ground truth
    topic_data = curriculum.get(topic, {})
    ground_truth = topic_data.get("ground_truth", {})
    
    if "sqrt(d_k)" in candidate_answer or "vanishing gradients" in candidate_answer.lower():
        score = 85
        feedback = "Candidate understands the variance scaling. Dreamer: Ask them about alternative attention mechanisms."
    else:
        score = 40
        feedback = "Candidate missed the core mathematical property of softmax scaling. Dreamer: Press them on the vanishing gradients issue."
        
    return {
        "score": score,
        "critic_feedback": feedback,
        "ground_truth": ground_truth
    }

class InterviewRequest(BaseModel):
    message: str
    topic: str

@app.post("/api/interview")
async def interview_endpoint(req: InterviewRequest):
    # Step 1: Critic evaluates (State Machine / MCP Tool call)
    eval_result = mcp.tools["evaluate_interview_response"](req.message, req.topic)
    
    # Step 2: Dreamer responds (Mocking LLM call)
    # The Dreamer uses the Critic's feedback to formulate the next question
    if eval_result["score"] >= 80:
        dreamer_response = "Correct. The scaling prevents vanishing gradients in the softmax. Now, considering the O(N^2) complexity of this attention mechanism, what are some sparse or linear approximations you would implement for sequences > 8K tokens?"
    else:
        dreamer_response = "Not quite. Think about the gradients of the softmax function. If the variance of the dot product is high, the values are pushed to the extremes. How does scaling by the square root of the key dimension mathematically prevent this?"
        
    return {
        "agent_response": dreamer_response,
        "critic_score": eval_result["score"]
    }

@app.get("/api/dpp/{day_id}")
async def get_dpp(day_id: int):
    questions = mcp.tools["generate_dpp"](day_id)
    if "error" in questions:
        raise HTTPException(status_code=404, detail=questions["error"])
    return {"questions": questions}

if __name__ == "__main__":
    import uvicorn
    # mcp.run(stateless_http=True) # Official FastMCP run method if used
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
