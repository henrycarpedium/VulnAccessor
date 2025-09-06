import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  FileText, 
  Download, 
  Calendar, 
  Settings, 
  Mail, 
  Clock,
  BarChart,
  PieChart,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Play
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'technical' | 'compliance' | 'custom';
  format: 'pdf' | 'csv' | 'json' | 'html';
  estimatedTime: string;
  icon: React.ElementType;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level security posture overview for leadership',
    type: 'executive',
    format: 'pdf',
    estimatedTime: '2-3 minutes',
    icon: TrendingUp
  },
  {
    id: 'technical-details',
    name: 'Technical Vulnerability Report',
    description: 'Detailed technical findings for security teams',
    type: 'technical',
    format: 'pdf',
    estimatedTime: '5-7 minutes',
    icon: Shield
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit Report',
    description: 'SLA compliance and regulatory requirements',
    type: 'compliance',
    format: 'pdf',
    estimatedTime: '3-4 minutes',
    icon: CheckCircle
  },
  {
    id: 'vulnerability-export',
    name: 'Vulnerability Data Export',
    description: 'Raw vulnerability data for external tools',
    type: 'technical',
    format: 'csv',
    estimatedTime: '1 minute',
    icon: Download
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Report',
    description: 'Risk analysis and trend forecasting',
    type: 'executive',
    format: 'pdf',
    estimatedTime: '4-5 minutes',
    icon: BarChart
  },
  {
    id: 'scan-results',
    name: 'Scan Results Summary',
    description: 'Recent scan outcomes and statistics',
    type: 'technical',
    format: 'html',
    estimatedTime: '2 minutes',
    icon: PieChart
  }
];

const scheduledReports = [
  {
    id: 'sr1',
    name: 'Weekly Executive Summary',
    template: 'Executive Summary',
    frequency: 'Weekly - Mondays 9:00 AM',
    recipients: 'ciso@company.com, executives@company.com',
    lastRun: '2024-01-15T09:00:00Z',
    status: 'active'
  },
  {
    id: 'sr2',
    name: 'Daily Compliance Check',
    template: 'Compliance Audit Report',
    frequency: 'Daily - 6:00 AM',
    recipients: 'compliance@company.com',
    lastRun: '2024-01-15T06:00:00Z',
    status: 'active'
  },
  {
    id: 'sr3',
    name: 'Monthly Risk Assessment',
    template: 'Risk Assessment Report',
    frequency: 'Monthly - 1st day 8:00 AM',
    recipients: 'risk-team@company.com',
    lastRun: '2024-01-01T08:00:00Z',
    status: 'paused'
  }
];

