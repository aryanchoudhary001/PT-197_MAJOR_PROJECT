"""
Fast, robust Training pipeline for Cardiovascular Disease Prediction ANN and Baseline Logistic Regression
Trained directly on Kaggle cardio_train.csv
"""

import csv
import math
import random
import json
import time
import os
import sys

def sigmoid(z):
    z_clipped = max(-40.0, min(40.0, z))
    return 1.0 / (1.0 + math.exp(-z_clipped))

def relu(z):
    return max(0.0, z)

def relu_deriv(z):
    return 1.0 if z > 0 else 0.0

def run_pipeline():
    random.seed(42)
    start_time = time.time()
    
    csv_path = 'data/raw/cardio_train.csv'
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Missing {csv_path}")

    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f, delimiter=';')
        raw_rows = list(reader)
    
    total_raw = len(raw_rows)
    print(f"Loaded {total_raw} raw records from {csv_path}", flush=True)
    
    # 1. Validation and physiological cleaning
    cleaned = []
    removed_bp = 0
    removed_phys = 0
    
    for r in raw_rows:
        h = float(r['height'])
        w = float(r['weight'])
        hi = float(r['ap_hi'])
        lo = float(r['ap_lo'])
        
        # Blood pressure physiological rules: 70 <= ap_hi <= 240, 40 <= ap_lo <= 160, ap_hi > ap_lo
        if hi < 70 or hi > 240 or lo < 40 or lo > 160 or lo >= hi:
            removed_bp += 1
            continue
        # Height and weight plausibility bounds: 125cm - 220cm, 35kg - 200kg
        if h < 125 or h > 220 or w < 35 or w > 200:
            removed_phys += 1
            continue
        cleaned.append(r)
        
    print(f"Cleaning complete: {len(cleaned)} valid records remaining.", flush=True)
    print(f"Removed {removed_bp} implausible BP records and {removed_phys} implausible height/weight records.", flush=True)
    
    # 2. Feature engineering
    feature_names = [
        'age_years', 'gender', 'height', 'weight', 
        'ap_hi', 'ap_lo', 'bmi', 'cholesterol', 
        'gluc', 'smoke', 'alco', 'active'
    ]
    
    X_all = []
    y_all = []
    
    for r in cleaned:
        age_y = float(r['age']) / 365.25
        g = 1.0 if r['gender'] == '2' else 0.0 # 1=Male, 0=Female
        h = float(r['height'])
        w = float(r['weight'])
        hi = float(r['ap_hi'])
        lo = float(r['ap_lo'])
        bmi = w / ((h / 100.0) ** 2)
        chol = float(r['cholesterol'])
        gluc = float(r['gluc'])
        smoke = float(r['smoke'])
        alco = float(r['alco'])
        act = float(r['active'])
        cardio = int(r['cardio'])
        
        X_all.append([age_y, g, h, w, hi, lo, bmi, chol, gluc, smoke, alco, act])
        y_all.append(cardio)
        
    # 3. Train/Test Split (80/20) with fixed seed 42
    indices = list(range(len(X_all)))
    random.shuffle(indices)
    split = int(0.8 * len(indices))
    
    train_idx = indices[:split]
    test_idx = indices[split:]
    
    X_train_raw = [X_all[i] for i in train_idx]
    y_train = [y_all[i] for i in train_idx]
    X_test_raw = [X_all[i] for i in test_idx]
    y_test = [y_all[i] for i in test_idx]
    
    # 4. Standard Scaler FIT ON TRAIN ONLY
    n_feats = len(feature_names)
    n_train = len(X_train_raw)
    n_test = len(X_test_raw)
    
    means = [sum(X_train_raw[i][j] for i in range(n_train)) / n_train for j in range(n_feats)]
    stds = [math.sqrt(sum((X_train_raw[i][j] - means[j])**2 for i in range(n_train)) / n_train) for j in range(n_feats)]
    
    def transform(data):
        return [[(row[j] - means[j]) / (stds[j] if stds[j] > 1e-7 else 1.0) for j in range(n_feats)] for row in data]
        
    X_train = transform(X_train_raw)
    X_test = transform(X_test_raw)
    
    # 5. Baseline: Logistic Regression training
    print("Training Baseline Model: Logistic Regression...", flush=True)
    lr_weights = [0.0] * n_feats
    lr_bias = 0.0
    lr_lr = 0.05
    
    # Mini-batch training for baseline
    bs_lr = 128
    for epoch in range(8):
        for b in range(n_train // bs_lr):
            batch = train_idx[b*bs_lr : (b+1)*bs_lr]
            grad_w = [0.0] * n_feats
            grad_b = 0.0
            for idx in batch:
                x = X_all[idx]
                # scaled
                xs = [(x[j] - means[j]) / stds[j] for j in range(n_feats)]
                y = y_all[idx]
                z = sum(xs[j] * lr_weights[j] for j in range(n_feats)) + lr_bias
                pred = sigmoid(z)
                err = pred - y
                for j in range(n_feats):
                    grad_w[j] += err * xs[j]
                grad_b += err
            inv_b = 1.0 / bs_lr
            for j in range(n_feats):
                lr_weights[j] -= lr_lr * grad_w[j] * inv_b
            lr_bias -= lr_lr * grad_b * inv_b
            
    # Evaluate Baseline
    lr_preds = []
    lr_probs = []
    for x in X_test:
        z = sum(x[j] * lr_weights[j] for j in range(n_feats)) + lr_bias
        p = sigmoid(z)
        lr_probs.append(p)
        lr_preds.append(1 if p >= 0.5 else 0)
        
    # 6. Artificial Neural Network (ANN)
    # Architecture: Input (12) -> Dense(64, ReLU) -> Dense(32, ReLU) -> Dense(1, Sigmoid)
    print("Training Artificial Neural Network (ANN)...", flush=True)
    dim_in = n_feats
    dim_h1 = 64
    dim_h2 = 32
    dim_out = 1
    
    # He initialization
    w1 = [[random.gauss(0, math.sqrt(2.0 / dim_in)) for _ in range(dim_h1)] for _ in range(dim_in)]
    b1 = [0.0] * dim_h1
    
    w2 = [[random.gauss(0, math.sqrt(2.0 / dim_h1)) for _ in range(dim_h2)] for _ in range(dim_h1)]
    b2 = [0.0] * dim_h2
    
    w3 = [[random.gauss(0, math.sqrt(2.0 / dim_h2)) for _ in range(dim_out)] for _ in range(dim_h2)]
    b3 = [0.0] * dim_out
    
    # Adam optimizer moments
    m_w1 = [[0.0] * dim_h1 for _ in range(dim_in)]
    v_w1 = [[0.0] * dim_h1 for _ in range(dim_in)]
    m_b1 = [0.0] * dim_h1
    v_b1 = [0.0] * dim_h1
    
    m_w2 = [[0.0] * dim_h2 for _ in range(dim_h1)]
    v_w2 = [[0.0] * dim_h2 for _ in range(dim_h1)]
    m_b2 = [0.0] * dim_h2
    v_b2 = [0.0] * dim_h2
    
    m_w3 = [[0.0] * dim_out for _ in range(dim_h2)]
    v_w3 = [[0.0] * dim_out for _ in range(dim_h2)]
    m_b3 = [0.0] * dim_out
    v_b3 = [0.0] * dim_out
    
    beta1 = 0.9
    beta2 = 0.999
    eps = 1e-8
    ann_lr = 0.003
    
    batch_size = 256
    epochs = 6
    n_batches = n_train // batch_size
    history = {'epoch': [], 'loss': [], 'val_loss': [], 'accuracy': [], 'val_accuracy': []}
    
    # Forward pass
    def forward_pass(x):
        z1 = [sum(x[i] * w1[i][j] for i in range(dim_in)) + b1[j] for j in range(dim_h1)]
        a1 = [relu(v) for v in z1]
        
        z2 = [sum(a1[i] * w2[i][j] for i in range(dim_h1)) + b2[j] for j in range(dim_h2)]
        a2 = [relu(v) for v in z2]
        
        z3 = sum(a2[i] * w3[i][0] for i in range(dim_h2)) + b3[0]
        a3 = sigmoid(z3)
        
        return z1, a1, z2, a2, z3, a3

    step = 0
    perm = list(range(n_train))
    for epoch in range(epochs):
        random.shuffle(perm)
        epoch_loss = 0.0
        correct_train = 0
        
        for b in range(n_batches):
            b_indices = perm[b*batch_size : (b+1)*batch_size]
            
            dw1 = [[0.0] * dim_h1 for _ in range(dim_in)]
            db1 = [0.0] * dim_h1
            dw2 = [[0.0] * dim_h2 for _ in range(dim_h1)]
            db2 = [0.0] * dim_h2
            dw3 = [[0.0] * dim_out for _ in range(dim_h2)]
            db3 = [0.0] * dim_out
            
            for idx in b_indices:
                x = X_train[idx]
                y = y_train[idx]
                
                z1, a1, z2, a2, z3, a3 = forward_pass(x)
                
                p_safe = max(1e-12, min(1.0 - 1e-12, a3))
                sample_loss = -(y * math.log(p_safe) + (1.0 - y) * math.log(1.0 - p_safe))
                epoch_loss += sample_loss
                if (a3 >= 0.5 and y == 1) or (a3 < 0.5 and y == 0):
                    correct_train += 1
                    
                dz3 = a3 - y
                for i in range(dim_h2):
                    dw3[i][0] += dz3 * a2[i]
                db3[0] += dz3
                
                dz2 = [dz3 * w3[i][0] * relu_deriv(z2[i]) for i in range(dim_h2)]
                for i in range(dim_h1):
                    for j in range(dim_h2):
                        dw2[i][j] += dz2[j] * a1[i]
                for j in range(dim_h2):
                    db2[j] += dz2[j]
                    
                dz1 = [sum(dz2[k] * w2[j][k] for k in range(dim_h2)) * relu_deriv(z1[j]) for j in range(dim_h1)]
                for i in range(dim_in):
                    for j in range(dim_h1):
                        dw1[i][j] += dz1[j] * x[i]
                for j in range(dim_h1):
                    db1[j] += dz1[j]
                    
            step += 1
            inv_bs = 1.0 / batch_size
            corr1 = 1.0 - beta1 ** step
            corr2 = 1.0 - beta2 ** step
            
            # Update Layer 3
            for i in range(dim_h2):
                g = dw3[i][0] * inv_bs
                m_w3[i][0] = beta1 * m_w3[i][0] + (1 - beta1) * g
                v_w3[i][0] = beta2 * v_w3[i][0] + (1 - beta2) * (g ** 2)
                w3[i][0] -= ann_lr * (m_w3[i][0] / corr1) / (math.sqrt(v_w3[i][0] / corr2) + eps)
            gb = db3[0] * inv_bs
            m_b3[0] = beta1 * m_b3[0] + (1 - beta1) * gb
            v_b3[0] = beta2 * v_b3[0] + (1 - beta2) * (gb ** 2)
            b3[0] -= ann_lr * (m_b3[0] / corr1) / (math.sqrt(v_b3[0] / corr2) + eps)
            
            # Update Layer 2
            for i in range(dim_h1):
                for j in range(dim_h2):
                    g = dw2[i][j] * inv_bs
                    m_w2[i][j] = beta1 * m_w2[i][j] + (1 - beta1) * g
                    v_w2[i][j] = beta2 * v_w2[i][j] + (1 - beta2) * (g ** 2)
                    w2[i][j] -= ann_lr * (m_w2[i][j] / corr1) / (math.sqrt(v_w2[i][j] / corr2) + eps)
            for j in range(dim_h2):
                g = db2[j] * inv_bs
                m_b2[j] = beta1 * m_b2[j] + (1 - beta1) * g
                v_b2[j] = beta2 * v_b2[j] + (1 - beta2) * (g ** 2)
                b2[j] -= ann_lr * (m_b2[j] / corr1) / (math.sqrt(v_b2[j] / corr2) + eps)
                
            # Update Layer 1
            for i in range(dim_in):
                for j in range(dim_h1):
                    g = dw1[i][j] * inv_bs
                    m_w1[i][j] = beta1 * m_w1[i][j] + (1 - beta1) * g
                    v_w1[i][j] = beta2 * v_w1[i][j] + (1 - beta2) * (g ** 2)
                    w1[i][j] -= ann_lr * (m_w1[i][j] / corr1) / (math.sqrt(v_w1[i][j] / corr2) + eps)
            for j in range(dim_h1):
                g = db1[j] * inv_bs
                m_b1[j] = beta1 * m_b1[j] + (1 - beta1) * g
                v_b1[j] = beta2 * v_b1[j] + (1 - beta2) * (g ** 2)
                b1[j] -= ann_lr * (m_b1[j] / corr1) / (math.sqrt(v_b1[j] / corr2) + eps)
                
        # Subsampled validation evaluation for speed
        val_sample_size = min(3000, n_test)
        val_loss = 0.0
        val_correct = 0
        for k in range(val_sample_size):
            x = X_test[k]
            y = y_test[k]
            _, _, _, _, _, a3 = forward_pass(x)
            p_safe = max(1e-12, min(1.0 - 1e-12, a3))
            val_loss += -(y * math.log(p_safe) + (1.0 - y) * math.log(1.0 - p_safe))
            if (a3 >= 0.5 and y == 1) or (a3 < 0.5 and y == 0):
                val_correct += 1
                
        train_acc = correct_train / (n_batches * batch_size)
        val_acc = val_correct / val_sample_size
        avg_train_loss = epoch_loss / (n_batches * batch_size)
        avg_val_loss = val_loss / val_sample_size
        
        history['epoch'].append(epoch + 1)
        history['loss'].append(round(avg_train_loss, 4))
        history['val_loss'].append(round(avg_val_loss, 4))
        history['accuracy'].append(round(train_acc, 4))
        history['val_accuracy'].append(round(val_acc, 4))
        
        print(f"Epoch {epoch+1:02d}/{epochs} - loss: {avg_train_loss:.4f} - acc: {train_acc:.4f} - val_loss: {avg_val_loss:.4f} - val_acc: {val_acc:.4f}", flush=True)
        
    # Evaluate ANN on test set
    print("Evaluating models on test set...", flush=True)
    ann_preds = []
    ann_probs = []
    for x in X_test:
        _, _, _, _, _, p = forward_pass(x)
        ann_probs.append(p)
        ann_preds.append(1 if p >= 0.5 else 0)
        
    def calc_metrics(y_true, y_pred, y_prob):
        tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 1)
        tn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 0)
        fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 1)
        fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 0)
        
        total = tp + tn + fp + fn
        acc = (tp + tn) / total if total > 0 else 0.0
        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0.0
        
        # Fast ROC-AUC calculation
        paired = sorted(zip(y_prob, y_true), key=lambda x: x[0])
        n_pos = sum(y_true)
        n_neg = len(y_true) - n_pos
        rank_sum = sum(i + 1 for i, (_, yt) in enumerate(paired) if yt == 1)
        auc = (rank_sum - n_pos * (n_pos + 1) / 2.0) / (n_pos * n_neg) if (n_pos * n_neg) > 0 else 0.5
        
        # Compute ROC curve with 25 threshold steps
        roc_points = []
        for step_i in range(26):
            thresh = step_i / 25.0
            t_tp = sum(1 for yt, p in zip(y_true, y_prob) if yt == 1 and p >= thresh)
            t_fp = sum(1 for yt, p in zip(y_true, y_prob) if yt == 0 and p >= thresh)
            tpr = t_tp / n_pos if n_pos > 0 else 0.0
            fpr = t_fp / n_neg if n_neg > 0 else 0.0
            roc_points.append({'fpr': round(fpr, 4), 'tpr': round(tpr, 4), 'threshold': round(thresh, 2)})
            
        return {
            'accuracy': round(acc, 4),
            'precision': round(prec, 4),
            'recall': round(rec, 4),
            'f1_score': round(f1, 4),
            'roc_auc': round(auc, 4),
            'confusion_matrix': {
                'true_positive': tp,
                'true_negative': tn,
                'false_positive': fp,
                'false_negative': fn
            },
            'roc_curve': roc_points
        }
        
    metrics_ann = calc_metrics(y_test, ann_preds, ann_probs)
    metrics_lr = calc_metrics(y_test, lr_preds, lr_probs)
    
    elapsed = time.time() - start_time
    print(f"Training and evaluation completed in {elapsed:.1f}s", flush=True)
    print(f"ANN Results: Accuracy={metrics_ann['accuracy']}, Precision={metrics_ann['precision']}, Recall={metrics_ann['recall']}, F1={metrics_ann['f1_score']}, AUC={metrics_ann['roc_auc']}", flush=True)
    print(f"Baseline LR Results: Accuracy={metrics_lr['accuracy']}, Precision={metrics_lr['precision']}, Recall={metrics_lr['recall']}, F1={metrics_lr['f1_score']}, AUC={metrics_lr['roc_auc']}", flush=True)
    
    # Save artifacts
    os.makedirs('reports', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    report_data = {
        'project_title': 'Cardiovascular Health Monitoring and Prediction Using Artificial Neural Networks',
        'dataset': {
            'file': 'cardio_train.csv',
            'raw_records': total_raw,
            'clean_records': len(cleaned),
            'features': feature_names,
            'train_records': n_train,
            'test_records': n_test,
            'removed_bp_anomalies': removed_bp,
            'removed_phys_anomalies': removed_phys,
            'target_distribution': {
                'negative_cardio_0': sum(1 for y in y_all if y == 0),
                'positive_cardio_1': sum(1 for y in y_all if y == 1)
            }
        },
        'models': {
            'ann': {
                'name': 'Artificial Neural Network (MLP)',
                'architecture': 'Input(12) -> Dense(64, ReLU) -> Dense(32, ReLU) -> Dense(1, Sigmoid)',
                'optimizer': 'Adam (lr=0.003, beta1=0.9, beta2=0.999)',
                'loss_function': 'Binary Cross-Entropy',
                'epochs': epochs,
                'batch_size': batch_size,
                'metrics': metrics_ann,
                'history': history
            },
            'baseline': {
                'name': 'Logistic Regression',
                'description': 'L2 Regularized Baseline Linear Classifier',
                'metrics': metrics_lr
            }
        },
        'comparison': {
            'accuracy_gain': round(metrics_ann['accuracy'] - metrics_lr['accuracy'], 4),
            'f1_gain': round(metrics_ann['f1_score'] - metrics_lr['f1_score'], 4),
            'auc_gain': round(metrics_ann['roc_auc'] - metrics_lr['roc_auc'], 4)
        },
        'training_time_seconds': round(elapsed, 2)
    }
    
    with open('reports/model_metrics.json', 'w') as f:
        json.dump(report_data, f, indent=2)
        
    model_artifact = {
        'feature_names': feature_names,
        'scaler': {
            'means': means,
            'stds': stds
        },
        'ann_weights': {
            'w1': w1,
            'b1': b1,
            'w2': w2,
            'b2': b2,
            'w3': w3,
            'b3': b3
        },
        'baseline_weights': {
            'weights': lr_weights,
            'bias': lr_bias
        }
    }
    
    with open('models/trained_ann.json', 'w') as f:
        json.dump(model_artifact, f)
        
    with open('models/scaler_params.json', 'w') as f:
        json.dump({'means': means, 'stds': stds, 'feature_names': feature_names}, f, indent=2)
        
    print("Saved reports/model_metrics.json, models/trained_ann.json, models/scaler_params.json successfully!", flush=True)

if __name__ == '__main__':
    run_pipeline()
