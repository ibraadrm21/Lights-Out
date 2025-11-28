"""
Migration script to add role column and create admin account.
Admin credentials: username=lightsout, password=1234
"""
from database import get_connection
from utils import hash_password

def migrate_add_role():
    """Add role column and create admin account"""
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Check if role column exists
        cur.execute("PRAGMA table_info(users)")
        columns = [col["name"] for col in cur.fetchall()]
        
        if 'role' not in columns:
            print("Adding role column to users table...")
            cur.execute("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'")
            conn.commit()
            print("Role column added successfully")
        else:
            print("Role column already exists")
        
        # Set all existing users to 'user' role
        print("Setting existing users to 'user' role...")
        cur.execute("UPDATE users SET role = 'user' WHERE role IS NULL OR role = ''")
        conn.commit()
        
        # Check if admin account exists
        cur.execute("SELECT id FROM users WHERE username = ?", ("lightsout",))
        admin_exists = cur.fetchone()
        
        if not admin_exists:
            print("Creating admin account...")
            password_hash = hash_password("1234")
            cur.execute("""
                INSERT INTO users (username, password_hash, role, coins, total_points)
                VALUES (?, ?, ?, ?, ?)
            """, ("lightsout", password_hash, "admin", 0, 0))
            conn.commit()
            print("Admin account created successfully")
            print("  Username: lightsout")
            print("  Password: 1234")
            print("  Role: admin")
        else:
            print("Admin account already exists")
            # Update existing admin account to ensure it has admin role
            cur.execute("UPDATE users SET role = 'admin' WHERE username = ?", ("lightsout",))
            conn.commit()
            print("Updated existing 'lightsout' account to admin role")
        
        print("\nMigration completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_add_role()
