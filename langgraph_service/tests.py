import unittest
import os
from agent_graph import build_inspection_graph

class TestInspectionGraph(unittest.TestCase):
    def test_graph_compilation(self):
        os.environ["GEMINI_API_KEY"] = "mock_key"
        try:
            graph = build_inspection_graph()
            self.assertIsNotNone(graph)
            print("Graph compiled successfully in test.")
        except Exception as e:
            self.fail(f"Graph compilation failed: {e}")

if __name__ == "__main__":
    unittest.main()
