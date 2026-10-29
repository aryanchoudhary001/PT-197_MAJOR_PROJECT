# 🩺 Predictive Analytic Health Monitoring Using Machine Learning

### An Artificial Neural Network-Based Cardiovascular Risk Prediction System

<p align="center">
  <strong>Project Code: PT-197</strong><br>
  <strong>B.Tech | IILM University, Greater Noida</strong><br>
  Academic Session: 2026–27
</p>

---

## 📌 About the Project

**Predictive Analytic Health Monitoring Using Machine Learning** is a machine learning-based project designed to analyze health-related parameters and predict the likelihood of cardiovascular disease.

The project uses a cardiovascular dataset and an **Artificial Neural Network (ANN)** classification model to identify patterns in health information. A user-friendly **Streamlit web application** allows users to enter health parameters, view prediction results, and explore data insights through an interactive dashboard.

The primary objective is to demonstrate how machine learning can support health-data analysis and educational risk assessment.

> **Important:** This project is developed for academic and educational purposes. Its predictions are not a medical diagnosis and must not replace professional medical advice.

---

## 🎓 Project Information

| Detail | Information |
|---|---|
| Project Code | PT-197 |
| Project Title | Predictive Analytic Health Monitoring Using Machine Learning |
| Degree | Bachelor of Technology (B.Tech) |
| Department | School of Computer Science and Engineering |
| University | IILM University, Greater Noida |
| Academic Session | 2026–27 |
| Project Guide | Mrs. Shruti Sharma |

## 👥 Project Team

| S. No. | Team Member | Student ID |
|---:|---|---|
| 1 | Akshat Kumar Choudhary | 2410031302 |
| 2 | Piyush Kumar | 2410030021 |
| 3 | Aryan Raj | 2410031289 |
| 4 | Ritesh Yadav | 2410030805 |

---

## 🎯 Project Objectives

The main objectives of this project are:

- To analyze cardiovascular health-related data using data science techniques.
- To preprocess health data and prepare it for machine learning.
- To explore relationships between health parameters and cardiovascular disease labels.
- To develop an Artificial Neural Network classification model.
- To compare the ANN model with a Logistic Regression baseline.
- To evaluate model performance using appropriate classification metrics.
- To develop an interactive Streamlit application for health-data exploration and prediction.
- To demonstrate how machine learning can be applied to educational health-monitoring systems.

---

## ✨ Key Features

### 1. Cardiovascular Risk Prediction
Users can enter supported health parameters and obtain a model-generated prediction.

### 2. Artificial Neural Network
An ANN model learns patterns from the training data and performs binary classification.

### 3. Data Preprocessing
The project prepares the dataset for model training through suitable preprocessing steps, such as feature selection, data validation, and feature scaling where required.

### 4. Exploratory Data Analysis
Visualizations help explore the dataset, understand feature distributions, and investigate relationships between health parameters and the target variable.

### 5. Interactive Dashboard
The Streamlit interface provides a simple way to interact with the project without manually running individual Python functions.

### 6. Model Evaluation
The model can be evaluated using metrics such as:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix
- ROC-AUC, when implemented and appropriate

Actual metric values should be reported only after evaluating the trained model on the test dataset.

### 7. Logistic Regression Baseline
A Logistic Regression model can serve as a baseline for comparing the ANN's performance.

### 8. Educational Health Insights
The application demonstrates the use of data-driven methods to analyze cardiovascular health-related information.

---

## 🗂️ Dataset Information

This project uses the **Cardiovascular Disease dataset**, commonly distributed as `cardio_train.csv`.

The dataset contains health-related attributes and a binary target indicating the presence or absence of cardiovascular disease in the recorded data.

### Dataset Overview

| Property | Details |
|---|---|
| Dataset file | `cardio_train.csv` |
| Records | 70,000 |
| Columns | 13 |
| Target column | `cardio` |
| Problem type | Binary classification |
| Missing values | Reported as none in the project dataset |
| File format | CSV |
| Delimiter | Semicolon (`;`) |

The dataset should be checked during preprocessing to confirm its structure and quality.

### Dataset Features

