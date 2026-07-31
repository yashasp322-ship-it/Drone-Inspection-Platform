import os
import json
from dotenv import load_dotenv
from agent_graph import build_inspection_graph

load_dotenv()

def test_run():
    # Load actual key if present
    print("GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY")[:8] + "..." if os.getenv("GEMINI_API_KEY") else "None")
    graph = build_inspection_graph()
    
    initial_state = {
        "asset_id": "1",
        "asset_name": "Bridge Structure Mesh",
        "gdrive_link": "https://drive.google.com/drive/folders/1B_eHh4v1R-G9-mock-mumbai",
        "images": ["https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80"],
        "next_agent": "supervisor",
        "logs": ["Initialized test run"],
        "image_analysis": {},
        "defect_detection": {},
        "severity_assessment": {},
        "recommendation": {},
        "report": {},
        "agent_states": {
            "image_analysis": {"status": "Waiting", "reasoning": "Waiting for initialization.", "confidence": 0, "output": {}},
            "defect_detection": {"status": "Waiting", "reasoning": "Waiting for defect analysis.", "confidence": 0, "output": {}},
            "severity_assessment": {"status": "Waiting", "reasoning": "Waiting for severity grading.", "confidence": 0, "output": {}},
            "recommendation": {"status": "Waiting", "reasoning": "Waiting for recommendations.", "confidence": 0, "output": {}},
            "report": {"status": "Waiting", "reasoning": "Waiting for compilation.", "confidence": 0, "output": {}}
        }
    }
    
    print("Invoking graph...")
    try:
        final_state = graph.invoke(initial_state)
        print("Success! Final state contains keys:", list(final_state.keys()))
        print("Final Report:\n", final_state.get("report", {}).get("report_markdown")[:200] + "...")
    except Exception as e:
        print("Execution failed:", e)

if __name__ == "__main__":
    test_run()
