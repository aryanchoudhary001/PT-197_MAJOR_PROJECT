"""
Tests for Data Validation logic
"""

import unittest
from src.data_validation import validate_dataset
from config import EXPECTED_COLUMNS

class TestDataValidation(unittest.TestCase):
    def setUp(self):
        self.fieldnames = EXPECTED_COLUMNS
        self.valid_record = {
            'id': '1', 'age': '18393', 'gender': '2', 'height': '168', 'weight': '70.0',
            'ap_hi': '120', 'ap_lo': '80', 'cholesterol': '1', 'gluc': '1',
            'smoke': '0', 'alco': '0', 'active': '1', 'cardio': '0'
        }

    def test_valid_record_passes(self):
        clean, summary = validate_dataset([self.valid_record], self.fieldnames)
        self.assertEqual(len(clean), 1)
        self.assertEqual(summary['clean_records_count'], 1)

    def test_implausible_blood_pressure_filtered(self):
        # Negative BP or extreme typos
        bad_bp1 = dict(self.valid_record, id='2', ap_hi='-150', ap_lo='80')
        bad_bp2 = dict(self.valid_record, id='3', ap_hi='140', ap_lo='180') # ap_lo > ap_hi
        bad_bp3 = dict(self.valid_record, id='4', ap_hi='16020', ap_lo='80')
        
        clean, summary = validate_dataset([bad_bp1, bad_bp2, bad_bp3], self.fieldnames)
        self.assertEqual(len(clean), 0)
        self.assertEqual(summary['implausible_blood_pressure_removed'], 3)

    def test_implausible_height_weight_filtered(self):
        bad_h = dict(self.valid_record, id='5', height='55') # 55 cm
        bad_w = dict(self.valid_record, id='6', weight='10') # 10 kg
        clean, summary = validate_dataset([bad_h, bad_w], self.fieldnames)
        self.assertEqual(len(clean), 0)
        self.assertEqual(summary['implausible_height_weight_removed'], 2)

    def test_missing_column_raises_error(self):
        with self.assertRaises(ValueError):
            validate_dataset([self.valid_record], ['age', 'gender', 'height'])

if __name__ == '__main__':
    unittest.main()
