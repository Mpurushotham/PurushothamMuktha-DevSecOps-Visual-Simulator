const { useState, useMemo, useEffect } = React;

// Icons - We'll use simple text or emojis for now
const Icons = {
    Code: '💻', Box: '📦', ShieldCheck: '🛡️', Rocket: '🚀', Activity: '📊',
    Play: '▶️', CheckCircle: '✅', Terminal: '💻', RefreshCw: '🔄', 
    ArrowRight: '→', Lock: '🔒', Unlock: '🔓', BookOpen: '📚',
    ShieldAlert: '⚠️', Shield: '🛡️', Bot: '🤖', Sparkles: '✨',
    Loader2: '⏳', AlertTriangle: '⚠️', Server: '🖥️', Database: '💾',
    Globe: '🌐', Users: '👥', Cloud: '☁️', UserX: '👤', Bug: '🐛',
    FileJson: '📄', Search: '🔍', X: '✖️', ChevronRight: '›'
};

// Constants
const PIPELINE_STAGES = [
    {
        id: 'code',
        name: 'Code & Commit',
        description: 'Developer commits code. Pre-commit hooks run secret scanning.',
        icon: Icons.Code,
        status: 'IDLE'
    },
    {
        id: 'build',
        name: 'Build & SCA',
        description: 'Compile artifacts. Software Composition Analysis checks dependencies.',
        icon: Icons.Box,
        status: 'IDLE'
    },
    {
        id: 'test',
        name: 'Test (SAST)',
        description: 'Static Analysis Security Testing scans source code for flaws.',
        icon: Icons.ShieldCheck,
        status: 'IDLE'
    },
    {
        id: 'deploy',
        name: 'Deploy (IaC)',
        description: 'Infrastructure as Code deployment to staging/production clusters.',
        icon: Icons.Rocket,
        status: 'IDLE'
    },
    {
        id: 'monitor',
        name: 'Monitor (DAST)',
        description: 'Runtime monitoring and Dynamic Analysis.',
        icon: Icons.Activity,
        status: 'IDLE'
    }
];

const VULNERABLE_CODE_SNIPPET = `// VULNERABLE CODE - SQL Injection & Hardcoded Secrets
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // SQL Injection vulnerability
  const query = "SELECT * FROM users WHERE user = '" + username + "'";
  db.query(query, (err, user) => {
    if (user) {
      // Hardcoded secret
      const apiKey = "SECRET-12345";
      res.json({ token: apiKey });
    }
  });
});`;

const SECURE_CODE_SNIPPET = `// SECURE CODE - Parameterized Queries & Environment Vars
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Parameterized query prevents SQL injection
  const query = "SELECT * FROM users WHERE user = ?";
  db.query(query, [username], (err, user) => {
    if (user) {
      // Secret from environment variable
      const apiKey = process.env.API_KEY;
      res.json({ token: apiKey });
    }
  });
});`;

