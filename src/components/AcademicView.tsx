import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Code, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Languages, 
  Layers, 
  ShieldCheck,
  FileCode2,
  Terminal
} from 'lucide-react';

export const AcademicView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'viva' | 'code' | 'methodology'>('viva');
  const [languageMode, setLanguageMode] = useState<'english' | 'hinglish'>('english');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('app.py');

  const vivaQuestions = [
    {
      id: 0,
      topic: 'Project Motivation',
      q: 'What problem does this project solve, and why is an ANN appropriate?',
      en: 'Cardiovascular diseases are the leading cause of mortality globally. Early detection of high-risk physiological indicators allows for preventive lifestyle adjustments and medical intervention before irreversible events occur. While linear models like Logistic Regression only capture direct additive effects, an Artificial Neural Network (ANN) uses non-linear activation functions (ReLU) to model multi-factorial combinations (e.g. combined hypertension, high cholesterol, and age).',
      hi: 'Yeh project cardiovascular disease ke risk ko early stage par identify karne ke liye ek Artificial Neural Network based system provide karta hai. Traditional linear models sirf seedhe relationships pakadte hain, jabki ANN multi-factorial complex interactions (jaise blood pressure + cholesterol + age ka combined effect) ko non-linear ReLU activations se behtar learn karta hai.'
    },
    {
      id: 1,
      topic: 'Data Preprocessing',
      q: 'Why was age converted from days to years, and how was BMI derived?',
      en: 'In the raw Kaggle dataset, age is recorded in days (e.g., 18,393 days). Converting it via age / 365.25 makes it human-interpretable and aligns with clinical risk age-brackets (>50 years). Height and weight were converted to Body Mass Index (BMI = weight_kg / (height_m)^2) to provide a single standardized indicator of obesity and metabolic strain.',
      hi: 'Raw dataset mein age days mein thi (jaise 18,393 days). Isko age / 365.25 karke standard years mein convert kiya taaki doctors aur users ke liye understandable ho. Height aur weight ko BMI (kg/m²) mein convert kiya taaki body mass aur cardiovascular strain ka standard metric mil sake.'
    },
    {
      id: 2,
      topic: 'Data Leakage',
      q: 'What is data leakage, and how did you prevent it in your scaling pipeline?',
      en: 'Data leakage happens when information from the test dataset leaks into the training phase (e.g. computing mean and variance across the whole dataset before splitting). We prevented this by first executing a strict 80/20 train/test split. The StandardScaler was fitted strictly on the 80% training data, and those exact learned parameters were used to scale the test data and new user inputs without refitting.',
      hi: 'Data leakage tab hota hai jab test set ka data galti se training phase mein use ho jaye. Humne pehle 80/20 split kiya. Scaler ka mean aur standard deviation sirf 80% training data par fit kiya, aur test set ko bina refit kiye transform kiya. Isse model ko test set ka koi prior knowledge nahi mila.'
    },
    {
      id: 3,
      topic: 'Neural Network Architecture',
      q: 'Explain the ANN architecture, activations, loss function, and optimizer.',
      en: 'We designed a 3-layer Multilayer Perceptron (MLP): Input layer (12 normalized features) -> Dense(64, ReLU) -> Dense(32, ReLU) -> Dense(1, Sigmoid). Hidden layers use ReLU (max(0,z)) to prevent vanishing gradients and capture non-linearities. The output neuron uses Sigmoid (1/(1+e^-z)) to generate a calibrated probability between 0 and 1. We trained with Binary Cross-Entropy loss and the Adam optimizer (lr=0.003).',
      hi: 'Hamara ANN ek 3-layer architecture hai: 12 Inputs -> 64 Neurons (ReLU) -> 32 Neurons (ReLU) -> 1 Output (Sigmoid). ReLU vanishing gradients ko prevent karta hai aur fast computation deta hai. Sigmoid output ko 0 se 1 ke beech probability mein map karta hai. Loss function Binary Cross-Entropy hai aur optimizer Adam hai.'
    },
    {
      id: 4,
      topic: 'Model Evaluation',
      q: 'Why is Accuracy not the only metric you should report in medical ML?',
      en: 'In medical classification, False Negatives (predicting a diseased patient is healthy) and False Positives (predicting a healthy person has disease) have vastly different consequences. False negatives can lead to untreated heart attacks or death. Thus, Precision (positive predictive value), Recall (sensitivity), F1-Score (harmonic mean), and ROC-AUC are mandatory to evaluate clinical reliability across thresholds.',
      hi: 'Healthcare mein sirf accuracy kaafi nahi hoti kyunki False Negative (ek bimaar patient ko healthy keh dena) bohot dangerous ho sakta hai. Isliye Precision, Recall, F1-Score aur ROC-AUC dekhna zaroori hota hai taaki pata chale ki model actual cases ko kitni accurately pakad pa raha hai.'
    },
    {
      id: 5,
      topic: 'Clinical Ethics',
      q: 'Why is this software NOT a clinical diagnostic tool?',
      en: 'This is an educational software project for a B.Tech CSE degree. Clinical diagnostic tools require FDA/CE medical device clearance, rigorous clinical trials across diverse hospital populations, and deep clinical data (ECG waveforms, troponin levels, angiography). The application includes visible disclaimers and explicitly advises users to consult qualified physicians.',
      hi: 'Yeh ek academic B.Tech project hai, koi certified medical device nahi hai. Real clinical diagnosis ke liye doctor ka checkup, ECG aur certified regulatory approval zaroori hota hai. Isliye humne UI aur documentation mein prominent medical disclaimers diye hain.'
    }
  ];

  const codeSnippets: Record<string, string> = {
    'app.py': `# Streamlit Application Main Entry Point
import streamlit as st
from config import METRICS_REPORT_PATH
from src.utils import load_json

st.set_page_config(page_title="CardioPredict ANN", page_icon="❤️", layout="wide")
st.title("Cardiovascular Health Monitoring & Prediction System")
st.info("B.Tech CSE Capstone Project Powered by Artificial Neural Networks")

metrics = load_json(METRICS_REPORT_PATH)
if metrics:
    st.write("ANN Test Accuracy:", metrics['models']['ann']['metrics']['accuracy'])
`,
    'src/predict.py': `# Prediction Engine
from config import ANN_MODEL_PATH, SCALER_PATH
from src.utils import sigmoid, relu, calculate_bmi
import json

class CardioPredictor:
    def __init__(self):
        with open(ANN_MODEL_PATH) as f:
            self.model = json.load(f)
        with open(SCALER_PATH) as f:
            self.scaler = json.load(f)
            
    def predict(self, patient_dict):
        # 1. Scale 12 features using training mean & std
        # 2. Execute forward pass: Input(12) -> Dense(64, ReLU) -> Dense(32, ReLU) -> Dense(1, Sigmoid)
        # 3. Return probability and risk level
        pass
`,
    'requirements.txt': `# Project Dependencies
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
tensorflow>=2.14.0
streamlit>=1.30.0
pytest>=7.4.0
`,
    'run_commands.ps1': `# PowerShell Execution Script
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
python -m src.train_model
python -m pytest -q
python -m streamlit run app.py
`
  };

  const copyToClipboard = (text: string, filename: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Academic Documentation & Viva Guide
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          B.Tech CSE university defense preparation, viva questions with English & Hinglish, and project code repository.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSection('viva')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            activeSection === 'viva'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Viva Defense Flashcards
        </button>
        <button
          onClick={() => setActiveSection('code')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            activeSection === 'code'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Source Code & Setup Explorer
        </button>
        <button
          onClick={() => setActiveSection('methodology')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            activeSection === 'methodology'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Research Methodology
        </button>
      </div>

      {/* SECTION 1: VIVA FLASHCARDS */}
      {activeSection === 'viva' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">University Viva Preparation Questions</h2>
              <p className="text-xs text-slate-600 mt-0.5">Click any question to view the technical answer.</p>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl p-1 shrink-0">
              <span className="text-xs font-bold text-slate-500 pl-2">Explanation:</span>
              <button
                onClick={() => setLanguageMode('english')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  languageMode === 'english' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguageMode('hinglish')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  languageMode === 'hinglish' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hinglish
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {vivaQuestions.map((item) => {
              const isExpanded = expandedQuestion === item.id;
              return (
                <div 
                  key={item.id}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : item.id)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 whitespace-nowrap">
                        {item.topic}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900">
                        {item.q}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/40 text-sm leading-relaxed text-slate-700">
                      <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-xs">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{languageMode === 'english' ? 'Technical Answer (English):' : 'Easy Viva Explanation (Hinglish):'}</span>
                        </div>
                        <p>{languageMode === 'english' ? item.en : item.hi}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: CODE EXPLORER */}
      {activeSection === 'code' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Project Code & Script Viewer</h2>
              <p className="text-sm text-slate-600">Review or copy source scripts directly into your local VS Code environment.</p>
            </div>

            {/* File Selector */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(codeSnippets).map((fn) => (
                <button
                  key={fn}
                  onClick={() => setSelectedFile(fn)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    selectedFile === fn
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {fn}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => copyToClipboard(codeSnippets[selectedFile], selectedFile)}
              className="absolute right-4 top-4 z-10 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {copiedFile === selectedFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <pre className="bg-slate-950 text-slate-200 p-6 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed border border-slate-800">
              <code>{codeSnippets[selectedFile]}</code>
            </pre>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>Local VS Code Setup Command:</span>
            </p>
            <p className="font-mono text-slate-800">python -m streamlit run app.py</p>
          </div>
        </div>
      )}

      {/* SECTION 3: RESEARCH METHODOLOGY */}
      {activeSection === 'methodology' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Academic Project Scope & Methodology</h2>
            <p>
              This capstone project implements a reproducible Machine Learning pipeline adhering to rigorous data science standards:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">1. Zero Data Leakage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Feature normalization parameters (mean and standard deviation) are strictly calculated on the 80% training partition (54,853 samples) before any evaluation occurs.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">2. Baseline Benchmarking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than evaluating the ANN in isolation, an L2-regularized Logistic Regression model was trained on the exact same split, demonstrating genuine non-linear performance gains.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">3. Transparent Explanations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every inference provides transparent factor-by-factor attribution, flagging elevated blood pressure, obesity categories, or protective exercise habits.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
