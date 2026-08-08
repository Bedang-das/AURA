## 📦 Backend Dependencies

AURA's backend is built with three core Python packages:

```txt
fastapi
uvicorn
fastmcp
```

### FastAPI

**FastAPI** is the web framework used to build AURA's HTTP API endpoints.

It handles incoming requests from the frontend and provides the API layer through which the interview system communicates with the React application.

### Uvicorn

**Uvicorn** is the ASGI server used to run the FastAPI application locally.

It starts the backend server and makes the API accessible to the frontend during development.

Example:

```bash
uvicorn main:app --reload
```

### FastMCP

**FastMCP** provides the Model Context Protocol (MCP) framework used by AURA to expose Python functions as structured tools.

It handles capabilities such as:

* Tool schema generation
* Tool validation
* MCP tool exposure
* Communication between the AI agent and backend tools

In AURA, FastMCP helps the **Critic** access curriculum-grounded tools when evaluating candidate responses.

### Dependency Relationship

```text
                 AURA Backend
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    FastAPI        Uvicorn       FastMCP
        │             │             │
        │             │             └── AI Tools
        │             │                 │
        │             │                 └── Curriculum
        │             │
        │             └── Runs API Server
        │
        └── HTTP API Endpoints
```
