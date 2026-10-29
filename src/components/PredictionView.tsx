import React, { useState } from 'react';
import { 
  Stethoscope, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Heart, 
  Activity, 
  Scale, 
  User, 
  ShieldAlert, 
  Info,
  Sparkles,
  Cigarette,
  Wine,
  Flame
} from 'lucide-react';
import { PatientInput, PredictionResult } from '../types/cardio';
import { predictPatientRisk, calculateBMI, getBMICategory, getBPCategory } from '../services/annModel';

export const PredictionView: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState<PatientInput>({
    age: 52,
    gender: 'Male',
    height: 168,
    weight: 74,
    ap_hi: 130,
    ap_lo: 85,
    cholesterol: 2,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Live computed indicators
  const currentBMI = calculateBMI(formData.height, formData.weight);
  const currentBMICat = getBMICategory(currentBMI);
  const currentBPCat = getBPCategory(formData.ap_hi, formData.ap_lo);

  // Quick Presets
  const applyPreset = (presetName: 'healthy' | 'borderline' | 'high_risk') => {
    setValidationError(null);
    if (presetName === 'healthy') {
      setFormData({
        age: 34,
        gender: 'Female',
        height: 164,
        weight: 58,
        ap_hi: 115,
        ap_lo: 75,
        cholesterol: 1,
        gluc: 1,
        smoke: 0,
        alco: 0,
        active: 1
      });
    } else if (presetName === 'borderline') {
      setFormData({
        age: 51,
        gender: 'Male',
        height: 172,
        weight: 78,
        ap_hi: 135,
        ap_lo: 88,
        cholesterol: 2,
        gluc: 1,
        smoke: 0,
        alco: 1,
        active: 1
      });
    } else {
      setFormData({
        age: 63,
        gender: 'Male',
        height: 169,
        weight: 92,
        ap_hi: 165,
        ap_lo: 102,
        cholesterol: 3,
        gluc: 2,
        smoke: 1,
        alco: 1,
        active: 0
      });
    }
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation checks
    if (formData.ap_lo >= formData.ap_hi) {
      setValidationError("Diastolic pressure (lower reading) must be strictly less than systolic pressure (upper reading).");
      return;
    }
    if (formData.height < 120 || formData.height > 220) {
      setValidationError("Please specify height between 120 cm and 220 cm.");
      return;
    }
    if (formData.weight < 35 || formData.weight > 200) {
      setValidationError("Please specify weight between 35 kg and 200 kg.");
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      const res = predictPatientRisk(formData);
      setResult(res);
      setIsCalculating(false);
    }, 250);
  };

  const handleReset = () => {
    setFormData({
      age: 52,
      gender: 'Male',
      height: 168,
      weight: 74,
      ap_hi: 130,
      ap_lo: 85,
      cholesterol: 2,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1
    });
    setResult(null);
    setValidationError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cardiovascular Health Prediction
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time inference using the trained 3-layer Artificial Neural Network (ANN).
          </p>
        </div>

        {/* Quick Presets Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('healthy')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            Healthy Profile
          </button>
          <button
            type="button"
            onClick={() => applyPreset('borderline')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
          >
            Borderline
          </button>
          <button
            type="button"
            onClick={() => applyPreset('high_risk')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            High Risk
          </button>
        </div>
      </div>

      {validationError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (7 cols) */}
        <form onSubmit={handlePredict} className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Section 1: Demographics */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Demographics & Anthropometrics</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min={18}
                  max={100}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-900"
                  required
                />
                <span className="text-xs text-slate-500 mt-1 block">Dataset range: 30 to 65 years</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Biological Sex
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Female' | 'Male' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-900 bg-white"
                >
                  <option value="Female">Female (Code 1)</option>
                  <option value="Male">Male (Code 2)</option>
                </select>
                <span className="text-xs text-slate-500 mt-1 block">Dataset encoded 1=Female, 2=Male</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min={120}
                  max={220}
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min={35}
                  max={200}
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-900"
                  required
                />
              </div>
            </div>

            {/* Instant BMI indicator bar */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-600 font-medium">Calculated Body Mass Index (BMI):</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold text-slate-900">{currentBMI} kg/m²</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold bg-${currentBMICat.color}-100 text-${currentBMICat.color}-800`}>
                  {currentBMICat.label}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Blood Pressure & Labs */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Activity className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">Vascular Readings & Laboratory Tiers</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Systolic BP (ap_hi mmHg)
                </label>
                <input
                  type="number"
                  min={70}
                  max={240}
                  value={formData.ap_hi}
                  onChange={(e) => setFormData({ ...formData, ap_hi: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-900"
                  required
                />
                <span className="text-xs text-slate-500 mt-1 block">Upper number during contraction</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Diastolic BP (ap_lo mmHg)
                </label>
                <input
                  type="number"
                  min={40}
                  max={160}
                  value={formData.ap_lo}
                  onChange={(e) => setFormData({ ...formData, ap_lo: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-900"
                  required
                />
                <span className="text-xs text-slate-500 mt-1 block">Lower number between beats</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Serum Cholesterol
                </label>
                <select
                  value={formData.cholesterol}
                  onChange={(e) => setFormData({ ...formData, cholesterol: Number(e.target.value) as 1 | 2 | 3 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-900 bg-white"
                >
                  <option value={1}>1: Normal</option>
                  <option value={2}>2: Above Normal</option>
                  <option value={3}>3: Well Above Normal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Fasting Glucose
                </label>
                <select
                  value={formData.gluc}
                  onChange={(e) => setFormData({ ...formData, gluc: Number(e.target.value) as 1 | 2 | 3 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold text-slate-900 bg-white"
                >
                  <option value={1}>1: Normal</option>
                  <option value={2}>2: Above Normal</option>
                  <option value={3}>3: Well Above Normal</option>
                </select>
              </div>
            </div>

            {/* Blood Pressure Category preview */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">AHA / ACC Guideline Classification:</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold bg-${currentBPCat.color}-100 text-${currentBPCat.color}-800`}>
                {currentBPCat.label}
              </span>
            </div>
          </div>

          {/* Section 3: Lifestyle Factors */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Flame className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">Lifestyle & Behaviors</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tobacco Smoker
                </label>
                <select
                  value={formData.smoke}
                  onChange={(e) => setFormData({ ...formData, smoke: Number(e.target.value) as 0 | 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white"
                >
                  <option value={0}>No (Non-smoker)</option>
                  <option value={1}>Yes (Active smoker)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Alcohol Consumption
                </label>
                <select
                  value={formData.alco}
                  onChange={(e) => setFormData({ ...formData, alco: Number(e.target.value) as 0 | 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white"
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes (Regular drinker)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Physical Activity
                </label>
                <select
                  value={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: Number(e.target.value) as 0 | 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white"
                >
                  <option value={1}>Yes (Regular exercise)</option>
                  <option value={0}>No (Sedentary)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 flex items-center space-x-3">
            <button
              type="submit"
              disabled={isCalculating}
              className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-rose-900/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>{isCalculating ? 'Computing ANN Inference...' : 'Calculate Cardiovascular Risk'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors flex items-center justify-center cursor-pointer"
              title="Reset to default values"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Right Column: Prediction Results Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ANN Inference Output</span>
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  result.predictedClass === 1 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {result.predictedClass === 1 ? 'Positive Target Class (1)' : 'Negative Target Class (0)'}
                </span>
              </div>

              {/* Main Risk Score Meter */}
              <div className="text-center py-2 space-y-2">
                <div className="text-5xl font-black text-slate-900 tracking-tight">
                  {result.probabilityPercentage}%
                </div>
                <div className={`text-sm font-bold ${
                  result.riskColor === 'rose' ? 'text-rose-600' :
                  result.riskColor === 'amber' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {result.riskLevel}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      result.probability >= 0.5 ? 'bg-linear-to-r from-amber-500 to-rose-600' : 'bg-linear-to-r from-blue-400 to-emerald-500'
                    }`}
                    style={{ width: `${result.probabilityPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span>0% (Lowest Association)</span>
                  <span>50% (Decision Boundary)</span>
                  <span>100% (Highest)</span>
                </div>
              </div>

              {/* Verdict Explanation */}
              <div className="bg-slate-50 rounded-xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed border border-slate-100">
                <p className="font-semibold text-slate-900 mb-1">Model Explanation:</p>
                {result.verdictText}
              </div>

              {/* Factors Breakdown */}
              <div className="space-y-4">
                {result.riskFactors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Elevated Risk Contributors:</span>
                    </p>
                    <ul className="space-y-1.5">
                      {result.riskFactors.map((rf, idx) => (
                        <li key={idx} className="text-xs text-rose-900 bg-rose-50/60 border border-rose-100 rounded-lg px-2.5 py-1.5">
                          {rf}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.positiveFactors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Favorable Biomarkers:</span>
                    </p>
                    <ul className="space-y-1.5">
                      {result.positiveFactors.map((pf, idx) => (
                        <li key={idx} className="text-xs text-emerald-900 bg-emerald-50/60 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                          {pf}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-start space-x-2">
                <Info className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                <span>{result.disclaimer}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-4 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">Ready for Patient Assessment</h3>
              <p className="text-xs leading-relaxed max-w-sm mx-auto">
                Adjust clinical measurements in the form on the left, or select a preset profile, then click <strong>Calculate Cardiovascular Risk</strong> to generate neural network inference.
              </p>
            </div>
          )}

          {/* Clinical Reference Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-800">AHA/ACC Reference Staging:</p>
            <p>• <strong>Normal BP:</strong> Systolic &lt; 120 and Diastolic &lt; 80 mmHg</p>
            <p>• <strong>Stage 1 Hypertension:</strong> Systolic 130-139 or Diastolic 80-89 mmHg</p>
            <p>• <strong>Stage 2 Hypertension:</strong> Systolic &ge; 140 or Diastolic &ge; 90 mmHg</p>
          </div>
        </div>
      </div>
    </div>
  );
};
