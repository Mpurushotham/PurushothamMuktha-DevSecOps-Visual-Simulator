import React from 'react';
import { Code, Box, ShieldCheck, Rocket, Activity, Server, Database, Globe, AlertTriangle, CheckCircle2, TrendingUp, BookOpen, Lock, ClipboardCheck, Container, Scale } from 'lucide-react';
import { PipelineStage, StageStatus } from './types';

export const REPORT_SUMMARY = {
  title: "DevSecOps Architecture & Maturity Report",
  objective: "To demonstrate the shift-left security methodology by integrating automated security controls into every stage of the CI/CD pipeline.",
  outcomes: [
    "Identified and remediated hardcoded secrets and SQL injection vulnerabilities in the source code.",
    "Implemented Software Composition Analysis (SCA) to detect vulnerabilities in third-party dependencies.",
    "Enforced container security standards including non-root user execution and base image scanning.",
    "Applied Policy-as-Code (OPA) to prevent misconfigured resources from reaching production.",
    "Established continuous runtime monitoring with WAF to block active attacks."
  ]
};

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'code',
    name: 'Code & Commit',
    description: 'Developer commits code. Pre-commit hooks run secret scanning.',
    details: 'The first line of defense. We use pre-commit hooks and IDE plugins to prevent secrets (API keys, passwords) and basic syntax errors from ever entering the version control system. This is the most cost-effective place to catch bugs.',
    ciConfig: `# .pre-commit-config.yaml
repos:
  - repo: https://github.com/zricethezav/gitleaks
    rev: v8.18.2
    hooks:
      - id: gitleaks
        description: Detect hardcoded secrets
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer`,
    complianceControls: [
        { id: 'C-01', name: 'No Hardcoded Secrets', description: 'Source code must not contain high-entropy strings or keys.', status: 'PENDING' },
        { id: 'C-02', name: 'Branch Protection', description: 'Commits must be signed and reviewed.', status: 'PENDING' }
    ],
    recommendedTools: [
      { name: 'Gitleaks', category: 'Secret Scanning', description: 'Scans git history for secrets/keys.' },
      { name: 'SonarLint', category: 'IDE Plugin', description: 'Real-time code quality and security feedback.' },
      { name: 'Pre-commit', category: 'Git Hooks', description: 'Framework for managing git hooks.' }
    ],
    icon: <Code size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'build',
    name: 'Build & SCA',
    description: 'Compile artifacts. Software Composition Analysis checks dependencies.',
    details: 'During the build process, we analyze the manifest files (package.json, pom.xml) to identify third-party dependencies with known Common Vulnerabilities and Exposures (CVEs). We also ensure license compliance.',
    ciConfig: `# .github/workflows/build.yml
jobs:
  build-and-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm ci
      - name: Software Composition Analysis
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high`,
    complianceControls: [
        { id: 'C-03', name: 'Clean Dependencies', description: 'No critical CVEs in 3rd party libraries.', status: 'PENDING' },
        { id: 'C-04', name: 'License Compliance', description: 'No restrictive licenses (e.g., GPL) in commercial build.', status: 'PENDING' }
    ],
    recommendedTools: [
      { name: 'Snyk', category: 'SCA', description: 'Developer-first dependency security.' },
      { name: 'OWASP Dependency Check', category: 'SCA', description: 'Open source SCA tool.' },
      { name: 'Mend (WhiteSource)', category: 'SCA', description: 'Enterprise open source security.' }
    ],
    icon: <Box size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'container',
    name: 'Container Security',
    description: 'Build Docker image and scan base layers for OS vulnerabilities.',
    details: 'We package the application into a Docker container. Security scanning here focuses on the Operating System layers (e.g., Alpine, Debian) to find system-level vulnerabilities and misconfigurations like running as root.',
    ciConfig: `# .github/workflows/container.yml
jobs:
  docker-build:
    steps:
      - name: Build Image
        run: docker build -t myapp:latest .
      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'`,
    complianceControls: [
        { id: 'C-05', name: 'Non-Root User', description: 'Container must not run as PID 1 (root).', status: 'PENDING' },
        { id: 'C-06', name: 'Base Image Hardening', description: 'Base image must be minimal and patched.', status: 'PENDING' }
    ],
    recommendedTools: [
      { name: 'Trivy', category: 'Container Scan', description: 'Comprehensive scanner for containers/filesystem.' },
      { name: 'Clair', category: 'Container Scan', description: 'Static analysis for containers.' },
      { name: 'Docker Bench', category: 'Hardening', description: 'Checks for CIS Docker Benchmark compliance.' }
    ],
    icon: <Container size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'test',
    name: 'Test (SAST)',
    description: 'Static Analysis Security Testing scans source code for flaws.',
    details: 'SAST tools analyze the source code without executing it. They build an Abstract Syntax Tree (AST) to find coding patterns that lead to security flaws like SQL Injection, XSS, and Buffer Overflows.',
    ciConfig: `# .github/workflows/sast.yml
jobs:
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}`,
    complianceControls: [
        { id: 'C-07', name: 'OWASP Top 10 Check', description: 'Code passes static checks for common web risks.', status: 'PENDING' },
        { id: 'C-08', name: 'Code Quality Gate', description: 'Security rating must be A or B.', status: 'PENDING' }
    ],
    recommendedTools: [
      { name: 'SonarQube', category: 'SAST', description: 'Code quality and security analysis.' },
      { name: 'Checkmarx', category: 'SAST', description: 'Enterprise SAST solution.' },
      { name: 'CodeQL', category: 'SAST', description: 'Semantic code analysis engine by GitHub.' }
    ],
    icon: <ShieldCheck size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'compliance',
    name: 'Compliance (OPA)',
    description: 'Policy as Code checks (e.g., no root users, resource limits).',
    details: 'Before deploying to the cluster, we use Open Policy Agent (OPA) to validate the Kubernetes manifests against organizational policies. This prevents misconfigured resources from ever reaching production.',
    ciConfig: `# policies/deployment.rego
package kubernetes.admission

deny[msg] {
  input.kind == "Deployment"
  not input.spec.template.spec.securityContext.runAsNonRoot
  msg = "Containers must not run as root"
}

deny[msg] {
  input.kind == "Deployment"
  not input.spec.template.spec.containers[0].resources.limits.memory
  msg = "Memory limits must be set"
}`,
    complianceControls: [
        { id: 'C-09', name: 'Resource Quotas', description: 'CPU/Memory limits must be defined.', status: 'PENDING' },
        { id: 'C-10', name: 'Read-Only Filesystem', description: 'Root filesystem should be read-only where possible.', status: 'PENDING' },
        { id: 'C-11', name: 'Ingress Whitelist', description: 'No public load balancers for internal services.', status: 'PENDING' }
    ],
    recommendedTools: [
      { name: 'Open Policy Agent', category: 'Policy Engine', description: 'General-purpose policy engine.' },
      { name: 'Kyverno', category: 'K8s Policy', description: 'Policy engine designed specifically for Kubernetes.' },
      { name: 'Conftest', category: 'Testing', description: 'Tests configuration files against OPA policies.' }
    ],
    icon: <Scale size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'deploy',
    name: 'Deploy (IaC)',
    description: 'Infrastructure as Code deployment to staging/production clusters.',
    details: 'We use Terraform or Helm to apply the validated manifests to the Kubernetes cluster. This stage ensures that the infrastructure state matches the code definition.',
    ciConfig: `# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Terraform Init
        run: terraform init
      - name: Terraform Apply
        run: terraform apply -auto-approve`,
    complianceControls: [
        { id: 'C-12', name: 'Audit Trail', description: 'Deployment triggered by authenticated pipeline.', status: 'PENDING' }
    ],
    recommendedTools: [
      { name: 'Terraform', category: 'IaC', description: 'Infrastructure provisioning tool.' },
      { name: 'ArgoCD', category: 'GitOps', description: 'Declarative, GitOps continuous delivery.' },
      { name: 'Helm', category: 'Package Manager', description: 'The package manager for Kubernetes.' }
    ],
    icon: <Rocket size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
  {
    id: 'monitor',
    name: 'Monitor (DAST)',
    description: 'Runtime monitoring and Dynamic Analysis.',
    details: 'Once running, the application is continuously monitored. DAST scans the running app for vulnerabilities that only appear at runtime, while WAF and RASP protect against live attacks.',
    ciConfig: `# .github/workflows/dast.yml
jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - name: OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'https://staging.myapp.com'`,
    complianceControls: [
        { id: 'C-13', name: 'TLS Encryption', description: 'Traffic encrypted in transit (TLS 1.2+).', status: 'PENDING' },
        { id: 'C-14', name: 'WAF Active', description: 'Web Application Firewall filtering malicious payloads.', status: 'PENDING' }
    ],
    recommendedTools: [
      { name: 'OWASP ZAP', category: 'DAST', description: 'Open source web scanner.' },
      { name: 'Falco', category: 'Runtime', description: 'Cloud-native runtime security.' },
      { name: 'Datadog', category: 'Observability', description: 'Cloud monitoring as a service.' }
    ],
    icon: <Activity size={20} />,
    status: StageStatus.IDLE,
    logs: [],
  },
];

