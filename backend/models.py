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

def get_user_by_id(user_id):
    """Get user by ID"""
    conn = get_connection()
    cur = conn.cursor()
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
    conn.commit()
    conn.close()

def get_leaderboard(limit=10):
    """Get leaderboard with ranking positions using cached total_points"""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, username, total_points
        FROM users
        ORDER BY total_points DESC
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
    
    if not updates:
        conn.close()
        return {"success": False, "error": "no_fields_to_update"}
    
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

def delete_user(user_id):
    """Delete user account (admin only)"""
    conn = get_connection()
    cur = conn.cursor()
    
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

def get_admin_stats():
    """Get dashboard statistics (admin only)"""
    conn = get_connection()
    cur = conn.cursor()
    
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
    
    conn.close()
    
    return {
        "total_users": total_users,
        "total_quizzes": total_quizzes,
        "total_points": total_points,
        "recent_users": recent_users
    }
