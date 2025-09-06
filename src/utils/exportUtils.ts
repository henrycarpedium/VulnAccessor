// Export utilities for VulnerAccessor
import { Vulnerability, Domain, ScanData, AuditLog } from '../data/mockData';

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel' | 'json';
  filename?: string;
  includeHeaders?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// CSV Export Functions
export function exportToCSV(data: any[], filename: string = 'export.csv') {
  if (!data.length) {
    throw new Error('No data to export');
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

// JSON Export
export function exportToJSON(data: any[], filename: string = 'export.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

// PDF Export (simplified - in real app would use jsPDF or similar)
export function exportToPDF(data: any[], filename: string = 'export.pdf', title: string = 'Export Report') {
  // Create a simple HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .metadata { margin-bottom: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="metadata">
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total Records: ${data.length}</p>
      </div>
      ${generateTableHTML(data)}
    </body>
    </html>
  `;

  // Convert HTML to blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace('.pdf', '.html'); // For now, export as HTML
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate HTML table from data
function generateTableHTML(data: any[]): string {
  if (!data.length) return '<p>No data available</p>';

  const headers = Object.keys(data[0]);
  
  return `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Generic file download function
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Specific export functions for different data types
export function exportVulnerabilities(vulnerabilities: Vulnerability[], options: ExportOptions) {
  const processedData = vulnerabilities.map(vuln => ({
    ID: vuln.id,
    Name: vuln.name,
    Domain: vuln.domain,
    Severity: vuln.severity,
    'CVSS Score': vuln.cvssScore,
    Status: vuln.status,
    'Date Found': new Date(vuln.dateFound).toLocaleDateString(),
    'SLA Due': new Date(vuln.slaDue).toLocaleDateString(),
    'OWASP Category': vuln.owaspCategory,
    Description: vuln.description
  }));

  const filename = options.filename || `vulnerabilities_${new Date().toISOString().split('T')[0]}.${options.format}`;

  switch (options.format) {
    case 'csv':
      exportToCSV(processedData, filename);
      break;
    case 'json':
      exportToJSON(processedData, filename);
      break;
    case 'pdf':
      exportToPDF(processedData, filename, 'Vulnerability Report');
      break;
    default:
      exportToCSV(processedData, filename.replace(`.${options.format}`, '.csv'));
  }
}

export function exportDomains(domains: Domain[], options: ExportOptions) {
  const processedData = domains.map(domain => ({
    ID: domain.id,
    Name: domain.name,
    'Risk Score': domain.riskScore,
    Status: domain.status,
    Vulnerabilities: domain.vulnerabilities,
    'Last Scan': new Date(domain.lastScan).toLocaleDateString(),
    'SLA Compliance': `${domain.slaCompliance}%`,
    Trend: domain.trend
  }));

  const filename = options.filename || `domains_${new Date().toISOString().split('T')[0]}.${options.format}`;

  switch (options.format) {
    case 'csv':
      exportToCSV(processedData, filename);
      break;
    case 'json':
      exportToJSON(processedData, filename);
      break;
    case 'pdf':
      exportToPDF(processedData, filename, 'Domain Security Report');
      break;
    default:
      exportToCSV(processedData, filename.replace(`.${options.format}`, '.csv'));
  }
}

export function exportScans(scans: ScanData[], options: ExportOptions) {
  const processedData = scans.map(scan => ({
    ID: scan.id,
    Domain: scan.domain,
    Timestamp: new Date(scan.timestamp).toLocaleString(),
    Status: scan.status,
    'Duration (seconds)': scan.duration,
    'Files Analyzed': scan.filesAnalyzed,
    'Vulnerabilities Found': scan.vulnerabilitiesFound,
    'Error Message': scan.errorMessage || 'N/A'
  }));

  const filename = options.filename || `scans_${new Date().toISOString().split('T')[0]}.${options.format}`;

  switch (options.format) {
    case 'csv':
      exportToCSV(processedData, filename);
      break;
    case 'json':
      exportToJSON(processedData, filename);
      break;
    case 'pdf':
      exportToPDF(processedData, filename, 'Scan History Report');
      break;
    default:
      exportToCSV(processedData, filename.replace(`.${options.format}`, '.csv'));
  }
}

export function exportAuditLogs(logs: AuditLog[], options: ExportOptions) {
  const processedData = logs.map(log => ({
    ID: log.id,
    User: log.user,
    Action: log.action,
    Target: log.target,
    Timestamp: new Date(log.timestamp).toLocaleString(),
    'IP Address': log.ip,
    Details: log.details
  }));

  const filename = options.filename || `audit_logs_${new Date().toISOString().split('T')[0]}.${options.format}`;

  switch (options.format) {
    case 'csv':
      exportToCSV(processedData, filename);
      break;
    case 'json':
      exportToJSON(processedData, filename);
      break;
    case 'pdf':
      exportToPDF(processedData, filename, 'Audit Log Report');
      break;
    default:
      exportToCSV(processedData, filename.replace(`.${options.format}`, '.csv'));
  }
}
