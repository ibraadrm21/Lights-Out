# PostgreSQL Database Connection for Vercel
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.parse import urlparse

def get_connection():
    """Get PostgreSQL connection from Vercel Postgres or local"""
    database_url = os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL')
    
    if not database_url:
        raise Exception("No database URL found. Set POSTGRES_URL environment variable.")
    
    # Parse the URL
    result = urlparse(database_url)
    
    conn = psycopg2.connect(
        database=result.path[1:],
        user=result.username,
        password=result.password,
        host=result.hostname,
        port=result.port,
        cursor_factory=RealDictCursor
    )
    return conn

def init_db():
    """Initialize database with schema"""
    conn = get_connection()
    cur = conn.cursor()
    
    # Read and execute schema
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
    with open(schema_path, 'r') as f:
        schema = f.read()
    
    cur.execute(schema)
    conn.commit()
    conn.close()
    print("✅ Database initialized")
