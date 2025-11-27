# migrate_add_coins.py - Script to add coins column to users table
import sqlite3
from pathlib import Path

# Update both databases
DB_PATHS = [
    Path(__file__).resolve().parent / "lightsout.db",
    Path(__file__).resolve().parent / "lights_out.db"
]

def migrate_db(db_path):
    if not db_path.exists():
        print(f"SKIP: {db_path.name} does not exist")
        return
        
    print(f"\nMigrating: {db_path.name}")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    try:
        # Check if users table exists
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cur.fetchone():
            print(f"  SKIP: users table does not exist in {db_path.name}")
            conn.close()
            return
            
        # Check if coins column already exists
        cur.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cur.fetchall()]
        
        if 'coins' not in columns:
            print(f"  Adding coins column...")
            cur.execute("ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 0")
            conn.commit()
            print(f"  SUCCESS: Coins column added to {db_path.name}")
        else:
            print(f"  SUCCESS: Coins column already exists in {db_path.name}")
            
    except Exception as e:
        print(f"  ERROR: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    for db_path in DB_PATHS:
        migrate_db(db_path)
    print("\nMigration complete!")
