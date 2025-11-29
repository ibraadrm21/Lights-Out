# controllers/points.py
from flask import Blueprint, request, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from utils.jwt_utils import decode_token
from models import get_user_by_id, update_user_points_and_coins, save_quiz_result

points_bp = Blueprint("points", __name__)

# Configurable base points. Can be adjusted per quiz_id in the future.
BASE_POINTS_DEFAULT = 100

def calculate_points(base_points, score_pct):
    """Calculate points proportional to score percentage"""
    return round(base_points * (score_pct / 100.0))

def calculate_coins(score_pct):
    """Calculate coins using formula: round(score_percentage * 0.35)"""
    return round(score_pct * 0.35)

@points_bp.route("/user", methods=["GET"])
def get_profile():
    auth = request.headers.get("Authorization")
    if not auth:
        return jsonify({"error": "Missing token"}), 401
    
    token = auth.split("Bearer ")[-1]
    try:
        payload = decode_token(token)
    except Exception:
        return jsonify({"error": "Invalid token"}), 401
    
    user = get_user_by_id(payload["user_id"])
    if not user:
        return jsonify({"error": "Not found"}), 404
    
    return jsonify({
        "id": user["id"],
        "username": user["username"],
        "points": user.get("total_points", 0),
        "coins": user.get("coins", 0)
    })

@points_bp.route("/quiz/result", methods=["POST"])
def quiz_result():
    """Receive quiz results and update points/coins if token valid."""
    auth = request.headers.get("Authorization")
    token = None
    if auth and "Bearer " in auth:
        token = auth.split("Bearer ")[-1]

    data = request.json or {}
    score_percentage = data.get("score_percentage")
    quiz_id = data.get("quiz_id", 0)
    base_points = data.get("base_points", BASE_POINTS_DEFAULT)

    if score_percentage is None:
        return jsonify({"error": "score_percentage required"}), 400

    # Calculate rewards
    coins_awarded = calculate_coins(score_percentage)
    points_awarded = calculate_points(base_points, score_percentage)

    # If no token -> don't store, return only the calculated rewards
    if not token:
        return jsonify({
            "message": "User not authenticated. Rewards calculated but not saved.",
            "points_awarded": points_awarded,
            "coins_awarded": coins_awarded
        }), 200

    try:
        payload = decode_token(token)
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    user_id = payload["user_id"]
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update persistent storage
    update_user_points_and_coins(user_id, points_awarded, coins_awarded)
    # Save result for history
    save_quiz_result(user_id, quiz_id, score_percentage, points_awarded, coins_awarded)

    # Get updated values
    updated_user = get_user_by_id(user_id)

    return jsonify({
        "message": "Rewards saved",
        "points_awarded": points_awarded,
        "coins_awarded": coins_awarded,
        "points_total": updated_user.get("total_points", 0),
        "coins_total": updated_user.get("coins", 0)
    }), 200
