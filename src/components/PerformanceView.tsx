import React from 'react';
import { 
  LineChart as LineChartIcon, 
  CheckCircle, 
  Award, 
  Cpu, 
  Layers, 
  Zap, 
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { MODEL_METRICS } from '../data/modelData';

export const PerformanceView: React.FC = () => {
  const ann = MODEL_METRICS.models.ann;
  const annMetrics = ann.metrics;
  const lrMetrics = MODEL_METRICS.models.baseline.metrics;
  const comp = MODEL_METRICS.comparison;
  const cm = annMetrics.confusion_matrix;
  const history = ann.history;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Model Performance & Evaluation
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Empirical testing results on the held-out test cohort (13,714 patients, 20% stratified test split).
        </p>
      </div>

      {/* Head-to-Head Comparison Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">1. Head-to-Head Model Benchmark</h2>
            <p className="text-sm text-slate-600">Comparing the Artificial Neural Network against the Logistic Regression baseline.</p>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>ANN Wins Across Accuracy, Precision, F1 & AUC</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accuracy</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{(annMetrics.accuracy * 100).toFixed(2)}%</div>
            <div className="text-xs text-emerald-700 font-bold mt-1">+{(comp.accuracy_gain * 100).toFixed(2)}% vs LR</div>
            <div className="text-[11px] text-slate-400 mt-0.5">LR: {(lrMetrics.accuracy * 100).toFixed(2)}%</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Precision</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{(annMetrics.precision * 100).toFixed(2)}%</div>
            <div className="text-xs text-emerald-700 font-bold mt-1">
              +{((annMetrics.precision - lrMetrics.precision) * 100).toFixed(2)}% vs LR
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">LR: {(lrMetrics.precision * 100).toFixed(2)}%</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recall</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{(annMetrics.recall * 100).toFixed(2)}%</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">
              {((annMetrics.recall - lrMetrics.recall) * 100).toFixed(2)}% vs LR
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">LR: {(lrMetrics.recall * 100).toFixed(2)}%</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">F1-Score</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{(annMetrics.f1_score * 100).toFixed(2)}%</div>
            <div className="text-xs text-emerald-700 font-bold mt-1">+{(comp.f1_gain * 100).toFixed(2)}% vs LR</div>
            <div className="text-[11px] text-slate-400 mt-0.5">LR: {(lrMetrics.f1_score * 100).toFixed(2)}%</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">ROC-AUC</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{annMetrics.roc_auc.toFixed(4)}</div>
            <div className="text-xs text-emerald-700 font-bold mt-1">+{comp.auc_gain.toFixed(4)} vs LR</div>
            <div className="text-[11px] text-slate-400 mt-0.5">LR: {lrMetrics.roc_auc.toFixed(4)}</div>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">2. Held-Out Test Set Confusion Matrix</h2>
          <p className="text-sm text-slate-600">Distribution of 13,714 predictions across actual vs predicted classes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Matrix Visual (6 cols) */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div className="p-2"></div>
              <div className="p-2 text-blue-700 bg-blue-50/80 rounded-lg">PREDICTED NEGATIVE (0)</div>
              <div className="p-2 text-rose-700 bg-rose-50/80 rounded-lg">PREDICTED POSITIVE (1)</div>

              <div className="p-3 text-slate-700 font-bold flex items-center justify-center bg-slate-100 rounded-lg">
                ACTUAL NEGATIVE (0)
              </div>
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 flex flex-col justify-center">
                <span className="text-2xl font-black">{cm.true_negative.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-emerald-700 mt-0.5">True Negative (TN)</span>
                <span className="text-[10px] text-emerald-600 mt-0.5">Correctly classified healthy</span>
              </div>
              <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-xl text-rose-950 flex flex-col justify-center">
                <span className="text-2xl font-black">{cm.false_positive.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-rose-700 mt-0.5">False Positive (FP)</span>
                <span className="text-[10px] text-rose-600 mt-0.5">Type I Error (False Alarm)</span>
              </div>

              <div className="p-3 text-slate-700 font-bold flex items-center justify-center bg-slate-100 rounded-lg">
                ACTUAL POSITIVE (1)
              </div>
              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-950 flex flex-col justify-center">
                <span className="text-2xl font-black">{cm.false_negative.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-amber-800 mt-0.5">False Negative (FN)</span>
                <span className="text-[10px] text-amber-700 mt-0.5">Type II Error (Missed Disease)</span>
              </div>
              <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl text-blue-950 flex flex-col justify-center">
                <span className="text-2xl font-black">{cm.true_positive.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-blue-800 mt-0.5">True Positive (TP)</span>
                <span className="text-[10px] text-blue-700 mt-0.5">Correctly classified CVD</span>
              </div>
            </div>
          </div>

          {/* Clinical Insights (6 cols) */}
          <div className="lg:col-span-6 space-y-4 text-sm text-slate-700">
            <h3 className="font-bold text-slate-900 text-base">Clinical Trade-Off Analysis</h3>
            <p className="leading-relaxed">
              In clinical risk prediction, the trade-off between **Precision** and **Recall** is critical:
            </p>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <strong className="text-slate-900">Precision ({ (annMetrics.precision * 100).toFixed(1) }%):</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Out of all patients the ANN classified as high-risk, nearly 76% actually have cardiovascular disease in clinical follow-up. This minimizes unnecessary clinical stress and over-testing.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <strong className="text-slate-900">Recall ({ (annMetrics.recall * 100).toFixed(1) }%):</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  The model successfully identifies 66.4% of all actual cardiovascular cases in the cohort. In future iterations, adjusting the decision threshold from 0.50 to 0.40 can increase sensitivity to over 80%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training & Validation Curves */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">3. Epoch Loss & Accuracy Progression</h2>
          <p className="text-sm text-slate-600">Logged training history across 6 Adam optimization epochs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Binary Cross-Entropy Loss</span>
            <div className="space-y-2 pt-1">
              {history.epoch.map((ep, i) => (
                <div key={ep} className="flex justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Epoch {ep}</span>
                  <span className="text-slate-900 font-mono">Train: {history.loss[i]} | Val: {history.val_loss[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Classification Accuracy</span>
            <div className="space-y-2 pt-1">
              {history.epoch.map((ep, i) => (
                <div key={ep} className="flex justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Epoch {ep}</span>
                  <span className="text-slate-900 font-mono">Train: {(history.accuracy[i]*100).toFixed(1)}% | Val: {(history.val_accuracy[i]*100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 italic">
          Verification: Validation loss tracks closely with training loss without widening gap, demonstrating solid generalization and absence of severe overfitting.
        </p>
      </div>

      {/* Network Specifications */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold">ANN Architecture Specifications</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">Input Dimension</span>
            <span className="text-sm font-bold text-white mt-1 block">12 Normalized Features</span>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">Hidden Layers</span>
            <span className="text-sm font-bold text-white mt-1 block">Dense(64) → Dense(32) [ReLU]</span>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">Output Activation</span>
            <span className="text-sm font-bold text-white mt-1 block">1 Neuron [Sigmoid Probability]</span>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 block font-medium">Optimizer & Loss</span>
            <span className="text-sm font-bold text-white mt-1 block">Adam (lr=0.003) | Log Loss</span>
          </div>
        </div>
      </div>
    </div>
  );
};
