"""
Streamlit Page 1: Health Prediction
User-friendly clinical parameter input form with real-time inference and explanations.
"""

import streamlit as st
import os
from src.predict import CardioPredictor
from src.utils import calculate_bmi, get_bmi_category, get_blood_pressure_category
from config import ANN_MODEL_PATH

st.set_page_config(page_title="Cardiovascular Health Prediction | CardioPredict ANN", page_icon="🩺", layout="wide")

st.title("🩺 Cardiovascular Health Risk Estimation")
st.write("Enter clinical measurements below to evaluate association with cardiovascular disease patterns using the trained Artificial Neural Network.")

st.warning("⚠️ **Educational Notice:** Predictions do not constitute medical diagnosis. Results reflect statistical patterns in the Kaggle training dataset.")

if not os.path.exists(ANN_MODEL_PATH):
    st.error("⚠️ Trained model artifact not found! Please execute `python -m src.train_model` in your terminal to train and save the model.")
    st.stop()

@st.cache_resource
def load_predictor():
    return CardioPredictor()

try:
    predictor = load_predictor()
except Exception as e:
    st.error(f"Error loading model: {e}")
    st.stop()

# Input Form
with st.form("prediction_form"):
    st.subheader("1. Patient Demographics & Body Metrics")
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        age = st.number_input("Age (years)", min_value=18, max_value=100, value=52, help="Patient chronological age in years.")
    with c2:
        gender = st.selectbox("Biological Sex", options=["Female", "Male"], help="Dataset encoded: Female=1, Male=2.")
    with c3:
        height = st.number_input("Height (cm)", min_value=120.0, max_value=220.0, value=168.0, step=0.5, help="Height in centimeters.")
    with c4:
        weight = st.number_input("Weight (kg)", min_value=35.0, max_value=180.0, value=74.0, step=0.5, help="Weight in kilograms.")
        
    # Instant BMI preview
    bmi = calculate_bmi(height, weight)
    bmi_cat, _ = get_bmi_category(bmi)
    st.caption(f"Calculated BMI: **{bmi:.1f} kg/m²** ({bmi_cat})")

    st.subheader("2. Blood Pressure & Laboratory Indicators")
    c5, c6, c7, c8 = st.columns(4)
    with c5:
        ap_hi = st.number_input("Systolic Blood Pressure (mmHg)", min_value=70, max_value=240, value=130, help="Upper reading during heartbeat contraction.")
    with c6:
        ap_lo = st.number_input("Diastolic Blood Pressure (mmHg)", min_value=40, max_value=160, value=85, help="Lower reading between heartbeats.")
    with c7:
        cholesterol = st.selectbox("Cholesterol Level", options=[1, 2, 3], format_func=lambda x: {1: "1: Normal", 2: "2: Above Normal", 3: "3: Well Above Normal"}[x])
    with c8:
        gluc = st.selectbox("Blood Glucose Level", options=[1, 2, 3], format_func=lambda x: {1: "1: Normal", 2: "2: Above Normal", 3: "3: Well Above Normal"}[x])
        
    bp_cat, _ = get_blood_pressure_category(ap_hi, ap_lo)
    st.caption(f"Blood Pressure Category: **{bp_cat}** ({ap_hi}/{ap_lo} mmHg)")

    st.subheader("3. Lifestyle & Behavioral Factors")
    c9, c10, c11 = st.columns(3)
    with c9:
        smoke = st.selectbox("Tobacco Smoking", options=[0, 1], format_func=lambda x: "No" if x==0 else "Yes (Active Smoker)")
    with c10:
        alco = st.selectbox("Alcohol Consumption", options=[0, 1], format_func=lambda x: "No" if x==0 else "Yes (Consumes Alcohol)")
    with c11:
        active = st.selectbox("Physical Activity", options=[1, 0], format_func=lambda x: "Yes (Physically Active)" if x==1 else "No (Sedentary Routine)")

    submitted = st.form_submit_button("⚡ Run ANN Prediction", use_container_width=True)

if submitted:
    if ap_lo >= ap_hi:
        st.error("Validation Error: Diastolic pressure (ap_lo) must be lower than systolic pressure (ap_hi). Please correct your values.")
    else:
        with st.spinner("Executing Artificial Neural Network forward pass..."):
            patient_input = {
                'age': age,
                'gender': gender,
                'height': height,
                'weight': weight,
                'ap_hi': ap_hi,
                'ap_lo': ap_lo,
                'cholesterol': cholesterol,
                'gluc': gluc,
                'smoke': smoke,
                'alco': alco,
                'active': active
            }
            result = predictor.predict(patient_input)
            
        st.success("Analysis Complete!")
        
        # Display Prediction Result Card
        st.markdown("### Prediction Results")
        res_col1, res_col2 = st.columns([1, 2])
        
        with res_col1:
            st.metric("Estimated Risk Probability", f"{result['probability_percentage']}%")
            st.markdown(f"**Classification:** `{'Class 1: High Association' if result['predicted_class'] == 1 else 'Class 0: Low Association'}`")
            st.markdown(f"**Assessment:** <span style='font-weight:700; color:{result['risk_color']};'>{result['risk_level']}</span>", unsafe_allow_html=True)
            
        with res_col2:
            st.write(result['verdict_text'])
            st.write(f"• **BMI Status:** {result['bmi_category']} ({result['derived_bmi']:.1f} kg/m²)")
            st.write(f"• **Blood Pressure Category:** {result['bp_category']}")
            
        st.markdown("---")
        st.markdown("#### Clinical Factor Highlights")
        rf_col, pf_col = st.columns(2)
        with rf_col:
            st.markdown("##### ⚠️ Risk Elevating Factors Identified:")
            if result['risk_factors']:
                for rf in result['risk_factors']:
                    st.write(f"- {rf}")
            else:
                st.write("None detected among standard markers.")
                
        with pf_col:
            st.markdown("##### ✅ Protective / Normal Indicators:")
            if result['positive_factors']:
                for pf in result['positive_factors']:
                    st.write(f"- {pf}")
            else:
                st.write("Multiple clinical indicators are elevated.")
                
        st.info(result['disclaimer'])
