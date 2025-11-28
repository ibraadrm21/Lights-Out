# Shared Database Utilities for Vercel Serverless Functions
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """
    Get database connection.
    Uses PostgreSQL on Vercel, SQLite for local development.
    """
    # Check if running on Vercel (POSTGRES_URL env var exists)
    postgres_url = os.environ.get('POSTGRES_URL')
    
    if postgres_url:
        # Production: Use Vercel Postgres
        conn = psycopg2.connect(postgres_url, cursor_factory=RealDictCursor)
        return conn
    else:
        # Local development: Use SQLite
        import sys
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
        from database import get_connection
        return get_connection()

def dict_factory(cursor, row):
    """Convert database rows to dictionaries (for SQLite compatibility)"""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d
