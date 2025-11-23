// Add these imports at the top
const { useState, useMemo, useEffect } = React;

// Remove duplicate style section and keep only one
<style>
    body {
        font-family: 'Inter', sans-serif;
        background-color: #0f172a;
        color: #e2e8f0;
        margin: 0;
        padding: 0;
    }
    .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #334155;
        border-top: 4px solid #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* NEW ANIMATIONS ADDED BELOW */
    @keyframes scan {
        0% { left: -10%; }
        100% { left: 110%; }
    }
    @keyframes moveRight {
        0% { left: 0%; opacity: 0; }
        50% { opacity: 1; }
        100% { left: 100%; opacity: 0; }
    }
    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 5px currentColor; }
        50% { box-shadow: 0 0 20px currentColor; }
    }
    .animate-scan {
        animation: scan 2s linear infinite;
    }
    .animate-move-right {
        animation: moveRight 1.5s linear infinite;
    }
    .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
    }
</style>

// Your existing constants and components continue here...
// [Rest of your code - PIPELINE_STAGES, VULNERABLE_CODE_SNIPPET, etc.]


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

// ENHANCED GUIDE CONTENT - ADD THIS AFTER EXISTING CONSTANTS
const GUIDE_CONTENT = [
    {
        id: 'intro',
        title: 'Introduction to DevSecOps',
        icon: Icons.BookOpen,
        content: {
            heading: "What is DevSecOps?",
            subheading: "Security as a Shared Responsibility",
            text: "DevSecOps integrates security practices within the DevOps process. It creates a 'Security as Code' culture with collaboration between release engineers and security teams.",
            points: [
                "Security becomes everyone's responsibility, not just the security team",
                "Automated security checks are embedded in the development workflow",
                "Continuous security feedback enables rapid remediation",
                "Security shifts left to earlier stages of development"
            ]
        }
    },
    {
        id: 'pipeline',
        title: 'Pipeline Stages',
        icon: Icons.Activity,
        content: {
            heading: "5-Stage DevSecOps Pipeline",
            subheading: "Security at Every Step",
            text: "Each stage in the CI/CD pipeline incorporates specific security checks and tools to ensure comprehensive coverage.",
            stages: PIPELINE_STAGES.map(stage => ({
                name: stage.name,
                description: stage.description,
                securityTools: ['SAST Tools', 'Secret Detection', 'Code Analysis'],
                risks: ['SQL Injection', 'XSS', 'Hardcoded Secrets']
            }))
        }
    },
    {
        id: 'vulnerabilities',
        title: 'Common Vulnerabilities',
        icon: Icons.ShieldAlert,
        content: {
            heading: "OWASP Top 10 Security Risks",
            subheading: "Understanding Common Attack Vectors",
            text: "The Open Web Application Security Project (OWASP) Top 10 represents the most critical security risks to web applications.",
            vulnerabilities: [
                {
                    id: 'A03',
                    name: 'Injection',
                    description: 'Untrusted data is sent to an interpreter as part of a command or query.',
                    example: 'SQL Injection, NoSQL Injection, OS Command Injection',
                    prevention: 'Use parameterized queries, input validation, stored procedures'
                },
                {
                    id: 'A07',
                    name: 'Identification and Authentication Failures',
                    description: 'Confirmation of user identity and session management is done incorrectly.',
                    example: 'Weak passwords, session fixation, hardcoded credentials',
                    prevention: 'Multi-factor authentication, strong password policies, secure session management'
                }
            ]
        }
    },
    {
        id: 'checklist',
        title: 'Security Checklist',
        icon: Icons.CheckCircle,
        content: {
            heading: "DevSecOps Maturity Checklist",
            subheading: "Track Your Security Progress",
            text: "Use this checklist to assess and improve your DevSecOps maturity level. Each item represents a key security control."
        }
    }
];
const StageStatus = {
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

// ARCHITECTURE DIAGRAM COMPONENT - ADD THIS BEFORE DevSecOpsApp FUNCTION
function ArchitectureDiagram({ activeStageId, pipelineStatus, isSecure }) {
    const isScanning = pipelineStatus === 'RUNNING' && ['code', 'build', 'test'].includes(activeStageId);
    const isRuntime = ['deploy', 'monitor'].includes(activeStageId);
    const showAttack = activeStageId === 'monitor' && !isSecure;
    const isVulnerableState = !isSecure && (activeStageId === 'code' || activeStageId === 'test' || activeStageId === 'monitor');

    const getNodeState = (nodeType) => {
        if (pipelineStatus === 'ERROR') return 'border-red-500 bg-red-900/20 text-red-400';
        if (!isSecure) {
            if (nodeType === 'api' && activeStageId === 'code') return 'border-yellow-500 bg-yellow-500/10 text-yellow-400 animate-pulse';
            if (nodeType === 'api' && activeStageId === 'test') return 'border-red-500 bg-red-500/10 text-red-400';
            if (nodeType === 'db' && activeStageId === 'monitor') return 'border-red-500 bg-red-500/10 text-red-400';
        }
        if (isSecure && pipelineStatus === 'SUCCESS') return 'border-green-500 bg-green-500/10 text-green-400';
        return 'border-slate-600 bg-slate-800/60 text-slate-400';
    };

    return (
        <div className={`relative w-full h-64 bg-slate-900 rounded-lg border-2 overflow-hidden flex items-center justify-center mb-6 transition-colors duration-500 ${
            isVulnerableState ? 'border-red-500/30' : 'border-slate-700'
        }`}>
            
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
            
            {/* Scanning Animation */}
            {isScanning && (
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-1 bg-blue-500" 
                         style={{
                             animation: 'scan 2s linear infinite',
                             left: '0%'
                         }}></div>
                </div>
            )}

            {/* Main Architecture Layout */}
            <div className="relative z-10 flex items-center justify-between w-full px-8">
                
                {/* Client Node */}
                <div className="text-center">
                    <div className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${getNodeState('frontend')}`}>
                        <div className="text-xl">{Icons.Globe}</div>
                        <div className="text-xs mt-1">Client</div>
                    </div>
                    {isRuntime && (
                        <div className={`mt-2 text-xs ${isSecure ? 'text-green-400' : 'text-slate-500'}`}>
                            {isSecure ? Icons.Lock : Icons.Unlock} HTTPS
                        </div>
                    )}
                </div>

                {/* Connection with WAF */}
                <div className="flex-1 relative h-1 bg-slate-600 mx-4">
                    {/* Data Flow Animation */}
                    {isRuntime && (
                        <div className={`absolute w-3 h-1 rounded ${isSecure ? 'bg-blue-400' : 'bg-slate-500'}`}
                             style={{ animation: 'moveRight 1.5s linear infinite' }}></div>
                    )}
                    
                    {/* WAF Shield */}
                    <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        isRuntime && isSecure ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-slate-600 text-slate-600'
                    }`}>
                        {Icons.Shield}
                    </div>
                </div>

                {/* API Server Node */}
                <div className="text-center relative">
                    {/* Attack Animation */}
                    {showAttack && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <div className="text-red-500 text-sm">{Icons.AlertTriangle}</div>
                            <div className="text-xs text-red-400">Attack!</div>
                        </div>
                    )}
                    
                    <div className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${getNodeState('api')}`}>
                        <div className="text-2xl">{Icons.Server}</div>
                        <div className="text-xs mt-1">API Server</div>
                        {isScanning && (
                            <div className="absolute -top-1 -right-1 text-blue-400" style={{ animation: 'spin 1s linear infinite' }}>
                                {Icons.Search}
                            </div>
                        )}
                    </div>

                    {/* Vulnerability Badges */}
                    {!isSecure && activeStageId === 'code' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs animate-pulse">
                            {Icons.FileJson}
                        </div>
                    )}
                    {!isSecure && activeStageId === 'test' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
                            {Icons.Bug}
                        </div>
                    )}
                </div>

                {/* Connection to DB */}
                <div className="flex-1 relative h-1 bg-slate-600 mx-4">
                    {/* Database Traffic */}
                    {isRuntime && (
                        <div className={`absolute w-2 h-2 rounded-full ${isSecure ? 'bg-green-400' : 'bg-slate-500'}`}
                             style={{ animation: 'moveRight 2s linear infinite', animationDelay: '0.5s' }}></div>
                    )}
                    
                    {/* Malicious Payload */}
                    {showAttack && (
                        <div className="absolute w-3 h-3 bg-red-500 rotate-45"
                             style={{ animation: 'moveRight 1s linear infinite' }}></div>
                    )}
                </div>

                {/* Database Node */}
                <div className="text-center">
                    <div className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${getNodeState('db')}`}>
                        <div className="text-xl">{Icons.Database}</div>
                        <div className="text-xs mt-1">Database</div>
                    </div>
                    
                    {/* Intrusion Alert */}
                    {showAttack && (
                        <div className="mt-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400 animate-pulse">
                            SQL Injection!
                        </div>
                    )}
                </div>
            </div>

            {/* Stage Description */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-slate-800/80 border border-slate-600 rounded-full px-4 py-2 flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isVulnerableState ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {PIPELINE_STAGES.find(s => s.id === activeStageId)?.icon}
                    </div>
                    <div className="text-sm">
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                            {PIPELINE_STAGES.find(s => s.id === activeStageId)?.name}
                        </div>
                        <div className="text-slate-200">
                            {PIPELINE_STAGES.find(s => s.id === activeStageId)?.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
// ENHANCED GUIDE MODAL COMPONENT - ADD THIS AFTER ArchitectureDiagram BUT BEFORE DevSecOpsApp
function GuideModal({ isOpen, onClose, currentStageIndex, isSecure, securityScore }) {
    const [activeTab, setActiveTab] = useState('intro');
    
    if (!isOpen) return null;

    const activeContent = GUIDE_CONTENT.find(item => item.id === activeTab)?.content;
    const currentStage = PIPELINE_STAGES[currentStageIndex];

    // Dynamic checklist based on current state
    const dynamicChecklist = [
        {
            id: 1,
            title: "Secret Management (OWASP A07)",
            description: "Secrets removed from source code and managed via environment variables",
            met: isSecure,
            stage: "Code"
        },
        {
            id: 2,
            title: "Input Validation (OWASP A03)",
            description: "Parameterized queries implemented to prevent SQL injection",
            met: isSecure,
            stage: "Code"
        },
        {
            id: 3,
            title: "Dependency Scanning (SCA)",
            description: "Automated analysis of third-party libraries for known CVEs",
            met: currentStageIndex >= 1,
            stage: "Build"
        },
        {
            id: 4,
            title: "Static Analysis (SAST)",
            description: "Source code scanned for vulnerabilities before deployment",
            met: currentStageIndex >= 2,
            stage: "Test"
        },
        {
            id: 5,
            title: "Infrastructure Security",
            description: "Infrastructure as Code validated and scanned for misconfigurations",
            met: currentStageIndex >= 3,
            stage: "Deploy"
        },
        {
            id: 6,
            title: "Runtime Protection",
            description: "WAF and monitoring implemented for production environment",
            met: currentStageIndex >= 4,
            stage: "Monitor"
        }
    ];

    const completedItems = dynamicChecklist.filter(item => item.met).length;
    const totalItems = dynamicChecklist.length;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-600 max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
                
                {/* Sidebar Navigation */}
                <div className="w-64 bg-slate-900 border-r border-slate-700 p-4 overflow-y-auto">
                    <div className="flex items-center gap-2 text-blue-400 mb-6">
                        <span className="text-lg">{Icons.BookOpen}</span>
                        <span className="font-bold">Security Guide</span>
                    </div>
                    
                    <nav className="space-y-1">
                        {GUIDE_CONTENT.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all ${
                                    activeTab === item.id 
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm font-medium">{item.title}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Progress Summary */}
                    <div className="mt-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-400 mb-2">Security Progress</div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold text-green-400">
                                {completedItems}/{totalItems} Complete
                            </div>
                            <div className="text-lg font-bold">{securityScore}%</div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                                className="h-2 rounded-full bg-green-500 transition-all duration-500"
                                style={{ width: `${(completedItems / totalItems) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b border-slate-700">
                        <h2 className="text-xl font-bold text-white">{GUIDE_CONTENT.find(item => item.id === activeTab)?.title}</h2>
                        <button 
                            onClick={onClose}
                            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-lg">{Icons.X}</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'checklist' ? (
                            <div className="space-y-4">
                                <div className="grid gap-4">
                                    {dynamicChecklist.map((item) => (
                                        <div 
                                            key={item.id}
                                            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                                item.met 
                                                ? 'bg-green-500/10 border-green-500/30' 
                                                : 'bg-slate-700/50 border-slate-600'
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`p-2 rounded-full flex-shrink-0 ${
                                                    item.met ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-400'
                                                }`}>
                                                    {item.met ? Icons.CheckCircle : Icons.Circle}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className={`font-bold ${item.met ? 'text-green-200' : 'text-slate-200'}`}>
                                                            {item.title}
                                                        </h3>
                                                        <span className="text-xs uppercase font-bold px-2 py-1 rounded bg-slate-600 text-slate-300">
                                                            {item.stage}
                                                        </span>
                                                        {!item.met && item.stage === currentStage.id && (
                                                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded animate-pulse">
                                                                Current Stage
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-300 text-sm">{item.description}</p>
                                                </div>
                                                {item.met && (
                                                    <div className="text-green-500 font-bold text-sm">
                                                        COMPLIANT
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="prose prose-invert max-w-none">
                                    <h1 className="text-2xl font-bold text-white mb-2">{activeContent.heading}</h1>
                                    <h2 className="text-lg text-blue-400 font-medium mb-4">{activeContent.subheading}</h2>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-6">{activeContent.text}</p>
                                </div>

                                {activeContent.points && (
                                    <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                                        <h3 className="text-lg font-semibold text-white mb-4">Key Points</h3>
                                        <ul className="space-y-3">
                                            {activeContent.points.map((point, index) => (
                                                <li key={index} className="flex items-start gap-3 text-slate-200">
                                                    <span className="text-green-400 mt-1">{Icons.CheckCircle}</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

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
                  {/* ARCHITECTURE DIAGRAM - FIXED PLACEMENT */}
                <ArchitectureDiagram 
                    activeStageId={currentStage.id}
                    pipelineStatus={pipelineStatus}
                    isSecure={isSecure}
                />
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

        {/* REPLACE YOUR EXISTING MODAL WITH THIS ENHANCED ONE */}
        {isGuideOpen && (
            <GuideModal 
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                currentStageIndex={currentStageIndex}
                isSecure={isSecure}
                securityScore={securityScore}
            />
        )}
        </div>
    );
 
// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<DevSecOpsApp />);
