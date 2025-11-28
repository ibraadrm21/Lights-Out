<<<<<<< Updated upstream
=======
# Database models for SQLite
>>>>>>> Stashed changes
from database import get_connection

def create_user(username, password_hash):
    conn = get_connection()
    cur = conn.cursor()
<<<<<<< Updated upstream
    cur.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
=======
    cur.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (username, password_hash)
    )
>>>>>>> Stashed changes
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

def get_user_by_id(user_id):
    """Get user by ID"""
    conn = get_connection()
    cur = conn.cursor()
<<<<<<< Updated upstream
    cur.execute("SELECT * FROM users WHERE id = ?",(user_id,))
    user = cur.fetchone()
    conn.close()
    return user

def update_username(user_id, new_username):
    """Update username with uniqueness check"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Check if username is already taken
    cur.execute("SELECT id FROM users WHERE username = ? AND id != ?", (new_username, user_id))
    if cur.fetchone():
        conn.close()
        return {"success": False, "error": "username_exists"}
    
    # Update username
    cur.execute("UPDATE users SET username = ? WHERE id = ?", (new_username, user_id))
    conn.commit()
    conn.close()
    return {"success": True}

def update_password(user_id, new_password_hash):
    """Update user password"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE users SET password_hash = ? WHERE id = ?", (new_password_hash, user_id))
    conn.commit()
    conn.close()
    return {"success": True}

def save_points(user_id, score, mode="quiz"):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO points (user_id, score, mode) VALUES (?, ?, ?)", (user_id, score, mode))
=======
    cur.execute(
        "INSERT INTO points (user_id, score, mode) VALUES (?, ?, ?)",
        (user_id, score, mode)
    )
>>>>>>> Stashed changes
    conn.commit()
    conn.close()

def get_leaderboard(limit=10):
    """Get leaderboard with ranking positions using cached total_points"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
<<<<<<< Updated upstream
        SELECT id, username, total_points
        FROM users
        ORDER BY total_points DESC
=======
        SELECT u.id, u.username, COALESCE(SUM(p.score), 0) as total_score
        FROM users u
        LEFT JOIN points p ON u.id = p.user_id
        GROUP BY u.id, u.username
        ORDER BY total_score DESC
>>>>>>> Stashed changes
        LIMIT ?
    """, (limit,))
    rows = cur.fetchall()
    conn.close()
    
    # Add ranking positions
    leaderboard = []
    for idx, r in enumerate(rows, start=1):
        leaderboard.append({
            "rank": idx,
            "user_id": r["id"],
            "username": r["username"],
            "total": r["total_points"]
        })
    return leaderboard

def get_random_questions(count=10):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM questions ORDER BY RANDOM() LIMIT ?", (count,))
<<<<<<< Updated upstream
    rows = cur.fetchall()
=======
    questions = cur.fetchall()
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
def update_user_rewards(user_id, points, coins):
    """Update user's coins and record points"""
=======
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
        "INSERT INTO quiz_sessions (user_id, mode) VALUES (?, ?)",
        (user_id, mode)
    )
    session_id = cur.lastrowid
    conn.commit()
    conn.close()
    return session_id

def update_quiz_session(session_id, rank=None, score=None, questions_answered=None):
    """Update quiz session metrics"""
>>>>>>> Stashed changes
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
    
    # Update user coins and total_points
    cur.execute("""
        UPDATE users 
        SET coins = coins + ?, total_points = total_points + ? 
        WHERE id = ?
    """, (coins_awarded, points_awarded, user_id))
    
    # Record points in points table (for history)
    cur.execute("INSERT INTO points (user_id, score, mode) VALUES (?, ?, ?)", (user_id, points_awarded, "quiz"))
    
    conn.commit()
    conn.close()

