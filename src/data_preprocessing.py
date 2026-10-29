"""
Data Preprocessing Pipeline
Separates input features and target, converts age to years, computes BMI,
scales features using parameters learned on training data only (no data leakage).
"""

import math
import random
import logging
from config import FEATURE_COLUMNS, RANDOM_SEED, TRAIN_TEST_SPLIT_RATIO

logger = logging.getLogger('cardio_monitor.preprocessing')

class CardioDataPreprocessor:
    def __init__(self):
        self.feature_names = FEATURE_COLUMNS
        self.means = []
        self.stds = []
        self.is_fitted = False
        
    def extract_features(self, rows):
        """
        Converts validated raw rows into feature vectors and target labels.
        Features engineered:
        1. age_years: age in days / 365.25
        2. gender: 1 if male (code 2), 0 if female (code 1)
        3. height (cm)
        4. weight (kg)
        5. ap_hi (systolic BP)
        6. ap_lo (diastolic BP)
        7. bmi (weight / (height/100)^2)
        8. cholesterol (1, 2, 3)
        9. gluc (1, 2, 3)
        10. smoke (0, 1)
        11. alco (0, 1)
        12. active (0, 1)
        """
        X = []
        y = []
        for r in rows:
            age_years = float(r['age']) / 365.25
            gender = 1.0 if str(r['gender']) == '2' else 0.0
            h = float(r['height'])
            w = float(r['weight'])
            hi = float(r['ap_hi'])
            lo = float(r['ap_lo'])
            bmi = w / ((h / 100.0) ** 2)
            chol = float(r['cholesterol'])
            gluc = float(r['gluc'])
            smoke = float(r['smoke'])
            alco = float(r['alco'])
            active = float(r['active'])
            
            vec = [age_years, gender, h, w, hi, lo, bmi, chol, gluc, smoke, alco, active]
            X.append(vec)
            if 'cardio' in r:
                y.append(int(r['cardio']))
                
        return X, y
        
    def fit(self, X_train):
        """Calculates means and standard deviations strictly on training data."""
        n_samples = len(X_train)
        n_features = len(self.feature_names)
        
        self.means = [
            sum(X_train[i][j] for i in range(n_samples)) / n_samples
            for j in range(n_features)
        ]
        self.stds = [
            math.sqrt(sum((X_train[i][j] - self.means[j]) ** 2 for i in range(n_samples)) / n_samples)
            for j in range(n_features)
        ]
        self.is_fitted = True
        logger.info(f"Fitted preprocessor on {n_samples} training samples.")
        
    def transform(self, X):
        """Applies fitted standard scaling (z = (x - mean) / std)."""
        if not self.is_fitted:
            raise ValueError("Preprocessor must be fitted before transforming data.")
        n_features = len(self.feature_names)
        scaled_X = []
        for row in X:
            scaled_row = [
                (row[j] - self.means[j]) / (self.stds[j] if self.stds[j] > 1e-7 else 1.0)
                for j in range(n_features)
            ]
            scaled_X.append(scaled_row)
        return scaled_X
        
    def fit_transform(self, X_train):
        self.fit(X_train)
        return self.transform(X_train)
        
    def transform_single_patient(self, patient_dict):
        """
        Transforms a single patient input dictionary matching UI input fields into a normalized vector.
        """
        age = float(patient_dict['age'])
        gender = 1.0 if patient_dict.get('gender') in ('2', 'Male', 'male', 2, 1.0) else 0.0
        h = float(patient_dict['height'])
        w = float(patient_dict['weight'])
        hi = float(patient_dict['ap_hi'])
        lo = float(patient_dict['ap_lo'])
        bmi = w / ((h / 100.0) ** 2)
        chol = float(patient_dict['cholesterol'])
        gluc = float(patient_dict['gluc'])
        smoke = float(patient_dict.get('smoke', 0))
        alco = float(patient_dict.get('alco', 0))
        active = float(patient_dict.get('active', 1))
        
        raw_vec = [age, gender, h, w, hi, lo, bmi, chol, gluc, smoke, alco, active]
        return self.transform([raw_vec])[0], raw_vec

def train_test_split(X, y, test_size=0.2, seed=RANDOM_SEED):
    """Splits data into train and test sets reproducibly with fixed random seed."""
    random.seed(seed)
    indices = list(range(len(X)))
    random.shuffle(indices)
    
    split_idx = int((1.0 - test_size) * len(indices))
    train_idx = indices[:split_idx]
    test_idx = indices[split_idx:]
    
    X_train = [X[i] for i in train_idx]
    y_train = [y[i] for i in train_idx]
    X_test = [X[i] for i in test_idx]
    y_test = [y[i] for i in test_idx]
    
    return X_train, X_test, y_train, y_test
