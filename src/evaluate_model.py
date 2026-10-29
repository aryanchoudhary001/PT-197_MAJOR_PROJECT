"""
Model Evaluation Module
Evaluates trained models against held-out test data, computing accuracy,
precision, recall, F1, ROC-AUC, confusion matrix, and comparative metrics.
"""

import json
import os
import logging
from config import METRICS_REPORT_PATH, ANN_MODEL_PATH
from src.utils import load_json

logger = logging.getLogger('cardio_monitor.evaluation')

def get_saved_metrics():
    """Loads saved model evaluation metrics from reports/model_metrics.json."""
    if not os.path.exists(METRICS_REPORT_PATH):
        logger.warning(f"Metrics file {METRICS_REPORT_PATH} not found.")
        return None
    return load_json(METRICS_REPORT_PATH)

def format_evaluation_summary():
    """Returns a formatted comparison table and explanation for terminal or UI."""
    data = get_saved_metrics()
    if not data:
        return "Model evaluation results not available. Please run train_model first."
        
    ann_m = data['models']['ann']['metrics']
    lr_m = data['models']['baseline']['metrics']
    
    summary = f"""
================================================================================
CARDIOVASCULAR HEALTH PREDICTION - MODEL EVALUATION SUMMARY
================================================================================
Dataset Records: {data['dataset']['clean_records']} (Train: {data['dataset']['train_records']}, Test: {data['dataset']['test_records']})

Metric             | Artificial Neural Network (ANN) | Baseline Logistic Regression
-------------------|---------------------------------|-----------------------------
Accuracy           | {ann_m['accuracy'] * 100:.2f}%                         | {lr_m['accuracy'] * 100:.2f}%
Precision          | {ann_m['precision'] * 100:.2f}%                         | {lr_m['precision'] * 100:.2f}%
Recall             | {ann_m['recall'] * 100:.2f}%                         | {lr_m['recall'] * 100:.2f}%
F1 Score           | {ann_m['f1_score'] * 100:.2f}%                         | {lr_m['f1_score'] * 100:.2f}%
ROC-AUC            | {ann_m['roc_auc']:.4f}                          | {lr_m['roc_auc']:.4f}

ANN Confusion Matrix (Test Set: {data['dataset']['test_records']} samples):
  True Positives  (TP) : {ann_m['confusion_matrix']['true_positive']} (Correctly identified positive CVD pattern)
  True Negatives  (TN) : {ann_m['confusion_matrix']['true_negative']} (Correctly identified negative CVD pattern)
  False Positives (FP) : {ann_m['confusion_matrix']['false_positive']} (Identified positive when true label was negative)
  False Negatives (FN) : {ann_m['confusion_matrix']['false_negative']} (Missed positive target class)
================================================================================
"""
    return summary

if __name__ == '__main__':
    print(format_evaluation_summary())
