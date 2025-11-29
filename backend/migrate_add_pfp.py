# migrate_add_pfp.py - Add profile_picture column
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'lights_out.db')

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Check if column already exists
    cur.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cur.fetchall()]
    
    if 'profile_picture' not in columns:
        print("Adding profile_picture column...")
        cur.execute("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255)")
        conn.commit()
        print("[OK] Profile picture column added successfully!")
    else:
        print("Profile picture column already exists. No migration needed.")
    
    conn.close()

if __name__ == "__main__":
    migrate()
