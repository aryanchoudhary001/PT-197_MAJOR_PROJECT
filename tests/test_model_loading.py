"""
Tests for Model Loading and Artifact Integrity
"""

import unittest
import os
import json
from config import ANN_MODEL_PATH, SCALER_PATH, METRICS_REPORT_PATH

class TestModelLoading(unittest.TestCase):
    def test_ann_model_artifact_exists_and_valid(self):
        self.assertTrue(os.path.exists(ANN_MODEL_PATH), f"Missing {ANN_MODEL_PATH}")
        with open(ANN_MODEL_PATH, 'r') as f:
            data = json.load(f)
        self.assertIn('ann_weights', data)
        self.assertIn('w1', data['ann_weights'])
        self.assertIn('w2', data['ann_weights'])
        self.assertIn('w3', data['ann_weights'])
        self.assertEqual(len(data['ann_weights']['w1']), 12) # 12 input features

    def test_scaler_params_exist_and_valid(self):
        self.assertTrue(os.path.exists(SCALER_PATH), f"Missing {SCALER_PATH}")
        with open(SCALER_PATH, 'r') as f:
            data = json.load(f)
        self.assertIn('means', data)
        self.assertIn('stds', data)
        self.assertEqual(len(data['means']), 12)
        self.assertEqual(len(data['stds']), 12)

    def test_metrics_report_exists_and_valid(self):
        self.assertTrue(os.path.exists(METRICS_REPORT_PATH), f"Missing {METRICS_REPORT_PATH}")
        with open(METRICS_REPORT_PATH, 'r') as f:
            data = json.load(f)
        self.assertIn('models', data)
        self.assertIn('ann', data['models'])
        self.assertIn('accuracy', data['models']['ann']['metrics'])
        self.assertGreater(data['models']['ann']['metrics']['accuracy'], 0.70)

if __name__ == '__main__':
    unittest.main()
