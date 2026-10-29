"""
Tests for Data Preprocessing
"""

import unittest
from src.data_preprocessing import CardioDataPreprocessor, train_test_split

class TestPreprocessing(unittest.TestCase):
    def setUp(self):
        self.preprocessor = CardioDataPreprocessor()
        self.dummy_rows = [
            {'age': '18262', 'gender': '1', 'height': '160', 'weight': '60.0', 'ap_hi': '120', 'ap_lo': '80',
             'cholesterol': '1', 'gluc': '1', 'smoke': '0', 'alco': '0', 'active': '1', 'cardio': '0'},
            {'age': '21915', 'gender': '2', 'height': '175', 'weight': '80.0', 'ap_hi': '140', 'ap_lo': '90',
             'cholesterol': '2', 'gluc': '1', 'smoke': '1', 'alco': '0', 'active': '1', 'cardio': '1'}
        ]

    def test_feature_extraction(self):
        X, y = self.preprocessor.extract_features(self.dummy_rows)
        self.assertEqual(len(X), 2)
        self.assertEqual(len(y), 2)
        # Check age conversion in years: 18262 / 365.25 ≈ 50.0
        self.assertAlmostEqual(X[0][0], 50.0, places=1)
        # Check BMI: 60 / (1.6)^2 = 23.4375
        self.assertAlmostEqual(X[0][6], 23.44, places=1)

    def test_fit_transform(self):
        X, y = self.preprocessor.extract_features(self.dummy_rows)
        X_scaled = self.preprocessor.fit_transform(X)
        self.assertEqual(len(X_scaled), 2)
        self.assertEqual(len(X_scaled[0]), len(self.preprocessor.feature_names))

    def test_train_test_split(self):
        X = [[i] for i in range(100)]
        y = [i % 2 for i in range(100)]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, seed=42)
        self.assertEqual(len(X_train), 80)
        self.assertEqual(len(X_test), 20)

if __name__ == '__main__':
    unittest.main()