export const VULNERABLE_CODE_SNIPPET = `// MICROSERVICE: User Authentication
// FILE: auth_service.js

const express = require('express');
const app = express();
const db = require('./db');
const jwt = require('jsonwebtoken');

// ❌ VULNERABILITY 1: Hardcoded Secrets (OWASP A07)
const SECRET_KEY = "super_secret_key_12345"; 
const DB_PASS = "admin123";

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // ❌ VULNERABILITY 2: SQL Injection (OWASP A03)
  // Concatenating strings allows attackers to manipulate the query
  // Payload: ' OR '1'='1
  const query = "SELECT * FROM users WHERE user = '" + username + "' AND pass = '" + password + "'";
  
  try {
    const user = await db.execute(query);
    
    if (user) {
      // ❌ VULNERABILITY 3: Sensitive Data Exposure
      // Returning full user object including password hash
      const token = jwt.sign({ id: user.id, role: 'admin' }, SECRET_KEY);
      res.json({ token, user_data: user });
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch (e) {
    res.status(500).send(e.toString());
  }
});`;

export const SECURE_CODE_SNIPPET = `// MICROSERVICE: User Authentication
// FILE: auth_service.js

const express = require('express');
const app = express();
const db = require('./db');
const jwt = require('jsonwebtoken');

// ✅ FIX 1: Secrets Management
// Secrets loaded from Environment Variables (Vault/K8s Secrets)
const SECRET_KEY = process.env.JWT_SECRET;
const DB_PASS = process.env.DB_PASSWORD;

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // ✅ FIX 2: Parameterized Queries
  // Database driver treats inputs as data, not executable code
  const query = "SELECT id, role, email FROM users WHERE user = $1 AND pass = $2";
  
  try {
    const user = await db.execute(query, [username, password]);
    
    if (user) {
      // ✅ FIX 3: Least Privilege Response
      // Only returning necessary token, no sensitive DB rows
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch (e) {
    // Log error internally, send generic message to user
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
});`;

