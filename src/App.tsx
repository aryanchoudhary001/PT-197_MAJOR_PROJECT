/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PredictionView } from './components/PredictionView';
import { AnalyticsView } from './components/AnalyticsView';
import { PerformanceView } from './components/PerformanceView';
import { AcademicView } from './components/AcademicView';
import { HeartPulse, ShieldAlert, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'predict' | 'analytics' | 'performance' | 'academic'>('home');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-rose-100 selection:text-rose-900 font-sans text-slate-900">
      {/* Primary Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}
        {activeTab === 'predict' && <PredictionView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'performance' && <PerformanceView />}
        {activeTab === 'academic' && <AcademicView />}
      </main>

      {/* Standard Human-Centered Clinical Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-800 text-sm">CardioPredict ANN</span>
              <span className="text-slate-400">|</span>
              <span>B.Tech CSE Capstone Healthcare Analytics</span>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('academic')} 
                className="hover:text-indigo-600 transition-colors font-medium cursor-pointer"
              >
                Viva Questions
              </button>
              <button 
                onClick={() => setActiveTab('performance')} 
                className="hover:text-indigo-600 transition-colors font-medium cursor-pointer"
              >
                Model Metrics
              </button>
              <button 
                onClick={() => setActiveTab('predict')} 
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Live Predictor
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
            <strong>Educational & Academic Disclaimer:</strong> This application is developed strictly for university capstone demonstrations. 
            It evaluates mathematical associations from the Kaggle Cardiovascular Disease dataset using an Artificial Neural Network. 
            It is not medical software, does not provide clinical diagnosis, and does not replace examination by a certified physician.
          </div>
        </div>
      </footer>
    </div>
  );
}
