import React, { useState, useMemo } from 'react';
import { PIPELINE_STAGES, VULNERABLE_CODE_SNIPPET, SECURE_CODE_SNIPPET, REPORT_SUMMARY } from './constants';
import { StageStatus, LogEntry } from './types';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import AICopilot from './components/AICopilot';
import MetricsDashboard from './components/MetricsDashboard';
import ThreatFeed from './components/ThreatFeed';
import InfoModal from './components/InfoModal';
import WelcomeScreen from './components/WelcomeScreen';
import SidebarChecklist from './components/SidebarChecklist';
import SimpleTooltip from './components/SimpleTooltip';
import { Play, CheckCircle, Terminal, RefreshCw, ArrowRight, ArrowLeft, Lock, Unlock, BookOpen, ShieldAlert, ShieldCheck, Heart, FileText, Settings, Info, AlertTriangle, CheckSquare, ExternalLink, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState<StageStatus>(StageStatus.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [codeContent, setCodeContent] = useState(VULNERABLE_CODE_SNIPPET);
  const [isSecure, setIsSecure] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'config' | 'details'>('code');

  const currentStage = PIPELINE_STAGES[currentStageIndex];

  // Security Score Calculation
  const securityScore = useMemo(() => {
    let score = 0;
    // Base security fix (Secrets + Input Validation)
    if (isSecure) score += 30;
    
    // Progress bonuses
    const stageWeight = 70 / PIPELINE_STAGES.length;
    // If we passed a stage successfully or are currently running it without error
    score += (currentStageIndex * stageWeight);
    
    if (isSecure && currentStageIndex === PIPELINE_STAGES.length - 1) return 100;

    return Math.min(100, Math.floor(score));
  }, [isSecure, currentStageIndex]);

  const getMaturityLabel = (score: number) => {
    if (score >= 90) return { label: 'Secure', color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500' };
    if (score >= 50) return { label: 'Improving', color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500' };
    return { label: 'Vulnerable', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500' };
  };

  const maturity = getMaturityLabel(securityScore);

  const addLog = (message: string, level: LogEntry['level'] = 'INFO') => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, level }]);
  };

  const clearLogs = () => setLogs([]);

  const handleRunStage = () => {
    setPipelineStatus(StageStatus.RUNNING);
    clearLogs();
    addLog(`Starting stage: ${currentStage.name}...`);
    
    // Simulation Logic
    setTimeout(() => {
        if (currentStage.id === 'code') {
            addLog('Running pre-commit hooks...', 'INFO');
            addLog('Scanning for secrets in git history...', 'INFO');
            if (!isSecure) {
                addLog('CRITICAL: Found hardcoded API Key pattern! (OWASP A07)', 'ERROR');
                addLog('CRITICAL: Potential SQL Injection detected! (OWASP A03)', 'ERROR');
                setPipelineStatus(StageStatus.ERROR);
                return;
            } else {
                addLog('Secret scanning passed.', 'SUCCESS');
                addLog('Linting checks passed.', 'SUCCESS');
            }
        } 
        else if (currentStage.id === 'build') {
            addLog('Installing npm dependencies...', 'INFO');
            addLog('Running SCA (Software Composition Analysis)...', 'INFO');
            addLog('Analyzing package-lock.json...', 'INFO');
            if (!isSecure) {
                addLog('WARN: "express-old-version" has known vulnerabilities.', 'WARN');
                addLog('Dependencies analyzed. No critical CVEs found.', 'SUCCESS');
            } else {
                addLog('Dependencies secure. No CVEs found.', 'SUCCESS');
            }
            addLog('Build artifact created: app-v1.0.0.zip', 'SUCCESS');
        }
        else if (currentStage.id === 'container') {
            addLog('Building Docker Image: app:v1.0.0...', 'INFO');
            addLog('Scanning image layers (Trivy/Clair)...', 'INFO');
            if (!isSecure) {
                addLog('WARN: Base image alpine:3.11 has 2 medium vulnerabilities.', 'WARN');
                addLog('WARN: Running as ROOT user detected in Dockerfile.', 'WARN');
            } else {
                addLog('Base image secure (alpine:latest).', 'SUCCESS');
                addLog('User instruction found: Running as "node" user.', 'SUCCESS');
            }
            addLog('Image pushed to private registry.', 'SUCCESS');
        }
        else if (currentStage.id === 'test') {
            addLog('Initializing SAST scanner (SonarQube)...', 'INFO');
            addLog('Analyzing AST (Abstract Syntax Tree)...', 'INFO');
            if (!isSecure) {
                addLog('SAST FAILED: High severity SQL Injection vulnerability found at line 18.', 'ERROR');
                setPipelineStatus(StageStatus.ERROR);
                return;
            }
            addLog('SAST passed. No vulnerabilities found.', 'SUCCESS');
        }
        else if (currentStage.id === 'compliance') {
            addLog('Checking OPA (Open Policy Agent) rules...', 'INFO');
            addLog('Validating deployment resources...', 'INFO');
            if (!isSecure) {
               addLog('WARN: Deployment missing CPU/Memory limits.', 'WARN'); 
            }
            addLog('Policy Check: No privileged containers allowed. [PASS]', 'SUCCESS');
            addLog('Compliance check complete.', 'SUCCESS');
        }
        else if (currentStage.id === 'deploy') {
            addLog('Reading Terraform configuration...', 'INFO');
            addLog('Validating Kubernetes manifests...', 'INFO');
            addLog('Applying network policies...', 'INFO');
            addLog('Deployment rolled out to staging cluster.', 'SUCCESS');
        }
        else if (currentStage.id === 'monitor') {
            addLog('Attaching runtime security agents...', 'INFO');
            addLog('Simulating user traffic...', 'INFO');
            if (!isSecure) {
                addLog('WARN: Unusual payload detected in HTTP request body.', 'WARN');
                addLog('CRITICAL: SQL Injection pattern matched in DB query logs.', 'ERROR');
                addLog('ALERT: WAF is blocking subsequent requests from IP 192.168.1.55', 'WARN');
                setPipelineStatus(StageStatus.WARNING); 
                return;
            } else {
                addLog('Traffic normal. Latency < 50ms.', 'SUCCESS');
                addLog('WAF active. No threats detected.', 'SUCCESS');
            }
        }

        setPipelineStatus(StageStatus.SUCCESS);
    }, 2500);
  };

  const handleNext = () => {
    if (currentStageIndex < PIPELINE_STAGES.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
      setPipelineStatus(StageStatus.IDLE);
      clearLogs();
    }
  };

  const handlePrev = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
      // We don't necessarily need to reset logs, but setting status to IDLE 
      // allows the user to re-run the previous stage if they want.
      setPipelineStatus(StageStatus.IDLE);
      clearLogs();
    }
  };

  const handleSidebarClick = (index: number) => {
    // Only allow clicking if we've been there or it's the next immediate step
    // Also allow jumping back to any previous stage
    if (index <= currentStageIndex + 1) {
      setCurrentStageIndex(index);
      setPipelineStatus(StageStatus.IDLE);
      clearLogs();
    }
  };

  const handleFixCode = () => {
    setCodeContent(SECURE_CODE_SNIPPET);
    setIsSecure(true);
    setPipelineStatus(StageStatus.IDLE);
    clearLogs();
    addLog('Applied security patch: Parameterized Queries implemented.', 'SUCCESS');
    addLog('Applied security patch: Secrets moved to environment variables.', 'SUCCESS');
  };

  // --- PRINT VIEW ---
  // Comprehensive PDF Report Layout
  const printView = (
    <div className="hidden print:block p-10 bg-white text-black min-h-screen font-sans">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-extrabold text-indigo-900">{REPORT_SUMMARY.title}</h1>
                <p className="text-gray-500 mt-2">Generated via DevSecOps Interactive Visualizer</p>
            </div>
            <div className="text-right">
                <div className="text-sm text-gray-400">Date generated</div>
                <div className="font-bold">{new Date().toLocaleDateString()}</div>
            </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-600 pl-3">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{REPORT_SUMMARY.objective}</p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3">Key Learning Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {REPORT_SUMMARY.outcomes.map((outcome, idx) => (
                        <li key={idx}>{outcome}</li>
                    ))}
                </ul>
            </div>
        </section>

        {/* Scorecard */}
        <section className="mb-10 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-indigo-600 pl-3">Maturity Scorecard</h2>
            <div className="grid grid-cols-2 gap-8">
                <div className="p-6 border rounded-xl bg-white shadow-sm flex flex-col justify-center items-center">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Overall Security Score</span>
                    <div className="text-6xl font-black text-indigo-600 mt-2">{securityScore}%</div>
                    <div className="mt-2 text-lg font-medium text-gray-600">
                        Assessment: <span className={securityScore > 80 ? "text-green-600" : "text-amber-600"}>{maturity.label}</span>
                    </div>
                </div>
                <div className="space-y-4">
                     {/* Simplified breakdown */}
                     <div className="flex justify-between items-center border-b pb-2">
                        <span>Code Security (SAST)</span>
                        <span className="font-bold text-green-600">PASS</span>
                     </div>
                     <div className="flex justify-between items-center border-b pb-2">
                        <span>Dependency Management (SCA)</span>
                        <span className="font-bold text-green-600">PASS</span>
                     </div>
                     <div className="flex justify-between items-center border-b pb-2">
                        <span>Infrastructure Policy (OPA)</span>
                        <span className="font-bold text-green-600">PASS</span>
                     </div>
                     <div className="flex justify-between items-center border-b pb-2">
                        <span>Runtime Protection (WAF)</span>
                        <span className="font-bold text-green-600">PASS</span>
                     </div>
                </div>
            </div>
        </section>

        {/* Tools Stack */}
        <section className="mb-10 page-break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-indigo-600 pl-3">Recommended Tool Stack</h2>
            <div className="grid grid-cols-3 gap-4">
                {PIPELINE_STAGES.map(stage => (
                    stage.recommendedTools && (
                        <div key={stage.id} className="p-4 border rounded bg-gray-50 break-inside-avoid">
                            <h4 className="font-bold text-indigo-700 mb-2 border-b border-gray-200 pb-1">{stage.name}</h4>
                            <ul className="text-xs space-y-2">
                                {stage.recommendedTools.slice(0, 2).map((tool, i) => (
                                    <li key={i}>
                                        <span className="font-bold text-gray-900">{tool.name}</span>
                                        <span className="text-gray-500 block">{tool.category}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}
            </div>
        </section>

        {/* Detailed Compliance Audit */}
        <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-indigo-600 pl-3">Compliance Audit Log</h2>
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-600 border-b-2 border-gray-300">
                    <tr>
                        <th className="p-3">Control ID</th>
                        <th className="p-3">Requirement</th>
                        <th className="p-3">Stage</th>
                        <th className="p-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                     {PIPELINE_STAGES.map(stage => (
                         stage.complianceControls?.map(ctrl => (
                             <tr key={ctrl.id} className="break-inside-avoid">
                                 <td className="p-3 font-mono text-xs">{ctrl.id}</td>
                                 <td className="p-3">{ctrl.name}</td>
                                 <td className="p-3">{stage.name}</td>
                                 <td className="p-3 text-right">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                                         (stage.id === 'code' && !isSecure) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                     }`}>
                                         {(stage.id === 'code' && !isSecure) ? 'NON-COMPLIANT' : 'COMPLIANT'}
                                     </span>
                                 </td>
                             </tr>
                         ))
                     ))}
                </tbody>
            </table>
        </section>

        <div className="mt-12 text-center text-gray-400 text-xs border-t pt-4">
            Report generated by DevSecOps Visualizer • Educational Use Only
        </div>
    </div>
  );

  // --- NORMAL VIEW ---
  return (
    <>
    {printView}
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans print:hidden">
      
      {showWelcome && <WelcomeScreen onStart={() => setShowWelcome(false)} />}

      <InfoModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
        currentStageIndex={currentStageIndex}
        isSecure={isSecure}
      />

      {/* Left Sidebar */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 bg-slate-900 relative">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            DevSecOps<br/>Visualizer
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">Interactive Pipeline Demo</p>
          <button 
            onClick={() => setIsGuideOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold transition-colors border border-indigo-500/20"
          >
            <BookOpen size={14} />
            Read the Guide
          </button>
        </div>

        {/* Security Score Widget */}
        <div className="px-6 pt-6 pb-2">
            <div className={`relative bg-slate-950/50 rounded-xl p-4 border ${maturity.border} overflow-hidden shadow-lg transition-colors duration-500`}>
                <div className="relative z-10 flex justify-between items-end mb-2">
                    <div>
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">Maturity</div>
                        <div className={`text-lg font-bold ${maturity.color} flex items-center gap-1.5`}>
                           {securityScore >= 90 ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                           {maturity.label}
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-200">{securityScore}%</div>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${securityScore}%` }}
                        className={`h-full ${maturity.bg} transition-all duration-700`}
                    />
                </div>
                {/* Ambient Glow */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 ${maturity.bg} opacity-10 rounded-full blur-2xl pointer-events-none transition-colors duration-500`}></div>
            </div>
        </div>

        {/* Stages List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1 custom-scrollbar min-h-[200px]">
          {PIPELINE_STAGES.map((stage, index) => {
             const isActive = index === currentStageIndex;
             const isCompleted = index < currentStageIndex;
             const isError = isActive && pipelineStatus === StageStatus.ERROR;
             const isClickable = index <= currentStageIndex; // Allow clicking back
             
             return (
               <SimpleTooltip key={stage.id} content={stage.description}>
               <div 
                onClick={() => isClickable && handleSidebarClick(index)}
                className={`mx-3 px-3 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 
                    ${isActive ? (isError ? 'bg-red-500/10 border border-red-500/50' : 'bg-indigo-500/10 border border-indigo-500/50') : isClickable ? 'hover:bg-slate-800 border border-transparent opacity-70 hover:opacity-100 cursor-pointer' : 'border border-transparent opacity-40 cursor-not-allowed'}
                    ${isError ? 'animate-pulse' : ''}
               `}>
                 <div className={`p-2 rounded-lg ${isActive ? (isError ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20') : 'bg-slate-800 text-slate-400'}`}>
                    {stage.icon}
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{stage.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {isActive && pipelineStatus === StageStatus.RUNNING && <span className="text-[10px] text-blue-400 animate-pulse flex items-center gap-1">Processing...</span>}
                      {isActive && pipelineStatus === StageStatus.ERROR && <span className="text-[10px] text-red-400 font-bold">Detection Failed</span>}
                      {isActive && pipelineStatus === StageStatus.WARNING && <span className="text-[10px] text-amber-400 font-bold">Warning</span>}
                      {(isCompleted || (isActive && pipelineStatus === StageStatus.SUCCESS)) && <span className="text-[10px] text-emerald-400 font-bold">Completed</span>}
                    </div>
                 </div>
                 {isCompleted && <CheckCircle size={14} className="text-emerald-500" />}
                 {isError && <AlertTriangle size={14} className="text-red-500" />}
               </div>
               </SimpleTooltip>
             )
          })}
        </div>
        
        {/* Live Checklist Component (Sidebar Bottom) */}
        <div className="h-48 border-t border-slate-800 bg-slate-900">
             <SidebarChecklist currentStageIndex={currentStageIndex} isSecure={isSecure} />
        </div>

        {/* Reset Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
            <button 
                onClick={() => {
                    setCurrentStageIndex(0);
                    setPipelineStatus(StageStatus.IDLE);
                    setIsSecure(false);
                    setCodeContent(VULNERABLE_CODE_SNIPPET);
                    clearLogs();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:border-slate-600"
            >
                <RefreshCw size={14} />
                Reset Simulation
            </button>
             <div className="text-[10px] text-center text-slate-500 mt-2">
              <span className="flex items-center justify-center gap-1">Built with <Heart size={10} className="text-red-500 fill-red-500" /> by <strong className="text-slate-400">Purushotham Muktha</strong></span>
           </div>
        </div>
      </div>

      {/* Center: Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative z-0">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
            <h2 className="text-lg font-medium text-white flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-700">{currentStageIndex + 1}</span>
                <span className="text-slate-200">{currentStage.name}</span>
            </h2>
            <div className="flex gap-3">
                {currentStageIndex > 0 && (
                     <button 
                        onClick={handlePrev} 
                        disabled={pipelineStatus === StageStatus.RUNNING}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <ArrowLeft size={16} /> Previous
                     </button>
                )}

                {pipelineStatus === StageStatus.RUNNING ? (
                    <button disabled className="px-5 py-2 bg-slate-800 text-slate-400 rounded-lg text-sm font-medium border border-slate-700 cursor-not-allowed flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <RefreshCw size={14} />
                        </motion.div>
                        Running Analysis...
                    </button>
                ) : pipelineStatus === StageStatus.ERROR ? (
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-red-400 font-bold px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">Critical Security Failure</span>
                        <button onClick={handleRunStage} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border border-slate-600">
                             <RefreshCw size={14} /> Retry
                        </button>
                    </div>
                ) : pipelineStatus === StageStatus.SUCCESS || pipelineStatus === StageStatus.WARNING ? (
                     <button 
                        onClick={handleNext} 
                        disabled={currentStageIndex === PIPELINE_STAGES.length - 1}
                        className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${currentStageIndex === PIPELINE_STAGES.length - 1 ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'}`}
                     >
                        Next Stage <ArrowRight size={16} />
                     </button>
                ) : (
                    <button onClick={handleRunStage} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                        <Play size={16} fill="currentColor" /> Run {currentStage.id === 'monitor' ? 'Simulation' : 'Stage'}
                    </button>
                )}
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8 pb-20">
            
            {/* Architecture Visualization */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs uppercase text-slate-500 font-bold tracking-widest">Live Architecture</h3>
                  {isSecure && <span className="text-xs text-emerald-400 flex items-center gap-1"><Lock size={12}/> Environment Secured</span>}
                  {!isSecure && <span className="text-xs text-amber-400 flex items-center gap-1"><Unlock size={12}/> Vulnerabilities Present</span>}
                </div>
                <ArchitectureDiagram activeStageId={currentStage.id} pipelineStatus={pipelineStatus} isSecure={isSecure} />
            </section>

            {/* Stage Specific Interactive Area */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Panel 1: Multi-Tab View */}
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                            <button 
                                onClick={() => setActiveTab('code')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <FileText size={12} /> Source / Config
                            </button>
                            <button 
                                onClick={() => setActiveTab('config')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${activeTab === 'config' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Settings size={12} /> CI Pipeline
                            </button>
                            <button 
                                onClick={() => setActiveTab('details')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${activeTab === 'details' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Info size={12} /> Tools & Details
                            </button>
                        </div>

                        {currentStage.id === 'code' && (
                             <button 
                                onClick={handleFixCode}
                                disabled={isSecure}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 font-medium ${isSecure ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-default' : 'bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20 hover:scale-105 active:scale-95'}`}
                             >
                                {isSecure ? <Lock size={12} /> : <Unlock size={12} />}
                                {isSecure ? 'Code Secured' : 'Auto-Fix Vulnerabilities'}
                             </button>
                        )}
                    </div>
                    
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden min-h-[350px] relative shadow-lg">
                        {/* VIEW: SOURCE / MONITOR */}
                        {activeTab === 'code' && (
                            currentStage.id === 'monitor' ? (
                                <div className="flex flex-col h-full p-4 space-y-4">
                                    <MetricsDashboard />
                                    <ThreatFeed 
                                        isSecure={isSecure} 
                                        active={pipelineStatus === StageStatus.RUNNING || pipelineStatus === StageStatus.WARNING || pipelineStatus === StageStatus.SUCCESS} 
                                    />
                                </div>
                            ) : (
                                <div className="relative h-full flex flex-col">
                                    <div className="h-9 bg-slate-950 border-b border-slate-800 flex items-center px-4 gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                        </div>
                                        <span className="ml-3 text-xs text-slate-500 font-mono">auth_service.js</span>
                                    </div>
                                    <div className="flex-1 relative overflow-hidden bg-slate-900/50">
                                        <pre className="p-4 text-xs sm:text-sm font-mono text-slate-300 overflow-auto h-full custom-scrollbar leading-relaxed">
                                            <code>{codeContent}</code>
                                        </pre>
                                        
                                        {/* Vulnerability Highlights Overlay */}
                                        {!isSecure && currentStage.id === 'code' && (
                                            <>
                                            <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute top-[280px] left-4 right-4 bg-red-500/10 border-l-2 border-red-500 p-1 pointer-events-none"
                                            >
                                                <div className="absolute right-0 -top-4 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">SQL Injection</div>
                                            </motion.div>
                                            <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="absolute top-[160px] left-4 right-4 bg-amber-500/10 border-l-2 border-amber-500 p-1 pointer-events-none"
                                            >
                                                <div className="absolute right-0 -top-4 bg-amber-500 text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded">Hardcoded Secrets</div>
                                            </motion.div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        )}

                        {/* VIEW: CI CONFIG */}
                        {activeTab === 'config' && (
                            <div className="relative h-full flex flex-col">
                                <div className="h-9 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between">
                                    <span className="text-xs text-indigo-400 font-mono">.github/workflows/pipeline.yaml</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">CI Configuration</span>
                                </div>
                                <div className="flex-1 p-4 bg-slate-900/50 overflow-auto custom-scrollbar">
                                    <pre className="font-mono text-xs text-blue-200">
                                        {currentStage.ciConfig || "# No CI configuration available for this stage."}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* VIEW: DETAILS / COMPLIANCE / TOOLS */}
                        {activeTab === 'details' && (
                            <div className="h-full p-6 bg-slate-900/50 overflow-y-auto custom-scrollbar">
                                <h3 className="text-lg font-bold text-white mb-2">{currentStage.name}</h3>
                                <p className="text-sm text-slate-300 leading-relaxed mb-6 border-b border-slate-800 pb-4">
                                    {currentStage.details}
                                </p>

                                {/* Recommended Tools Section */}
                                {currentStage.recommendedTools && (
                                    <div className="mb-6">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Wrench size={14} /> Industry Standard Tools
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {currentStage.recommendedTools.map((tool, idx) => (
                                                <div key={idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-xs font-bold text-white">{tool.name}</span>
                                                        <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{tool.category}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-1">{tool.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Compliance Controls Section */}
                                {currentStage.complianceControls && currentStage.complianceControls.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <CheckSquare size={14} /> Stage Compliance Controls
                                        </h4>
                                        <div className="space-y-3">
                                            {currentStage.complianceControls.map((ctrl) => (
                                                <div key={ctrl.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-bold text-slate-200">{ctrl.id}: {ctrl.name}</span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                            (currentStage.id === 'code' && !isSecure) || (currentStage.id === 'compliance' && !isSecure && ctrl.id === 'C-09') // Mock logic for specific failures
                                                            ? 'bg-red-500/20 text-red-400' 
                                                            : 'bg-emerald-500/20 text-emerald-400'
                                                        }`}>
                                                            {(currentStage.id === 'code' && !isSecure) ? 'FAIL' : 'PASS'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400">{ctrl.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Panel 2: Terminal / Logs */}
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    <h3 className="text-xs uppercase text-slate-500 font-bold tracking-widest">CI/CD Pipeline Logs</h3>
                    <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs h-[350px] overflow-y-auto shadow-inner custom-scrollbar relative">
                         {/* Terminal Header */}
                         <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900/80 border-b border-slate-800 flex items-center px-4 sticky z-10 backdrop-blur-sm">
                             <span className="text-slate-500 flex items-center gap-2"><Terminal size={12}/> runner-1.2.0</span>
                         </div>
                         <div className="mt-8 space-y-2 pb-4">
                            {logs.length === 0 && (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-700">
                                    <Terminal size={40} className="mb-3 opacity-20" />
                                    <p>Waiting for pipeline trigger...</p>
                                </div>
                            )}
                            {logs.map((log, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`font-mono border-l-2 pl-2 py-0.5 ${
                                        log.level === 'ERROR' ? 'border-red-500 text-red-400 bg-red-500/5' :
                                        log.level === 'SUCCESS' ? 'border-emerald-500 text-emerald-400' :
                                        log.level === 'WARN' ? 'border-amber-500 text-amber-400' : 'border-slate-700 text-slate-300'
                                    }`}
                                >
                                    <span className="opacity-40 mr-3 text-[10px]">{log.timestamp}</span>
                                    {log.message}
                                </motion.div>
                            ))}
                            {pipelineStatus === StageStatus.RUNNING && (
                                <motion.div 
                                    animate={{ opacity: [0, 1, 0] }} 
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-2 h-4 bg-indigo-500 inline-block align-middle ml-1" 
                                />
                            )}
                         </div>
                    </div>
                </div>

            </section>
        </div>
      </div>

      {/* Right Sidebar: AI Copilot */}
      <AICopilot currentStage={currentStage} isSimulating={pipelineStatus === StageStatus.RUNNING} />
      
    </div>
    </>
  );
};

export default App;