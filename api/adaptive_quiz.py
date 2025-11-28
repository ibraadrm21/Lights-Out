# Vercel Serverless Function - Adaptive AI Quiz
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_quiz_generator import generate_adaptive_question, calculate_rank

app = Flask(__name__)
CORS(app)

@app.route('/api/quiz/adaptive', methods=['POST'])
def adaptive_quiz():
    """
    Generate an adaptive quiz question based on player state.
    
    Expected JSON body:
    {
        "score": 150,
        "rank": "silver",
        "previous_difficulty": "medium",
        "accuracy_last_5": 75.0,
        "category": "F1",
        "pace": "normal",
        "seen_questions": ["question text 1", "question text 2", ...]
    }
    """
    try:
        data = request.get_json()
        
        # Extract player state
        player_state = {
            "score": data.get("score", 0),
            "rank": data.get("rank", "bronze"),
            "previous_difficulty": data.get("previous_difficulty", "easy"),
            "accuracy_last_5": data.get("accuracy_last_5", 50.0),
            "category": data.get("category", "F1"),
            "pace": data.get("pace", "normal")
        }
        
        seen_questions = data.get("seen_questions", [])
        
        # Generate adaptive question
        question = generate_adaptive_question(player_state, seen_questions)
        
        if question:
            # Calculate current rank based on score
            current_rank = calculate_rank(player_state["score"])
            
            return jsonify({
                "success": True,
                "question": question,
                "current_rank": current_rank
            })
        else:
            return jsonify({
                "success": False,
                "error": "Failed to generate question"
            }), 500
            
    except Exception as e:
        print(f"Error in adaptive_quiz: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# Vercel handler
def handler(request, context):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