| Feature | Description |
|---|---|
| `id` | Record identifier |
| `age` | Age, represented in the dataset's original units |
| `gender` | Encoded gender value |
| `height` | Height |
| `weight` | Weight |
| `ap_hi` | Systolic blood pressure |
| `ap_lo` | Diastolic blood pressure |
| `cholesterol` | Cholesterol category |
| `gluc` | Glucose category |
| `smoke` | Smoking indicator |
| `alco` | Alcohol consumption indicator |
| `active` | Physical activity indicator |
| `cardio` | Target label for cardiovascular disease |

**Target interpretation:**

- `cardio = 0`: Cardiovascular disease is not indicated by the dataset label.
- `cardio = 1`: Cardiovascular disease is indicated by the dataset label.

These labels describe the dataset's recorded outcomes; they do not establish a medical diagnosis for a new user.

**Note:** The `age` field in this dataset is commonly recorded in days. Confirm the units and apply the appropriate conversion if the application accepts age in years.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Pandas | Data loading and manipulation |
| NumPy | Numerical operations |
| Scikit-learn | Data preprocessing, baseline model, and evaluation |
| TensorFlow / Keras | Artificial Neural Network development |
| Streamlit | Interactive web application |
| Matplotlib | Data visualization |
| Seaborn | Statistical visualization |
| Plotly | Interactive charts, if used |
| Joblib | Saving and loading compatible Python objects, if used |
| Pytest | Automated testing, if implemented |
| Git and GitHub | Version control and project hosting |

---

## ⚙️ System Requirements

### Hardware Requirements

- Computer or laptop
- Minimum 4 GB RAM recommended
- Sufficient storage for the dataset, dependencies, and trained model
- Internet connection for initial dependency installation

### Software Requirements

- Python 3.10 or another Python version compatible with the project's dependencies
- pip
- Visual Studio Code or another Python IDE
- Git, optional but recommended
- A modern web browser

> TensorFlow and other dependencies may require specific Python versions. Use a Python version compatible with the dependency versions in your project.

---

## 🚀 Installation and Setup

Follow these steps to run the project locally.

### Step 1: Clone the Repository

Replace the placeholder with your actual GitHub repository URL.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd <YOUR_PROJECT_FOLDER>
```

### Step 2: Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Activate it on macOS or Linux:

```bash
source venv/bin/activate
```

### Step 3: Install Dependencies

If the repository contains a `requirements.txt` file, run:

```bash
pip install -r requirements.txt
```

If the dependency file has not been created, install the packages required by your implementation. For example:

```bash
pip install pandas numpy scikit-learn tensorflow streamlit matplotlib seaborn joblib
```

Install Plotly or Pytest separately if your project uses them:

```bash
pip install plotly pytest
```

### Step 4: Prepare the Dataset

Place the dataset in the location expected by your preprocessing script.

For example:

```text
data/
└── cardio_train.csv
```

Because the dataset is semicolon-delimited, load it appropriately:

```python
import pandas as pd

df = pd.read_csv("data/cardio_train.csv", sep=";")

print(df.head())
print(df.shape)
print(df.isnull().sum())
```

Adjust the file path if your dataset is stored elsewhere.

### Step 5: Train or Load the Model

If your repository includes a training script, run it using the appropriate command. For example:

```bash
python train_model.py
```

The exact command depends on your actual file names.

If the trained model is already saved, ensure that the application loads the correct model and any associated preprocessing objects.

**Important:** Use the same feature order and preprocessing steps during prediction that were used during model training.

### Step 6: Run the Streamlit Application

If the main application file is named `app.py`, run:

```bash
streamlit run app.py
```

Streamlit will display a local address in the terminal. Open that address in your browser to access the application.

---

## 🧠 Project Workflow

The overall workflow follows these stages:

```text
                 ┌───────────────────────┐
                 │   Cardiovascular      │
                 │       Dataset        │
                 └──────────┬────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │ Data Inspection and   │
                 │   Preprocessing       │
                 └──────────┬────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │ Exploratory Data      │
                 │      Analysis         │
                 └──────────┬────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │ Train-Test Split and  │
                 │ Feature Preparation   │
                 └──────────┬────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │ ANN Model Training    │
                 │ and Baseline Model    │
                 └──────────┬────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │ Model Evaluation      │
                 └──────────┬────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │ Save Model and        │
                 │ Preprocessing Objects │
                 └──────────┬────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │ Streamlit Web         │
                 │ Application           │
                 └──────────┬────────────┘
                            │
                            ▼
                 ┌───────────────────────┐
                 │ Prediction and        │
                 │ Data Visualization    │
                 └───────────────────────┘
