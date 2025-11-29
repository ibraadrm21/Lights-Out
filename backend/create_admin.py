# create_admin.py - Create admin user
import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), 'lights_out.db')

def create_admin():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Check if admin already exists
    cur.execute("SELECT id FROM users WHERE email = ?", ("admin@lightsout.com",))
    existing = cur.fetchone()
    
    if existing:
        print("Admin user already exists!")
        print("Email: admin@lightsout.com")
        print("Updating password to: 1234")
        
        # Update password and ensure role is admin
        password_hash = generate_password_hash("1234")
        cur.execute("UPDATE users SET password_hash = ?, role = 'admin' WHERE email = ?", 
                   (password_hash, "admin@lightsout.com"))
        conn.commit()
        print("[OK] Admin password updated!")
    else:
        print("Creating new admin user...")
        
        # Create admin user
        username = "admin"
        email = "admin@lightsout.com"
        password = "1234"
        password_hash = generate_password_hash(password)
        
        cur.execute("""
            INSERT INTO users (username, email, password_hash, role, coins, total_points)
            VALUES (?, ?, ?, 'admin', 0, 0)
        """, (username, email, password_hash))
        
        conn.commit()
        print("[OK] Admin user created successfully!")
        print(f"Username: {username}")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print(f"Role: admin")
    
    conn.close()

if __name__ == "__main__":
    create_admin()
