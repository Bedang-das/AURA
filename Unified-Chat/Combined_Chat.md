# AI Usage Log — AURA (Autonomous Understanding and Reasoning Assessor)

> **Hackathon:** IEEE TechFusion Innovation Challenge 2026  
> **Team:** Bedang Das, Ganesh Nair, Lehalyaa L  
> **Repository:** [github.com/Bedang-das/AURA](https://github.com/Bedang-das/AURA)  
> **Stack:** Python · FastAPI · FastMCP · Google Gemini · SQLite · Next.js · TypeScript

---

## Overview

This document is the official AI Usage Log for the AURA project. It records every major AI-assisted decision, code generation step, architectural discussion, and prompt interaction that took place during the hackathon sprint. The log is organized chronologically by development phase.

All AI interactions were conducted via **Google Gemini** (planning, ideation, backend architecture) and **Claude** (code review, integration, refinement).

---

## Phase 0 — Ideation & Project Scoping

**AI Tool Used:** Google Gemini  
**Purpose:** Evaluate feasibility, name the project, define architecture

### Key Decisions Made with AI Assistance

- Evaluated the hackathon problem statement and shortlisted the **"Dreamer & Critic" dual-agent architecture** as the core strategy — chosen over a single monolithic prompt because it decouples conversational fluency from factual evaluation, eliminating hallucinations.
- Chose **FastMCP + FastAPI** as the backend stack. FastMCP was selected because its `@mcp.tool` decorator pattern allows new evaluation tools to be added within the 20-minute Live Steer Challenge window without touching core routing logic.
- Confirmed **10-hour feasibility** of the full architecture with the three-person team — Bedang Das (backend lead), Ganesh Nair (backend + integration), and Lehalyaa L (frontend) — working in parallel across backend and frontend tracks.
- Project named **AURA** — *Autonomous Understanding and Reasoning Assessor*.

### AI Prompt Summary

```
"I need a good idea for an AI Interview Agent hackathon project. The system must conduct
personalized technical interviews based on a 31-day AI cohort curriculum. It must ask
minimum 8 questions across 4 curriculum days and produce structured feedback."
```

**AI Output Used:** Architecture blueprint (Dreamer & Critic pattern), project name shortlist, 10-hour sprint breakdown, folder structure recommendation.

---

## Phase 1 — Repository Setup & Project Structure

**AI Tool Used:** Google Gemini  
**Purpose:** Define GitHub repo structure, requirements, README

### Actions Taken

- AI generated the recommended repository folder structure separating `backend/` and `frontend/` for parallel development without merge conflicts.
- AI wrote the `requirements.txt` for the backend (`fastapi`, `uvicorn`, `fastmcp`).
- AI drafted the full `README.md` in Markdown including architecture overview, tech stack, local setup instructions, and hackathon compliance checklist.
- AI confirmed public repository requirement for Stage 1 Eligibility Verification.

### AI Prompt Summary

```
"Give me a detailed README file in markdown. Also tell me the basic GitHub structure
so we can build it cleanly with a frontend teammate."
```

**AI Output Used:** README.md content, folder structure, requirements.txt entries.

---

## Phase 2 — Backend Core: FastAPI + Session Management

**AI Tool Used:** Google Gemini  
**Purpose:** Build the foundational FastAPI server and in-memory session manager

### Actions Taken

- AI generated the initial `main.py` with a `POST /api/interview` endpoint conforming to the hackathon's technical specification JSON schema.
- AI designed the `state_manager.py` with the `InterviewSession` and `SessionStore` classes to track question count, covered curriculum days, and conversation history across HTTP requests.
- AI implemented the **weakness targeting engine**: on session start, it parses `candidates.json` for skipped missions and high-attempt days, then selects the 4 most relevant curriculum days to test.
- Verified the endpoint returns `{ "reply": "...", "done": false }` schema matching the technical spec.

### Key Code Generated

```python
class InterviewSession:
    def __init__(self, session_id, candidate_data):
        self.target_days = self._identify_target_days()

    def _identify_target_days(self):
        missions = self.candidate.get("missions", [])
        skipped_days = [m["day"] for m in missions if m.get("skipped")]
        high_attempt_days = [m["day"] for m in missions if m.get("attempts", 0) > 2]
        targets = list(dict.fromkeys(skipped_days + high_attempt_days))
        default_days = [7, 12, 22, 23, 28]
        for day in default_days:
            if len(targets) < 4 and day not in targets:
                targets.append(day)
        return targets[:4]
```

**AI Output Used:** Full `main.py`, `state_manager.py`, endpoint schema, curl test commands.

---

## Phase 3 — LLM Integration: Google Gemini API

**AI Tool Used:** Google Gemini  
**Purpose:** Replace static mock responses with live AI generation

### Actions Taken

- AI guided the swap from OpenAI SDK to **Google Gemini free tier** (`gemini-2.5-flash` → updated to `gemini-3.6-flash` after model deprecation).
- AI generated the `google-genai` SDK integration using `client.models.generate_content()`.
- AI created the `.env` file pattern and `load_dotenv()` setup for secure API key management.
- AI debugged: invalid OAuth token vs. valid `AIzaSy...` API key format (user was copying session credentials instead of API keys from Google AI Studio).
- AI resolved Windows-specific PowerShell quote escaping issues with `curl.exe`.
- AI created `test_api.py` using only Python's built-in `urllib` library to bypass all terminal formatting issues.

### Model Update Required

During testing, `gemini-2.5-flash` returned `404 NOT_FOUND` for new developer accounts. AI identified the fix:

```python
# Updated from:
model='gemini-2.5-flash'
# To:
model='gemini-3.6-flash'
```

**AI Output Used:** Full updated `main.py` with Gemini SDK, `.env` setup, `test_api.py`, debugging steps.

---

## Phase 4 — Permanent Database: SQLite State Management

**AI Tool Used:** Google Gemini  
**Purpose:** Replace volatile in-memory sessions with persistent SQLite storage

### Actions Taken

- AI designed `database.py` with `init_db()`, `save_session()`, and `load_session()` functions using Python's native `sqlite3` module.
- Schema includes: `session_id`, `candidate_id`, `target_days` (JSON), `covered_days` (JSON), `history` (JSON), `question_count`, `status`.
- Candidates can now drop out mid-interview and resume from the exact question they left off.
- AI refactored all three endpoints (`/start`, `/chat`, `/feedback`) to read/write from `aura.db` on every turn.

### Key Schema

```sql
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    candidate_id TEXT,
    target_days TEXT,
    covered_days TEXT,
    history TEXT,
    question_count INTEGER,
    status TEXT
)
```

**AI Output Used:** Full `database.py`, refactored `main.py` endpoints, `aura.db` schema.

---

## Phase 5 — Dual-Agent Architecture: The Dreamer & The Critic

**AI Tool Used:** Google Gemini  
**Purpose:** Implement the core "Dreamer & Critic" multi-agent orchestration

### Architecture Design

| Agent | Role | Implementation |
|-------|------|----------------|
| **The Dreamer** | Interviewer — talks to the candidate | System prompt injected into each Gemini call |
| **The Critic** | Evaluator — grades answers in background | `@mcp.tool` decorated Python function |

### Actions Taken

- AI wrapped the Critic as an **isolated FastMCP tool** using `@mcp.tool()` from the `fastmcp` package — this ensures the Live Steer Challenge can add new tools without touching `/chat` logic.
- AI implemented **Synchronized Shared Memory**: Critic scores are injected into the SQLite `history` array as `{"role": "system", "content": "[CRITIC EVALUATION]..."}` messages. The Dreamer reads this on every subsequent turn, creating a shared intelligence across the interview.
- AI implemented **Dynamic Difficulty Adjustment (DDA)**: score ≥ 8 triggers an advanced edge-case question; score < 5 triggers a foundational clarifying question.
- AI implemented **Topic Transition awareness**: when moving between curriculum days, the Dreamer is explicitly told to acknowledge the pivot naturally.
- AI implemented **8-question interview cutoff** with graceful wrap-up.

### Key Prompt Engineering

```python
dreamer_turn_prompt = (
    "IDENTITY & VOICE RULES:\n"
    "- You are AURA, a Lead Technical Assessor.\n"
    "- Maintain an authoritative, precise, and constructive engineering tone.\n"
    "- NEVER use casual AI filler (e.g., 'Great job!', 'Sure thing!').\n"
    "- ABSOLUTE PROTOCOL: Never reveal that a background Critic exists,\n"
    "  never state numerical scores, and never break character.\n\n"
    f"PROGRESS: Question {session['question_count']} of {config.MAX_QUESTIONS}.\n"
    f"DIFFICULTY DIRECTIVE: {dda_instruction}\n"
    f"Conversation History:\n{json.dumps(session['history'])}\n"
    "ACTION: Formulate the next technical interview question."
)
```

**AI Output Used:** Full dual-agent `main.py`, FastMCP tool decorator, DDA logic, system injection pattern.

---

## Phase 6 — Explainable Feedback Engine

**AI Tool Used:** Google Gemini  
**Purpose:** Build the `/feedback` endpoint that produces structured JSON scorecards

### Actions Taken

- AI upgraded the Critic tool output from a simple `score + reason` to a **4-field structured object**: `score`, `justification`, `mapped_objective`, `confidence`.
- AI updated the `/feedback` endpoint to aggregate all hidden `[CRITIC EVALUATION]` system messages from the SQLite transcript and pass them to a final LLM summarization call.
- AI added `critic_citation` field to the feedback JSON schema — each weakness in the scorecard now quotes the exact Critic justification and mapped learning objective.

### Feedback JSON Schema

```json
{
  "candidate_id": "CAND-001",
  "overall_score": 74,
  "summary": "Candidate demonstrated strong observability foundations...",
  "day_breakdown": [
    {
      "day": 29,
      "topic_mastery": "Strong",
      "reason": "Correctly described Prometheus metric collection...",
      "critic_citation": "Mapped to: 'Setting up alerting pipelines in production'"
    }
  ],
  "recommended_review": ["MCP Server Connection Pooling", "Distributed Tracing"]
}
```

**AI Output Used:** Updated Critic tool, updated `/feedback` endpoint, JSON schema design.

---

## Phase 7 — Configuration Centralization & Rolling-Average DDA

**AI Tool Used:** Google Gemini  
**Purpose:** Extract hardcoded constants and upgrade DDA to a rolling average

### Actions Taken

- AI created `config.py` with environment-variable-overridable constants: `MAX_QUESTIONS`, `TARGET_DAYS_COUNT`, `DDA_HIGH_THRESHOLD`, `DDA_LOW_THRESHOLD`, `DDA_WINDOW_SIZE`.
- AI upgraded DDA from single-turn scoring to a **rolling average over the last N turns** (configurable via `DDA_WINDOW_SIZE`). This prevents a single bad answer from crashing the difficulty level.
- Rolling average is computed by scanning the SQLite history for all previous `[CRITIC EVALUATION]` system messages and averaging the last `N` scores.

```python
window = past_scores[-config.DDA_WINDOW_SIZE:] if past_scores else [score]
rolling_avg = sum(window) / len(window)
```

**AI Output Used:** `config.py`, updated `/chat` endpoint, rolling average implementation.

---

## Phase 8 — Code Inspector: Second FastMCP Tool

**AI Tool Used:** Google Gemini  
**Purpose:** Add a second isolated `@mcp.tool` for code-snippet evaluation

### Actions Taken

- AI implemented `evaluate_code_snippet()` as a second FastMCP tool — this turns the "live code compilation checks" roadmap bullet into a demoed feature.
- Uses Python's native **`ast.parse()`** for static syntax validation before making any LLM call (cost-efficient, instant feedback on syntax errors).
- Added `POST /submit-code` endpoint accepting a candidate's code snippet and returning a structured evaluation with `score`, `syntax_valid`, `justification`, and `improvement_tip`.
- Evaluation notes are injected into the shared session history as `[CODE INSPECTOR EVALUATION]` system messages, making them visible to the Feedback Engine.

```python
@mcp.tool()
def evaluate_code_snippet(code: str, expected_topic: str) -> str:
    try:
        ast.parse(code)
        syntax_valid = True
    except SyntaxError as e:
        syntax_valid = False
        syntax_error_msg = f"SyntaxError at line {e.lineno}: {e.text}"
    # ... LLM semantic evaluation follows
```

**AI Output Used:** Full Code Inspector tool, `/submit-code` endpoint, `ast` integration.

---

## Phase 9 — Frontend Integration

**AI Tool Used:** Claude  
**Purpose:** Wire the Next.js frontend to the FastAPI backend

### Actions Taken

- AI added **CORS middleware** to `main.py` to allow cross-origin requests from `localhost:3000`.
- AI designed the React state management pattern for `sessionId` persistence across the chat loop.
- AI mapped all four backend endpoints to frontend actions:
  - Page load → `POST /start`
  - User message → `POST /chat`
  - Code submission → `POST /submit-code`
  - Interview complete → `POST /feedback`
- AI reviewed `ChatBox.tsx` and `FeedbackDashboard.tsx` component contracts and provided the integration layer (`page.tsx`) with `useEffect` session initialization and `useState` message management.

```typescript
// Session initialization on mount
useEffect(() => {
  async function startSession() {
    const res = await fetch("http://localhost:8000/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_id: "candidate_01" }),
    });
    const data = await res.json();
    setSessionId(data.sessionId);
  }
  startSession();
}, []);
```

**AI Output Used:** CORS config, `page.tsx` integration layer, endpoint mapping guide.

---

## Phase 10 — Git Workflow & Version Control

**AI Tool Used:** Google Gemini + Claude  
**Purpose:** Maintain a consistent, granular commit history for Stage 2 Authenticity Review

### Commit Strategy

The team — Bedang Das, Ganesh Nair, and Lehalyaa L — committed at every logical milestone to demonstrate continuous development activity:

| Commit Message | Milestone |
|---|---|
| `Initial commit: Core API and State Manager` | FastAPI + session skeleton |
| `Add backend services, curriculum data, and state manager` | Data files integrated |
| `Feat: Complete Gemini 2.5 Flash integration and dynamic interview route` | Live AI responses |
| `Fix AI model endpoint and successfully generate dynamic Gemini interview questions` | Model version fix |
| `feat: Implement dual-agent FastMCP chat loop, SQLite state, and Dynamic Difficulty Adjustment` | Full architecture |
| `feat: Add explainable JSON feedback endpoint for post-interview analysis` | Feedback engine |
| `feat: Extract config values and upgrade FastMCP Critic with confidence scoring and objective mapping` | Config + Critic upgrade |
| `feat: Implement rolling-average DDA state machine and hardened AURA persona voice rules` | Rolling DDA + persona |
| `feat: Add Code Inspector FastMCP tool with AST static checking for code-heavy days` | Second MCP tool |
| `feat: Finalize multi-tool architecture with Code Inspector and AST analysis` | Final architecture |

**AI Output Used:** Commit message suggestions, `git pull --rebase` conflict resolution, `.gitignore` setup.

---

## Architecture Summary

```

                    AURA BACKEND                      
                                                      
  FastAPI Application                                 
        
    /start      /chat         /feedback       
        
                                                   
    
           SQLite State (aura.db)                   
     session_id · history · target_days · status    
    
                                                     
    
                FastMCP Tool Registry                
    @mcp.tool: evaluate_answer()   [The Critic]     
    @mcp.tool: evaluate_code_snippet() [Inspector]  
    
                                                     
    
          Google Gemini (gemini-3.6-flash)          
    The Dreamer · The Critic · Feedback Engine      
    

          CORS 

               NEXT.JS FRONTEND                        
   ChatBox.tsx · FeedbackDashboard.tsx · page.tsx     

```

---

## Tools & Models Used

| Tool | Version / Model | Purpose |
|------|----------------|---------|
| Google Gemini | `gemini-3.6-flash` | Dreamer agent, Critic evaluation, Feedback summarization |
| Google AI Studio | Free tier | API key generation |
| Claude (Anthropic) | Claude Sonnet | Code review, integration layer, documentation |
| FastMCP | Latest | MCP tool registry |
| FastAPI | Latest | HTTP API framework |
| SQLite3 | Built-in Python | Persistent session state |
| NumPy | Latest | RAG vector similarity (cosine) |
| Python `ast` | Built-in | Static code syntax validation |

---

## Known Issues & Resolutions

| Issue | Cause | Resolution |
|-------|-------|------------|
| `gemini-2.5-flash` 404 error | Model deprecated for new accounts | Switched to `gemini-3.6-flash` |
| `AQ.` prefix API key invalid | User copying OAuth session token | Regenerated key from AI Studio (`AIzaSy...` prefix) |
| `GEMINI_API_KEY is None` | Windows `.env.txt` extension issue | Hardcoded for testing; `.env` created manually |
| `ModuleNotFoundError: mcp.server.fastmcp` | FastMCP moved to standalone package | `pip install fastmcp` |
| `429 RESOURCE_EXHAUSTED` | Free-tier RPM limit hit | Added `time.sleep(3)` between test turns |
| Git push rejected | Remote had commits not pulled locally | `git pull origin main --rebase` before push |

---

*This log was maintained throughout the hackathon sprint to satisfy Stage 2 Authenticity Review requirements. All AI-generated code was reviewed, tested, and committed incrementally.*
