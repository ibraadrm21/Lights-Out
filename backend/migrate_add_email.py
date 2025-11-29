# migrate_add_email.py
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'lights_out.db')

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Check if email column already exists
    cur.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cur.fetchall()]
    
    if 'email' not in columns:
        print("Adding email column to users table...")
        
        # Add email column (allow NULL initially)
        cur.execute("ALTER TABLE users ADD COLUMN email VARCHAR(255)")
        
        # Generate placeholder emails for existing users
        cur.execute("SELECT id, username FROM users WHERE email IS NULL")
        users = cur.fetchall()
        
        for user_id, username in users:
            placeholder_email = f"{username}@placeholder.local"
            cur.execute("UPDATE users SET email = ? WHERE id = ?", (placeholder_email, user_id))
            print(f"  - Set placeholder email for user {username}: {placeholder_email}")
        
        conn.commit()
        print("[OK] Email column added successfully!")
        print("\nIMPORTANT: Existing users have placeholder emails.")
        print("They should update their emails through the settings page.")
    else:
        print("Email column already exists. No migration needed.")
    
    conn.close()

if __name__ == "__main__":
    migrate()
