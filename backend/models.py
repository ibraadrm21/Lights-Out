# Database models for PostgreSQL
from database import get_connection

def create_user(username, password_hash):
    """Create a new user"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (username, password_hash) VALUES (%s, %s) RETURNING id",
        (username, password_hash)
    )
    user_id = cur.fetchone()['id']
    conn.commit()
    conn.close()
    return user_id

def get_user_by_username(username):
    """Get user by username"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    conn.close()
    return user

def save_points(user_id, score, mode="quiz"):
    """Save points for a user"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO points (user_id, score, mode) VALUES (%s, %s, %s)",
        (user_id, score, mode)
    )
    conn.commit()
    conn.close()

def get_leaderboard(limit=100):
    """Get leaderboard"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT u.id, u.username, COALESCE(SUM(p.score), 0) as total_score
        FROM users u
        LEFT JOIN points p ON u.id = p.user_id
        GROUP BY u.id, u.username
        ORDER BY total_score DESC
        LIMIT %s
    """, (limit,))
    rows = cur.fetchall()
    conn.close()
    return rows

def get_random_questions(count=10):
    """Get random quiz questions"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM questions ORDER BY RANDOM() LIMIT %s", (count,))
    questions = cur.fetchall()
    conn.close()
    return questions

def get_random_geo():
    """Get random geo location"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM geo_locations ORDER BY RANDOM() LIMIT 1")
    geo = cur.fetchone()
    conn.close()
    return geo
