// Mock data for VulnerAccessor Dashboard

export interface Domain {
  id: string;
  name: string;
  riskScore: number;
  status: 'active' | 'scanning' | 'failed' | 'idle';
  vulnerabilities: number;
  lastScan: string;
  slaCompliance: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Vulnerability {
  id: string;
  domain: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvssScore: number;
  dateFound: string;
  status: 'open' | 'fixed' | 'false-positive' | 'accepted';
  slaDue: string;
  daysOverdue?: number;
  owaspCategory: string;
  description: string;
}

export interface RiskTimelineData {
  date: string;
  riskScore: number;
  domain: string;
  predicted?: boolean;
}

export interface ThreatData {
  category: string;
  count: number;
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface MLInsight {
  id: string;
  domain: string;
  type: 'anomaly' | 'spike' | 'trend';
  confidence: number;
  description: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ScanData {
  id: string;
  domain: string;
  timestamp: string;
  status: 'success' | 'failed' | 'running';
  duration: number;
  filesAnalyzed: number;
  vulnerabilitiesFound: number;
  errorMessage?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  details: string;
}

// Mock data instances
export const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'app.company.com',
    riskScore: 8.7,
    status: 'active',
    vulnerabilities: 23,
    lastScan: '2024-01-15T10:30:00Z',
    slaCompliance: 78,
    trend: 'up'
  },
  {
    id: '2',
    name: 'api.company.com',
    riskScore: 6.2,
    status: 'scanning',
    vulnerabilities: 15,
    lastScan: '2024-01-14T14:20:00Z',
    slaCompliance: 92,
    trend: 'down'
  },
  {
    id: '3',
    name: 'admin.company.com',
    riskScore: 9.1,
    status: 'failed',
    vulnerabilities: 31,
    lastScan: '2024-01-13T08:15:00Z',
    slaCompliance: 45,
    trend: 'up'
  },
  {
    id: '4',
    name: 'portal.company.com',
    riskScore: 4.3,
    status: 'active',
    vulnerabilities: 8,
    lastScan: '2024-01-15T16:45:00Z',
    slaCompliance: 95,
    trend: 'stable'
  },
  {
    id: '5',
    name: 'dev.company.com',
    riskScore: 7.8,
    status: 'idle',
    vulnerabilities: 19,
    lastScan: '2024-01-12T12:00:00Z',
    slaCompliance: 67,
    trend: 'up'
  }
];

export const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'v1',
    domain: 'app.company.com',
    name: 'SQL Injection in Login Form',
    severity: 'critical',
    cvssScore: 9.8,
    dateFound: '2024-01-10T09:30:00Z',
    status: 'open',
    slaDue: '2024-01-17T09:30:00Z',
    daysOverdue: 2,
    owaspCategory: 'A03:2021 – Injection',
    description: 'SQL injection vulnerability in user login form allows unauthorized database access'
  },
  {
    id: 'v2',
    domain: 'api.company.com',
    name: 'Cross-Site Scripting (XSS)',
    severity: 'high',
    cvssScore: 7.4,
    dateFound: '2024-01-12T14:15:00Z',
    status: 'open',
    slaDue: '2024-01-19T14:15:00Z',
    owaspCategory: 'A07:2021 – Cross-Site Scripting',
    description: 'Reflected XSS vulnerability in search parameter'
  },
  {
    id: 'v3',
    domain: 'admin.company.com',
    name: 'Broken Access Control',
    severity: 'critical',
    cvssScore: 9.1,
    dateFound: '2024-01-08T11:20:00Z',
    status: 'open',
    slaDue: '2024-01-15T11:20:00Z',
    daysOverdue: 5,
    owaspCategory: 'A01:2021 – Broken Access Control',
    description: 'Users can access admin functions without proper authorization'
  },
  {
    id: 'v4',
    domain: 'portal.company.com',
    name: 'Insecure Direct Object References',
    severity: 'medium',
    cvssScore: 6.5,
    dateFound: '2024-01-13T16:45:00Z',
    status: 'fixed',
    slaDue: '2024-01-20T16:45:00Z',
    owaspCategory: 'A01:2021 – Broken Access Control',
    description: 'Users can access other users\' documents by changing URL parameters'
  },
  {
    id: 'v5',
    domain: 'dev.company.com',
    name: 'Sensitive Data Exposure',
    severity: 'high',
    cvssScore: 8.2,
    dateFound: '2024-01-11T10:00:00Z',
    status: 'open',
    slaDue: '2024-01-18T10:00:00Z',
    owaspCategory: 'A02:2021 – Cryptographic Failures',
    description: 'Database credentials exposed in configuration files'
  }
];

export const mockRiskTimeline: RiskTimelineData[] = [
  { date: '2024-01-01', riskScore: 5.2, domain: 'app.company.com' },
  { date: '2024-01-02', riskScore: 5.8, domain: 'app.company.com' },
  { date: '2024-01-03', riskScore: 6.1, domain: 'app.company.com' },
  { date: '2024-01-04', riskScore: 7.3, domain: 'app.company.com' },
  { date: '2024-01-05', riskScore: 8.1, domain: 'app.company.com' },
  { date: '2024-01-06', riskScore: 8.7, domain: 'app.company.com' },
  { date: '2024-01-07', riskScore: 9.2, domain: 'app.company.com', predicted: true },
  { date: '2024-01-08', riskScore: 9.5, domain: 'app.company.com', predicted: true },
  // API domain
  { date: '2024-01-01', riskScore: 7.8, domain: 'api.company.com' },
  { date: '2024-01-02', riskScore: 7.2, domain: 'api.company.com' },
  { date: '2024-01-03', riskScore: 6.8, domain: 'api.company.com' },
  { date: '2024-01-04', riskScore: 6.5, domain: 'api.company.com' },
  { date: '2024-01-05', riskScore: 6.2, domain: 'api.company.com' },
  { date: '2024-01-06', riskScore: 5.9, domain: 'api.company.com' },
  { date: '2024-01-07', riskScore: 5.6, domain: 'api.company.com', predicted: true },
  { date: '2024-01-08', riskScore: 5.3, domain: 'api.company.com', predicted: true }
];

