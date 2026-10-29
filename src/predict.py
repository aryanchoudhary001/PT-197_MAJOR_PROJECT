"""
Prediction Engine
Loads the saved trained ANN and scaler artifacts to generate real-time inferences
with human-understandable clinical explanations and probability estimates.
"""

import json
import os
import math
from config import ANN_MODEL_PATH, SCALER_PATH
from src.utils import sigmoid, relu, calculate_bmi, get_bmi_category, get_blood_pressure_category

class CardioPredictor:
    def __init__(self, model_path=ANN_MODEL_PATH, scaler_path=SCALER_PATH):
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.is_loaded = False
        self.feature_names = []
        self.means = []
        self.stds = []
        self.w1 = []
        self.b1 = []
        self.w2 = []
        self.b2 = []
        self.w3 = []
        self.b3 = []
        self.load_model()
        
    def load_model(self):
        """Loads trained ANN weights, biases, and normalization parameters."""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model weights not found at {self.model_path}. Please train the model first.")
        if not os.path.exists(self.scaler_path):
            raise FileNotFoundError(f"Scaler parameters not found at {self.scaler_path}.")
            
        with open(self.model_path, 'r') as f:
            model_data = json.load(f)
            
        with open(self.scaler_path, 'r') as f:
            scaler_data = json.load(f)
            
        self.feature_names = scaler_data['feature_names']
        self.means = scaler_data['means']
        self.stds = scaler_data['stds']
        
        ann = model_data['ann_weights']
        self.w1 = ann['w1']
        self.b1 = ann['b1']
        self.w2 = ann['w2']
        self.b2 = ann['b2']
        self.w3 = ann['w3']
        self.b3 = ann['b3']
        
        self.is_loaded = True
        
    def forward(self, x_scaled):
        """Executes forward pass through trained ANN."""
        dim_in = len(x_scaled)
        dim_h1 = len(self.b1)
        dim_h2 = len(self.b2)
        
        # Layer 1
        z1 = [sum(x_scaled[i] * self.w1[i][j] for i in range(dim_in)) + self.b1[j] for j in range(dim_h1)]
        a1 = [relu(v) for v in z1]
        
        # Layer 2
        z2 = [sum(a1[i] * self.w2[i][j] for i in range(dim_h1)) + self.b2[j] for j in range(dim_h2)]
        a2 = [relu(v) for v in z2]
        
        # Layer 3
        z3 = sum(a2[i] * self.w3[i][0] for i in range(dim_h2)) + self.b3[0]
        prob = sigmoid(z3)
        return prob
        
    def predict(self, patient_dict):
        """
        Generates prediction, probability, clinical context, and explanations for a patient.
        
        patient_dict keys expected:
        - age (years, float/int)
        - gender (1=female, 2=male, or 'Female'/'Male')
        - height (cm, float)
        - weight (kg, float)
        - ap_hi (systolic BP, mmHg)
        - ap_lo (diastolic BP, mmHg)
        - cholesterol (1=Normal, 2=Above Normal, 3=Well Above Normal)
        - gluc (1=Normal, 2=Above Normal, 3=Well Above Normal)
        - smoke (0 or 1)
        - alco (0 or 1)
        - active (0 or 1)
        """
        if not self.is_loaded:
            self.load_model()
            
        age = float(patient_dict['age'])
        gender = 1.0 if patient_dict.get('gender') in ('2', 'Male', 'male', 2, 1.0) else 0.0
        h = float(patient_dict['height'])
        w = float(patient_dict['weight'])
        hi = float(patient_dict['ap_hi'])
        lo = float(patient_dict['ap_lo'])
        bmi = calculate_bmi(h, w)
        chol = float(patient_dict['cholesterol'])
        gluc = float(patient_dict['gluc'])
        smoke = float(patient_dict.get('smoke', 0))
        alco = float(patient_dict.get('alco', 0))
        active = float(patient_dict.get('active', 1))
        
        raw_vec = [age, gender, h, w, hi, lo, bmi, chol, gluc, smoke, alco, active]
        
        # Scale features using training mean and std
        scaled_vec = [
            (raw_vec[i] - self.means[i]) / (self.stds[i] if self.stds[i] > 1e-7 else 1.0)
            for i in range(len(raw_vec))
        ]
        
        # ANN Forward pass
        probability = self.forward(scaled_vec)
        predicted_class = 1 if probability >= 0.5 else 0
        
        # Clinical Risk Factors Evaluation
        risk_factors = []
        positive_factors = []
        
        bp_cat, bp_color = get_blood_pressure_category(hi, lo)
        bmi_cat, bmi_color = get_bmi_category(bmi)
        
        if hi >= 130 or lo >= 80:
            risk_factors.append(f"Elevated Blood Pressure ({hi:.0f}/{lo:.0f} mmHg - {bp_cat})")
        else:
            positive_factors.append(f"Healthy Blood Pressure ({hi:.0f}/{lo:.0f} mmHg)")
            
        if bmi >= 25.0:
            risk_factors.append(f"BMI indicates {bmi_cat} ({bmi:.1f} kg/m²)")
        else:
            positive_factors.append(f"Healthy BMI ({bmi:.1f} kg/m²)")
            
        if chol > 1:
            risk_factors.append(f"Cholesterol level {'Above Normal' if chol==2 else 'Well Above Normal'}")
        else:
            positive_factors.append("Normal Cholesterol level")
            
        if gluc > 1:
            risk_factors.append(f"Glucose level {'Above Normal' if gluc==2 else 'Well Above Normal'}")
        else:
            positive_factors.append("Normal Glucose level")
            
        if smoke == 1:
            risk_factors.append("Tobacco smoker (significant cardiovascular stressor)")
        else:
            positive_factors.append("Non-smoker")
            
        if alco == 1:
            risk_factors.append("Alcohol consumer")
            
        if active == 0:
            risk_factors.append("Sedentary lifestyle (low physical activity)")
        else:
            positive_factors.append("Physically active routine")
            
        if age >= 55:
            risk_factors.append(f"Age {age:.0f} years (demographic risk increases >50)")
            
        # Risk assessment level
        if probability < 0.35:
            risk_level = "Low Estimated Association"
            risk_color = "green"
            verdict_text = "The neural network estimates that these physiological metrics align with the negative target class (No CVD indicator pattern in the dataset)."
        elif probability < 0.65:
            risk_level = "Moderate Estimated Association"
            risk_color = "amber"
            verdict_text = "The neural network identifies borderline indicators. Several measurements (such as blood pressure or cholesterol) suggest monitoring."
        else:
            risk_level = "High Estimated Association"
            risk_color = "red"
            verdict_text = "The neural network estimates that these clinical attributes closely match the positive target class in the cardiovascular dataset."
            
        return {
            'predicted_class': predicted_class,
            'probability': round(probability, 4),
            'probability_percentage': round(probability * 100, 1),
            'risk_level': risk_level,
            'risk_color': risk_color,
            'verdict_text': verdict_text,
            'derived_bmi': bmi,
            'bmi_category': bmi_cat,
            'bp_category': bp_cat,
            'risk_factors': risk_factors,
            'positive_factors': positive_factors,
            'raw_features': dict(zip(self.feature_names, raw_vec)),
            'disclaimer': "This estimation is generated by an educational Artificial Neural Network and is NOT a medical diagnosis. Always consult a certified healthcare professional."
        }