export const MOCK_METRICS = Array.from({ length: 20 }, (_, i) => ({
  time: `${10 + i}:00`,
  traffic: Math.floor(Math.random() * 500) + 200,
  threats: Math.floor(Math.random() * 50) + 5,
  latency: Math.floor(Math.random() * 100) + 20,
}));

export const GUIDE_CONTENT = [
  {
    id: 'intro',
    title: 'Introduction',
    icon: <BookOpen size={18} />,
    content: {
      heading: "DevSecOps Lab Overview",
      subheading: "From Code to Cloud with Confidence",
      text: "DevSecOps (Development, Security, and Operations) is an architectural approach that involves automating the integration of security at every phase of the software development lifecycle, from initial design through integration, testing, deployment, and software delivery.",
      points: [
        "It replaces the old model where security was a final gatekeeper.",
        "It emphasizes 'Security as Code'.",
        "It aims to make security everyone's responsibility."
      ]
    }
  },
  {
    id: 'problem',
    title: 'The Problem',
    icon: <AlertTriangle size={18} />,
    content: {
      heading: "The 'Wall of Confusion'",
      subheading: "Traditional DevOps Gaps",
      text: "In traditional models, security checks happened weeks after code was written. This created a bottleneck known as the 'Wall of Confusion' between developers and security teams.",
      points: [
        "High Cost of Repair: Fixing a bug in production costs 100x more than in dev.",
        "Slow Velocity: Security reviews delayed releases by days or weeks.",
        "Reactive Posture: Vulnerabilities were only found after breaches or audits."
      ]
    }
  },
  {
    id: 'solution',
    title: 'The Solution',
    icon: <CheckCircle2 size={18} />,
    content: {
      heading: "Shifting Left",
      subheading: "Proactive Security Integration",
      text: "The solution is to 'Shift Left'—moving security testing to the earliest possible stages of development.",
      points: [
        "Automated SAST/DAST: Tools run on every commit.",
        "Container Scanning: Check Docker images for OS-level CVEs.",
        "Policy as Code: Prevent non-compliant infrastructure (e.g., OPA)."
      ]
    }
  },
  {
    id: 'benefits',
    title: 'Business Benefits',
    icon: <TrendingUp size={18} />,
    content: {
      heading: "ROI & Strategic Value",
      subheading: "Why companies adopt DevSecOps",
      text: "Implementing a robust DevSecOps pipeline is not just about technical security; it drives significant business value.",
      points: [
        "Faster Time-to-Market: Automation removes manual security bottlenecks.",
        "Reduced Costs: Early detection drastically lowers remediation expenses.",
        "Regulatory Compliance: Automated audit trails for GDPR, SOC2, HIPAA.",
        "Brand Trust: Fewer breaches mean higher customer confidence."
      ]
    }
  },
  {
    id: 'standards',
    title: 'Standards (OWASP)',
    icon: <ShieldCheck size={18} />,
    content: {
      heading: "OWASP Top 10 & Best Practices",
      subheading: "Measuring Success",
      text: "We align with industry standards like the OWASP Top 10 to prioritize the most critical web application security risks.",
      points: [
        "A01: Broken Access Control - Enforced via policy checks.",
        "A03: Injection (SQLi/XSS) - Caught by SAST and DAST.",
        "A07: Identification and Authentication Failures - Caught by Integration Tests.",
        "Metrics: We track 'Mean Time to Remediate' (MTTR) and 'Vulnerability Density'."
      ]
    }
  },
  {
    id: 'checklist',
    title: 'Live Checklist',
    icon: <ClipboardCheck size={18} />,
    content: {
      heading: "DevSecOps Maturity Checklist",
      subheading: "Real-time Compliance Tracking",
      text: "This checklist updates in real-time based on your current pipeline simulation status. Ensure all items are checked to achieve a secure maturity level.",
      points: [] // Dynamically rendered
    }
  }
];