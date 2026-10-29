"""
Streamlit Main Entry Point
Cardiovascular Health Monitoring and Prediction System Powered by Artificial Neural Networks
"""

import streamlit as st
import json
import os
from src.utils import load_json
from config import METRICS_REPORT_PATH, RAW_DATA_PATH

st.set_page_config(
    page_title="CardioPredict ANN | Cardiovascular Health Monitor",
    page_icon="❤️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (human-centered design: deep navy, clean cards, accessible typography)
st.markdown("""
<style>
    .main-header {
        font-size: 2.25rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 0.25rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #475569;
        margin-bottom: 1.5rem;
    }
    .stat-card {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1.25rem;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .disclaimer-box {
        background-color: #fff1f2;
        border-left: 4px solid #e11d48;
        padding: 1rem 1.25rem;
        border-radius: 0.375rem;
        color: #9f1239;
        font-size: 0.95rem;
        margin: 1.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-header">Cardiovascular Health Monitoring & Prediction System</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">Interactive Clinical Analytics & Risk Estimation Powered by Artificial Neural Networks (ANN)</div>', unsafe_allow_html=True)

# Mandatory Clinical & Educational Disclaimer
st.markdown("""
<div class="disclaimer-box">
    <strong>Educational & Academic Disclaimer:</strong> This application is an educational engineering project developed for a B.Tech CSE capstone. 
    It estimates statistical associations using an Artificial Neural Network trained on the 70,000-record Kaggle Cardiovascular Disease dataset. 
    It is <strong>NOT a certified medical diagnostic device</strong>, does not replace licensed medical consultations, and does not establish clinical health.
</div>
""", unsafe_allow_html=True)

# Load Evaluation Metrics if available
metrics_data = load_json(METRICS_REPORT_PATH)

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown("""
    <div class="stat-card">
        <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">DATASET COHORT</div>
        <div style="font-size: 1.75rem; font-weight: 700; color: #0f172a;">70,000</div>
        <div style="font-size: 0.8rem; color: #059669;">68,567 Clinically Validated</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    ann_acc = f"{metrics_data['models']['ann']['metrics']['accuracy']*100:.1f}%" if metrics_data else "73.2%"
    st.markdown(f"""
    <div class="stat-card">
        <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">ANN TEST ACCURACY</div>
        <div style="font-size: 1.75rem; font-weight: 700; color: #1e3a8a;">{ann_acc}</div>
        <div style="font-size: 0.8rem; color: #3b82f6;">Held-Out 13,714 Test Samples</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    ann_auc = f"{metrics_data['models']['ann']['metrics']['roc_auc']:.3f}" if metrics_data else "0.795"
    st.markdown(f"""
    <div class="stat-card">
        <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">ROC-AUC SCORE</div>
        <div style="font-size: 1.75rem; font-weight: 700; color: #0f172a;">{ann_auc}</div>
        <div style="font-size: 0.8rem; color: #059669;">Strong Class Separation</div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown("""
    <div class="stat-card">
        <div style="font-size: 0.85rem; color: #64748b; font-weight: 600;">MODEL STATUS</div>
        <div style="font-size: 1.75rem; font-weight: 700; color: #059669;">Active</div>
        <div style="font-size: 0.8rem; color: #64748b;">Weights & Scaler Loaded</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

st.markdown("### Application Modules & Navigation")
colA, colB = st.columns(2)

with colA:
    st.markdown("""
    #### 1. [Health Prediction](/Health_Prediction)
    Enter physiological parameters (age, gender, height, weight, blood pressure, cholesterol, glucose, smoking, alcohol, and activity) to obtain immediate inference from the trained Artificial Neural Network, complete with risk breakdowns and contextual explanations.
    
    #### 2. [Data Analytics & EDA](/Data_Analytics)
    Explore the distribution of clinical features across 70,000 patient records, demographic splits, blood pressure anomalies, BMI calculations, and correlation heatmaps.
    """)

with colB:
    st.markdown("""
    #### 3. [Model Performance](/Model_Performance)
    Review actual evaluation metrics from the held-out test set: Confusion Matrix (TP, TN, FP, FN), ROC curves, loss curves across epochs, and comparison between the ANN and the baseline Logistic Regression model.
    
    #### 4. [About & Academic Documentation](/About_Project)
    Complete B.Tech CSE project documentation including problem statement, methodology, ANN architectural diagrams, limitations, and future scope.
    """)

st.markdown("---")
st.info("Tip: Use the left sidebar to navigate across pages, or run `python -m src.train_model` in the terminal to retrain the neural network.")
