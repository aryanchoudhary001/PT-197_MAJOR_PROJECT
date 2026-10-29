"""
Tests for Prediction Engine
"""

import unittest
from src.predict import CardioPredictor

class TestPrediction(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.predictor = CardioPredictor()

    def test_predictor_loaded(self):
        self.assertTrue(self.predictor.is_loaded)
        self.assertEqual(len(self.predictor.means), 12)

    def test_healthy_patient_prediction(self):
        healthy_patient = {
            'age': 35,
            'gender': '1',
            'height': 165,
            'weight': 58,
            'ap_hi': 115,
            'ap_lo': 75,
            'cholesterol': 1,
            'gluc': 1,
            'smoke': 0,
            'alco': 0,
            'active': 1
        }
        res = self.predictor.predict(healthy_patient)
        self.assertIn('predicted_class', res)
        self.assertIn('probability', res)
        self.assertIn('risk_level', res)
        self.assertIn('disclaimer', res)
        self.assertGreaterEqual(res['probability'], 0.0)
        self.assertLessEqual(res['probability'], 1.0)
        # Healthy patient should have low to moderate probability
        self.assertLess(res['probability'], 0.50)

    def test_high_risk_patient_prediction(self):
        high_risk_patient = {
            'age': 63,
            'gender': '2',
            'height': 170,
            'weight': 98,
            'ap_hi': 170,
            'ap_lo': 105,
            'cholesterol': 3,
            'gluc': 3,
            'smoke': 1,
            'alco': 1,
            'active': 0
        }
        res = self.predictor.predict(high_risk_patient)
        self.assertGreaterEqual(res['probability'], 0.50)
        self.assertEqual(res['predicted_class'], 1)
        self.assertGreater(len(res['risk_factors']), 0)

if __name__ == '__main__':
    unittest.main()
