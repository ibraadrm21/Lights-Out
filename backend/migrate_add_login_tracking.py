# migrate_add_login_tracking.py - Add login tracking fields
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'lights_out.db')

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Check if columns already exist
    cur.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cur.fetchall()]
    
    changes_made = False
    
    # Add last_login_at column
    if 'last_login_at' not in columns:
        print("Adding last_login_at column...")
        cur.execute("ALTER TABLE users ADD COLUMN last_login_at DATETIME")
        changes_made = True
    
    # Add last_login_ip column
    if 'last_login_ip' not in columns:
        print("Adding last_login_ip column...")
        cur.execute("ALTER TABLE users ADD COLUMN last_login_ip VARCHAR(45)")
        changes_made = True
    
    if changes_made:
        conn.commit()
        print("[OK] Login tracking columns added successfully!")
    else:
        print("Login tracking columns already exist. No migration needed.")
    
    conn.close()

if __name__ == "__main__":
    migrate()
