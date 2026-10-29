"""
Utility functions for Cardiovascular Health Monitoring and Prediction Project
"""

import json
import os
import math
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('cardio_monitor')

def load_json(filepath):
    """Safely loads a JSON file, returning None if missing or corrupted."""
    if not os.path.exists(filepath):
        logger.warning(f"File not found: {filepath}")
        return None
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading {filepath}: {e}")
        return None

def save_json(data, filepath):
    """Saves dictionary data to a JSON file with pretty formatting."""
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    logger.info(f"Saved JSON artifact to {filepath}")

def sigmoid(z):
    """Numerically stable sigmoid function."""
    z_clipped = max(-50.0, min(50.0, z))
    return 1.0 / (1.0 + math.exp(-z_clipped))

def relu(z):
    """Rectified Linear Unit activation function."""
    return max(0.0, z)

def calculate_bmi(height_cm, weight_kg):
    """Calculates Body Mass Index (BMI = kg / m^2)."""
    if height_cm <= 0:
        return 0.0
    height_m = height_cm / 100.0
    return round(weight_kg / (height_m ** 2), 2)

def get_bmi_category(bmi):
    """Returns clinical WHO BMI category."""
    if bmi < 18.5:
        return "Underweight", "blue"
    elif bmi < 25.0:
        return "Normal weight", "green"
    elif bmi < 30.0:
        return "Overweight", "amber"
    else:
        return "Obese", "red"

def get_blood_pressure_category(ap_hi, ap_lo):
    """
    Returns AHA/ACC 2017 Blood Pressure Guideline Category:
    - Normal: <120 and <80
    - Elevated: 120-129 and <80
    - Stage 1 Hypertension: 130-139 or 80-89
    - Stage 2 Hypertension: >=140 or >=90
    - Hypertensive Crisis: >180 and/or >120
    """
    if ap_hi > 180 or ap_lo > 120:
        return "Hypertensive Crisis (Urgent)", "red"
    elif ap_hi >= 140 or ap_lo >= 90:
        return "Stage 2 Hypertension", "rose"
    elif ap_hi >= 130 or ap_lo >= 80:
        return "Stage 1 Hypertension", "amber"
    elif ap_hi >= 120 and ap_lo < 80:
        return "Elevated", "yellow"
    else:
        return "Normal", "green"
