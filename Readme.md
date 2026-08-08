# 🧠 AURA — Autonomous Understanding and Reasoning Assessor

> **An AI-powered, adaptive technical interviewer built to assess a candidate's 31-day AI learning journey.**

AURA (**Autonomous Understanding and Reasoning Assessor**) is a personalized, multi-turn AI interview agent designed for the **AI Engineering Hackathon**.

Instead of relying on rigid, predefined questionnaires, AURA conducts a dynamic technical interview based on a candidate's learning history, curriculum progress, strengths, and weaknesses.

The system uses a **dual-agent "Dreamer & Critic" architecture** to separate conversational intelligence from factual evaluation.

---

## 🚀 Project Overview

AURA ingests two key sources of information:

1. **A structured 31-day Enterprise AI Cohort curriculum**
2. **A candidate's personalized learning profile**

Using this information, AURA dynamically conducts an **8-question technical interview**.

The interview adapts in real time based on the candidate's responses.

If a candidate demonstrates strong understanding, AURA increases the difficulty. If the candidate struggles with a concept, the system generates targeted follow-up questions to investigate the candidate's understanding.

### The Core Idea

Traditional assessments often look like:

```text
Question → Answer → Score → Next Question
```

AURA instead works like:

```text
Candidate Profile
       ↓
31-Day Curriculum
       ↓
     Dreamer
   (Interviewer)
       ↓
Candidate Response
       ↓
     Critic
   (Evaluator)
       ↓
Curriculum Verification
       ↓
Score + Reasoning
       ↓
Adaptive Follow-Up
       ↓
Next Question
```

This creates a more realistic technical interview experience while keeping evaluation grounded in the official curriculum.

---

# ✨ Key Features

## 🎯 Contextual 31-Day State Tracking

AURA maintains awareness of the candidate's learning journey across the entire 31-day curriculum.

It can identify:

* Completed missions
* Skipped missions
* Weak learning signals
* Strong learning signals
* Previously assessed topics
* Areas requiring deeper evaluation

This allows the interview to focus on the candidate's actual learning profile rather than asking generic questions.

---

## 🤖 Dreamer & Critic Architecture

AURA separates **conversation generation** from **candidate evaluation**.

### 🌙 Dreamer — Interviewer

The Dreamer is responsible for the candidate-facing conversation.

It:

* Maintains a natural conversational flow
* Generates technical questions
* Responds empathetically
* Maintains interview context
* Generates adaptive follow-up questions
* Adjusts question difficulty based on evaluation results

The Dreamer is optimized for **conversation and reasoning**.

---

### 🔍 Critic — Evaluator

The Critic operates in the background.

It:

* Evaluates candidate responses
* Verifies answers against the official curriculum
* Identifies misconceptions
* Assigns competency scores
* Determines whether deeper probing is required
* Provides structured feedback to the Dreamer

The Critic is optimized for **accuracy and evaluation**.

This separation helps reduce the risk of a conversational model confidently accepting technically incorrect answers.

---

# 🛡️ Hallucination Resistance

One of AURA's primary design goals is to prevent the interviewer from becoming the source of truth.

Instead of allowing the conversational agent to independently decide whether an answer is correct, the Critic evaluates responses against the **official curriculum**.

The evaluation flow is:

```text
Candidate Answer
      ↓
Critic
      ↓
FastMCP Tools
      ↓
Official Curriculum
      ↓
Evidence-Based Evaluation
      ↓
Score / Feedback
```

This creates a clear separation between:

> **Generating the conversation**

and

> **Determining factual correctness**

---

# 🧩 Dynamic Follow-Ups

AURA does not simply move from one question to the next.

Every response influences what happens next.

For example:

```text
Strong Answer
     ↓
High Score
     ↓
Increase Difficulty
     ↓
Advanced Question
```

While:

```text
Weak Answer
     ↓
Low Score
     ↓
Identify Knowledge Gap
     ↓
Targeted Follow-Up
```

This enables the interview to explore the candidate's **depth of understanding**, rather than measuring only their ability to answer isolated questions.

---

# 📊 Structured Competency Report

At the end of the **8-question interview**, AURA generates a structured competency report.

The report is designed to capture information such as:

* Overall competency
* Topic-wise performance
* Strengths
* Knowledge gaps
* Answer quality
* Technical reasoning ability
* Curriculum coverage
* Areas for improvement

The final output is structured as **JSON**, making it easy to consume from the frontend or integrate into other systems.

Example:

```json
{
  "overall_score": 82,
  "competency_level": "Advanced",
  "strengths": [
    "LLM fundamentals",
    "Prompt engineering",
    "RAG architecture"
  ],
  "knowledge_gaps": [
    "Agent evaluation",
    "Production monitoring"
  ],
  "recommendations": [
    "Review agent evaluation strategies",
    "Practice production AI observability"
  ]
}
```

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │  Candidate Profile  │
                    │    31-Day State     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  31-Day Curriculum  │
                    │   Ground Truth      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      DREAMER        │
                    │    Interviewer      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Candidate Response  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       CRITIC        │
                    │     Evaluator       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastMCP        │
                    │  Curriculum Tools   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Evaluation + Score  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Adaptive Follow-Up  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next Interview   │
                    │      Question       │
                    └─────────────────────┘
