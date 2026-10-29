"""
Configuration and Hyperparameters for Cardiovascular Health Monitoring and Prediction Project
"""

import os

# Project paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RAW_DATA_PATH = os.path.join(DATA_DIR, 'raw', 'cardio_train.csv')
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, 'processed')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
REPORTS_DIR = os.path.join(BASE_DIR, 'reports')

ANN_MODEL_PATH = os.path.join(MODELS_DIR, 'trained_ann.json')
SCALER_PATH = os.path.join(MODELS_DIR, 'scaler_params.json')
METRICS_REPORT_PATH = os.path.join(REPORTS_DIR, 'model_metrics.json')

# Dataset Specification
DELIMITER = ';'
TARGET_COLUMN = 'cardio'
ID_COLUMN = 'id'

EXPECTED_COLUMNS = [
    'id', 'age', 'gender', 'height', 'weight',
    'ap_hi', 'ap_lo', 'cholesterol', 'gluc',
    'smoke', 'alco', 'active', 'cardio'
]

FEATURE_COLUMNS = [
    'age_years', 'gender', 'height', 'weight',
    'ap_hi', 'ap_lo', 'bmi', 'cholesterol',
    'gluc', 'smoke', 'alco', 'active'
]

# Validation Bounds (Physiological ranges for data cleaning)
VALIDATION_BOUNDS = {
    'ap_hi_min': 70,
    'ap_hi_max': 240,
    'ap_lo_min': 40,
    'ap_lo_max': 160,
    'height_min': 125,
    'height_max': 220,
    'weight_min': 35,
    'weight_max': 200,
}

# Machine Learning & ANN Hyperparameters
RANDOM_SEED = 42
TRAIN_TEST_SPLIT_RATIO = 0.8
ANN_EPOCHS = 12
ANN_BATCH_SIZE = 64
ANN_LEARNING_RATE = 0.001
ANN_HIDDEN_LAYER_1 = 64
ANN_HIDDEN_LAYER_2 = 32
DROPOUT_RATE = 0.2
