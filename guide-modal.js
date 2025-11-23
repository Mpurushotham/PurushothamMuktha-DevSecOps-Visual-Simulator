// Enhanced Guide Modal Component
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
                            <ChecklistView 
                                checklist={dynamicChecklist} 
                                currentStage={currentStage}
                            />
                        ) : (
                            <GuideContentView content={activeContent} activeTab={activeTab} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Checklist View Component
function ChecklistView({ checklist, currentStage }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {checklist.map((item) => (
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
    );
}

// Guide Content View Component
function GuideContentView({ content, activeTab }) {
    if (!content) return null;

    return (
        <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
                <h1 className="text-2xl font-bold text-white mb-2">{content.heading}</h1>
                <h2 className="text-lg text-blue-400 font-medium mb-4">{content.subheading}</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">{content.text}</p>
            </div>

            {activeTab === 'intro' && content.benefits && (
                <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                    <h3 className="text-lg font-semibold text-white mb-4">Key Benefits</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {content.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <span className="text-green-400 mt-1">{Icons.CheckCircle}</span>
                                <span className="text-slate-200">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'pipeline' && content.tools && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Security Tools by Stage</h3>
                    <div className="grid gap-4">
                        {Object.entries(content.tools).map(([stage, tools]) => (
                            <div key={stage} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                                <h4 className="font-semibold text-blue-400 mb-2 capitalize">{stage} Stage</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tools.map((tool, index) => (
                                        <span key={index} className="px-3 py-1 bg-slate-600 rounded-full text-sm text-slate-300">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'vulnerabilities' && content.vulnerabilities && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Common Vulnerabilities</h3>
                    <div className="grid gap-4">
                        {content.vulnerabilities.map((vuln, index) => (
                            <div key={vuln.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-semibold text-red-400">{vuln.name} ({vuln.id})</h4>
                                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                        HIGH RISK
                                    </span>
                                </div>
                                <p className="text-slate-300 mb-3">{vuln.description}</p>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h5 className="font-semibold text-slate-400 mb-1">Examples:</h5>
                                        <p className="text-slate-300">{vuln.example}</p>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-slate-400 mb-1">Prevention:</h5>
                                        <p className="text-slate-300">{vuln.prevention}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {content.points && (
                <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                    <h3 className="text-lg font-semibold text-white mb-4">Key Points</h3>
                    <ul className="space-y-3">
                        {content.points.map((point, index) => (
                            <li key={index} className="flex items-start gap-3 text-slate-200">
                                <span className="text-green-400 mt-1">{Icons.CheckCircle}</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