```

---

# 🛠️ Technology Stack

## Backend

* **Python**
* **FastAPI**
* **FastMCP**
* JSON-based curriculum and candidate state
* HTTP-based API communication

## Frontend

* **React**
* **Node.js**
* JavaScript
* Interactive interview interface

## AI Architecture

* Dual-agent architecture
* Dreamer / Critic separation
* Curriculum-grounded evaluation
* Adaptive question generation
* Structured competency scoring

---

# 📁 Project Structure

```text
AURA-Interview-Agent/
│
├── AI_USAGE.md
├── README.md
├── .gitignore
│
├── backend/
│   ├── main.py
│   ├── student_profile.json
│   ├── curriculum.json
│   └── requirements.txt
│
└── frontend/
    ├── package.json
    │
    └── src/
        ├── components/
        │   ├── ChatBox
        │   └── ScoreRadar
        │
        └── api.js
```

---

# 📂 Backend

The backend contains the core interview engine and API layer.

### `main.py`

The main FastAPI application responsible for:

* API routing
* Interview state management
* Agent orchestration
* Candidate response processing
* Communication with evaluation tools
* Returning structured interview results

### `curriculum.json`

Contains the standardized **31-day Enterprise AI Cohort curriculum**.

This acts as the primary knowledge source for candidate evaluation.

### `student_profile.json`

Acts as a mock long-term candidate database.

It stores information such as:

* Learning progress
* Completed missions
* Skipped missions
* Weak areas
* Strong areas
* Previous learning signals

### `requirements.txt`

Contains the Python dependencies required to run the backend.

---

# 🎨 Frontend

The frontend provides the interactive candidate experience.

### `ChatBox`

Provides the conversational interface between the candidate and AURA.

### `ScoreRadar`

Visualizes competency and performance across different technical areas.

### `api.js`

Handles communication between the React frontend and FastAPI backend.

---



# 🔄 Interview Flow

A typical AURA interview follows this process:

### Step 1 — Load Candidate Profile

AURA loads the candidate's 31-day learning history.

```text
student_profile.json
```

### Step 2 — Load Curriculum

The official learning objectives are loaded from:

```text
curriculum.json
```

### Step 3 — Generate Initial Question

The Dreamer selects an appropriate technical topic based on the candidate's profile.

### Step 4 — Candidate Responds

The candidate provides a technical answer through the chat interface.

### Step 5 — Critic Evaluates

The Critic analyzes the response and verifies the answer against curriculum-grounded information.

### Step 6 — Score

The Critic produces a structured evaluation.

### Step 7 — Adapt

The Dreamer receives the evaluation and determines the next question.

### Step 8 — Repeat

The process continues until the **8-question interview** is completed.

### Step 9 — Generate Report

AURA produces a final competency report containing scores, strengths, weaknesses, and recommendations.

---

# 🧠 Why AURA?

Traditional technical assessments have several limitations:

| Traditional Assessment       | AURA                         |
| ---------------------------- | ---------------------------- |
| Fixed questions              | Adaptive questions           |
| Same difficulty for everyone | Dynamic difficulty           |
| Stateless                    | 31-day learning context      |
| Single evaluator             | Dreamer + Critic             |
| Generic scoring              | Curriculum-grounded scoring  |
| Limited follow-ups           | Targeted follow-ups          |
| Static results               | Structured competency report |

AURA is designed to make technical assessment feel more like a **real engineering interview**.

---

# 🎯 Hackathon Value Proposition

AURA demonstrates how multi-agent AI systems can be used beyond simple chat applications.

The project combines:

* **Agentic AI**
* **Long-term context**
* **Multi-agent orchestration**
* **Tool-assisted reasoning**
* **Curriculum-grounded evaluation**
* **Adaptive interviewing**
* **Structured AI outputs**
* **Full-stack application development**

The key innovation is the separation between the agent that **talks** and the agent that **checks**.

---

# 🔮 Future Improvements

Potential future enhancements include:

* Persistent database instead of JSON storage
* Authentication and candidate accounts
* Multiple curriculum support
* Voice-based interviews
* Real-time speech analysis
* Code execution and coding assessments
* More advanced competency models
* Interview analytics dashboard
* LLM observability and tracing
* Automated interview difficulty calibration
* Recruiter / instructor dashboard
* Historical candidate performance tracking
* Deployment using Docker and cloud infrastructure

---

# 🧪 Example Use Case

Imagine a candidate who completed most of the 31-day AI curriculum but skipped several days related to **RAG and AI agents**.

Instead of randomly asking questions, AURA can identify these gaps:

```text
Candidate Profile
       ↓
Skipped: RAG fundamentals
Skipped: Agent evaluation
       ↓
Dreamer
       ↓
Ask RAG fundamentals
       ↓
Candidate gives strong answer
       ↓
Critic → High Score
       ↓
Increase Difficulty
       ↓
Ask advanced RAG architecture question
       ↓
Candidate struggles
       ↓
Critic → Knowledge Gap
       ↓
Targeted follow-up
```

The result is an interview that explores **actual competency**, not just memorization.

---

# 🏆 Project Goal

The goal of AURA is simple:

> **Build an AI interviewer that understands what a candidate has learned, evaluates what they actually understand, and adapts the interview accordingly.**

By combining personalized context, multi-agent reasoning, curriculum-grounded evaluation, and adaptive questioning, AURA transforms a static technical questionnaire into a dynamic AI-powered assessment experience.

---

# 👥 Team

**AURA — Autonomous Understanding and Reasoning Assessor**

Built for the **AI Engineering Hackathon**.

---

## 📜 License

This project is intended for educational and hackathon purposes.
