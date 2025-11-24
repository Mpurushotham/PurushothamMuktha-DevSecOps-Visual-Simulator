import React from 'react';

export enum StageStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
}

export interface ToolRecommendation {
  name: string;
  category: string;
  description: string;
  url?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  details?: string; // Extended description for the details tab
  ciConfig?: string; // CI/CD Configuration Snippet (YAML)
  complianceControls?: ComplianceControl[]; // Specific controls checked in this stage
  recommendedTools?: ToolRecommendation[]; // Industry standard tools for this stage
  icon: React.ReactNode;
  status: StageStatus;
  logs: string[];
}

export interface Vulnerability {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  location: string;
  description: string;
  remediation?: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface ChartData {
  time: string;
  traffic: number;
  threats: number;
  latency: number;
}