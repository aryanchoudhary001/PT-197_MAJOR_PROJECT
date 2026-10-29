"""
Data Validation Module
Performs comprehensive quality checks, identifies missing/duplicate records,
and filters physiologically implausible records with clinical documentation.
"""

import logging
from config import VALIDATION_BOUNDS, TARGET_COLUMN, EXPECTED_COLUMNS

logger = logging.getLogger('cardio_monitor.data_validation')

def validate_dataset(rows, fieldnames):
    """
    Validates structural integrity and physiological plausibility of the dataset.
    
    Parameters:
        rows (list of dict): Raw dataset records.
        fieldnames (list of str): Column headers.
        
    Returns:
        tuple: (clean_rows, summary_dict)
    """
    total = len(rows)
    logger.info(f"Starting data validation on {total} records...")
    
    # 1. Column check
    missing_fields = [f for f in EXPECTED_COLUMNS if f not in fieldnames]
    if missing_fields:
        raise ValueError(f"Missing required fields: {missing_fields}")
        
    # 2. Track quality metrics
    missing_values = {f: 0 for f in fieldnames}
    seen_ids = set()
    duplicate_ids = 0
    
    implausible_bp_count = 0
    implausible_phys_count = 0
    clean_rows = []
    
    b = VALIDATION_BOUNDS
    
    for r in rows:
        # Check missing values
        for f in fieldnames:
            if r.get(f) is None or str(r.get(f)).strip() == '':
                missing_values[f] += 1
                
        # Check duplicate IDs
        rec_id = r.get('id')
        if rec_id in seen_ids:
            duplicate_ids += 1
        seen_ids.add(rec_id)
        
        # Parse numerical values
        try:
            h = float(r['height'])
            w = float(r['weight'])
            hi = float(r['ap_hi'])
            lo = float(r['ap_lo'])
            age_d = float(r['age'])
            gender = int(r['gender'])
            chol = int(r['cholesterol'])
            gluc = int(r['gluc'])
            smoke = int(r['smoke'])
            alco = int(r['alco'])
            active = int(r['active'])
            cardio = int(r['cardio'])
        except (ValueError, KeyError) as e:
            logger.warning(f"Parse error on record {r.get('id')}: {e}")
            continue
            
        # Clinical plausibility filters
        # 1. Blood Pressure: systolic (70-240), diastolic (40-160), and ap_hi > ap_lo
        if hi < b['ap_hi_min'] or hi > b['ap_hi_max'] or lo < b['ap_lo_min'] or lo > b['ap_lo_max'] or lo >= hi:
            implausible_bp_count += 1
            continue
            
        # 2. Height and Weight bounds
        if h < b['height_min'] or h > b['height_max'] or w < b['weight_min'] or w > b['weight_max']:
            implausible_phys_count += 1
            continue
            
        # 3. Categorical valid ranges
        if gender not in (1, 2) or chol not in (1, 2, 3) or gluc not in (1, 2, 3):
            continue
        if smoke not in (0, 1) or alco not in (0, 1) or active not in (0, 1) or cardio not in (0, 1):
            continue
            
        clean_rows.append(r)
        
    summary = {
        'total_raw_records': total,
        'clean_records_count': len(clean_rows),
        'removed_records_count': total - len(clean_rows),
        'retention_percentage': round(len(clean_rows) / total * 100, 2) if total > 0 else 0.0,
        'missing_values_by_column': missing_values,
        'duplicate_id_count': duplicate_ids,
        'implausible_blood_pressure_removed': implausible_bp_count,
        'implausible_height_weight_removed': implausible_phys_count,
        'target_distribution': {
            'cardio_0': sum(1 for r in clean_rows if r['cardio'] == '0'),
            'cardio_1': sum(1 for r in clean_rows if r['cardio'] == '1')
        }
    }
    
    logger.info(f"Validation summary: {summary['clean_records_count']}/{total} valid ({summary['retention_percentage']}%)")
    return clean_rows, summary

if __name__ == '__main__':
    from src.data_loader import load_cardiovascular_data
    rows, fields, _ = load_cardiovascular_data()
    clean, s = validate_dataset(rows, fields)
    print("Summary:", s)
