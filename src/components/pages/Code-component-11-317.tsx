import React, { useState, useEffect } from 'react';
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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell
} from 'recharts';
import { 
  Activity, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react';
import { mockScans, mockDomains } from '../../data/mockData';

export function ScanningHealthPage() {
  const [realTimeData, setRealTimeData] = useState({
    activeScans: 2,
    queuedScans: 5,
    completedToday: 12,
    errorRate: 4.2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeScans: Math.max(0, prev.activeScans + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        queuedScans: Math.max(0, prev.queuedScans + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        completedToday: prev.completedToday + (Math.random() > 0.9 ? 1 : 0),
        errorRate: Math.max(0, Math.min(10, prev.errorRate + (Math.random() - 0.5) * 0.5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Calculate scan health metrics
  const scanMetrics = {
    totalScans: mockScans.length,
    successfulScans: mockScans.filter(s => s.status === 'success').length,
    failedScans: mockScans.filter(s => s.status === 'failed').length,
    runningScans: mockScans.filter(s => s.status === 'running').length,
    averageDuration: Math.round(mockScans.filter(s => s.status === 'success').reduce((acc, s) => acc + s.duration, 0) / mockScans.filter(s => s.status === 'success').length)
  };

  const successRate = ((scanMetrics.successfulScans / scanMetrics.totalScans) * 100).toFixed(1);

  // Generate scan pipeline funnel data
  const funnelData = [
    { name: 'Scheduled', value: 100, fill: '#8884d8' },
    { name: 'Started', value: 95, fill: '#82ca9d' },
    { name: 'In Progress', value: 85, fill: '#ffc658' },
    { name: 'Completed', value: 78, fill: '#ff7300' },
    { name: 'Success', value: 72, fill: '#00C49F' }
  ];

  // Mock success rate trend data
  const successTrendData = [
    { date: '2024-01-01', successRate: 94.5, failureRate: 5.5 },
    { date: '2024-01-02', successRate: 92.3, failureRate: 7.7 },
    { date: '2024-01-03', successRate: 96.1, failureRate: 3.9 },
    { date: '2024-01-04', successRate: 89.2, failureRate: 10.8 },
    { date: '2024-01-05', successRate: 95.7, failureRate: 4.3 },
    { date: '2024-01-06', successRate: 91.8, failureRate: 8.2 },
    { date: '2024-01-07', successRate: 94.2, failureRate: 5.8 }
  ];

  // Scanner health status
  const scannerHealth = [
    { name: 'Scanner-01', status: 'healthy', load: 45, uptime: '99.9%', location: 'US-East' },
    { name: 'Scanner-02', status: 'healthy', load: 67, uptime: '99.5%', location: 'US-West' },
    { name: 'Scanner-03', status: 'warning', load: 89, uptime: '98.2%', location: 'EU-Central' },
    { name: 'Scanner-04', status: 'healthy', load: 23, uptime: '99.8%', location: 'Asia-Pacific' },
    { name: 'Scanner-05', status: 'maintenance', load: 0, uptime: '95.1%', location: 'US-Central' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'warning':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Scanning Health & Pipeline</h1>
        <p className="text-muted-foreground">
          Monitor scanner infrastructure performance, pipeline health, and operational metrics
        </p>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Active Scans</span>
            </div>
            <div className="text-2xl font-bold">{realTimeData.activeScans}</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Queued Scans</span>
            </div>
            <div className="text-2xl font-bold">{realTimeData.queuedScans}</div>
            <p className="text-xs text-muted-foreground mt-1">Waiting to start</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Completed Today</span>
            </div>
            <div className="text-2xl font-bold">{realTimeData.completedToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(realTimeData.completedToday / 24 * 10) / 10}/hour avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="flex items-center gap-1 mt-1">
              {parseFloat(successRate) >= 95 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className="text-xs text-muted-foreground">Last 24h</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Pipeline Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Pipeline Health</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <FunnelChart>
                <Funnel dataKey="value" data={funnelData} fill="#8884d8" />
                <Tooltip />
              </FunnelChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-5 gap-2 mt-4 text-xs">
              {funnelData.map((stage, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium">{stage.value}%</div>
                  <div className="text-muted-foreground">{stage.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Success Rate Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={successTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[80, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value, name) => [`${value}%`, name === 'successRate' ? 'Success Rate' : 'Failure Rate']}
                />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="failureRate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scanner Infrastructure Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Scanner Infrastructure Status</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {scannerHealth.map((scanner) => (
              <div 
                key={scanner.name}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">{scanner.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(scanner.status)}
                    <Badge className={getStatusColor(scanner.status)}>
                      {scanner.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Load</span>
                      <span>{scanner.load}%</span>
                    </div>
                    <Progress 
                      value={scanner.load} 
                      className={`h-2 ${
                        scanner.load > 80 ? 'text-red-500' : 
                        scanner.load > 60 ? 'text-orange-500' : 'text-green-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium">{scanner.uptime}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Location</span>
                    <span className="text-muted-foreground">{scanner.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Scan Failures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Recent Scan Failures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Failed At</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Error Type</TableHead>
                  <TableHead>Scanner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockScans.filter(scan => scan.status === 'failed').map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">{scan.domain}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(scan.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{formatDuration(scan.duration)}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="text-xs">
                        {scan.errorMessage ? 'Timeout' : 'Connection Error'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      Scanner-{Math.floor(Math.random() * 5) + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-2">
                          <Play className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          Details
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

      {/* Performance Optimization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-6 w-6 text-blue-600" />
              <h3 className="font-medium">Optimize Performance</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              3 scanners running at high load. Consider scaling up.
            </p>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Scale Infrastructure
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="font-medium">System Health</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              All critical systems operational. Performance optimal.
            </p>
            <Button size="sm" variant="outline" className="border-green-300">
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="h-6 w-6 text-orange-600" />
              <h3 className="font-medium">Maintenance Window</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Scheduled maintenance in 4 hours. Plan accordingly.
            </p>
            <Button size="sm" variant="outline" className="border-orange-300">
              Reschedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}