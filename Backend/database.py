import sqlite3
import json

DB_FILE = "aura.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY,
            candidate_id TEXT,
            target_days TEXT,
            covered_days TEXT,
            history TEXT,
            question_count INTEGER,
            status TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_session(session_id, candidate_id, target_days, covered_days, history, question_count, status="active"):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO sessions (session_id, candidate_id, target_days, covered_days, history, question_count, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(session_id) DO UPDATE SET
            covered_days=excluded.covered_days,
            history=excluded.history,
            question_count=excluded.question_count,
            status=excluded.status
    ''', (session_id, candidate_id, json.dumps(target_days), json.dumps(list(covered_days)), json.dumps(history), question_count, status))
    conn.commit()
    conn.close()

def load_session(session_id):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT candidate_id, target_days, covered_days, history, question_count, status FROM sessions WHERE session_id=?", (session_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "candidate_id": row[0],
            "target_days": json.loads(row[1]),
            "covered_days": set(json.loads(row[2])),
            "history": json.loads(row[3]),
            "question_count": row[4],
            "status": row[5]
        }
    return None