"""
Data Loader Module for Cardiovascular Disease Dataset
Handles CSV reading with correct delimiter, validation, and encoding.
"""

import os
import csv
import logging
from config import RAW_DATA_PATH, DELIMITER, EXPECTED_COLUMNS, TARGET_COLUMN, ID_COLUMN

logger = logging.getLogger('cardio_monitor.data_loader')

def load_cardiovascular_data(filepath=None, delimiter=DELIMITER):
    """
    Loads raw cardiovascular records from the Kaggle dataset.
    
    Parameters:
        filepath (str, optional): Path to CSV. Defaults to config.RAW_DATA_PATH.
        delimiter (str): CSV delimiter (default ';').
        
    Returns:
        tuple: (list of dict rows, fieldnames list, metadata dict)
    """
    path = filepath or RAW_DATA_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Cardiovascular dataset file not found at: {path}")

    logger.info(f"Loading cardiovascular dataset from: {path} with delimiter '{delimiter}'")
    
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=delimiter)
        fieldnames = reader.fieldnames or []
        rows = list(reader)
        
    missing_cols = [col for col in EXPECTED_COLUMNS if col not in fieldnames]
    if missing_cols:
        raise ValueError(f"Dataset is missing required columns: {missing_cols}")
        
    metadata = {
        'total_records': len(rows),
        'columns': fieldnames,
        'delimiter': delimiter,
        'has_target': TARGET_COLUMN in fieldnames,
        'has_id': ID_COLUMN in fieldnames
    }
    
    logger.info(f"Successfully loaded {len(rows)} records with {len(fieldnames)} columns.")
    return rows, fieldnames, metadata

if __name__ == '__main__':
    rows, fields, meta = load_cardiovascular_data()
    print("Metadata:", meta)
    print("First record:", rows[0] if rows else "Empty")
