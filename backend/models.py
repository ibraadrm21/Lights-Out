from database import get_connection

def create_user(username, password_hash):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
    user_id = cur.lastrowid
    conn.commit()
    conn.close()
    return user_id

def get_user_by_username(username):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cur.fetchone()
    conn.close()
    return user

def save_points(user_id, score, mode="quiz"):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO points (user_id, score, mode) VALUES (?, ?, ?)", (user_id, score, mode))
    conn.commit()
    conn.close()

def get_leaderboard(limit=10):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT u.username, COALESCE(SUM(p.score), 0) as total
        FROM users u
        LEFT JOIN points p ON u.id = p.user_id
        GROUP BY u.id, u.username
        ORDER BY total DESC
        LIMIT ?
    """, (limit,))
    rows = cur.fetchall()
    conn.close()
    return [{"username": r["username"], "total": r["total"]} for r in rows]

def get_random_questions(count=10):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM questions ORDER BY RANDOM() LIMIT ?", (count,))
    rows = cur.fetchall()
    conn.close()
    
    questions = []
    for r in rows:
        questions.append({
            "id": r["id"],
            "text": r["text"],
            "A": r["option_a"],
            "B": r["option_b"],
            "C": r["option_c"],
            "D": r["option_d"],
            "debug_correct": r["correct"]
        })
    return questions

def update_user_rewards(user_id, points, coins):
    """Update user's coins and record points"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Update coins
    cur.execute("UPDATE users SET coins = coins + ? WHERE id = ?", (coins, user_id))
    
    # Record points
    cur.execute("INSERT INTO points (user_id, score, mode) VALUES (?, ?, ?)", (user_id, points, "quiz"))
    
    conn.commit()
    conn.close()

def record_quiz_result(user_id, score_percentage, points_awarded, coins_awarded):
    """Record a quiz result and update user rewards"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Insert quiz result
    cur.execute("""
        INSERT INTO quiz_results (user_id, score_percentage, points_awarded, coins_awarded)
        VALUES (?, ?, ?, ?)
    """, (user_id, score_percentage, points_awarded, coins_awarded))
    
    # Update user coins
    cur.execute("UPDATE users SET coins = coins + ? WHERE id = ?", (coins_awarded, user_id))
    
    # Record points
    cur.execute("INSERT INTO points (user_id, score, mode) VALUES (?, ?, ?)", (user_id, points_awarded, "quiz"))
    
    conn.commit()
    conn.close()

def get_user_stats(user_id):
    """Get user's total points and coins"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Get total points
    cur.execute("SELECT COALESCE(SUM(score), 0) as total_points FROM points WHERE user_id = ?", (user_id,))
    points_row = cur.fetchone()
    
    # Get coins
    cur.execute("SELECT coins FROM users WHERE id = ?", (user_id,))
    user_row = cur.fetchone()
    
    conn.close()
    
    return {
        "total_points": points_row["total_points"] if points_row else 0,
        "coins": user_row["coins"] if user_row else 0
    }

