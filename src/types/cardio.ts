/**
 * TypeScript Type Definitions for Cardiovascular Health Monitoring System
 */

export interface PatientInput {
  age: number; // in years
  gender: 'Female' | 'Male' | 1 | 2;
  height: number; // in cm
  weight: number; // in kg
  ap_hi: number; // systolic BP, mmHg
  ap_lo: number; // diastolic BP, mmHg
  cholesterol: 1 | 2 | 3; // 1: normal, 2: above normal, 3: well above normal
  gluc: 1 | 2 | 3;
  smoke: 0 | 1;
  alco: 0 | 1;
  active: 0 | 1;
}

export interface PredictionResult {
  predictedClass: 0 | 1;
  probability: number;
  probabilityPercentage: number;
  riskLevel: 'Low Estimated Association' | 'Moderate Estimated Association' | 'High Estimated Association';
  riskColor: 'emerald' | 'amber' | 'rose';
  verdictText: string;
  derivedBmi: number;
  bmiCategory: string;
  bpCategory: string;
  riskFactors: string[];
  positiveFactors: string[];
  rawFeatures: Record<string, number>;
  disclaimer: string;
}

export interface MetricReport {
  project_title: string;
  dataset: {
    file: string;
    raw_records: number;
    clean_records: number;
    features: string[];
    train_records: number;
    test_records: number;
    removed_bp_anomalies: number;
    removed_phys_anomalies: number;
    target_distribution: {
      negative_cardio_0: number;
      positive_cardio_1: number;
    };
  };
  models: {
    ann: {
      name: string;
      architecture: string;
      optimizer: string;
      loss_function: string;
      epochs: number;
      batch_size: number;
      metrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
        roc_auc: number;
        confusion_matrix: {
          true_positive: number;
          true_negative: number;
          false_positive: number;
          false_negative: number;
        };
        roc_curve: Array<{ fpr: number; tpr: number; threshold: number }>;
      };
      history: {
        epoch: number[];
        loss: number[];
        val_loss: number[];
        accuracy: number[];
        val_accuracy: number[];
      };
    };
    baseline: {
      name: string;
      description: string;
      metrics: {
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
        roc_auc: number;
        confusion_matrix: {
          true_positive: number;
          true_negative: number;
          false_positive: number;
          false_negative: number;
        };
      };
    };
  };
  comparison: {
    accuracy_gain: number;
    f1_gain: number;
    auc_gain: number;
  };
  training_time_seconds: number;
}
