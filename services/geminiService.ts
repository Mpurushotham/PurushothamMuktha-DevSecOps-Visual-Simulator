import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    return null; // Return null to trigger offline mode
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Mock data for offline mode / free tier experience
const MOCK_INSIGHTS: Record<string, string> = {
  'Code & Commit': "Offline Mode: At the Code stage, the primary risk is pushing hardcoded secrets or logic flaws. We use pre-commit hooks and IDE plugins to catch these instantly (Secret Scanning).",
  'Build & SCA': "Offline Mode: During Build, we check third-party libraries. The risk here is 'Supply Chain Attacks' where a dependency has a known vulnerability (CVE). SCA tools mitigate this.",
  'Container Security': "Offline Mode: Containers may run as 'root' or use base images with OS-level vulnerabilities. Image scanning ensures the runtime environment is hardened before deployment.",
  'Test (SAST)': "Offline Mode: Static Analysis looks at the source code without running it. It identifies pattern-based flaws like SQL Injection or Buffer Overflows early in the lifecycle.",
  'Compliance (OPA)': "Offline Mode: Policy as Code (e.g., OPA) ensures that infrastructure meets regulatory standards (e.g., 'No S3 buckets open to public') before provisioning resources.",
  'Deploy (IaC)': "Offline Mode: Infrastructure as Code allows us to review infrastructure changes via PRs. We scan Terraform/Helm charts for misconfigurations before applying them.",
  'Monitor (DAST)': "Offline Mode: In production, DAST simulates hacker attacks against the running app. WAFs (Web Application Firewalls) actively block malicious traffic like SQL Injection payloads."
};

export const generateSecurityInsight = async (
  stageName: string,
  contextData: string
): Promise<string> => {
  const ai = getAiClient();
  
  // Fallback to offline mock data if no API key is present
  if (!ai) {
    console.log("Running in Offline AI Mode");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_INSIGHTS[stageName] || "Offline Mode: Security controls are active. Proactive monitoring helps reduce Mean Time to Response (MTTR).");
      }, 800);
    });
  }

  const prompt = `
    You are a DevSecOps Expert Architect.
    The user is currently at the "${stageName}" stage of a CI/CD pipeline.
    
    Context Data or Code Snippet:
    ${contextData}

    Provide a concise (max 3 sentences), high-level explanation of:
    1. What security risk is most relevant here?
    2. How the current stage mitigates it.
    
    If code is provided, briefly identify the vulnerability.
    Keep the tone professional and educational.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_INSIGHTS[stageName] || "Unable to fetch security insights.";
  }
};

export const analyzeVulnerability = async (codeSnippet: string): Promise<string> => {
  const ai = getAiClient();

  if (!ai) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`
                <h3>Offline Analysis Report</h3>
                <p><strong>Vulnerability Found:</strong> SQL Injection (CWE-89)</p>
                <p><strong>Severity:</strong> <span style="color:red">CRITICAL</span></p>
                <p><strong>Analysis:</strong> The code directly concatenates user input into the database query string: <code>"SELECT * ... user = '" + username + "'"</code>.</p>
                <p><strong>Fix:</strong> Use Parameterized Queries (e.g., <code>$1, $2</code> inputs) to separate code from data.</p>
                <br/>
                <p><strong>Vulnerability Found:</strong> Hardcoded Secrets (CWE-798)</p>
                <p><strong>Severity:</strong> <span style="color:orange">HIGH</span></p>
                <p><strong>Fix:</strong> Move <code>SECRET_KEY</code> to environment variables.</p>
            `);
        }, 1000);
    });
  }

  const prompt = `
    Analyze the following code snippet for security vulnerabilities (e.g., SQL Injection, Hardcoded Secrets).
    
    Code:
    \`\`\`javascript
    ${codeSnippet}
    \`\`\`
    
    Output a Markdown formatted response with:
    - **Vulnerability Found**: [Name]
    - **Severity**: [High/Critical]
    - **Fix**: A brief code correction or explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis returned.";
  } catch (error) {
    console.error(error);
    return "Error analyzing code.";
  }
};
