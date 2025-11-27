# Vercel Serverless Function - Quiz Endpoints
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from flask import Flask, request, jsonify
from flask_cors import CORS
from models import get_random_questions, get_leaderboard

app = Flask(__name__)
CORS(app)

@app.route('/api/quiz/start', methods=['GET'])
def quiz_start():
    count = int(request.args.get('count', 10))
    questions = get_random_questions(count)
    
    qs = []
    for q in questions:
        qs.append({
            'id': q['id'],
            'text': q['text'],
            'A': q['option_a'],
            'B': q['option_b'],
            'C': q['option_c'],
            'D': q['option_d'],
            'debug_correct': q['correct']
        })
    
    return jsonify({'questions': qs})

@app.route('/api/quiz/leaderboard', methods=['GET'])
def quiz_leaderboard():
    rows = get_leaderboard(limit=100)
    lb = [{'user_id': r['id'], 'username': r['username'], 'score': r['total_score']} for r in rows]
    return jsonify({'leaderboard': lb})

# Vercel handler
def handler(request, context):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
