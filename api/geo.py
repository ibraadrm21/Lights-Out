# Vercel Serverless Function - Geo Endpoint
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from flask import Flask, jsonify
from flask_cors import CORS
from models import get_random_geo

app = Flask(__name__)
CORS(app)

@app.route('/api/geo/random', methods=['GET'])
def geo_random():
    geo = get_random_geo()
    
    if not geo:
        return jsonify({'error': 'no_geo'}), 404
    
    return jsonify({
        'id': geo['id'],
        'lat': float(geo['lat']),
        'lon': float(geo['lon']),
        'description': geo['description'],
        'mapillary_image_id': geo['mapillary_image_id'],
        'mapillary_token': os.environ.get('MAPILLARY_TOKEN', '')
    })

# Vercel handler
def handler(request, context):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