export function ReportsExportPage() {
  const { state, actions } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);

  const handleGenerateReport = () => {
    if (!selectedTemplate) {
      actions.addNotification({
        type: 'error',
        title: 'Template Required',
        message: 'Please select a report template before generating.'
      });
      return;
    }

    const templateData = reportTemplates.find(t => t.id === selectedTemplate);
    if (!templateData) return;

    const reportOptions = {
      title: reportTitle || templateData.name,
      description: reportDescription,
      dateRange,
      domains: selectedDomains.length > 0 ? selectedDomains : state.domains.map(d => d.id),
      includeCharts,
      includeRecommendations,
      template: templateData.name
    };

    actions.generateReport(templateData.name, reportOptions);
  };

  const handleDomainSelection = (domainId: string, checked: boolean) => {
    if (checked) {
      setSelectedDomains(prev => [...prev, domainId]);
    } else {
      setSelectedDomains(prev => prev.filter(id => id !== domainId));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'executive':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'technical':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'compliance':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'csv':
        return <Download className="h-4 w-4 text-green-500" />;
      case 'json':
        return <Download className="h-4 w-4 text-blue-500" />;
      case 'html':
        return <Download className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports & Export Center</h1>
        <p className="text-muted-foreground">
          Generate custom reports, schedule automated deliveries, and export data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Report Template Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === template.id;
                  
                  return (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{template.name}</h3>
                            <Badge className={getTypeColor(template.type)}>
                              {template.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {getFormatIcon(template.format)}
                              <span>{template.format.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{template.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Title</label>
                    <Input
                      placeholder="Custom report title..."
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Report description or notes..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Domain Selection</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {state.domains.map((domain) => (
                      <div key={domain.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={domain.id}
                          checked={selectedDomains.includes(domain.id)}
                          onCheckedChange={(checked) => handleDomainSelection(domain.id, checked as boolean)}
                        />
                        <label htmlFor={domain.id} className="text-sm">
                          {domain.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Report Options</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeCharts"
                        checked={includeCharts}
                        onCheckedChange={setIncludeCharts}
                      />
                      <label htmlFor="includeCharts" className="text-sm">
                        Include charts and visualizations
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeRecommendations"
                        checked={includeRecommendations}
                        onCheckedChange={setIncludeRecommendations}
                      />
                      <label htmlFor="includeRecommendations" className="text-sm">
                        Include remediation recommendations
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleGenerateReport} 
                    disabled={state.loading}
                    className="flex items-center gap-2"
                  >
                    {state.loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => actions.addNotification({
                      type: 'info',
                      title: 'Email Feature',
                      message: 'Email report functionality would be implemented here.'
                    })}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Report
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => actions.addNotification({
                      type: 'info',
                      title: 'Schedule Feature',
                      message: 'Report scheduling functionality would be implemented here.'
                    })}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions & Scheduled Reports */}
        <div className="space-y-6">
          {/* Quick Export */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  const csvData = state.vulnerabilities.map(v => ({
                    Domain: v.domain,
                    Name: v.name,
                    Severity: v.severity,
                    Status: v.status,
                    'CVSS Score': v.cvssScore,
                    'Date Found': v.dateFound
                  }));
                  
                  const csv = [
                    Object.keys(csvData[0]).join(','),
                    ...csvData.map(row => Object.values(row).join(','))
                  ].join('\n');
                  
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'all_vulnerabilities.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                  
                  actions.addNotification({
                    type: 'success',
                    title: 'Export Complete',
                    message: 'All vulnerabilities exported to CSV'
                  });
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export All Vulnerabilities (CSV)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => actions.generateReport('Current Scan Results', { format: 'pdf' })}
              >
                <FileText className="h-4 w-4 mr-2" />
                Current Scan Results (PDF)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  const metrics = {
                    domains: state.domains.length,
                    vulnerabilities: state.vulnerabilities.length,
                    scans: state.scans.length,
                    timestamp: new Date().toISOString()
                  };
                  
                  const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'risk_metrics.json';
                  a.click();
                  URL.revokeObjectURL(url);
                  
                  actions.addNotification({
                    type: 'success',
                    title: 'Export Complete',
                    message: 'Risk metrics exported to JSON'
                  });
                }}
              >
                <BarChart className="h-4 w-4 mr-2" />
                Risk Metrics (JSON)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => actions.generateReport('Compliance Summary', { format: 'pdf' })}
              >
                <Shield className="h-4 w-4 mr-2" />
                Compliance Summary (PDF)
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Executive Summary - January', date: '2024-01-15', size: '2.3 MB' },
                  { name: 'Technical Report - Weekly', date: '2024-01-14', size: '4.7 MB' },
                  { name: 'Compliance Audit Q1', date: '2024-01-13', size: '1.8 MB' },
                  { name: 'Risk Assessment Dec', date: '2024-01-12', size: '3.2 MB' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{report.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(report.date).toLocaleDateString()} • {report.size}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Scheduled Reports</CardTitle>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{report.template}</TableCell>
                    <TableCell className="text-sm">{report.frequency}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {report.recipients}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(report.lastRun).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        report.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Reports Generated</span>
            </div>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Data Exported</span>
            </div>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground">Total size</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Scheduled Reports</span>
            </div>
            <div className="text-2xl font-bold">{scheduledReports.length}</div>
            <p className="text-xs text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Avg Generation Time</span>
            </div>
            <div className="text-2xl font-bold">3.2m</div>
            <p className="text-xs text-muted-foreground">Per report</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}