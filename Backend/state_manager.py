import json
from typing import Dict, Any, List

class InterviewSession:
    def __init__(self, session_id: str, candidate_data: Dict[str, Any]):
        self.session_id = session_id
        self.candidate = candidate_data
        self.history: List[Dict[str, str]] = []
        self.question_count = 0
        self.covered_days = set()
        self.is_completed = False
        
        # Analyze candidate weaknesses (skipped missions & high attempt counts)
        self.target_days = self._identify_target_days()

    def _identify_target_days(self) -> List[int]:
        missions = self.candidate.get("missions", [])
        skipped_days = [m["day"] for m in missions if m.get("skipped")]
        high_attempt_days = [m["day"] for m in missions if m.get("attempts", 0) > 2]
        
        # Combine weaknesses, defaulting to core curriculum days if none found
        targets = list(dict.fromkeys(skipped_days + high_attempt_days))
        default_days = [7, 12, 22, 23, 28]  # Embeddings, Prompting, Multi-Agent, MCP, Docker
        
        for day in default_days:
            if len(targets) < 4 and day not in targets:
                targets.append(day)
                
        return targets[:4]

class SessionStore:
    def __init__(self):
        self._sessions: Dict[str, InterviewSession] = {}

    def get_or_create(self, session_id: str, candidate_data: Dict[str, Any] = None) -> InterviewSession:
        if session_id not in self._sessions:
            if candidate_data is None:
                raise ValueError("Candidate data required to initialize new session.")
            self._sessions[session_id] = InterviewSession(session_id, candidate_data)
        return self._sessions[session_id]

session_store = SessionStore()