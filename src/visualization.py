"""
Visualization helpers for exploratory data analysis, correlation matrices,
distributions, confusion matrices, and ROC curves.
"""

import json
import math
from config import METRICS_REPORT_PATH
from src.utils import load_json

def get_eda_distributions(rows):
    """Computes distribution statistics for EDA charts from cleaned records."""
    if not rows:
        return {}
        
    ages = [float(r['age']) / 365.25 for r in rows]
    systolics = [float(r['ap_hi']) for r in rows]
    diastolics = [float(r['ap_lo']) for r in rows]
    bmis = [float(r['weight']) / ((float(r['height'])/100.0)**2) for r in rows]
    
    return {
        'age_bins': _histogram_bins(ages, 30, 65, 7),
        'systolic_bins': _histogram_bins(systolics, 90, 180, 9),
        'diastolic_bins': _histogram_bins(diastolics, 60, 110, 5),
        'bmi_bins': _histogram_bins(bmis, 18, 42, 8),
        'target_counts': {
            'No CVD (0)': sum(1 for r in rows if r.get('cardio') == '0'),
            'CVD Present (1)': sum(1 for r in rows if r.get('cardio') == '1')
        },
        'gender_counts': {
            'Female': sum(1 for r in rows if r.get('gender') == '1'),
            'Male': sum(1 for r in rows if r.get('gender') == '2')
        },
        'cholesterol_counts': {
            'Normal (1)': sum(1 for r in rows if r.get('cholesterol') == '1'),
            'Above Normal (2)': sum(1 for r in rows if r.get('cholesterol') == '2'),
            'Well Above Normal (3)': sum(1 for r in rows if r.get('cholesterol') == '3')
        },
        'glucose_counts': {
            'Normal (1)': sum(1 for r in rows if r.get('gluc') == '1'),
            'Above Normal (2)': sum(1 for r in rows if r.get('gluc') == '2'),
            'Well Above Normal (3)': sum(1 for r in rows if r.get('gluc') == '3')
        },
        'lifestyle': {
            'Smokers': sum(1 for r in rows if r.get('smoke') == '1'),
            'Alcohol Consumers': sum(1 for r in rows if r.get('alco') == '1'),
            'Physically Active': sum(1 for r in rows if r.get('active') == '1')
        }
    }

def _histogram_bins(values, min_v, max_v, num_bins):
    """Bins continuous values into frequency counts."""
    bin_width = (max_v - min_v) / num_bins
    bins = [{'label': f"{int(min_v + i*bin_width)}-{int(min_v + (i+1)*bin_width)}", 'count': 0} for i in range(num_bins)]
    for v in values:
        if v < min_v:
            bins[0]['count'] += 1
        elif v >= max_v:
            bins[-1]['count'] += 1
        else:
            idx = int((v - min_v) / bin_width)
            if 0 <= idx < num_bins:
                bins[idx]['count'] += 1
    return bins