const StageStatus = {
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

// Main App Component
function DevSecOpsApp() {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [pipelineStatus, setPipelineStatus] = useState(StageStatus.IDLE);
    const [logs, setLogs] = useState([]);
    const [codeContent, setCodeContent] = useState(VULNERABLE_CODE_SNIPPET);
    const [isSecure, setIsSecure] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const currentStage = PIPELINE_STAGES[currentStageIndex];

    // Security Score Calculation
    const securityScore = useMemo(() => {
        let score = 0;
        if (isSecure) score += 40;
        if (currentStageIndex >= 1) score += 15;
        if (currentStageIndex >= 2) score += 15;
        if (currentStageIndex >= 3) score += 15;
        if (currentStageIndex >= 4) score += 15;
        return Math.min(100, score);
    }, [isSecure, currentStageIndex]);

    const getMaturityLabel = (score) => {
        if (score >= 80) return { label: 'Secure', color: 'text-green-400', bg: 'bg-green-500' };
        if (score >= 40) return { label: 'Improving', color: 'text-yellow-400', bg: 'bg-yellow-500' };
        return { label: 'Vulnerable', color: 'text-red-400', bg: 'bg-red-500' };
    };

    const maturity = getMaturityLabel(securityScore);

    const addLog = (message, level = 'INFO') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { timestamp, message, level }]);
    };

    const clearLogs = () => setLogs([]);

    const handleRunStage = () => {
        setPipelineStatus(StageStatus.RUNNING);
        clearLogs();
        addLog(`Starting stage: ${currentStage.name}...`);
        
        setTimeout(() => {
            if (currentStage.id === 'code') {
                addLog('Running pre-commit hooks...');
                addLog('Scanning for secrets...');
                if (!isSecure) {
                    addLog('CRITICAL: Hardcoded API Key found!', 'ERROR');
                    addLog('CRITICAL: SQL Injection vulnerability!', 'ERROR');
                    setPipelineStatus(StageStatus.ERROR);
                    return;
                } else {
                    addLog('Secret scanning passed.', 'SUCCESS');
                }
            } 
            else if (currentStage.id === 'build') {
                addLog('Installing dependencies...');
                addLog('Running SCA analysis...');
                addLog('Dependencies secure.', 'SUCCESS');
            }
            else if (currentStage.id === 'test') {
                addLog('Running SAST scanner...');
                if (!isSecure) {
                    addLog('SAST FAILED: SQL Injection found.', 'ERROR');
                    setPipelineStatus(StageStatus.ERROR);
                    return;
                }
                addLog('SAST passed. No vulnerabilities.', 'SUCCESS');
            }
            else if (currentStage.id === 'deploy') {
                addLog('Deploying to staging...');
                addLog('Infrastructure secured.', 'SUCCESS');
            }
            else if (currentStage.id === 'monitor') {
                addLog('Starting runtime monitoring...');
                if (!isSecure) {
                    addLog('WARNING: Suspicious activity detected.', 'ERROR');
                    setPipelineStatus(StageStatus.ERROR);
                    return;
                }
                addLog('Monitoring active. All systems secure.', 'SUCCESS');
            }

            setPipelineStatus(StageStatus.SUCCESS);
        }, 2000);
    };

    const handleNext = () => {
        if (currentStageIndex < PIPELINE_STAGES.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
            setPipelineStatus(StageStatus.IDLE);
            clearLogs();
        }
    };

    const handleFixCode = () => {
        setCodeContent(SECURE_CODE_SNIPPET);
        setIsSecure(true);
        setPipelineStatus(StageStatus.IDLE);
        clearLogs();
        addLog('Applied security patches.', 'SUCCESS');
        addLog('SQL Injection vulnerabilities fixed.', 'SUCCESS');
    };

    const handleReset = () => {
        setCurrentStageIndex(0);
        setPipelineStatus(StageStatus.IDLE);
        setIsSecure(false);
        setCodeContent(VULNERABLE_CODE_SNIPPET);
        clearLogs();
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            {/* Sidebar */}
            <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold text-blue-400">DevSecOps Visualizer</h1>
                    <p className="text-sm text-slate-400 mt-2">Interactive Pipeline Demo</p>
                    <button 
                        onClick={() => setIsGuideOpen(true)}
                        className="mt-4 w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 rounded text-sm"
                    >
                        {Icons.BookOpen} Security Guide
                    </button>
                </div>

                {/* Security Score */}
                <div className="p-6">
                    <div className="bg-slate-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-slate-300">Security Score</div>
                            <div className="text-2xl font-bold">{securityScore}%</div>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${maturity.bg} transition-all duration-500`}
                                style={{ width: `${securityScore}%` }}
                            ></div>
                        </div>
                        <div className="text-sm mt-2 text-center">{maturity.label}</div>
                    </div>
                </div>

                {/* Pipeline Stages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {PIPELINE_STAGES.map((stage, index) => {
                        const isActive = index === currentStageIndex;
                        const isCompleted = index < currentStageIndex;
                        
                        return (
                            <div 
                                key={stage.id}
                                className={`p-3 rounded-lg flex items-center gap-3 ${
                                    isActive ? 'bg-blue-500/20 border border-blue-500' : 'bg-slate-700'
                                }`}
                            >
                                <div className={`p-2 rounded ${
                                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'
                                }`}>
                                    {stage.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{stage.name}</div>
                                    <div className="text-xs text-slate-400">
                                        {isActive && pipelineStatus === StageStatus.RUNNING && 'Running...'}
                                        {isActive && pipelineStatus === StageStatus.ERROR && 'Failed'}
                                        {(isCompleted || (isActive && pipelineStatus === StageStatus.SUCCESS)) && 'Completed'}
                                    </div>
                                </div>
                                {isCompleted && <span>{Icons.CheckCircle}</span>}
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-700">
                    <button 
                        onClick={handleReset}
                        className="w-full py-2 px-3 bg-slate-600 hover:bg-slate-500 rounded text-sm"
                    >
                        {Icons.RefreshCw} Reset Simulation
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-8">
                    <h2 className="text-lg font-medium flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-sm">
                            {currentStageIndex + 1}
                        </span>
                        {currentStage.name}
                    </h2>
                    <div className="flex gap-3">
                        {pipelineStatus === StageStatus.RUNNING ? (
                            <button disabled className="px-5 py-2 bg-slate-700 text-slate-400 rounded text-sm">
                                {Icons.Loader2} Running...
                            </button>
                        ) : pipelineStatus === StageStatus.SUCCESS ? (
                            <button 
                                onClick={handleNext}
                                disabled={currentStageIndex === PIPELINE_STAGES.length - 1}
                                className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded text-sm"
                            >
                                Next Stage {Icons.ArrowRight}
                            </button>
                        ) : (
                            <button 
                                onClick={handleRunStage}
                                className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded text-sm"
                            >
                                {Icons.Play} Run Pipeline
                            </button>
                        )}
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Code Panel */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-slate-400">Source Code</h3>
                                {currentStage.id === 'code' && (
                                    <button 
                                        onClick={handleFixCode}
                                        disabled={isSecure}
                                        className={`px-3 py-1 rounded text-xs ${
                                            isSecure ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                        }`}
                                    >
                                        {isSecure ? Icons.Lock : Icons.Unlock}
                                        {isSecure ? ' Secured' : ' Fix Vulnerabilities'}
                                    </button>
                                )}
                            </div>
                            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                                <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 text-sm font-mono">
                                    auth_service.js
                                </div>
                                <pre className="p-4 text-sm font-mono text-slate-300 overflow-auto max-h-80">
                                    <code>{codeContent}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Logs Panel */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-400">Pipeline Logs</h3>
                            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden h-80">
                                <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 text-sm">
                                    {Icons.Terminal} CI/CD Runner
                                </div>
                                <div className="p-4 font-mono text-sm overflow-y-auto h-64">
                                    {logs.length === 0 ? (
                                        <div className="text-slate-500 text-center py-8">
                                            Waiting for pipeline to start...
                                        </div>
                                    ) : (
                                        logs.map((log, i) => (
                                            <div 
                                                key={i}
                                                className={`border-l-2 pl-2 py-1 ${
                                                    log.level === 'ERROR' ? 'border-red-500 text-red-400' :
                                                    log.level === 'SUCCESS' ? 'border-green-500 text-green-400' :
                                                    'border-slate-600 text-slate-300'
                                                }`}
                                            >
                                                <span className="text-slate-500 text-xs mr-2">{log.timestamp}</span>
                                                {log.message}
                                            </div>
                                        ))
                                    )}
                                    {pipelineStatus === StageStatus.RUNNING && (
                                        <div className="text-blue-400 animate-pulse">Processing...</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Architecture Diagram Placeholder */}
                    <div className="mt-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-400 mb-4">Architecture Overview</h3>
                        <div className="flex justify-between items-center text-center">
                            <div className="p-4 border border-slate-600 rounded">
                                <div className="text-2xl mb-2">{Icons.Globe}</div>
                                <div className="text-sm">Client</div>
                            </div>
                            <div className="text-slate-500">→</div>
                            <div className="p-4 border border-slate-600 rounded">
                                <div className="text-2xl mb-2">{Icons.Server}</div>
                                <div className="text-sm">API Server</div>
                            </div>
                            <div className="text-slate-500">→</div>
                            <div className="p-4 border border-slate-600 rounded">
                                <div className="text-2xl mb-2">{Icons.Database}</div>
                                <div className="text-sm">Database</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Guide Modal */}
            {isGuideOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">DevSecOps Guide</h2>
                            <button 
                                onClick={() => setIsGuideOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                {Icons.X}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p>This interactive demo shows how security is integrated throughout the CI/CD pipeline.</p>
                            <div className="bg-slate-700 p-4 rounded">
                                <h3 className="font-semibold mb-2">Current Stage: {currentStage.name}</h3>
                                <p className="text-sm text-slate-300">{currentStage.description}</p>
                            </div>
                            <div className="bg-slate-700 p-4 rounded">
                                <h3 className="font-semibold mb-2">Security Status</h3>
                                <p className="text-sm text-slate-300">
                                    {isSecure ? 'All security measures implemented' : 'Vulnerabilities detected - click "Fix Vulnerabilities"'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DevSecOpsApp />);
