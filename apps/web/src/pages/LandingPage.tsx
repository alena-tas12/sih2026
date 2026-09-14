import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Globe, Activity, Lock, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-neutral-800 bg-black/80 backdrop-blur-sm fixed w-full z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Genesis</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-white font-medium px-4 py-2 transition-colors"
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white hover:bg-gray-200 text-black px-5 py-2 rounded-lg font-bold transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 sm:px-12 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 text-white">
          Compliance & Supply Chain Verification
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          The open-source SaaS platform for global product inspections, evidence management, and cross-border regulatory compliance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-xl text-lg font-bold transition-colors"
          >
            Start Verification <ArrowRight size={20} />
          </button>
          <button onClick={() => window.location.href="https://github.com/alena-tas12/sih2026"} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors border border-neutral-800">
            View Documentation
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-4 text-white">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Cross-Location Data</h3>
            <p className="text-gray-400">Instantly compare product declarations across global supply chains with automated discrepancy alerts.</p>
          </div>
          
          <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-4 text-white">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Real-time Analytics</h3>
            <p className="text-gray-400">Monitor compliance scores, inspection workflows, and regulatory breaches with live dashboards.</p>
          </div>

          <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-colors">
            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-4 text-white">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Immutable Evidence</h3>
            <p className="text-gray-400">Securely store inspection photos, barcodes, and final decisions with full audit logging.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12 text-center text-gray-500">
        <p>© 2026 Genesis Compliance. Open Source under MIT License.</p>
      </footer>
    </div>
  );
}
