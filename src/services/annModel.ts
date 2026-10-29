/**
 * ANN Inference Engine (TypeScript)
 * Performs forward pass through the deep artificial neural network
 * using weights learned from Kaggle cardio_train.csv.
 */

import { SCALER_PARAMS, ANN_WEIGHTS } from '../data/modelData';
import { PatientInput, PredictionResult } from '../types/cardio';

function sigmoid(z: number): number {
  const clipped = Math.max(-40.0, Math.min(40.0, z));
  return 1.0 / (1.0 + Math.exp(-clipped));
}

function relu(z: number): number {
  return Math.max(0.0, z);
}

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100.0;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'blue' };
  if (bmi < 25.0) return { label: 'Normal weight', color: 'emerald' };
  if (bmi < 30.0) return { label: 'Overweight', color: 'amber' };
  if (bmi < 35.0) return { label: 'Obese (Class 1)', color: 'orange' };
  return { label: 'Severely Obese (Class 2+)', color: 'rose' };
}

export function getBPCategory(apHi: number, apLo: number): { label: string; color: string } {
  if (apHi > 180 || apLo > 120) return { label: 'Hypertensive Crisis (Urgent)', color: 'rose' };
  if (apHi >= 140 || apLo >= 90) return { label: 'Stage 2 Hypertension', color: 'rose' };
  if (apHi >= 130 || apLo >= 80) return { label: 'Stage 1 Hypertension', color: 'amber' };
  if (apHi >= 120 && apLo < 80) return { label: 'Elevated BP', color: 'yellow' };
  return { label: 'Normal BP', color: 'emerald' };
}

