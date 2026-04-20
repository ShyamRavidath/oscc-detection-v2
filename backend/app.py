"""
OSCC Detection Platform — Flask Backend

Endpoints:
  GET  /api/health  → { status, models_loaded }
  GET  /api/predict  → usage info
  POST /api/predict  → { probability_tumor, models: { LR, RF, SVM } }
"""

import os
import math
import traceback
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# CORS
frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")
CORS(app, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    frontend_origin,
])

# ── Model loading ──────────────────────────────────────────────────────────

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
BIOMARKER_ORDER = ["HPX", "CP", "ORM2", "APOA1", "ALB", "HP", "C3", "SERPINA1"]

scaler = None
models = {}
models_loaded = False

def load_models():
    global scaler, models, models_loaded
    try:
        scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
        models["LR"] = joblib.load(os.path.join(MODELS_DIR, "lr_model.pkl"))
        models["RF"] = joblib.load(os.path.join(MODELS_DIR, "rf_model.pkl"))
        models["SVM"] = joblib.load(os.path.join(MODELS_DIR, "svm_model.pkl"))
        models_loaded = True
        print("Models loaded successfully.")
    except Exception as e:
        models_loaded = False
        print(f"Model loading failed: {e}")
        print("Server will return mock predictions.")

load_models()

# ── Mock prediction fallback ──────────────────────────────────────────────

def mock_predict(features: list[float]) -> dict:
    """Deterministic mock prediction based on a weighted sum."""
    weights = [0.35, 0.10, 0.10, -0.10, -0.15, 0.10, 0.05, -0.05]
    z = sum(w * f for w, f in zip(weights, features)) - 0.3
    base = 1 / (1 + math.exp(-z))  # sigmoid
    return {
        "probability_tumor": round(base, 4),
        "models": {
            "LR": round(base * 0.97, 4),
            "RF": round(min(base * 1.05, 0.9999), 4),
            "SVM": round(base * 0.95, 4),
        },
        "mock": True,
    }

# ── Endpoints ─────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "models_loaded": models_loaded})


@app.route("/api/predict", methods=["GET", "POST"])
def predict():
    if request.method == "GET":
        return jsonify({
            "usage": "POST /api/predict with JSON body {\"features\": [HPX, CP, ORM2, APOA1, ALB, HP, C3, SERPINA1]}",
            "biomarkers": BIOMARKER_ORDER,
            "example": {"features": [1.2, 0.8, 0.5, 1.1, 3.5, 2.1, 0.9, 1.4]},
        })

    # POST
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON body"}), 400

    features = data.get("features")

    if not isinstance(features, list) or len(features) != 8:
        return jsonify({
            "error": f"Expected 'features' array of 8 numbers, got {type(features).__name__} of length {len(features) if isinstance(features, list) else 'N/A'}"
        }), 400

    try:
        features = [float(f) for f in features]
    except (ValueError, TypeError):
        return jsonify({"error": "All feature values must be numeric"}), 400

    # Predict
    if not models_loaded:
        return jsonify(mock_predict(features))

    try:
        X = np.array(features).reshape(1, -1)
        X_scaled = scaler.transform(X)
        probs = {}
        for name, model in models.items():
            probs[name] = round(float(model.predict_proba(X_scaled)[0][1]), 4)
        avg = round(sum(probs.values()) / len(probs), 4)
        return jsonify({
            "probability_tumor": avg,
            "models": probs,
            "mock": False,
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
