"""
Streamlit Page 4: About the Project
Comprehensive B.Tech CSE Capstone Project Documentation, Methodology, and Academic Details.
"""

import streamlit as st

st.set_page_config(page_title="About the Project | CardioPredict ANN", page_icon="📖", layout="wide")

st.title("📖 Academic & Project Documentation")
st.write("Cardiovascular Health Monitoring and Prediction Using Artificial Neural Networks")

tab_intro, tab_arch, tab_method, tab_limits = st.tabs([
    "1. Overview & Problem Statement",
    "2. System Architecture",
    "3. Methodology & Preprocessing",
    "4. Limitations & Future Scope"
])

with tab_intro:
    st.subheader("Problem Statement")
    st.write("""
    Cardiovascular diseases (CVDs) remain the leading cause of mortality globally, taking an estimated 17.9 million lives each year according to the World Health Organization (WHO). 
    Early identification of individuals at high risk allows proactive lifestyle interventions, clinical surveillance, and pharmaceutical management before irreversible cardiac events occur.
    
    Traditional clinical risk scoring tools (such as Framingham Risk Score) rely on linear statistical tables. This project explores the implementation of **Artificial Neural Networks (ANN)** to learn non-linear patterns and multi-factorial physiological interactions from tabular cardiovascular patient cohorts.
    """)
    
    st.subheader("Key Objectives")
    st.markdown("""
    1. **Data Pipeline Engineering:** Design an automated pipeline to clean, validate, and scale 70,000 patient records from Kaggle without data leakage.
    2. **Neural Network Architecture:** Implement a multi-layer deep feedforward artificial neural network with ReLU hidden activations and Sigmoid classification output.
    3. **Baseline Comparison:** Benchmark the ANN against a calibrated Logistic Regression model on an identical 80/20 held-out test split.
    4. **Human-Centered Decision Support:** Build an accessible, educational web dashboard allowing non-technical users to enter metrics and receive transparent, explainable predictions.
    """)

with tab_arch:
    st.subheader("System Architecture")
    st.code("""
+-------------------------------------------------------------------------+
|                  70,000 Raw Kaggle Cardiovascular CSV                   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                      Stage 1: Clinical Validation                       |
|   - Check column types & null values (0 missing)                        |
|   - Eliminate physiological errors (70 <= ap_hi <= 240, ap_hi > ap_lo)  |
|   - Filter implausible heights/weights (retention: 97.95% / 68,567 rows)|
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                    Stage 2: Feature Engineering & Split                 |
|   - Age converted from days to years (age / 365.25)                     |
|   - Calculated Body Mass Index (BMI = weight / (height/100)^2)          |
|   - Stratified 80% Train (54,853 samples) / 20% Test (13,714 samples)   |
|   - StandardScaler fit strictly on Train partition                      |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                  Stage 3: Deep Artificial Neural Network                |
|   - Input (12 features) -> Dense(64, ReLU) -> Dense(32, ReLU)           |
|     -> Dense(1, Sigmoid)                                                |
|   - Trained via Adam Optimizer with Binary Cross-Entropy Loss           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                   Stage 4: Prediction & Explanation UI                  |
|   - Interactive Streamlit and React interfaces                          |
|   - Real-time probability estimation and risk breakdown                 |
+-------------------------------------------------------------------------+
    """, language="text")

with tab_method:
    st.subheader("Methodology & Preprocessing Details")
    st.markdown("""
    - **Dataset Source:** Kaggle Cardiovascular Disease Dataset (Svetlana Ulianova).
    - **Encoding Strategy:**
      - Categorical variables like cholesterol and glucose are preserved as ordinal tiers (1: Normal, 2: Above Normal, 3: Well Above Normal).
      - Binary variables (gender, smoke, alco, active) are encoded as (0, 1).
    - **Preventing Data Leakage:**
      - The `StandardScaler` (means and standard deviations) is fitted **strictly on the 80% training set**.
      - The learned scaling transformations are then applied to the held-out test set and new user inputs without refitting.
    """)

with tab_limits:
    st.subheader("Limitations & Future Enhancements")
    st.markdown("""
    #### Project Limitations:
    1. **Tabular Scope:** The dataset contains demographic and baseline lab markers but lacks clinical ECG waveforms, lipid panels (HDL/LDL/Triglycerides), troponin markers, or family medical history.
    2. **Geographical & Cohort Specificity:** The dataset represents a specific demographic cohort and may not generalize uniformly across distinct global populations.
    3. **Educational Intent:** The application is an academic software engineering demonstrator and has not undergone medical device regulatory clearance (FDA, CE, CDSCO).
    
    #### Future Scope:
    1. **SHAP (SHapley Additive exPlanations):** Incorporate local Shapley values to visualize exact numerical feature contributions for each individual inference.
    2. **Wearable IoT Integration:** Stream real-time heart rate, SpO2, and step counts from smartwatch APIs.
    3. **Longitudinal Risk Tracking:** Allow users to save multiple chronological readings to analyze arterial stiffness and hypertension trajectories over time.
    """)
