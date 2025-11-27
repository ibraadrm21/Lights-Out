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

def create_quiz_session(user_id, mode="adaptive"):
    """Create a new quiz session"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO quiz_sessions (user_id, mode) VALUES (%s, %s) RETURNING id",
        (user_id, mode)
    )
    session_id = cur.fetchone()['id']
    conn.commit()
    conn.close()
    return session_id

def update_quiz_session(session_id, rank=None, score=None, questions_answered=None):
    """Update quiz session metrics"""
    conn = get_connection()
    cur = conn.cursor()
    
    updates = []
    params = []
    
    if rank:
        updates.append("current_rank = %s")
        params.append(rank)
    if score is not None:
        updates.append("total_score = %s")
        params.append(score)
    if questions_answered is not None:
        updates.append("questions_answered = %s")
        params.append(questions_answered)
    
    updates.append("last_activity = CURRENT_TIMESTAMP")
    params.append(session_id)
    
    query = f"UPDATE quiz_sessions SET {', '.join(updates)} WHERE id = %s"
    cur.execute(query, params)
    conn.commit()
    conn.close()

def record_player_metric(user_id, session_id, difficulty, was_correct, answer_time):
    """Record a player's answer metric"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO player_metrics 
           (user_id, session_id, question_difficulty, was_correct, answer_time_seconds)
           VALUES (%s, %s, %s, %s, %s)""",
        (user_id, session_id, difficulty, was_correct, answer_time)
    )
    conn.commit()
    conn.close()

def get_player_accuracy(user_id, last_n=5):
    """Get player's accuracy for last N questions"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT AVG(CASE WHEN was_correct THEN 100.0 ELSE 0.0 END) as accuracy
           FROM (
               SELECT was_correct FROM player_metrics
               WHERE user_id = %s
               ORDER BY created_at DESC
               LIMIT %s
           ) recent""",
        (user_id, last_n)
    )
    result = cur.fetchone()
    conn.close()
    return result['accuracy'] if result and result['accuracy'] else 50.0
