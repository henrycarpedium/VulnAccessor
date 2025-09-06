import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Target,
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';
import { mockVulnerabilities, mockDomains } from '../../data/mockData';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export function ComplianceSLAPage() {
  const { state, actions } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Calculate SLA metrics
  const getSLAMetrics = () => {
    const now = new Date();
    
    const metrics = {
      total: state.vulnerabilities.length,
      onTime: 0,
      atRisk: 0, // Within 24 hours of deadline
      overdue: 0,
      resolved: 0
    };

    state.vulnerabilities.forEach(vuln => {
      const dueDate = new Date(vuln.slaDue);
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

      if (vuln.status === 'fixed') {
        metrics.resolved++;
      } else if (daysDiff < 0) {
        metrics.overdue++;
      } else if (daysDiff <= 1) {
        metrics.atRisk++;
      } else {
        metrics.onTime++;
      }
    });

    return metrics;
  };

  const slaMetrics = getSLAMetrics();
  const complianceRate = ((slaMetrics.onTime + slaMetrics.resolved) / slaMetrics.total) * 100;

  // Prepare pie chart data
  const pieData = [
    { name: 'On Time', value: slaMetrics.onTime, color: '#10b981' },
    { name: 'At Risk', value: slaMetrics.atRisk, color: '#f59e0b' },
    { name: 'Overdue', value: slaMetrics.overdue, color: '#ef4444' },
    { name: 'Resolved', value: slaMetrics.resolved, color: '#6b7280' }
  ];

  // Calculate domain-wise SLA compliance
  const domainCompliance = state.domains.map(domain => {
    const domainVulns = state.vulnerabilities.filter(v => v.domain === domain.name);
    const totalVulns = domainVulns.length;
    const onTimeVulns = domainVulns.filter(v => {
      const dueDate = new Date(v.slaDue);
      const now = new Date();
      return dueDate.getTime() > now.getTime() || v.status === 'fixed';
    }).length;
    
    return {
      domain: domain.name,
      compliance: totalVulns > 0 ? (onTimeVulns / totalVulns) * 100 : 100,
      total: totalVulns,
      onTime: onTimeVulns
    };
  });

  // Generate aging report data
  const getAgingData = () => {
    const aging = {
      '0-7': 0,
      '8-14': 0,
      '15-30': 0,
      '31+': 0
    };

    state.vulnerabilities.forEach(vuln => {
      if (vuln.status === 'open') {
        const daysSinceFound = Math.floor((Date.now() - new Date(vuln.dateFound).getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceFound <= 7) aging['0-7']++;
        else if (daysSinceFound <= 14) aging['8-14']++;
        else if (daysSinceFound <= 30) aging['15-30']++;
        else aging['31+']++;
      }
    });

    return Object.entries(aging).map(([range, count]) => ({
      range,
      count,
      percentage: (count / state.vulnerabilities.filter(v => v.status === 'open').length) * 100
    }));
  };

  const agingData = getAgingData();

  // SLA breach trends (mock data)
  const breachTrends = [
    { date: '2024-01-01', breaches: 2, compliance: 95 },
    { date: '2024-01-02', breaches: 3, compliance: 92 },
    { date: '2024-01-03', breaches: 1, compliance: 96 },
    { date: '2024-01-04', breaches: 4, compliance: 89 },
    { date: '2024-01-05', breaches: 2, compliance: 94 },
    { date: '2024-01-06', breaches: 1, compliance: 97 },
    { date: '2024-01-07', breaches: 3, compliance: 91 }
  ];

  const getOverdueVulnerabilities = () => {
    const now = new Date();
    return state.vulnerabilities
      .filter(vuln => {
        const dueDate = new Date(vuln.slaDue);
        return dueDate < now && vuln.status === 'open';
      })
      .map(vuln => {
        const dueDate = new Date(vuln.slaDue);
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return { ...vuln, daysOverdue };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);
  };

  const handleGenerateReport = (framework: string) => {
    actions.generateReport(`${framework} Compliance Report`, {
      framework,
      dateRange: selectedTimeframe,
      includeCharts: true,
      includeRecommendations: true
    });
  };

  const handleBulkResolve = () => {
    const overdueCritical = state.vulnerabilities.filter(v => {
      const dueDate = new Date(v.slaDue);
      return dueDate < new Date() && v.severity === 'critical' && v.status === 'open';
    });
    
    if (overdueCritical.length > 0) {
      actions.bulkUpdateVulnerabilities(
        overdueCritical.map(v => v.id),
        { status: 'accepted' }
      );
      actions.addNotification({
        type: 'warning',
        title: 'Bulk Resolution',
        message: `Marked ${overdueCritical.length} overdue critical vulnerabilities as accepted`
      });
    } else {
      actions.addNotification({
        type: 'info',
        title: 'No Action Needed',
        message: 'No overdue critical vulnerabilities found'
      });
    }
  };

  const overdueVulns = getOverdueVulnerabilities();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Compliance & SLA Monitoring</h1>
        <p className="text-muted-foreground">
          Track SLA adherence, compliance metrics, and vulnerability aging across all domains
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Overall Compliance</span>
            </div>
            <div className="text-2xl font-bold">{complianceRate.toFixed(1)}%</div>
            <Progress value={complianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">SLA Breaches</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{slaMetrics.overdue}</div>
            <p className="text-xs text-muted-foreground mt-1">Overdue vulnerabilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">At Risk</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{slaMetrics.atRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">Due within 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">On Track</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{slaMetrics.onTime}</div>
            <p className="text-xs text-muted-foreground mt-1">Meeting deadlines</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>SLA Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex justify-around mt-4 text-sm">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={breachTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Domain Compliance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Domain-wise SLA Compliance</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Compliance Rate</TableHead>
                  <TableHead>Total Vulnerabilities</TableHead>
                  <TableHead>On Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domainCompliance.map((domain, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{domain.domain}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={domain.compliance} className="w-20" />
                        <span className="text-sm font-medium">{domain.compliance.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{domain.total}</TableCell>
                    <TableCell>{domain.onTime}</TableCell>
                    <TableCell>
                      <Badge className={
                        domain.compliance >= 90 ? 'bg-green-100 text-green-800' :
                        domain.compliance >= 70 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {domain.compliance >= 90 ? 'Good' :
                         domain.compliance >= 70 ? 'At Risk' : 'Poor'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TrendingUp className={`h-4 w-4 ${
                        Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'
                      }`} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerability Aging Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Aging Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={agingData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" />
              <YAxis dataKey="range" type="category" width={60} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} vulnerabilities (${agingData.find(d => d.count === value)?.percentage.toFixed(1)}%)`,
                  'Count'
                ]}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Vulnerability age distribution (days since discovery)</p>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Vulnerabilities */}
      {overdueVulns.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Overdue Vulnerabilities
              </CardTitle>
              <Badge variant="destructive">{overdueVulns.length} overdue</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vulnerability</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>CVSS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueVulns.slice(0, 10).map((vuln) => (
                    <TableRow key={vuln.id} className="border-l-4 border-l-red-500">
                      <TableCell>
                        <div>
                          <div className="font-medium">{vuln.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {vuln.owaspCategory}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{vuln.domain}</TableCell>
                      <TableCell>
                        <Badge className={
                          vuln.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          vuln.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {vuln.severity.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(vuln.slaDue).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600 font-bold">
                          {vuln.daysOverdue} days
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vuln.cvssScore}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Immediate Action Required</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {slaMetrics.overdue} vulnerabilities are past their SLA deadline
            </p>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              Review Overdue Items
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">At Risk Items</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {slaMetrics.atRisk} vulnerabilities due within 24 hours
            </p>
            <Button size="sm" variant="outline">
              Prioritize Actions
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Generate Compliance Report</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create detailed SLA compliance report for stakeholders
            </p>
            <Button size="sm" variant="outline" className="border-blue-300">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}