def get_user_stats(user_id):
    """Get user's total points, coins, and ranking"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Get user data (using cached total_points)
    cur.execute("SELECT total_points, coins FROM users WHERE id = ?", (user_id,))
    user_row = cur.fetchone()
    
    if not user_row:
        conn.close()
        return {"total_points": 0, "coins": 0, "rank": None}
    
    # Get user's ranking position
    cur.execute("""
        SELECT COUNT(*) + 1 as rank
        FROM users
        WHERE total_points > (SELECT total_points FROM users WHERE id = ?)
    """, (user_id,))
    rank_row = cur.fetchone()
    
    conn.close()
    
    return {
        "total_points": user_row["total_points"] or 0,
        "coins": user_row["coins"] or 0,
        "rank": rank_row["rank"] if rank_row else None
    }

# ============ ADMIN FUNCTIONS ============

def get_all_users():
    """Get all users with their stats (admin only)"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, username, role, total_points, coins, created_at
        FROM users
        ORDER BY created_at DESC
    """)
    users = cur.fetchall()
    conn.close()
    return users

def update_user_admin(user_id, data):
    """Update user fields (admin only)"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Build dynamic update query
    updates = []
    values = []
    
<<<<<<< Updated upstream
    if 'username' in data:
        updates.append("username = ?")
        values.append(data['username'])
    if 'total_points' in data:
        updates.append("total_points = ?")
        values.append(data['total_points'])
    if 'coins' in data:
        updates.append("coins = ?")
        values.append(data['coins'])
    if 'role' in data:
        updates.append("role = ?")
        values.append(data['role'])
=======
    if rank:
        updates.append("current_rank = ?")
        params.append(rank)
    if score is not None:
        updates.append("total_score = ?")
        params.append(score)
    if questions_answered is not None:
        updates.append("questions_answered = ?")
        params.append(questions_answered)
>>>>>>> Stashed changes
    
    if not updates:
        conn.close()
        return {"success": False, "error": "no_fields_to_update"}
    
<<<<<<< Updated upstream
    values.append(user_id)
    query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
    
    try:
        cur.execute(query, values)
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        conn.close()
        return {"success": False, "error": str(e)}
=======
    query = f"UPDATE quiz_sessions SET {', '.join(updates)} WHERE id = ?"
    cur.execute(query, params)
    conn.commit()
    conn.close()
>>>>>>> Stashed changes

def delete_user(user_id):
    """Delete user account (admin only)"""
    conn = get_connection()
    cur = conn.cursor()
<<<<<<< Updated upstream
    
    try:
        # Delete user (CASCADE will handle related records)
        cur.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        conn.close()
        return {"success": False, "error": str(e)}
=======
    cur.execute(
        """INSERT INTO player_metrics 
           (user_id, session_id, question_difficulty, was_correct, answer_time_seconds)
           VALUES (?, ?, ?, ?, ?)""",
        (user_id, session_id, difficulty, was_correct, answer_time)
    )
    conn.commit()
    conn.close()
>>>>>>> Stashed changes

def get_admin_stats():
    """Get dashboard statistics (admin only)"""
    conn = get_connection()
    cur = conn.cursor()
<<<<<<< Updated upstream
    
    # Total users
    cur.execute("SELECT COUNT(*) as count FROM users")
    total_users = cur.fetchone()["count"]
    
    # Total quizzes completed
    cur.execute("SELECT COUNT(*) as count FROM quiz_results")
    total_quizzes = cur.fetchone()["count"]
    
    # Total points awarded
    cur.execute("SELECT COALESCE(SUM(score), 0) as total FROM points")
    total_points = cur.fetchone()["total"]
    
    # Recent users (last 5)
    cur.execute("""
        SELECT username, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
    """)
    recent_users = cur.fetchall()
    
=======
    cur.execute(
        """SELECT AVG(CASE WHEN was_correct THEN 100.0 ELSE 0.0 END) as accuracy
           FROM (
               SELECT was_correct FROM player_metrics
               WHERE user_id = ?
               ORDER BY created_at DESC
               LIMIT ?
           ) recent""",
        (user_id, last_n)
    )
    result = cur.fetchone()
>>>>>>> Stashed changes
    conn.close()
    
    return {
        "total_users": total_users,
        "total_quizzes": total_quizzes,
        "total_points": total_points,
        "recent_users": recent_users
    }
