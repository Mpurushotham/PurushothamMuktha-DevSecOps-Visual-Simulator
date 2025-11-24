import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Server, Lock, Zap, PlayCircle } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Panel: Hero */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-900 to-slate-900 p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">DevSecOps<br/>Interactive Lab</h1>
              <p className="text-indigo-200 text-sm font-medium">Master the Art of Secure Delivery</p>
            </div>
            
            <div className="relative z-10 mt-8">
              <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold mb-2">Built By</p>
              <div className="font-semibold text-white">Purushotham Muktha</div>
              <div className="text-[10px] text-indigo-300 flex items-center gap-1 mt-1">
                 Powered by Google Gemini
              </div>
            </div>

            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          </div>

          {/* Right Panel: Content */}
          <div className="flex-1 p-8 md:p-10 bg-slate-900">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Why is this important?</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-slate-800 rounded-lg h-fit text-emerald-400 border border-slate-700">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-slate-200 font-semibold mb-1">Shift Left Security</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Learn how to integrate security checks early in the CI/CD pipeline, fixing vulnerabilities 
                    before they cost millions to remediate in production.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-slate-800 rounded-lg h-fit text-blue-400 border border-slate-700">
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="text-slate-200 font-semibold mb-1">Full Architecture Simulation</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Visualize the complete journey of code: from a developer's IDE, through Docker containers, 
                    policy checks, and finally to a live Kubernetes cluster.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-slate-800 rounded-lg h-fit text-amber-400 border border-slate-700">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-slate-200 font-semibold mb-1">Real-time Attack Scenarios</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Witness live SQL Injection and XSS attacks on vulnerable code, then apply fixes 
                    to see the defense mechanisms in action.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlayCircle size={20} />
              Start Interactive Lab
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomeScreen;
