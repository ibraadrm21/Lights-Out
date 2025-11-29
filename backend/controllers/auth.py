# controllers/auth.py
from flask import Blueprint, request, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from models import create_user, get_user_by_email, get_user_by_id
from utils.hashing import hash_password, verify_password
from utils.jwt_utils import create_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400
    
    if get_user_by_email(email):
        return jsonify({"error": "Email already exists"}), 400
    
    password_hash = hash_password(password)
    try:
        uid = create_user(username, email, password_hash)
        token = create_token({"user_id": uid, "username": username})
        return jsonify({
            "token": token, 
            "user": {
                "id": uid, 
                "username": username,
                "email": email
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    user = get_user_by_email(email)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    if not verify_password(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Update login metadata
    from models import update_login_metadata
    client_ip = request.remote_addr or request.environ.get('HTTP_X_FORWARDED_FOR', 'unknown')
    update_login_metadata(user["id"], client_ip)
    
    token = create_token({"user_id": user["id"], "username": user["username"]})
    return jsonify({
        "token": token, 
        "user": {
            "id": user["id"], 
            "username": user["username"],
            "points": user.get("total_points", 0),
            "coins": user.get("coins", 0),
            "role": user.get("role", "user")
        }
    })
