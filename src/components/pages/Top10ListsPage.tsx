import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useApp } from '../../contexts/AppContext';
import { Progress } from '../ui/progress';
import { 
  Trophy, 
  AlertTriangle, 
  TrendingUp, 
  XCircle, 
  Activity, 
  Target,
  Clock,
  Shield,
  Zap,
  FileText
} from 'lucide-react';
import { mockDomains, mockVulnerabilities, mockScans } from '../../data/mockData';

export function Top10ListsPage() {
  const { actions } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('domains');

  // Calculate top vulnerable domains
  const getTopVulnerableDomains = () => {
    return mockDomains
      .map(domain => {
        const domainVulns = mockVulnerabilities.filter(v => v.domain === domain.name);
        const criticalCount = domainVulns.filter(v => v.severity === 'critical').length;
        const highCount = domainVulns.filter(v => v.severity === 'high').length;
        
        return {
          ...domain,
          vulnerabilityCount: domainVulns.length,
          criticalCount,
          highCount,
          riskWeight: criticalCount * 3 + highCount * 2 + domainVulns.filter(v => v.severity === 'medium').length
        };
      })
      .sort((a, b) => b.riskWeight - a.riskWeight)
      .slice(0, 10);
  };

  // Calculate recurring vulnerabilities
  const getRecurringVulnerabilities = () => {
    const vulnTypes = {};
    
    mockVulnerabilities.forEach(vuln => {
      const type = vuln.name.split(' ')[0] + ' ' + vuln.name.split(' ')[1]; // Get first two words
      if (!vulnTypes[type]) {
        vulnTypes[type] = {
          name: type,
          count: 0,
          domains: new Set(),
          severity: vuln.severity,
          avgCvss: 0,
          totalCvss: 0
        };
      }
      
      vulnTypes[type].count++;
      vulnTypes[type].domains.add(vuln.domain);
      vulnTypes[type].totalCvss += vuln.cvssScore;
      vulnTypes[type].avgCvss = vulnTypes[type].totalCvss / vulnTypes[type].count;
    });

    return Object.values(vulnTypes)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  // Calculate SLA breaches
  const getSLABreaches = () => {
    const now = new Date();
    return mockVulnerabilities
      .filter(vuln => {
        const dueDate = new Date(vuln.slaDue);
        return dueDate < now && vuln.status === 'open';
      })
      .map(vuln => {
        const dueDate = new Date(vuln.slaDue);
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return { ...vuln, daysOverdue };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue)
      .slice(0, 10);
  };

  // Calculate failed scans
  const getFailedScans = () => {
    return mockScans
      .filter(scan => scan.status === 'failed')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  };

  // Calculate risk score spikes
  const getRiskSpikes = () => {
    return mockDomains
      .filter(domain => domain.trend === 'up')
      .map(domain => ({
        ...domain,
        spikePercentage: Math.floor(Math.random() * 50) + 20, // Mock spike percentage
        timeframe: '24h'
      }))
      .sort((a, b) => b.spikePercentage - a.spikePercentage)
      .slice(0, 10);
  };

  // Mock data for other categories
  const getHighestCVSS = () => {
    return mockVulnerabilities
      .sort((a, b) => b.cvssScore - a.cvssScore)
      .slice(0, 10);
  };

  const getMostAffectedComponents = () => {
    const components = [
      { name: 'Login System', vulnerabilities: 12, domains: 3, severity: 'critical' },
      { name: 'API Gateway', vulnerabilities: 8, domains: 4, severity: 'high' },
      { name: 'Database Layer', vulnerabilities: 6, domains: 2, severity: 'high' },
      { name: 'File Upload', vulnerabilities: 5, domains: 3, severity: 'medium' },
      { name: 'Session Management', vulnerabilities: 4, domains: 2, severity: 'critical' }
    ];
    return components;
  };

  const getSlowScanners = () => {
    return mockScans
      .filter(scan => scan.status === 'success')
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
  };

  const getLargestTargets = () => {
    return mockScans
      .filter(scan => scan.status === 'success')
      .sort((a, b) => b.filesAnalyzed - a.filesAnalyzed)
      .slice(0, 10);
  };

  const getFrequentScanners = () => {
    const scanCounts = {};
    mockScans.forEach(scan => {
      scanCounts[scan.domain] = (scanCounts[scan.domain] || 0) + 1;
    });
    
    return Object.entries(scanCounts)
      .map(([domain, count]) => ({ domain, scanCount: count }))
      .sort((a, b) => b.scanCount - a.scanCount)
      .slice(0, 10);
  };

  const categories = [
    { 
      id: 'domains', 
      name: 'Vulnerable Domains', 
      icon: Shield, 
      data: getTopVulnerableDomains(),
      color: 'text-red-600'
    },
    { 
      id: 'recurring', 
      name: 'Recurring Vulnerabilities', 
      icon: AlertTriangle, 
      data: getRecurringVulnerabilities(),
      color: 'text-orange-600'
    },
    { 
      id: 'sla-breaches', 
      name: 'SLA Breaches', 
      icon: Clock, 
      data: getSLABreaches(),
      color: 'text-red-700'
    },
    { 
      id: 'failed-scans', 
      name: 'Failed Scans', 
      icon: XCircle, 
      data: getFailedScans(),
      color: 'text-red-500'
    },
    { 
      id: 'risk-spikes', 
      name: 'Risk Score Spikes', 
      icon: TrendingUp, 
      data: getRiskSpikes(),
      color: 'text-purple-600'
    },
    { 
      id: 'highest-cvss', 
      name: 'Highest CVSS Scores', 
      icon: Target, 
      data: getHighestCVSS(),
      color: 'text-red-800'
    },
    { 
      id: 'components', 
      name: 'Affected Components', 
      icon: Zap, 
      data: getMostAffectedComponents(),
      color: 'text-blue-600'
    },
    { 
      id: 'slow-scans', 
      name: 'Slowest Scans', 
      icon: Activity, 
      data: getSlowScanners(),
      color: 'text-yellow-600'
    },
    { 
      id: 'large-targets', 
      name: 'Largest Scan Targets', 
      icon: FileText, 
      data: getLargestTargets(),
      color: 'text-green-600'
    },
    { 
      id: 'frequent-scanners', 
      name: 'Most Scanned Domains', 
      icon: Trophy, 
      data: getFrequentScanners(),
      color: 'text-indigo-600'
    }
  ];

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const renderListItem = (item, index, categoryId) => {
    switch (categoryId) {
      case 'domains':
        return (
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  {item.vulnerabilityCount} vulnerabilities • {item.criticalCount} critical
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`text-lg px-3 py-1 ${
                item.riskScore >= 8 ? 'bg-red-100 text-red-800' :
                item.riskScore >= 6 ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.riskScore.toFixed(1)}
              </Badge>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">SLA Compliance</div>
                <div className="font-medium">{item.slaCompliance}%</div>
              </div>
            </div>
          </div>
        );

      case 'recurring':
        return (
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  Found in {item.domains.size} domains
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={
                item.severity === 'critical' ? 'bg-red-100 text-red-800' :
                item.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {item.severity.toUpperCase()}
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold">{item.count}</div>
                <div className="text-sm text-muted-foreground">occurrences</div>
              </div>
            </div>
          </div>
        );

      case 'sla-breaches':
        return (
          <div className="flex items-center justify-between p-4 border rounded-lg border-l-4 border-l-red-500 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.domain}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-red-100 text-red-800">
                {item.severity.toUpperCase()}
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">{item.daysOverdue}</div>
                <div className="text-sm text-muted-foreground">days overdue</div>
              </div>
            </div>
          </div>
        );

      case 'failed-scans':
        return (
          <div className="flex items-center justify-between p-4 border rounded-lg border-l-4 border-l-red-500 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
              <div>
                <div className="font-medium">{item.domain}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                {item.errorMessage && (
                  <div className="text-xs text-red-600 mt-1">{item.errorMessage}</div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</div>
            </div>
          </div>
        );

      case 'risk-spikes':
        return (
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  Risk spike in {item.timeframe}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-100 text-purple-800">
                +{item.spikePercentage}%
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold">{item.riskScore.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">current score</div>
              </div>
            </div>
          </div>
        );

      case 'highest-cvss':
        return (
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.domain}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-red-100 text-red-800">
                {item.severity.toUpperCase()}
              </Badge>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{item.cvssScore}</div>
                <div className="text-sm text-muted-foreground">CVSS Score</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
              <div className="font-medium">
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Top 10 Security Lists</h1>
        <p className="text-muted-foreground">
          Executive summary of critical security metrics and worst offenders
        </p>
      </div>

      {/* Category Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Icon className={`h-5 w-5 ${category.color}`} />
              <span className="text-xs text-center leading-tight">{category.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Selected Category Display */}
      {selectedCategoryData && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <selectedCategoryData.icon className={`h-6 w-6 ${selectedCategoryData.color}`} />
              <CardTitle>Top 10 {selectedCategoryData.name}</CardTitle>
              <Badge variant="outline" className="ml-auto">
                {selectedCategoryData.data.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedCategoryData.data.length > 0 ? (
                selectedCategoryData.data.map((item, index) => (
                  <div key={index}>
                    {renderListItem(item, index, selectedCategory)}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <selectedCategoryData.icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No data available for this category</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {getTopVulnerableDomains()[0]?.vulnerabilityCount || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Most vulnerabilities in single domain
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {getSLABreaches().length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total SLA breaches
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {getRiskSpikes()[0]?.spikePercentage || 0}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Largest risk spike (24h)
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <div className="flex gap-4">
        <Button
          className="flex items-center gap-2"
          onClick={async () => {
            await actions.generateReport('Executive Summary - Top 10 Lists', {
              includeCharts: true,
              includeMetrics: true,
              format: 'pdf'
            });
          }}
        >
          <FileText className="h-4 w-4" />
          Export Executive Summary
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={async () => {
            await actions.generateReport('Top 10 Security Report', {
              includeCharts: true,
              includeMetrics: true,
              format: 'pdf'
            });
          }}
        >
          <Trophy className="h-4 w-4" />
          Generate Top 10 Report
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            actions.addNotification({
              type: 'success',
              title: 'Report Scheduled',
              message: 'Weekly Top 10 report has been scheduled for every Monday at 9:00 AM'
            });
          }}
        >
          Schedule Weekly Report
        </Button>
      </div>
    </div>
  );
}