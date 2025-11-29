# __init__.py - Make utils a package and re-export old utils.py functions
from .hashing import hash_password, verify_password
from .jwt_utils import create_token as create_jwt, decode_token as decode_jwt

__all__ = ['hash_password', 'verify_password', 'create_jwt', 'decode_jwt']
