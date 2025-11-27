# Vercel Serverless Function - Auth Endpoints
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from flask import Flask, request, jsonify
from flask_cors import CORS
from models import create_user, get_user_by_username
from utils import hash_password, verify_password, create_jwt

app = Flask(__name__)
CORS(app)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if get_user_by_username(username):
        return jsonify({'error': 'username_exists'}), 400
    
    pwd_hash = hash_password(password)
    user_id = create_user(username, pwd_hash)
    token = create_jwt({'user_id': user_id, 'username': username})
    
    return jsonify({'token': token, 'user_id': user_id})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = get_user_by_username(username)
    if not user:
        return jsonify({'error': 'invalid_credentials'}), 401
    
    if not verify_password(user['password_hash'], password):
        return jsonify({'error': 'invalid_credentials'}), 401
    
    token = create_jwt({'user_id': user['id'], 'username': username})
    return jsonify({'token': token, 'user_id': user['id']})

# Vercel handler
def handler(request, context):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
