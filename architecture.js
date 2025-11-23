// Architecture Diagram Component
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
                    <div className="absolute top-0 bottom-0 w-1 bg-blue-500 animate-pulse" 
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
                        <div className={`absolute w-3 h-1 rounded ${isSecure ? 'bg-blue-400' : 'bg-slate-500'} animate-pulse`}
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
                            <div className="absolute -top-1 -right-1 text-blue-400 animate-spin">
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
                        <div className={`absolute w-2 h-2 rounded-full ${isSecure ? 'bg-green-400' : 'bg-slate-500'} animate-pulse`}
                             style={{ animation: 'moveRight 2s linear infinite', animationDelay: '0.5s' }}></div>
                    )}
                    
                    {/* Malicious Payload */}
                    {showAttack && (
                        <div className="absolute w-3 h-3 bg-red-500 rotate-45 animate-pulse"
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
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-full px-4 py-2 flex items-center gap-3">
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

            <style>{`
                @keyframes scan {
                    0% { left: -10%; }
                    100% { left: 110%; }
                }
                @keyframes moveRight {
                    0% { left: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
}
