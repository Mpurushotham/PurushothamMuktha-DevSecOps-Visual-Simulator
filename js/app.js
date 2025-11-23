// Main Application Component with Enhanced Features
class DevSecOpsApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStageIndex: 0,
            pipelineStatus: 'IDLE',
            logs: [],
            codeContent: CODE_EXAMPLES.VULNERABLE.code,
            isSecure: false,
            isGuideOpen: false,
            securityScore: 0,
            vulnerabilities: CODE_EXAMPLES.VULNERABLE.vulnerabilities,
            realTimeMetrics: DevSecOpsUtils.generateMockMetrics(),
            activeThreats: [],
            userPreferences: {
                reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                highContrast: window.matchMedia('(prefers-contrast: high)').matches
            }
        };
        
        // Bind methods
        this.handleRunStage = this.handleRunStage.bind(this);
        this.handleNextStage = this.handleNextStage.bind(this);
        this.handleFixCode = this.handleFixCode.bind(this);
        this.addLog = this.addLog.bind(this);
        this.clearLogs = this.clearLogs.bind(this);
        
        // Initialize performance monitoring
        DevSecOpsUtils.performanceMonitor();
    }

    componentDidMount() {
        // Load user preferences
        const savedPrefs = DevSecOpsUtils.storage.get('userPreferences');
        if (savedPrefs) {
            this.setState({ userPreferences: { ...this.state.userPreferences, ...savedPrefs } });
        }

        // Initialize real-time metrics
        this.metricsInterval = setInterval(() => {
            this.setState(prevState => ({
                realTimeMetrics: DevSecOpsUtils.generateMockMetrics(),
                activeThreats: [...prevState.activeThreats, DevSecOpsUtils.simulateThreatIntelligence()].slice(-5)
            }));
        }, 5000);

        // Calculate initial security score
        this.updateSecurityScore();
    }

    componentDidUpdate(prevProps, prevState) {
        // Update security score when relevant state changes
        if (prevState.isSecure !== this.state.isSecure || 
            prevState.currentStageIndex !== this.state.currentStageIndex ||
            prevState.vulnerabilities !== this.state.vulnerabilities) {
            this.updateSecurityScore();
        }
    }

    componentWillUnmount() {
        clearInterval(this.metricsInterval);
    }

    updateSecurityScore() {
        const securityScore = DevSecOpsUtils.calculateSecurityScore(
            this.state.isSecure,
            this.state.currentStageIndex,
            this.state.vulnerabilities
        );
        this.setState({ securityScore });
    }

    addLog(message, level = 'INFO') {
        const timestamp = new Date().toLocaleTimeString();
        this.setState(prevState => ({
            logs: [...prevState.logs, { timestamp, message, level }]
        }));
    }

    clearLogs() {
        this.setState({ logs: [] });
    }

    handleRunStage() {
        const { currentStageIndex, isSecure } = this.state;
        const currentStage = PIPELINE_STAGES[currentStageIndex];
        
        this.setState({ pipelineStatus: 'RUNNING' });
        this.clearLogs();
        
        this.addLog(`🚀 Starting ${currentStage.name} stage...`, 'INFO');
        this.addLog(`🔍 Running security checks: ${currentStage.securityChecks.join(', ')}`, 'INFO');
        
        // Simulate stage execution with enhanced logging
        setTimeout(() => {
            this.simulateStageExecution(currentStage, isSecure);
        }, 1000);
    }

    simulateStageExecution(stage, isSecure) {
        switch (stage.id) {
            case 'code':
                this.simulateCodeStage(isSecure);
                break;
            case 'build':
                this.simulateBuildStage(isSecure);
                break;
            case 'test':
                this.simulateTestStage(isSecure);
                break;
            case 'deploy':
                this.simulateDeployStage(isSecure);
                break;
            case 'monitor':
                this.simulateMonitorStage(isSecure);
                break;
        }
    }

    simulateCodeStage(isSecure) {
        this.addLog('🔎 Scanning for secrets and credentials...', 'INFO');
        this.addLog('📝 Analyzing code patterns for security issues...', 'INFO');
        
        if (!isSecure) {
            this.addLog('❌ CRITICAL: Hardcoded JWT secret detected!', 'ERROR');
            this.addLog('❌ CRITICAL: SQL Injection vulnerability found!', 'ERROR');
            this.addLog('⚠️  WARNING: Insecure cookie configuration detected', 'WARN');
            this.setState({ pipelineStatus: 'ERROR' });
        } else {
            this.addLog('✅ No secrets found in codebase', 'SUCCESS');
            this.addLog('✅ Input validation properly implemented', 'SUCCESS');
            this.addLog('✅ Secure authentication patterns detected', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }
    }

    simulateBuildStage(isSecure) {
        this.addLog('📦 Installing dependencies...', 'INFO');
        this.addLog('🔍 Scanning 3rd party libraries for vulnerabilities...', 'INFO');
        
        // Simulate dependency scan results
        setTimeout(() => {
            this.addLog('📊 Generating Software Bill of Materials (SBOM)...', 'INFO');
            this.addLog('✅ All dependencies comply with security policy', 'SUCCESS');
            this.addLog('✅ No critical vulnerabilities found in dependencies', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }, 2000);
    }

    simulateTestStage(isSecure) {
        this.addLog('🧪 Executing security test suite...', 'INFO');
        this.addLog('🔍 Running Static Application Security Testing (SAST)...', 'INFO');
        
        if (!isSecure) {
            this.addLog('❌ SAST FAILED: Multiple critical vulnerabilities detected', 'ERROR');
            this.addLog('📍 SQL Injection at auth_service.js:12', 'ERROR');
            this.addLog('📍 Hardcoded secret at auth_service.js:25', 'ERROR');
            this.setState({ pipelineStatus: 'ERROR' });
        } else {
            this.addLog('✅ SAST passed: No security vulnerabilities found', 'SUCCESS');
            this.addLog('✅ Dynamic analysis completed successfully', 'SUCCESS');
            this.addLog('✅ Security unit tests passed', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }
    }

    simulateDeployStage(isSecure) {
        this.addLog('🏗️  Validating Infrastructure as Code...', 'INFO');
        this.addLog('🔒 Applying security policies...', 'INFO');
        this.addLog('🛡️  Configuring network security groups...', 'INFO');
        
        setTimeout(() => {
            this.addLog('✅ Infrastructure security validation passed', 'SUCCESS');
            this.addLog('✅ Container security scan completed', 'SUCCESS');
            this.addLog('✅ Deployment to secure environment successful', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }, 2000);
    }

    simulateMonitorStage(isSecure) {
        this.addLog('👀 Starting runtime security monitoring...', 'INFO');
        this.addLog('🛡️  Initializing Web Application Firewall...', 'INFO');
        this.addLog('📊 Collecting security metrics...', 'INFO');
        
        if (!isSecure) {
            this.addLog('🚨 ALERT: SQL Injection attempt blocked by WAF', 'WARN');
            this.addLog('🚨 ALERT: Suspicious user agent detected', 'WARN');
            this.addLog('⚠️  Multiple security events requiring review', 'WARN');
            this.setState({ pipelineStatus: 'WARNING' });
        } else {
            this.addLog('✅ Runtime protection active', 'SUCCESS');
            this.addLog('✅ No security events detected', 'SUCCESS');
            this.addLog('✅ System operating within secure parameters', 'SUCCESS');
            this.setState({ pipelineStatus: 'SUCCESS' });
        }
    }

    handleNextStage() {
        const { currentStageIndex } = this.state;
        if (currentStageIndex < PIPELINE_STAGES.length - 1) {
            this.setState(prevState => ({
                currentStageIndex: prevState.currentStageIndex + 1,
                pipelineStatus: 'IDLE'
            }));
            this.clearLogs();
        }
    }

    handleFixCode() {
        this.setState({
            codeContent: CODE_EXAMPLES.SECURE.code,
            isSecure: true,
            vulnerabilities: [],
            pipelineStatus: 'IDLE'
        });
        this.clearLogs();
        this.addLog('🔧 Applying security patches...', 'INFO');
        this.addLog('✅ Implemented parameterized queries', 'SUCCESS');
        this.addLog('✅ Removed hardcoded secrets', 'SUCCESS');
        this.addLog('✅ Enhanced input validation', 'SUCCESS');
        this.addLog('✅ Updated security headers configuration', 'SUCCESS');
    }

    handleResetSimulation() {
        this.setState({
            currentStageIndex: 0,
            pipelineStatus: 'IDLE',
            codeContent: CODE_EXAMPLES.VULNERABLE.code,
            isSecure: false,
            vulnerabilities: CODE_EXAMPLES.VULNERABLE.vulnerabilities,
            logs: []
        });
    }

    render() {
        const { 
            currentStageIndex, 
            pipelineStatus, 
            logs, 
            codeContent, 
            isSecure, 
            isGuideOpen,
            securityScore,
            realTimeMetrics,
            activeThreats
        } = this.state;

        const currentStage = PIPELINE_STAGES[currentStageIndex];
        const maturity = this.getMaturityLabel(securityScore);

        return React.createElement('div', { className: "flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans" },
            // Enhanced sidebar with threat intelligence
            this.renderSidebar(currentStage, securityScore, maturity, activeThreats),
            
            // Main content area
            React.createElement('div', { className: "flex-1 flex flex-col min-w-0 bg-slate-950 relative z-0" },
                this.renderHeader(currentStage, pipelineStatus),
                this.renderContentArea(currentStage, pipelineStatus, logs, codeContent, isSecure, realTimeMetrics)
            ),

            // AI Copilot sidebar
            React.createElement(AICopilot, {
                currentStage: currentStage,
                isSimulating: pipelineStatus === 'RUN