```

---

## 🔬 Machine Learning Methodology

### 1. Data Loading

The dataset is loaded into a Pandas DataFrame. Its columns, data types, target distribution, and overall structure are inspected.

### 2. Data Preprocessing

The preprocessing stage prepares the data for modeling. Depending on the implementation, it may include:

- Removing unnecessary identifier columns from the model features.
- Checking for invalid or implausible values.
- Handling missing or inconsistent records if encountered.
- Separating input features from the target variable.
- Splitting the data into training and testing sets.
- Scaling numerical features when appropriate.

Any fitted preprocessing transformations should be learned from the training data only, then applied consistently to the test data and new predictions.

### 3. Exploratory Data Analysis

Exploratory Data Analysis (EDA) helps understand the dataset before training.

Potential visualizations include:

- Target-class distribution
- Age distribution
- Height and weight distributions
- Blood pressure distributions
- Cholesterol and glucose categories
- Correlations between numerical features
- Feature comparisons across target classes

### 4. Model Development

The project uses an **Artificial Neural Network** for binary classification.

An ANN consists of interconnected computational units arranged into layers.

A typical ANN includes:

- **Input layer:** Receives the prepared health-related features.
- **Hidden layers:** Learn patterns from the input data.
- **Output layer:** Produces a score or probability for binary classification.

The exact number of layers, neurons, activation functions, optimizer, and training parameters should match the implemented model.

### 5. Baseline Comparison

Logistic Regression can be trained on the same data split as a baseline model. This comparison helps determine whether the ANN provides a useful improvement over a simpler classification approach.

### 6. Model Evaluation

Evaluate the trained model on data that was not used to fit the model.

The evaluation can include:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix
- ROC curve and ROC-AUC, if implemented

Accuracy alone may not adequately describe performance. Precision, recall, and the confusion matrix help explain different types of classification errors.

### 7. Prediction

The application collects supported input features, applies the same preprocessing pipeline used during training, and passes the prepared input to the trained model.

The displayed result represents a **model prediction**, not a confirmed medical condition.

---

## 📊 Model Performance

The project should report model performance based on actual evaluation results.

| Metric | Purpose |
|---|---|
| Accuracy | Proportion of correctly classified examples |
| Precision | Proportion of positive predictions that are correct |
| Recall | Proportion of actual positive examples correctly identified |
| F1-score | Harmonic mean of precision and recall |
| Confusion Matrix | Shows correct and incorrect predictions for each class |
| ROC-AUC | Measures discrimination across classification thresholds |

**No performance values are specified in this README because they must be taken from the final trained model's evaluation results.**

After training, update this section with your actual metrics. Clearly state the test-set size, classification threshold where relevant, and the evaluation method used.

---

## 🖥️ Application Overview

The Streamlit application can be organized into the following sections, depending on the implemented interface.

### 1. Home / Dashboard

Provides an overview of the project, its purpose, and the available application features.

### 2. Health Prediction

Allows users to enter the health parameters supported by the model and view the resulting classification.

### 3. Data Analytics

Displays dataset summaries and visualizations to help users understand the data.

### 4. Model Performance

Presents the trained model's evaluation metrics and visualizations, such as a confusion matrix, when available.

### 5. About the Project

Explains the project objectives, technology stack, academic context, team, limitations, and medical disclaimer.

---

## 📁 Suggested Project Structure

The following is a suggested structure. Adapt it to the actual files in your repository.

```text
predictive-health-monitoring/
│
├── app.py
├── train_model.py
├── requirements.txt
├── README.md
├── .gitignore
│
├── data/
│   └── cardio_train.csv
│
├── models/
│   ├── ann_model.keras
│   └── preprocessor.joblib
│
├── src/
│   ├── preprocessing.py
│   ├── evaluation.py
│   └── prediction.py
│
├── tests/
│   └── test_preprocessing.py
│
└── assets/
    └── screenshots/
