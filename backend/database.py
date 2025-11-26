# database.py - inicialización de SQLite y helpers
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "lights_out.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # Users
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Points / Stats
    cur.execute("""
    CREATE TABLE IF NOT EXISTS points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        score INTEGER,
        mode TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Questions (seeded)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct CHAR(1),
        difficulty TEXT,
        tags TEXT,
        source TEXT,
        last_verified_at DATETIME
    )
    """)

    # Geo locations for Mapillary (seed)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS geo_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lat REAL,
        lon REAL,
        description TEXT,
        mapillary_image_id TEXT
    )
    """)

    conn.commit()
    conn.close()
