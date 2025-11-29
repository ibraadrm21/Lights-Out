# controllers/user.py
from flask import Blueprint, request, jsonify, current_app
import os
import uuid
from werkzeug.utils import secure_filename
from models import update_profile_picture, get_user_by_id
from utils.jwt_utils import decode_token

user_bp = Blueprint("user", __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@user_bp.route("/profile-picture", methods=["PUT"])
def update_pfp():
    # Auth check
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    payload = decode_token(token)
    if not payload:
        return jsonify({"error": "unauthorized"}), 401
    
    user_id = payload["user_id"]
    
    # Check if file upload or preset
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Generate unique filename
            ext = filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{ext}"
            
            upload_folder = os.path.join(current_app.static_folder, "uploads")
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
                
            file.save(os.path.join(upload_folder, unique_filename))
            
            # Update DB
            update_profile_picture(user_id, unique_filename)
            
            return jsonify({"message": "Profile picture updated", "filename": unique_filename})
            
    elif request.json and 'avatar' in request.json:
        avatar = request.json['avatar']
        # Validate avatar is one of the presets
        valid_presets = ['helmet_red.png', 'helmet_blue.png', 'helmet_yellow.png', 'helmet_green.png']
        if avatar in valid_presets:
             update_profile_picture(user_id, avatar)
             return jsonify({"message": "Profile picture updated", "filename": avatar})
        else:
             return jsonify({"error": "Invalid preset"}), 400
             
    return jsonify({"error": "Invalid request"}), 400
