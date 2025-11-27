# utils.py - helpers para auth, hashing y jwt
import jwt
import os
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

JWT_SECRET = os.environ.get("JWT_SECRET", "jwt-secret-example")

def hash_password(password):
    return generate_password_hash(password)

def verify_password(hash_, password):
    return check_password_hash(hash_, password)

def create_jwt(payload):
    # Token expires in 365 days (effectively permanent until logout)
    exp = datetime.utcnow() + timedelta(days=365)
    payload_copy = {**payload, "exp": exp}
    token = jwt.encode(payload_copy, JWT_SECRET, algorithm="HS256")
    return token

def decode_jwt(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        return None
