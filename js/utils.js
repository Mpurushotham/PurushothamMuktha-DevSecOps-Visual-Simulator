// Enhanced utility functions
class DevSecOpsUtils {
    // Security scoring algorithm
    static calculateSecurityScore(isSecure, currentStageIndex, vulnerabilities = []) {
        let score = 0;
        
        // Base security measures (40%)
        if (isSecure) score += 40;
        
        // Pipeline progression (30%)
        const stageWeights = [0, 15, 15, 15, 15];
        for (let i = 0; i <= currentStageIndex; i++) {
            score += stageWeights[i] || 0;
        }
        
        // Vulnerability penalties (30%)
        const vulnPenalties = {
            'CRITICAL': -20,
            'HIGH': -15,
            'MEDIUM': -10,
            'LOW': -5
        };
        
        vulnerabilities.forEach(vuln => {
            score += vulnPenalties[vuln.severity] || 0;
        });
        
        return Math.max(0, Math.min(100, score));
    }

    // OWASP risk assessment
    static assessOWASPRisk(vulnerabilities) {
        const owaspRisks = {
            'A01': 'Broken Access Control',
            'A03': 'Injection',
            'A07': 'Identification and Authentication Failures',
            'A08': 'Software and Data Integrity Failures'
        };
        
        return vulnerabilities.map(vuln => ({
            ...vuln,
            owaspCategory: owaspRisks[vuln.type] || 'Other'
        }));
    }

    // Performance monitoring
    static performanceMonitor() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                console.log(`[Performance] ${entry.name}: ${entry.duration}ms`);
            });
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    }

    // Error boundary and logging
    static errorHandler(error, errorInfo) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.toString(),
            stack: error.stack,
            componentStack: errorInfo?.componentStack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Send to analytics (in real app)
        console.error('Application Error:', errorLog);
        
        // Fallback UI update
        this.showErrorToast('An unexpected error occurred. Please refresh the page.');
    }

    static showErrorToast(message) {
        // Implementation for toast notifications
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 5000);
    }

    // Local storage with encryption
    static storage = {
        set(key, value) {
            try {
                const encrypted = btoa(JSON.stringify(value));
                localStorage.setItem(`devsecops_${key}`, encrypted);
            } catch (error) {
                console.warn('LocalStorage set failed:', error);
            }
        },
        
        get(key) {
            try {
                const encrypted = localStorage.getItem(`devsecops_${key}`);
                return encrypted ? JSON.parse(atob(encrypted)) : null;
            } catch (error) {
                console.warn('LocalStorage get failed:', error);
                return null;
            }
        }
    };

    // Real-time metrics simulation
    static generateMockMetrics(count = 20) {
        return Array.from({ length: count }, (_, i) => ({
            time: `${10 + i}:00`,
            traffic: Math.floor(Math.random() * 500) + 200 + Math.sin(i * 0.5) * 50,
            threats: Math.floor(Math.random() * 50) + 5 + Math.cos(i * 0.3) * 10,
            latency: Math.floor(Math.random() * 100) + 20 + Math.sin(i * 0.7) * 15,
            errors: Math.floor(Math.random() * 10) + 1,
            throughput: Math.floor(Math.random() * 1000) + 500
        }));
    }

    // Threat intelligence simulation
    static simulateThreatIntelligence() {
        const threats = [
            { type: 'SQL Injection', severity: 'HIGH', source: '192.168.1.100' },
            { type: 'XSS Attempt', severity: 'MEDIUM', source: '203.0.113.42' },
            { type: 'Credential Stuffing', severity: 'HIGH', source: '198.51.100.23' },
            { type: 'DDoS Probe', severity: 'LOW', source: '192.0.2.55' }
        ];
        
        return threats[Math.floor(Math.random() * threats.length)];
    }
}

// Export for use in other modules
window.DevSecOpsUtils = DevSecOpsUtils;