```

**Note:** The names above are examples, not a claim that these files already exist. Keep only the folders and files that are present in your implementation. Avoid committing large datasets or trained-model files if your repository-hosting or dataset-distribution arrangements do not permit it.

---

## 🧪 Testing

Testing helps verify that preprocessing, model loading, and application behavior work as expected.

Potential checks include:

- Confirming that the dataset loads correctly.
- Checking that expected columns are present.
- Validating the input feature count and order.
- Ensuring preprocessing produces valid model inputs.
- Confirming that model predictions have the expected shape.
- Checking that the application handles invalid input gracefully.
- Verifying that evaluation metrics are calculated correctly.

If automated tests are implemented with Pytest, run:

```bash
pytest
```

Only use this command after adding tests and installing Pytest.

---

## 🔐 Data Privacy and Responsible Use

This project is an academic demonstration of machine learning techniques.

- Do not enter identifiable personal or medical information unless the application has appropriate safeguards.
- Do not treat predictions as a confirmed diagnosis.
- Do not use the model as the sole basis for medical decisions.
- Evaluate the model for potential bias and errors before considering any real-world use.
- Protect any locally stored data and model files.
- Follow applicable dataset licensing and usage conditions.

---

## ⚠️ Limitations

The project has several limitations:

1. **Dataset limitations:** The model's behavior depends on the quality, representativeness, and characteristics of its training data.
2. **Prediction uncertainty:** A machine learning model can make incorrect predictions.
3. **Generalization:** Performance on the available dataset does not guarantee similar performance for other populations.
4. **Feature limitations:** The model can only consider the features provided to it.
5. **Clinical validation:** Academic model evaluation does not establish clinical safety or effectiveness.
6. **Input quality:** Incorrect, unrealistic, or inconsistent input values can affect predictions.
7. **Model dependence:** Results depend on the trained model, preprocessing pipeline, and classification threshold.

The system should therefore be considered an educational prototype rather than a clinically validated healthcare product.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Evaluating additional machine learning models.
- Improving hyperparameter tuning and model evaluation.
- Adding explainability techniques to help interpret model predictions.
- Improving input validation and error handling.
- Adding more interactive visualizations.
- Introducing model versioning and reproducible training.
- Evaluating performance across different demographic groups.
- Adding secure storage and authentication if required.
- Conducting independent validation on suitable external datasets.
- Exploring deployment options after appropriate privacy, security, and clinical-safety considerations.

These are proposed enhancements and should not be interpreted as features already implemented.

---

## 🤝 Contribution

This project was developed as part of an academic team project at IILM University, Greater Noida.

If you are extending the project:

1. Create a separate branch for your changes.
2. Make focused and understandable changes.
3. Test your changes before submitting them.
4. Document any new dependencies or configuration requirements.
5. Submit a pull request describing the changes.

---

## 📚 Learning Outcomes

Through this project, the team can demonstrate practical experience with:

- Python programming
- Data analysis and preprocessing
- Exploratory Data Analysis
- Supervised machine learning
- Artificial Neural Networks
- Classification metrics and model evaluation
- Streamlit application development
- Model integration and inference
- Software testing and documentation
- Responsible use of machine learning in a health-related context

---

## 👨‍💻 Academic Credits

**Project:** Predictive Analytic Health Monitoring Using Machine Learning  
**Project Code:** PT-197  
**Project Guide:** Mrs. Shruti Sharma  
**University:** IILM University, Greater Noida  
**Academic Session:** 2026–27

**Developed by:**

- Akshat Kumar Choudhary
- Piyush Kumar
- Aryan Raj
- Ritesh Yadav

---

## ⚕️ Disclaimer

This application is intended exclusively for academic, educational, and demonstration purposes. It is not a medical device and has not been established as clinically validated.

Predictions generated by the model must not be used to diagnose, treat, prevent, or rule out cardiovascular disease. Consult a qualified healthcare professional for medical advice, diagnosis, or treatment.

---

<p align="center">
  <strong>Predictive Analytic Health Monitoring Using Machine Learning</strong><br>
  B.Tech Project | IILM University, Greater Noida | 2026–27
</p>
