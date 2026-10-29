import React from 'react';
import { 
  Heart, 
  Activity, 
  Database, 
  Cpu, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  Stethoscope, 
  LineChart, 
  BarChart3, 
  FileText,
  Zap,
  Users
} from 'lucide-react';
import { MODEL_METRICS } from '../data/modelData';

interface HomeViewProps {
  onNavigate: (tab: 'home' | 'predict' | 'analytics' | 'performance' | 'academic') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const dataset = MODEL_METRICS.dataset;
  const annMetrics = MODEL_METRICS.models.ann.metrics;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-200">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>B.Tech CSE Capstone Project · Artificial Neural Network (ANN)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Cardiovascular Health Monitoring & Risk Prediction
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            An empirical deep learning and clinical analytics application trained on <strong className="text-white">70,000 real patient records</strong> from Kaggle. 
            Evaluate multi-factorial cardiovascular associations in real time through an optimized feedforward neural network.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('predict')}
              className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-rose-900/40 hover:shadow-rose-900/60 transition-all cursor-pointer"
            >
              <Stethoscope className="w-5 h-5" />
              <span>Launch Health Prediction</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className="inline-flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold px-5 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Explore 70,000 Dataset</span>
            </button>

            <button
              onClick={() => onNavigate('academic')}
              className="inline-flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-medium px-4 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Viva & Code Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Educational & Medical Disclaimer */}
      <div className="bg-rose-50/80 border-l-4 border-rose-600 rounded-r-2xl p-5 text-slate-800 shadow-xs flex items-start space-x-4">
        <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-sm space-y-1">
          <p className="font-bold text-rose-900 text-base">Important Educational & Medical Limitation</p>
          <p className="text-slate-700 leading-relaxed">
            This application is an educational machine learning project built for engineering study. 
            <strong> It is NOT a certified diagnostic system</strong>, does not establish that a patient is healthy, and must never replace consultation with a licensed physician. 
            All probabilities represent statistical pattern associations within the Kaggle cohort.
          </p>
        </div>
      </div>

      {/* Real Statistics Grid (Based on actual 70,000 records & trained model) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Cohort</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">70,000</div>
            <p className="text-xs text-slate-600 mt-1">
              <span className="text-emerald-700 font-bold">68,567 Validated</span> (97.95% clean retention)
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ANN Test Accuracy</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-indigo-900">{(annMetrics.accuracy * 100).toFixed(1)}%</div>
            <p className="text-xs text-slate-600 mt-1">
              Evaluated on <strong className="text-slate-800">13,714 held-out test samples</strong>
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ANN ROC-AUC Score</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <LineChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{annMetrics.roc_auc.toFixed(3)}</div>
            <p className="text-xs text-emerald-700 font-semibold mt-1">
              High discriminatory classification capability
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cohort Class Ratio</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">50 : 50</div>
            <p className="text-xs text-slate-600 mt-1">
              Naturally balanced target distribution (Cardio 0 vs 1)
            </p>
          </div>
        </div>
      </div>

      {/* 4-Step Engineering & Inference Workflow */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">End-to-End System Workflow</h2>
          <p className="text-sm text-slate-600">How patient measurements flow from input to neural network inference and clinical risk insights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="space-y-3 relative p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">1</div>
            <h3 className="font-bold text-slate-900 text-sm">Input & Validation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patient demographics, blood pressure readings, cholesterol, glucose, and lifestyle markers are validated against physiological bounds.
            </p>
          </div>

          <div className="space-y-3 relative p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">2</div>
            <h3 className="font-bold text-slate-900 text-sm">Feature Normalization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              BMI is computed dynamically. All 12 inputs are scaled with parameters fitted strictly on the 80% training partition (no data leakage).
            </p>
          </div>

          <div className="space-y-3 relative p-4 rounded-xl bg-indigo-50 border border-indigo-200/60">
            <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white font-bold flex items-center justify-center text-sm">3</div>
            <h3 className="font-bold text-indigo-950 text-sm">Deep ANN Inference</h3>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Data passes through 64-neuron and 32-neuron ReLU hidden layers, culminating in a Sigmoid output neuron generating an exact probability.
            </p>
          </div>

          <div className="space-y-3 relative p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">4</div>
            <h3 className="font-bold text-slate-900 text-sm">Transparent Explanations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The output highlights individual risk-elevating factors (such as hypertension or elevated cholesterol) versus normal/protective factors.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('predict')}
          className="bg-white border border-slate-200 hover:border-rose-400 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Health Prediction</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Enter individual patient biomarkers or choose preset test profiles to test neural network classification in real time.
          </p>
          <div className="mt-4 flex items-center text-sm font-bold text-rose-600">
            <span>Try Prediction</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('performance')}
          className="bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <LineChart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Model Evaluation</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Inspect the Confusion Matrix, ROC curves, and benchmark comparison between the ANN and Baseline Logistic Regression.
          </p>
          <div className="mt-4 flex items-center text-sm font-bold text-indigo-600">
            <span>View Metrics</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('academic')}
          className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Viva & Academic Guide</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Exam flashcards with English & Hinglish explanations, complete Python source code explorer, and methodology notes.
          </p>
          <div className="mt-4 flex items-center text-sm font-bold text-emerald-600">
            <span>Explore Guide</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
