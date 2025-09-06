import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Activity,
  Target,
  Calendar,
  FileText
} from 'lucide-react';
import { mockDomains, mockVulnerabilities, mockRiskTimeline, mockScans } from '../../data/mockData';

export function DomainDetailsPage() {
  const [selectedDomain, setSelectedDomain] = useState(mockDomains[0].id);
  
  const currentDomain = mockDomains.find(d => d.id === selectedDomain) || mockDomains[0];
  const domainVulns = mockVulnerabilities.filter(v => v.domain === currentDomain.name);
  const domainRiskHistory = mockRiskTimeline.filter(item => item.domain === currentDomain.name);
  const domainScans = mockScans.filter(s => s.domain === currentDomain.name);

  // Calculate additional metrics
  const criticalVulns = domainVulns.filter(v => v.severity === 'critical').length;
  const openVulns = domainVulns.filter(v => v.status === 'open').length;
  const overdueVulns = domainVulns.filter(v => {
    const dueDate = new Date(v.slaDue);
    return dueDate < new Date() && v.status === 'open';
  }).length;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getTimeRemaining = (slaDue: string) => {
    const dueDate = new Date(slaDue);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600', overdue: true };
    } else if (diffDays <= 2) {
      return { text: `${diffDays} days left`, color: 'text-orange-600', urgent: true };
    } else {
      return { text: `${diffDays} days left`, color: 'text-green-600', safe: true };
    }
  };

  // Prepare vulnerability timeline data
  const vulnTimelineData = domainRiskHistory.map(item => ({
    date: item.date,
    riskScore: item.riskScore,
    vulnerabilities: Math.floor(item.riskScore * 3) // Mock vulnerability count
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Domain Security Analysis</h1>
          <p className="text-muted-foreground">
            Deep-dive analysis of individual domain security posture
          </p>
        </div>
        
        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {mockDomains.map(domain => (
              <SelectItem key={domain.id} value={domain.id}>
                {domain.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Domain Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentDomain.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">Risk Score:</span>
                  <Badge className={`text-lg px-3 py-1 ${
                    currentDomain.riskScore >= 8 ? 'bg-red-100 text-red-800' :
                    currentDomain.riskScore >= 6 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {currentDomain.riskScore.toFixed(1)}
                  </Badge>
                  {getTrendIcon(currentDomain.trend)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-right">
              <div>
                <div className="text-2xl font-bold">{currentDomain.slaCompliance}%</div>
                <div className="text-sm text-muted-foreground">SLA Compliance</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{currentDomain.vulnerabilities}</div>
                <div className="text-sm text-muted-foreground">Total Vulnerabilities</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{criticalVulns}</div>
                <div className="text-sm text-muted-foreground">Critical Issues</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Open Vulnerabilities</span>
            </div>
            <div className="text-2xl font-bold">{openVulns}</div>
            <Progress value={(openVulns / domainVulns.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">SLA Breaches</span>
            </div>
            <div className="text-2xl font-bold">{overdueVulns}</div>
            <p className="text-xs text-muted-foreground mt-1">Overdue items</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Last Scan</span>
            </div>
            <div className="text-lg font-bold">
              {new Date(currentDomain.lastScan).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.floor((Date.now() - new Date(currentDomain.lastScan).getTime()) / (1000 * 60 * 60))}h ago
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Scan Status</span>
            </div>
            <div className="text-lg font-bold capitalize">{currentDomain.status}</div>
            <Badge variant={currentDomain.status === 'active' ? 'default' : 'secondary'} className="mt-1">
              {currentDomain.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vulnTimelineData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [value, name === 'riskScore' ? 'Risk Score' : 'Vulnerabilities']}
                />
                <Line 
                  type="monotone" 
                  dataKey="riskScore" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vulnerability Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['critical', 'high', 'medium', 'low'].map(severity => {
                const count = domainVulns.filter(v => v.severity === severity).length;
                const percentage = domainVulns.length > 0 ? (count / domainVulns.length) * 100 : 0;
                
                return (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getSeverityColor(severity)}>
                        {severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm">{count} vulnerabilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage} className="w-24" />
                      <span className="text-sm text-muted-foreground w-10">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Vulnerabilities with SLA Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Top Vulnerabilities & SLA Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vulnerability</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>CVSS Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SLA Deadline</TableHead>
                  <TableHead>Time Remaining</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domainVulns.slice(0, 5).map((vuln) => {
                  const timeRemaining = getTimeRemaining(vuln.slaDue);
                  const daysSinceFound = Math.floor((Date.now() - new Date(vuln.dateFound).getTime()) / (1000 * 60 * 60 * 24));
                  const totalSLADays = vuln.severity === 'critical' ? 3 : vuln.severity === 'high' ? 7 : 14;
                  const progressPercentage = Math.min((daysSinceFound / totalSLADays) * 100, 100);
                  
                  return (
                    <TableRow key={vuln.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vuln.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {vuln.owaspCategory}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vuln.cvssScore}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vuln.status === 'open' ? 'destructive' : 'default'}>
                          {vuln.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(vuln.slaDue).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={timeRemaining.color}>
                          {timeRemaining.text}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={progressPercentage} 
                            className={`w-16 ${timeRemaining.overdue ? 'bg-red-100' : timeRemaining.urgent ? 'bg-orange-100' : 'bg-green-100'}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Scan History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scan History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {domainScans.map((scan) => (
              <div 
                key={scan.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    scan.status === 'success' ? 'bg-green-500' :
                    scan.status === 'failed' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  
                  <div>
                    <div className="font-medium">
                      {new Date(scan.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {scan.status === 'running' ? 'Scan in progress...' :
                       scan.status === 'failed' ? 'Scan failed' :
                       `Found ${scan.vulnerabilitiesFound} vulnerabilities`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div>
                    <FileText className="h-4 w-4 inline mr-1" />
                    {scan.filesAnalyzed.toLocaleString()} files
                  </div>
                  <div>
                    <Clock className="h-4 w-4 inline mr-1" />
                    {Math.floor(scan.duration / 60)}:{(scan.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <Badge variant={
                    scan.status === 'success' ? 'default' :
                    scan.status === 'failed' ? 'destructive' :
                    'secondary'
                  }>
                    {scan.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Run New Scan
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generate Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Scan
        </Button>
      </div>
    </div>
  );
}