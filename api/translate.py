# Vercel Serverless Function - Translation Endpoint
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/translate', methods=['POST'])
def translate():
    from translation import translate_batch
    
    data = request.get_json()
    texts = data.get('texts', [])
    target_lang = data.get('target_lang', 'es')
    source_lang = data.get('source_lang', 'en')
    
    if not texts:
        return jsonify({'error': 'No texts provided'}), 400
    
    translations = translate_batch(texts, target_lang, source_lang)
    return jsonify({'translations': translations})

# Vercel handler
def handler(request, context):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
