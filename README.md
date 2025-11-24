# DevSecOps Interactive Visualizer

**Built with ❤️ by Purushotham Muktha | Powered by Google Gemini**

## Overview
This is an interactive, browser-based educational lab designed to demonstrate the principles of **DevSecOps** (Development, Security, and Operations). It visualizes a modern CI/CD pipeline, highlighting where and how security checks are integrated ("Shift Left") to prevent vulnerabilities from reaching production.

## Learning Objectives
By using this lab, you will learn:
1.  **Shift Left Security**: How moving security checks earlier in the pipeline reduces cost and risk.
2.  **Pipeline Stages**: Understanding the flow from Code -> Build -> Container -> Test -> Compliance -> Deploy -> Monitor.
3.  **Vulnerability Management**: Identifying SQL Injection, Hardcoded Secrets, and dependency flaws.
4.  **Remediation**: How automated tools (SAST, SCA, OPA) catch issues that humans miss.

## Features
*   **Interactive Simulation**: Run the pipeline and watch real-time logs.
*   **Visual Architecture**: See how code flows from the developer's machine to the cloud.
*   **Threat Simulation**: Observe attacks on a vulnerable application vs. a secure one.
*   **AI Security Copilot**: Context-aware security insights (powered by Gemini or Offline Mode).
*   **Live Metrics**: Real-time traffic and threat monitoring.

## Tech Stack
*   React 19
*   TypeScript
*   Tailwind CSS
*   Framer Motion (Animations)
*   Google GenAI SDK (Optional for live AI)

## Usage
1.  **Start**: Click "Run Pipeline" to see a vulnerable deployment.
2.  **Observe**: Watch the "Threat Feed" and "Architecture" to see attacks succeed.
3.  **Fix**: Click "Auto-Fix Vulnerabilities" in the code panel.
4.  **Re-Run**: Run the pipeline again to see security checks pass and attacks blocked.
