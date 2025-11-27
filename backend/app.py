# app.py - Flask app que sirve frontend y expone API
import os
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from database import init_db, get_connection
from models import create_user, get_user_by_username, save_points, get_leaderboard, get_random_questions
from utils import hash_password, verify_password, create_jwt, decode_jwt
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")
MAPILLARY_TOKEN = os.environ.get("MAPILLARY_TOKEN", "")

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "public"

app = Flask(__name__, static_folder=str(FRONTEND_DIST), static_url_path="/")
app.config["SECRET_KEY"] = SECRET_KEY
CORS(app)

# Inicializar DB
init_db()

# Serve index.html
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

# Serve src folder for No-NPM setup
@app.route("/src/<path:path>")
def serve_src(path):
    return send_from_directory(BASE_DIR / "frontend" / "src", path)

# Auth endpoints
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if get_user_by_username(username):
        return jsonify({"error":"username_exists"}), 400
    pwd_hash = hash_password(password)
    user_id = create_user(username, pwd_hash)
    token = create_jwt({"user_id": user_id, "username": username})
    return jsonify({"token": token, "user_id": user_id})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = get_user_by_username(username)
    if not user:
        return jsonify({"error":"invalid_credentials"}), 401
    if not verify_password(user["password_hash"], password):
        return jsonify({"error":"invalid_credentials"}), 401
    token = create_jwt({"user_id": user["id"], "username": username})
    return jsonify({"token": token, "user_id": user["id"]})

# Points endpoints
@app.route("/api/points/<int:user_id>", methods=["GET"])
def get_points(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COALESCE(SUM(score),0) as total FROM points WHERE user_id = ?", (user_id,))
    r = cur.fetchone()
    conn.close()
    return jsonify({"user_id": user_id, "total": r["total"] if r else 0})

@app.route("/api/points/<int:user_id>", methods=["POST"])
def post_points(user_id):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    payload = decode_jwt(token)
    if not payload or payload.get("user_id") != user_id:
        return jsonify({"error":"unauthorized"}), 401
    data = request.get_json()
    score = int(data.get("score",0))
    mode = data.get("mode","quiz")
    save_points(user_id, score, mode)
    return jsonify({"ok":True})

# Quiz endpoints
@app.route("/api/quiz/start", methods=["GET"])
def quiz_start():
    count = int(request.args.get("count", 10))
    questions = get_random_questions(count)
    # Convert sqlite rows to dict
    qs = []
    for q in questions:
        qs.append({
            "id": q["id"],
            "text": q["text"],
            "A": q["option_a"],
            "B": q["option_b"],
            "C": q["option_c"],
            "D": q["option_d"],
            # No enviar correct a cliente en producción. Para v0.1 lo enviamos si DEBUG.
            "debug_correct": q["correct"]
        })
    return jsonify({"questions": qs})

@app.route("/api/quiz/leaderboard", methods=["GET"])
def quiz_leaderboard():
    rows = get_leaderboard(limit=100)
    lb = [{"user_id": r["id"], "username": r["username"], "score": r["total_score"]} for r in rows]
    return jsonify({"leaderboard": lb})

# Geo endpoints (preparación)
@app.route("/api/geo/random", methods=["GET"])
def geo_random():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM geo_locations ORDER BY RANDOM() LIMIT 1")
    r = cur.fetchone()
    conn.close()
    if not r:
        return jsonify({"error": "no_geo"}), 404
    # Devolver coords y example mapillary id (cliente usa Mapillary JS)
    return jsonify({
        "id": r["id"],
        "lat": r["lat"],
        "lon": r["lon"],
        "description": r["description"],
        "mapillary_image_id": r["mapillary_image_id"],
        "mapillary_token": MAPILLARY_TOKEN
    })

# Translation endpoint
@app.route("/api/translate", methods=["POST"])
def translate():
    from translation import translate_batch
    data = request.get_json()
    texts = data.get("texts", [])
    target_lang = data.get("target_lang", "es")
    source_lang = data.get("source_lang", "en")
    
    if not texts:
        return jsonify({"error": "No texts provided"}), 400
    
    translations = translate_batch(texts, target_lang, source_lang)
    return jsonify({"translations": translations})

# Adaptive AI Quiz endpoint
@app.route("/api/quiz/adaptive", methods=["POST"])
def quiz_adaptive():
    """
    Generate adaptive quiz question based on player state.
    Expects JSON: {score, rank, previous_difficulty, accuracy_last_5, category, pace}
    """
    from ai_quiz_generator import generate_adaptive_question, calculate_rank
    
    data = request.get_json()
    
    # Build player state from request
    player_state = {
        "score": data.get("score", 0),
        "rank": data.get("rank", "bronze"),
        "previous_difficulty": data.get("previous_difficulty", "easy"),
        "accuracy_last_5": data.get("accuracy_last_5", 50),
        "category": data.get("category", "F1"),
        "pace": data.get("pace", "normal")
    }
    
    # Auto-calculate rank if not provided or if score suggests different rank
    calculated_rank = calculate_rank(player_state["score"])
    if player_state["rank"] != calculated_rank:
        player_state["rank"] = calculated_rank
    
    # Generate adaptive question
    question = generate_adaptive_question(player_state)
    
    if not question:
        return jsonify({"error": "Failed to generate question"}), 500
    
    return jsonify(question)


if __name__ == "__main__":
    # Ensure database is initialized and seeded
    try:
        from quiz_seed import seed_questions
        from geo_seed import seed_geo_examples
        
        # Check if data exists before seeding
        conn = get_connection()
        cur = conn.cursor()
        
        # Check questions
        cur.execute("SELECT COUNT(*) as count FROM questions")
        q_count = cur.fetchone()["count"]
        if q_count == 0:
            print("Seeding quiz questions...")
            seed_questions()
        else:
            print(f"Quiz already has {q_count} questions")
        
        # Check geo locations
        cur.execute("SELECT COUNT(*) as count FROM geo_locations")
        g_count = cur.fetchone()["count"]
        if g_count == 0:
            print("Seeding geo locations...")
            seed_geo_examples()
        else:
            print(f"Geo already has {g_count} locations")
        
        conn.close()
    except Exception as e:
        print(f"Seed error: {e}")
    
    app.run(host="0.0.0.0", port=5000, debug=True)
