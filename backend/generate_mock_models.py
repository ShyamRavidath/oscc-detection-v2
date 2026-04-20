"""
Generate mock ML models for the OSCC detection platform.

Creates synthetic training data and trains LogisticRegression, RandomForest,
and SVM classifiers to produce realistic-looking predictions for demo purposes.

Biomarker order: HPX, CP, ORM2, APOA1, ALB, HP, C3, SERPINA1
"""

import os
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib

np.random.seed(42)

N_SAMPLES = 200
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# Feature means for healthy (class 0) vs OSCC (class 1)
# HPX is the primary differentiator (hemopexin elevated in OSCC)
healthy_means = [0.8, 0.7, 0.4, 1.3, 4.0, 1.8, 1.0, 1.5]
tumor_means =   [2.1, 1.1, 0.9, 0.9, 3.2, 2.6, 1.4, 1.1]
feature_std =   [0.4, 0.3, 0.2, 0.3, 0.5, 0.5, 0.3, 0.3]

# Generate synthetic data
n_healthy = N_SAMPLES // 2
n_tumor = N_SAMPLES - n_healthy

X_healthy = np.array([
    np.random.normal(m, s, n_healthy)
    for m, s in zip(healthy_means, feature_std)
]).T

X_tumor = np.array([
    np.random.normal(m, s, n_tumor)
    for m, s in zip(tumor_means, feature_std)
]).T

X = np.vstack([X_healthy, X_tumor])
y = np.array([0] * n_healthy + [1] * n_tumor)

# Clip to positive values (concentrations can't be negative)
X = np.clip(X, 0.01, None)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Fit scaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train models
models = {
    "lr": LogisticRegression(random_state=42, max_iter=1000),
    "rf": RandomForestClassifier(n_estimators=50, random_state=42),
    "svm": SVC(probability=True, random_state=42),
}

for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    train_acc = model.score(X_train_scaled, y_train)
    test_acc = model.score(X_test_scaled, y_test)
    print(f"{name.upper():>3s}: train={train_acc:.3f}  test={test_acc:.3f}")

# Save
joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.pkl"))
joblib.dump(models["lr"], os.path.join(MODELS_DIR, "lr_model.pkl"))
joblib.dump(models["rf"], os.path.join(MODELS_DIR, "rf_model.pkl"))
joblib.dump(models["svm"], os.path.join(MODELS_DIR, "svm_model.pkl"))

print(f"\nSaved 4 files to {MODELS_DIR}/")
print("  scaler.pkl, lr_model.pkl, rf_model.pkl, svm_model.pkl")
