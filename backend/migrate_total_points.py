"""
Migration script to add total_points column to users table
and populate it with existing points data.
Safe to run multiple times (idempotent).
Works with SQLite.
"""
from database import get_connection

def migrate_total_points():
    """Add total_points column and populate from points table"""
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Check if column already exists (SQLite way)
        cur.execute("PRAGMA table_info(users)")
        columns = [col["name"] for col in cur.fetchall()]
        
        if 'total_points' not in columns:
            print("Adding total_points column to users table...")
            # Add the column
            cur.execute("ALTER TABLE users ADD COLUMN total_points INTEGER DEFAULT 0")
            conn.commit()
            print("Column added successfully")
        else:
            print("total_points column already exists")
        
        # Populate total_points for all users
        print("Calculating and updating total_points for all users...")
        cur.execute("""
            UPDATE users 
            SET total_points = COALESCE(
                (SELECT SUM(score) FROM points WHERE points.user_id = users.id), 
                0
            )
        """)
        rows_updated = cur.rowcount
        conn.commit()
        print(f"Updated total_points for {rows_updated} users")
        
        # Verify the migration
        cur.execute("SELECT COUNT(*) as count FROM users WHERE total_points > 0")
        result = cur.fetchone()
        count = result["count"] if result else 0
        print(f"{count} users have points")
        
        print("\nMigration completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_total_points()
