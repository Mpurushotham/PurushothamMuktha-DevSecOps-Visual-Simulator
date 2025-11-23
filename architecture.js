// Enhanced Architecture Diagram Functions
class ArchitectureDiagram {
    static getNodeState(nodeType, stageId, pipelineStatus, isSecure) {
        if (pipelineStatus === StageStatus.ERROR) return 'border-red-500 bg-red-900/20 text-red-400';
        if (!isSecure) {
            if (nodeType === 'api' && stageId === 'code') return 'border-yellow-500 bg-yellow-500/10 text-yellow-400 animate-pulse';
            if (nodeType === 'api' && stageId === 'test') return 'border-red-500 bg-red-500/10 text-red-400';
            if (nodeType === 'db' && stageId === 'monitor') return 'border-red-500 bg-red-500/10 text-red-400';
        }
        if (isSecure && pipelineStatus === StageStatus.SUCCESS) return 'border-green-500 bg-green-500/10 text-green-400';
        return 'border-slate-600 bg-slate-800/60 text-slate-400';
    }

    static render(currentStage, pipelineStatus, isSecure) {
        const isScanning = pipelineStatus === StageStatus.RUNNING && ['code', 'build', 'test'].includes(currentStage.id);
        const isRuntime = ['deploy', 'monitor'].includes(currentStage.id);
        const showAttack = currentStage.id === 'monitor' && !isSecure;
        const isVulnerableState = !isSecure && (currentStage.id === 'code' || currentStage.id === 'test' || currentStage.id === 'monitor');

        return `
            <div class="relative w-full h-64 bg-slate-900 rounded-lg border-2 overflow-hidden flex items-center justify-center mb-6 transition-colors duration-500 ${
                isVulnerableState ? 'border-red-500/30' : 'border-slate-700'
            }">
                
                <!-- Background Grid -->
                <div class="absolute inset-0 opacity-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                
                <!-- Scanning Animation -->
                ${isScanning ? `
                    <div class="absolute inset-0 overflow-hidden">
                        <div class="absolute top-0 bottom-0 w-1 bg-blue-500 animate-scan"></div>
                    </div>
                ` : ''}

                <!-- Main Architecture Layout -->
                <div class="relative z-10 flex items-center justify-between w-full px-8">
                    
                    <!-- Client Node -->
                    <div class="text-center">
                        <div class="w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                            this.getNodeState('frontend', currentStage.id, pipelineStatus, isSecure)
                        }">
                            <div class="text-xl">${Icons.Globe}</div>
                            <div class="text-xs mt-1">Client</div>
                        </div>
                        ${isRuntime ? `
                            <div class="mt-2 text-xs ${isSecure ? 'text-green-400' : 'text-slate-500'}">
                                ${isSecure ? Icons.Lock : Icons.Unlock} HTTPS
                            </div>
                        ` : ''}
                    </div>

                    <!-- Connection with WAF -->
                    <div class="flex-1 relative h-1 bg-slate-600 mx-4">
                        <!-- Data Flow Animation -->
                        ${isRuntime ? `
                            <div class="absolute w-3 h-1 rounded ${isSecure ? 'bg-blue-400' : 'bg-slate-500'} animate-move-right"></div>
                        ` : ''}
                        
                        <!-- WAF Shield -->
                        <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            isRuntime && isSecure ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-slate-600 text-slate-600'
                        }">
                            ${Icons.Shield}
                        </div>
                    </div>

                    <!-- API Server Node -->
                    <div class="text-center relative">
                        <!-- Attack Animation -->
                        ${showAttack ? `
                            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                                <div class="text-red-500 text-sm">${Icons.AlertTriangle}</div>
                                <div class="text-xs text-red-400">Attack!</div>
                            </div>
                        ` : ''}
                        
                        <div class="w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                            this.getNodeState('api', currentStage.id, pipelineStatus, isSecure)
                        }">
                            <div class="text-2xl">${Icons.Server}</div>
                            <div class="text-xs mt-1">API Server</div>
                            ${isScanning ? `
                                <div class="absolute -top-1 -right-1 text-blue-400 animate-spin">
                                    ${Icons.Search}
                                </div>
                            ` : ''}
                        </div>

                        <!-- Vulnerability Badges -->
                        ${!isSecure && currentStage.id === 'code' ? `
                            <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs animate-pulse">
                                ${Icons.FileJson}
                            </div>
                        ` : ''}
                        ${!isSecure && currentStage.id === 'test' ? `
                            <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
                                ${Icons.Bug}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Connection to DB -->
                    <div class="flex-1 relative h-1 bg-slate-600 mx-4">
                        <!-- Database Traffic -->
                        ${isRuntime ? `
                            <div class="absolute w-2 h-2 rounded-full ${isSecure ? 'bg-green-400' : 'bg-slate-500'} animate-move-right" style="animation-delay: 0.5s"></div>
                        ` : ''}
                        
                        <!-- Malicious Payload -->
                        ${showAttack ? `
                            <div class="absolute w-3 h-3 bg-red-500 rotate-45 animate-move-right"></div>
                        ` : ''}
                    </div>

                    <!-- Database Node -->
                    <div class="text-center">
                        <div class="w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                            this.getNodeState('db', currentStage.id, pipelineStatus, isSecure)
                        }">
                            <div class="text-xl">${Icons.Database}</div>
                            <div class="text-xs mt-1">Database</div>
                        </div>
                        
                        <!-- Intrusion Alert -->
                        ${showAttack ? `
                            <div class="mt-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400 animate-pulse">
                                SQL Injection!
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Stage Description -->
                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div class="bg-slate-800/80 border border-slate-600 rounded-full px-4 py-2 flex items-center gap-3">
                        <div class="p-2 rounded-full ${isVulnerableState ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}">
                            ${currentStage.icon}
                        </div>
                        <div class="text-sm">
                            <div class="text-xs text-slate-400 uppercase tracking-wide">
                                ${currentStage.name}
                            </div>
                            <div class="text-slate-200">
                                ${currentStage.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
