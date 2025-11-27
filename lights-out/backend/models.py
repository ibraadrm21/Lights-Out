# models.py - modelos ligeros usando sqlite helpers (no ORM, así es portátil)
from database import get_connection

def create_user(username, password_hash):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    return user_id

def get_user_by_username(username):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    conn.close()
    return row

def save_points(user_id, score, mode="quiz"):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO points (user_id, score, mode) VALUES (?, ?, ?)", (user_id, score, mode))
    conn.commit()
    conn.close()

def get_leaderboard(limit=100):
    conn = get_connection()
    cur = conn.cursor()
    # Sumar puntos por usuario y ordenar desc
    cur.execute("""
        SELECT u.id, u.username, COALESCE(SUM(p.score),0) as total_score
        FROM users u
        LEFT JOIN points p ON u.id = p.user_id
        GROUP BY u.id
        ORDER BY total_score DESC
        LIMIT ?
    """, (limit,))
    rows = cur.fetchall()
    conn.close()
    return rows

# Preguntas
def get_random_questions(count=10):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM questions ORDER BY RANDOM() LIMIT ?", (count,))
    rows = cur.fetchall()
    conn.close()
    return rows
