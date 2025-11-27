# Vercel Serverless Function - Points Endpoints
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_connection
from models import save_points
from utils import decode_jwt

app = Flask(__name__)
CORS(app)

@app.route('/api/points/<int:user_id>', methods=['GET'])
def get_points(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COALESCE(SUM(score), 0) as total FROM points WHERE user_id = %s", (user_id,))
    r = cur.fetchone()
    conn.close()
    return jsonify({'user_id': user_id, 'total': r['total'] if r else 0})

@app.route('/api/points/<int:user_id>', methods=['POST'])
def post_points(user_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    payload = decode_jwt(token)
    
    if not payload or payload.get('user_id') != user_id:
        return jsonify({'error': 'unauthorized'}), 401
    
    data = request.get_json()
    score = int(data.get('score', 0))
    mode = data.get('mode', 'quiz')
    
    save_points(user_id, score, mode)
    return jsonify({'ok': True})

# Vercel handler
def handler(request, context):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
