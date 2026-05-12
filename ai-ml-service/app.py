from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = 'shared_secret_between_services'

def require_api_key(f):
    def wrapper(*args, **kwargs):
        key = request.headers.get('X-API-Key')
        if key != API_KEY:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

@app.route('/predict/disease', methods=['POST'])
@require_api_key
def predict_disease():
    data = request.json
    return jsonify({
        'source': 'ml-service',
        'predictions': [
            {'disease': 'Bovine Respiratory Disease', 'confidence': 0.87},
            {'disease': 'Mastitis', 'confidence': 0.12},
        ],
        'recommendations': ['Isolate animal', 'Consult veterinarian immediately'],
    })

@app.route('/predict/yield', methods=['POST'])
@require_api_key
def predict_yield():
    data = request.json
    base_yield = float(data.get('area', 1)) * 2.5
    return jsonify({
        'source': 'ml-service',
        'predictedYield': round(base_yield, 2),
        'unit': 'tons',
        'confidence': 0.78,
        'factors': ['Soil quality: good', 'Weather forecast: favorable'],
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ml-prediction'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
