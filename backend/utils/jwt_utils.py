# jwt_utils.py
import jwt
from datetime import datetime, timedelta
import os

# IMPORTANT: Change this to a secure key in production
JWT_SECRET = os.environ.get("JWT_SECRET", "pon_aqui_una_clave_muy_larga_y_segura")
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_HOURS = 48

def create_token(payload: dict) -> str:
    exp = datetime.utcnow() + timedelta(hours=JWT_EXP_DELTA_HOURS)
    data = {**payload, "exp": exp}
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except Exception as e:
        raise