export function predictPatientRisk(input: PatientInput): PredictionResult {
  const age = Number(input.age);
  const gender = (input.gender === 'Male' || input.gender === 2) ? 1.0 : 0.0;
  const h = Number(input.height);
  const w = Number(input.weight);
  const hi = Number(input.ap_hi);
  const lo = Number(input.ap_lo);
  const bmi = calculateBMI(h, w);
  const chol = Number(input.cholesterol);
  const gluc = Number(input.gluc);
  const smoke = Number(input.smoke || 0);
  const alco = Number(input.alco || 0);
  const active = Number(input.active ?? 1);

  const rawVector = [age, gender, h, w, hi, lo, bmi, chol, gluc, smoke, alco, active];
  const { means, stds, feature_names } = SCALER_PARAMS;

  // 1. Standard Scaler Transform (z = (x - mean) / std)
  const scaledVector = rawVector.map((val, idx) => {
    const std = stds[idx] > 1e-7 ? stds[idx] : 1.0;
    return (val - means[idx]) / std;
  });

  const { w1, b1, w2, b2, w3, b3 } = ANN_WEIGHTS;
  const dimIn = 12;
  const dimH1 = b1.length; // 64
  const dimH2 = b2.length; // 32

  // 2. Layer 1 Forward (Input -> Dense 64 -> ReLU)
  const z1: number[] = new Array(dimH1);
  const a1: number[] = new Array(dimH1);
  for (let j = 0; j < dimH1; j++) {
    let sum = b1[j];
    for (let i = 0; i < dimIn; i++) {
      sum += scaledVector[i] * w1[i][j];
    }
    z1[j] = sum;
    a1[j] = relu(sum);
  }

  // 3. Layer 2 Forward (Dense 64 -> Dense 32 -> ReLU)
  const z2: number[] = new Array(dimH2);
  const a2: number[] = new Array(dimH2);
  for (let j = 0; j < dimH2; j++) {
    let sum = b2[j];
    for (let i = 0; i < dimH1; i++) {
      sum += a1[i] * w2[i][j];
    }
    z2[j] = sum;
    a2[j] = relu(sum);
  }

  // 4. Layer 3 Forward (Dense 32 -> Dense 1 -> Sigmoid)
  let z3 = b3[0];
  for (let i = 0; i < dimH2; i++) {
    z3 += a2[i] * w3[i][0];
  }
  const probability = sigmoid(z3);
  const predictedClass: 0 | 1 = probability >= 0.5 ? 1 : 0;

  // Clinical Factors Extraction
  const riskFactors: string[] = [];
  const positiveFactors: string[] = [];

  const bpCat = getBPCategory(hi, lo);
  const bmiCat = getBMICategory(bmi);

  if (hi >= 130 || lo >= 80) {
    riskFactors.push(`Elevated Blood Pressure: ${hi}/${lo} mmHg (${bpCat.label})`);
  } else {
    positiveFactors.push(`Optimal Blood Pressure: ${hi}/${lo} mmHg (${bpCat.label})`);
  }

  if (bmi >= 25.0) {
    riskFactors.push(`BMI Indicates ${bmiCat.label}: ${bmi} kg/m²`);
  } else {
    positiveFactors.push(`Healthy BMI: ${bmi} kg/m² (${bmiCat.label})`);
  }

  if (chol > 1) {
    riskFactors.push(`Serum Cholesterol: Level ${chol} (${chol === 2 ? 'Above Normal' : 'Well Above Normal'})`);
  } else {
    positiveFactors.push('Serum Cholesterol: Normal level (Level 1)');
  }

  if (gluc > 1) {
    riskFactors.push(`Fasting Glucose: Level ${gluc} (${gluc === 2 ? 'Above Normal' : 'Well Above Normal'})`);
  } else {
    positiveFactors.push('Fasting Glucose: Normal level (Level 1)');
  }

  if (smoke === 1) {
    riskFactors.push('Tobacco Smoker (Active vascular stressor)');
  } else {
    positiveFactors.push('Non-Smoker (Cardiovascular protective)');
  }

  if (alco === 1) {
    riskFactors.push('Regular Alcohol Consumption');
  }

  if (active === 0) {
    riskFactors.push('Sedentary Lifestyle (Low physical activity reported)');
  } else {
    positiveFactors.push('Regular Physical Activity');
  }

  if (age >= 55) {
    riskFactors.push(`Chronological Age: ${age} years (elevated epidemiological baseline)`);
  }

  let riskLevel: 'Low Estimated Association' | 'Moderate Estimated Association' | 'High Estimated Association';
  let riskColor: 'emerald' | 'amber' | 'rose';
  let verdictText = '';

  if (probability < 0.35) {
    riskLevel = 'Low Estimated Association';
    riskColor = 'emerald';
    verdictText = 'The trained Artificial Neural Network indicates that the provided physiological parameters align with the negative cohort class (No CVD indicator pattern).';
  } else if (probability < 0.65) {
    riskLevel = 'Moderate Estimated Association';
    riskColor = 'amber';
    verdictText = 'The Artificial Neural Network identifies borderline biomarkers. Several measurements (such as blood pressure, BMI, or lipid categories) warrant regular clinical surveillance.';
  } else {
    riskLevel = 'High Estimated Association';
    riskColor = 'rose';
    verdictText = 'The Artificial Neural Network estimates a high statistical alignment with the positive cardiovascular disease class in the Kaggle patient cohort.';
  }

  const rawFeatures: Record<string, number> = {};
  feature_names.forEach((name: string, i: number) => {
    rawFeatures[name] = rawVector[i];
  });

  return {
    predictedClass,
    probability: Number(probability.toFixed(4)),
    probabilityPercentage: Number((probability * 100).toFixed(1)),
    riskLevel,
    riskColor,
    verdictText,
    derivedBmi: bmi,
    bmiCategory: bmiCat.label,
    bpCategory: bpCat.label,
    riskFactors,
    positiveFactors,
    rawFeatures,
    disclaimer: 'This estimation is produced by an academic Artificial Neural Network model and is NOT a clinical diagnosis. Always consult a certified cardiologist or physician.'
  };
}
