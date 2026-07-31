# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Drone Infrastructure Inspector — a full-stack platform that runs drone imagery through a multi-agent
AI pipeline to detect infrastructure defects (bridges, wind turbines, solar farms, roads) and produce
Markdown inspection reports.

## Architecture — three separate runtimes, no shared build

```
React (Vite, :5173) → Node/Express backend (server.js, :5001) → Python FastAPI/LangGraph service (:8000)
```

- **Frontend** (`src/`): React 19 + TypeScript + Tailwind, single-page app. `AssetsView` triggers an
  inspection → `InspectionsView` renders the live agent pipeline (via SSE) → `ReportsView` shows saved
  reports.
- **Node backend** (`server.js`): one file, Express 5. Owns `db.json` (lowdb-style flat JSON file used
  as the datastore — no real DB) and `uploads/` (multer disk storage). Responsibilities:
  - CRUD for `assets` and `missions`, plus a simulated live-telemetry endpoint (`/live-mission`) that
    fakes drone GPS/battery/altitude data for the map UI.
  - A legacy in-memory "Agentic AI Orchestrator" (`runAgenticWorkflow`, `orchestrationState`) that
    calls Gemini directly from Node — this predates the LangGraph service and is a separate code path
    from the one described below. Don't assume the two are wired together.
  - The actual inspection flow: `POST /api/inspections/stream` proxies to the Python service's
    `/inspect/stream` and pipes its newline-delimited JSON stream straight back to the client as SSE.
    `POST /api/inspections/save` persists the finished inspection + generates a `reports` entry in
    `db.json`.
- **LangGraph service** (`langgraph_service/`): FastAPI app (`main.py`) wrapping a LangGraph
  `StateGraph` (`agent_graph.py`). A `supervisor` node deterministically routes through five agent
  nodes in sequence — image_analysis → defect_detection → severity_assessment → recommendation →
  report — looping back through the supervisor after each node until it returns `FINISH`. Every node
  attempts one `call_ai()` (Groq, `llama-3.3-70b-versatile`) and falls back to a hardcoded
  heuristic/template result on any exception (missing key, timeout, bad JSON), so the pipeline always
  completes. `/inspect/stream` streams one JSON line per completed node for the UI's live agent
  status view; `/inspect` runs synchronously and returns final state only.
  - Video-format detection (checking `gdrive_link` / `images` for video extensions) happens in
    **two places independently**: `server.js`'s legacy orchestrator and `image_analysis_node` in
    `agent_graph.py`. Keep both in sync if the rejection logic changes.

## Running locally

Three processes, no single command starts them all:

```bash
npm run dev                 # Vite frontend, :5173
node server.js              # Express backend, :5001 (NOT :3001 despite README)
cd langgraph_service && ./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Env vars (root `.env`, and also `langgraph_service/.env` which is loaded in addition to root):
- `GROQ_API_KEY` — used by the LangGraph service (`agent_graph.py`); this is the live model backend now.
- `GEMINI_API_KEY` — still used by the legacy orchestrator in `server.js` and referenced in
  `langgraph_service/requirements.txt` (langchain-google-genai), but the LangGraph agent nodes use
  Groq, not Gemini, despite what the README says.

## Commands

```bash
npm run build      # tsc -b && vite build — type-check then bundle
npm run lint        # oxlint (config: .oxlintrc.json)
npm run preview     # preview the production build
```

No test runner is configured for the frontend/Node backend. Python side has `langgraph_service/tests.py`
and `test_run.py` but no pytest config/CI wiring — run directly with the venv's Python if needed:
```bash
cd langgraph_service && ./venv/bin/python tests.py
```

## Things to know when editing

- `db.json` is a real, committed data file acting as the database — treat writes to it as you would
  a database migration; don't hand-edit its shape without updating both the seed data in `server.js`'s
  `readDB()` and every route that reads that shape.
- The Python service has no persistence — `agent_states` and inspection results only live for the
  duration of a request; `server.js` is the only place inspection results get saved (to `db.json`).
- Agent node outputs share one JSON contract: `{ ...fields, reasoning, confidence_score }`, and each
  wraps it in `agent_states[<name>] = { status, reasoning, confidence, output }` for the UI. New agent
  nodes should follow this shape so `InspectionsView` doesn't need special-casing.
