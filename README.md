# 🚁 Drone Infrastructure Inspector

> **AI-powered drone inspection platform for infrastructure analysis, defect detection, and automated reporting.**

---

## 🌟 Overview

Drone Infrastructure Inspector is a full-stack platform that automates the entire infrastructure inspection lifecycle — from drone image capture to AI-powered defect analysis and professional report generation.

Powered by a **LangGraph multi-agent pipeline** and a **React + Node.js frontend/backend**, the platform enables engineers to inspect bridges, wind turbines, solar farms, roads, and other critical infrastructure at scale — without manual analysis.

---

## ✨ Features

- 🛸 **Asset Management** — Track all infrastructure assets, their status, and Google Drive image folders
- 👁️ **One-Click AI Inspection** — Click *View* on any asset to automatically trigger the full AI inspection pipeline
- 🤖 **Multi-Agent LangGraph Pipeline** — 5 specialized AI agents run sequentially:
  1. **Image Analysis Agent** — Validates image quality, sensor type, and GSD
  2. **Defect Detection Agent** — Identifies cracks, spalling, rust, thermal anomalies
  3. **Severity Assessment Agent** — Grades risk from None → Minor → Action Required → High
  4. **Recommendation Agent** — Suggests corrective actions and next inspection date
  5. **Report Agent** — Compiles a full Markdown inspection report
- 📊 **Live Agent Status UI** — Real-time status (Waiting / Running / Completed / Failed), reasoning, and confidence scores per agent
- 📄 **Automated Report Generation** — Reports are auto-saved and available on the Reports page
- 📅 **Google Calendar Integration** — Create reminders for next inspection dates directly from the UI
- 🔒 **Authentication** — Login/signup flow with JWT-based auth
- 🗂️ **Flights & Teams** — Manage drone flights and team members

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                 │
│   AssetsView → InspectionsView → ReportsView            │
└───────────────────┬─────────────────────────────────────┘
                    │ REST / SSE (Server-Sent Events)
┌───────────────────▼─────────────────────────────────────┐
│              Node.js Backend (Express)                   │
│   Auth · Assets · Flights · Reports · DB (lowdb)        │
└───────────────────┬─────────────────────────────────────┘
                    │ REST (POST /inspect)
┌───────────────────▼─────────────────────────────────────┐
│          LangGraph AI Service (FastAPI + Python)         │
│                                                          │
│   Supervisor Agent                                       │
│       ↓                                                  │
│   Image Analysis → Defect Detection → Severity          │
│       → Recommendation → Report                         │
│                                                          │
│   Model: Google Gemini (with heuristic fallback)        │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, lowdb |
| AI Service | Python, FastAPI, LangGraph, LangChain, Gemini |
| Streaming | Server-Sent Events (SSE) |
| Auth | JWT |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone the repo

```bash
git clone https://github.com/yashasp322-ship-it/Drone-Inspection-.git
cd Drone-Inspection-
```

### 2. Set up environment

Create a `.env` file in the root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install frontend + backend

```bash
npm install
```

### 4. Set up the LangGraph AI service

```bash
cd langgraph_service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 5. Start all services

**Terminal 1 — Frontend + Node backend:**
```bash
npm run dev          # Vite frontend on :5173
node server.js       # Node backend on :3001
```

**Terminal 2 — AI service:**
```bash
cd langgraph_service
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Then open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
Drone Infrastructure Inspector/
├── src/                        # React frontend
│   ├── components/
│   │   ├── AssetsView.tsx       # Asset management + trigger inspection
│   │   ├── InspectionsView.tsx  # Live agent pipeline UI
│   │   ├── ReportsView.tsx      # Generated reports browser
│   │   ├── DashboardShell.tsx   # Main app shell
│   │   └── ...
│   └── App.tsx
├── server.js                   # Node.js Express backend
├── langgraph_service/
│   ├── agent_graph.py          # LangGraph multi-agent pipeline
│   ├── main.py                 # FastAPI endpoints (/inspect, /inspect/stream)
│   ├── requirements.txt
│   └── tests.py
└── package.json
```

---

## 🤖 AI Pipeline Details

The LangGraph pipeline uses a **StateGraph** with a deterministic supervisor that routes between 5 specialized agent nodes. Each node:
- Attempts a live Gemini API call
- Falls back to **heuristic/template-based results** if the API is unavailable (rate limits, quota, etc.)
- Returns structured JSON that is passed to the next agent

This ensures the inspection always completes and returns a full report, even without a live AI response.

---

## 📸 Screenshots

> Dashboard, Asset Manager, Live Inspection Pipeline, and Report Viewer all included in the app.

---

## 📝 License

MIT License — feel free to use, modify, and distribute.

---

Built with ❤️ by Yashas
