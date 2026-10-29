# Cardiovascular Health Monitoring and Prediction Using Artificial Neural Networks (ANN)

An end-to-end, human-centered machine learning and healthcare analytics system developed for a B.Tech Computer Science and Engineering capstone project. Powered by an Artificial Neural Network trained on the 70,000-record Kaggle Cardiovascular Disease dataset.

---

## 🌟 Project Highlights

- **Genuine Neural Network Architecture:** Multi-layer feedforward neural network (MLP) with ReLU hidden layers, Sigmoid output, and Adam optimization.
- **70,000 Patient Cohort:** Comprehensive data validation, removing physiological typos while retaining 97.95% (68,567 records) with no data leakage.
- **Benchmark Evaluation:** Evaluated on a held-out test split (13,714 patients), achieving **73.20% Accuracy** and **0.795 ROC-AUC**, outperforming the baseline Logistic Regression model.
- **Dual Interface:** Run locally via **Streamlit** on Windows in VS Code, or interact through the modern web dashboard.
- **Explainable Clinical Inference:** Real-time probability estimation with derived Body Mass Index (BMI), AHA/ACC blood pressure staging, and risk factor highlights.
- **Viva Defense Preparedness:** Complete with `VIVA_QUESTIONS.md` covering standard university examiner questions with English & Hinglish explanations.

---

## 📁 Repository Structure

```text
cardio-health-monitor/
├── app.py                      # Main Streamlit dashboard application
├── config.py                   # Centralized paths, bounds, and hyperparameters
├── requirements.txt            # Python dependencies with compatible versions
├── README.md                   # Complete project documentation
├── VIVA_QUESTIONS.md           # University viva questions & explanations
│
├── data/
│   ├── raw/                    # Original cardio_train.csv dataset
│   └── processed/              # Validated partitions
│
├── src/
│   ├── __init__.py             # Module initialization
│   ├── data_loader.py          # CSV loading with delimiter auto-detection
│   ├── data_validation.py      # Quality checks and physiological boundary validation
│   ├── data_preprocessing.py   # Feature engineering & training-fit StandardScaler
│   ├── visualization.py        # EDA bins, histograms, and correlation helpers
│   ├── train_model.py          # Script entry point to train ANN & Baseline
│   ├── evaluate_model.py       # Comprehensive test evaluation & metrics report
│   ├── predict.py              # Real-time inference engine and clinical explanation
│   └── utils.py                # Math activations, BMI, and blood pressure categorizers
│
├── models/
│   ├── trained_ann.json        # Saved ANN weights and baseline parameters
│   └── scaler_params.json      # Pre-computed feature means and standard deviations
│
├── reports/
│   └── model_metrics.json      # Empirical evaluation results on held-out test set
│
├── pages/
│   ├── 1_Health_Prediction.py  # Interactive patient risk estimation form
│   ├── 2_Data_Analytics.py     # Exploratory data analysis & distribution charts
│   ├── 3_Model_Performance.py  # Confusion matrix, ROC curves, and comparison
│   └── 4_About_Project.py      # Academic documentation & system architecture
│
├── notebooks/
│   └── 01_exploratory_data_analysis.ipynb
│
└── tests/
    ├── test_data_validation.py # Unit tests for data cleaning logic
    ├── test_preprocessing.py   # Unit tests for feature extraction and scaling
    ├── test_prediction.py      # Unit tests for inference outputs
    └── test_model_loading.py   # Unit tests verifying artifact integrity
```

---

## 🚀 Getting Started (Windows & VS Code)

### 1. Prerequisites
- Python 3.9, 3.10, or 3.11 installed on your computer.
- Git and Visual Studio Code.

### 2. Environment Setup
Open PowerShell or Command Prompt in the project root:

```powershell
# 1. Create a virtual environment
python -m venv .venv

# 2. Activate the virtual environment
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# (If script execution is disabled: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser)

# 3. Upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Running Model Training & Testing
```powershell
# Train the Artificial Neural Network & Baseline Model:
python -m src.train_model

# Run the automated test suite:
python -m unittest discover -s tests -p "test_*.py"
```

### 4. Launching the Interactive Streamlit App
```powershell
python -m streamlit run app.py
```
Open your browser at `http://localhost:8501`.

---

## 📊 Model Evaluation Results (Test Set: 13,714 records)

| Metric | Artificial Neural Network (ANN) | Baseline Logistic Regression | Absolute Gain |
| :--- | :--- | :--- | :--- |
| **Accuracy** | **73.20%** | 72.66% | +0.54% |
| **Precision** | **75.97%** | 74.61% | +1.36% |
| **Recall** | **66.37%** | 67.15% | -0.78% |
| **F1 Score** | **70.85%** | 70.68% | +0.17% |
| **ROC-AUC** | **0.7950** | 0.7900 | +0.0050 |

---

## 🩺 Important Medical Disclaimer
This software is developed strictly for **educational and research demonstrations as part of a B.Tech CSE degree**. It does not diagnose cardiovascular conditions, replace certified clinical consultations, or determine patient health. Always consult licensed healthcare providers for clinical diagnosis and treatment.
