# SQLite Database Connection for Local Development
import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), 'lights_out.db')

def dict_factory(cursor, row):
    """Convert sqlite rows to dictionaries"""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_connection():
    """Get SQLite connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    return conn

def init_db():
    """Initialize database with schema"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Read and execute schema (convert PostgreSQL to SQLite)
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r') as f:
        schema = f.read()
    
    # Convert PostgreSQL syntax to SQLite
    schema = schema.replace('SERIAL PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT')
    schema = schema.replace('TIMESTAMP DEFAULT CURRENT_TIMESTAMP', 'DATETIME DEFAULT CURRENT_TIMESTAMP')
    schema = schema.replace('DECIMAL(10, 6)', 'REAL')
    schema = schema.replace('%s', '?')
    
    # Execute schema (SQLite doesn't support multiple statements at once)
    for statement in schema.split(';'):
        if statement.strip():
            try:
                cur.execute(statement)
            except sqlite3.OperationalError as e:
                # Ignore "table already exists" errors
                if 'already exists' not in str(e):
                    raise
    
    conn.commit()
    conn.close()
    print("✅ Database initialized")