export const mockThreats: ThreatData[] = [
  {
    category: 'A01:2021 – Broken Access Control',
    count: 45,
    severity: { critical: 12, high: 18, medium: 10, low: 5 }
  },
  {
    category: 'A02:2021 – Cryptographic Failures',
    count: 32,
    severity: { critical: 8, high: 14, medium: 7, low: 3 }
  },
  {
    category: 'A03:2021 – Injection',
    count: 28,
    severity: { critical: 15, high: 8, medium: 3, low: 2 }
  },
  {
    category: 'A04:2021 – Insecure Design',
    count: 19,
    severity: { critical: 3, high: 7, medium: 6, low: 3 }
  },
  {
    category: 'A05:2021 – Security Misconfiguration',
    count: 38,
    severity: { critical: 5, high: 12, medium: 15, low: 6 }
  },
  {
    category: 'A06:2021 – Vulnerable Components',
    count: 24,
    severity: { critical: 6, high: 9, medium: 6, low: 3 }
  },
  {
    category: 'A07:2021 – Cross-Site Scripting',
    count: 16,
    severity: { critical: 2, high: 8, medium: 4, low: 2 }
  }
];

export const mockMLInsights: MLInsight[] = [
  {
    id: 'ml1',
    domain: 'app.company.com',
    type: 'spike',
    confidence: 0.94,
    description: 'Unusual increase in vulnerability count detected. Risk score increased by 65% in 24 hours.',
    timestamp: '2024-01-15T08:30:00Z',
    severity: 'high'
  },
  {
    id: 'ml2',
    domain: 'api.company.com',
    type: 'trend',
    confidence: 0.87,
    description: 'Positive trend detected: Risk score decreasing consistently over 5 days.',
    timestamp: '2024-01-14T12:15:00Z',
    severity: 'medium'
  },
  {
    id: 'ml3',
    domain: 'admin.company.com',
    type: 'anomaly',
    confidence: 0.91,
    description: 'Anomalous pattern: Multiple critical vulnerabilities found in short timeframe.',
    timestamp: '2024-01-13T16:45:00Z',
    severity: 'high'
  }
];

export const mockScans: ScanData[] = [
  {
    id: 's1',
    domain: 'app.company.com',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'success',
    duration: 847,
    filesAnalyzed: 1247,
    vulnerabilitiesFound: 23
  },
  {
    id: 's2',
    domain: 'api.company.com',
    timestamp: '2024-01-15T11:45:00Z',
    status: 'running',
    duration: 0,
    filesAnalyzed: 0,
    vulnerabilitiesFound: 0
  },
  {
    id: 's3',
    domain: 'admin.company.com',
    timestamp: '2024-01-13T08:15:00Z',
    status: 'failed',
    duration: 156,
    filesAnalyzed: 234,
    vulnerabilitiesFound: 0,
    errorMessage: 'Connection timeout to target server'
  },
  {
    id: 's4',
    domain: 'portal.company.com',
    timestamp: '2024-01-15T16:45:00Z',
    status: 'success',
    duration: 423,
    filesAnalyzed: 892,
    vulnerabilitiesFound: 8
  },
  {
    id: 's5',
    domain: 'dev.company.com',
    timestamp: '2024-01-12T12:00:00Z',
    status: 'success',
    duration: 634,
    filesAnalyzed: 1103,
    vulnerabilitiesFound: 19
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'a1',
    user: 'john.doe@company.com',
    action: 'Mark Vulnerability as Fixed',
    target: 'SQL Injection in Login Form',
    timestamp: '2024-01-15T14:30:00Z',
    ip: '192.168.1.45',
    details: 'Marked vulnerability v1 as fixed after code review'
  },
  {
    id: 'a2',
    user: 'jane.smith@company.com',
    action: 'Start Manual Scan',
    target: 'api.company.com',
    timestamp: '2024-01-15T11:45:00Z',
    ip: '192.168.1.67',
    details: 'Initiated manual vulnerability scan'
  },
  {
    id: 'a3',
    user: 'admin@company.com',
    action: 'Update SLA Settings',
    target: 'Critical Vulnerabilities',
    timestamp: '2024-01-15T09:20:00Z',
    ip: '192.168.1.23',
    details: 'Changed critical vulnerability SLA from 7 days to 3 days'
  }
];

export const globalMetrics = {
  domainsMonitored: mockDomains.length,
  activeScans: mockScans.filter(s => s.status === 'running').length,
  totalVulnerabilities: mockVulnerabilities.length,
  averageRiskScore: mockDomains.reduce((acc, d) => acc + d.riskScore, 0) / mockDomains.length,
  slaCompliance: mockDomains.reduce((acc, d) => acc + d.slaCompliance, 0) / mockDomains.length,
  mttd: 2.4, // Mean Time to Detection (hours)
  mttr: 18.7 // Mean Time to Resolution (hours)
};