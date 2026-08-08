# 🎨 Frontend Components

The AURA frontend is built around four key React components. Together, they create the complete interview experience — from the first question to the final competency report.

---

## 1. 💬 `ChatBox` — The Core Interface

The **ChatBox** is the primary interface where the 8-question **"Grand Interview"** takes place.

### What It Does

The component:

* Displays a scrolling conversation between the AI Interviewer and the candidate
* Shows the interviewer's questions
* Displays the candidate's responses
* Provides a text input field for submitting answers
* Maintains the active interview conversation

### ⚡ Key Feature — Streaming Responses

AURA supports **streaming AI responses**.

Instead of waiting for the backend to generate the entire response, the ChatBox receives and displays the AI response incrementally.

```text
Backend generates response
          ↓
     Text stream
          ↓
       ChatBox
          ↓
"That is a good approach..."
          ↓
"That is a good approach because..."
          ↓
"That is a good approach because RAG..."
```

This creates a more natural, real-time interview experience.

---

## 2. 📡 `SkillRadar` — The Visualizer

The **SkillRadar** component provides a visual representation of the candidate's 31-day learning journey.

It can be implemented using a charting library such as **Recharts** or **Chart.js**.

### What It Does

The radar/spider chart visualizes the candidate's strengths and weaknesses across different AI engineering topics.

For example:

```text
                 Agentic AI
                     ▲
                    / \
                   /   \
                  /     \
 Vector DB ◀─────●───────▶ LLMs
                  \
                   \
                    ▼
                  RAG
```

### Key Feature

The chart uses information from:

```text
student_profile.json
```

to visualize competency across different topics.

For example:

| Skill Area         | Competency |
| ------------------ | ---------: |
| Agentic AI         |        90% |
| LLM Fundamentals   |        82% |
| RAG                |        68% |
| Vector Databases   |        45% |
| Prompt Engineering |        85% |

This gives judges and candidates an immediate visual understanding of the candidate's technical profile.

---

## 3. 📊 `FeedbackDashboard` — The Final Report

The **FeedbackDashboard** displays the candidate's final assessment after completing all **8 interview questions**.

### What It Does

The component receives the final structured JSON response from the backend and converts it into an easy-to-understand visual report.

It can display:

* Overall score
* Competency level
* Topic-wise performance
* Strengths
* Knowledge gaps
* Missed learning objectives
* Critic-generated recommendations
* Actionable learning advice

### Example

```text
┌──────────────────────────────────────────┐
│          AURA FINAL ASSESSMENT           │
├──────────────────────────────────────────┤
│                                          │
│              Overall Score               │
│                  82/100                  │
│                                          │
│          Competency: Advanced            │
│                                          │
├──────────────────────────────────────────┤
│ Strengths                                │
│ ✓ Agentic AI                             │
│ ✓ Prompt Engineering                     │
│ ✓ LLM Fundamentals                       │
│                                          │
├──────────────────────────────────────────┤
│ Knowledge Gaps                           │
│ • Vector Databases                       │
│ • Agent Evaluation                       │
│                                          │
├──────────────────────────────────────────┤
│ Recommended Next Steps                   │
│ Review vector indexing and retrieval     │
│ strategies and practice agent           │
│ evaluation techniques.                  │
└──────────────────────────────────────────┘
```

### 🎯 Key Feature

The dashboard should clearly communicate **why the candidate received their score**, rather than displaying only a numerical result.

This makes the assessment actionable for the learner.

---

## 4. ⌨️ `TypingIndicator` — The UX Element

The **TypingIndicator** is a small but important component that improves the interview experience.

### What It Does

It displays an animated indicator while AURA is processing the candidate's answer and preparing the next question.

For example:

```text
AURA is thinking   ●  ●  ●
```

The dots can be animated using CSS or a React animation library.

### Why It Matters

AURA uses a two-agent architecture:

```text
Candidate Answer
       ↓
     Critic
       ↓
Evaluation
       ↓
    Dreamer
       ↓
Next Question
```

This processing may take a few seconds.

Without a visual indicator, the candidate may assume that:

* The application has frozen
* Their answer was not submitted
* The server stopped responding

The `TypingIndicator` provides immediate feedback that the system is actively processing the response.

---

# 🔄 Frontend Component Flow

The four components work together throughout the interview:

```text
                    ┌───────────────┐
                    │    ChatBox    │
                    │   Interview   │
                    └───────┬───────┘
                            │
                            ▼
                    Candidate Answer
                            │
                            ▼
                    ┌───────────────┐
                    │ TypingIndicator│
                    │  AI Thinking   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Backend    │
                    │ Dreamer/Critic│
                    └───────┬───────┘
                            │
                            ▼
                    Next AI Question
                            │
                            ▼
                    ┌───────────────┐
                    │    ChatBox    │
                    └───────┬───────┘
                            │
                         Question 8
                            │
                            ▼
                  ┌───────────────────┐
                  │ FeedbackDashboard │
                  │   Final Report    │
                  └───────────────────┘
                            │
                            ▼
                     SkillRadar
                  Competency Overview
```

---

# 🗂️ Suggested Frontend Structure

A clean React structure for these components could look like:

```text
frontend/
│
├── package.json
│
└── src/
    │
    ├── components/
    │   ├── ChatBox.jsx
    │   ├── SkillRadar.jsx
    │   ├── FeedbackDashboard.jsx
    │   └── TypingIndicator.jsx
    │
    ├── api.js
    ├── App.jsx
    └── main.jsx
```

---

# 🎯 Component Responsibilities

| Component           | Primary Responsibility     | When Used              |
| ------------------- | -------------------------- | ---------------------- |
| `ChatBox`           | Conduct the interview      | During all 8 questions |
| `SkillRadar`        | Visualize candidate skills | Profile / results      |
| `FeedbackDashboard` | Display final assessment   | After Question 8       |
| `TypingIndicator`   | Show processing state      | While AI is responding |

Together, these components provide AURA with a complete **interactive, visual, and responsive technical interview experience**.
