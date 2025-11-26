# quiz_seed.py - cargar questions.json en la tabla questions
import json
from database import get_connection
from pathlib import Path

def seed_questions():
    path = Path(__file__).resolve().parent.parent / "data" / "questions.json"
    if not path.exists():
        print("questions.json not found")
        return
    with open(path, "r", encoding="utf-8") as f:
        questions = json.load(f)

    conn = get_connection()
    cur = conn.cursor()
    for q in questions:
        cur.execute("""
            INSERT INTO questions (text, option_a, option_b, option_c, option_d, correct, difficulty, tags, source)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (q["text"], q["A"], q["B"], q["C"], q["D"], q["correct"], q.get("difficulty","medium"), ",".join(q.get("tags",[])), q.get("source","unknown")))
    conn.commit()
    conn.close()
    print("Seeded", len(questions), "questions")
