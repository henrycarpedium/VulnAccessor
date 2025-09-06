import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useApp } from '../../contexts/AppContext';
import { exportAuditLogs } from '../../utils/exportUtils';
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
  Search, 
  Filter, 
  Download, 
  User, 
  Shield, 
  Settings, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';
import { mockAuditLogs } from '../../data/mockData';

// Extended mock audit logs with more realistic data
const extendedAuditLogs = [
  ...mockAuditLogs,
  {
    id: 'a4',
    user: 'security@company.com',
    action: 'Create Scan Schedule',
    target: 'Weekly Security Scan',
    timestamp: '2024-01-15T08:00:00Z',
    ip: '192.168.1.89',
    details: 'Created recurring scan for all production domains'
  },
  {
    id: 'a5',
    user: 'jane.smith@company.com',
    action: 'Update Vulnerability Status',
    target: 'Cross-Site Scripting (XSS)',
    timestamp: '2024-01-15T07:45:00Z',
    ip: '192.168.1.67',
    details: 'Changed status from open to in-progress'
  },
  {
    id: 'a6',
    user: 'mike.wilson@company.com',
    action: 'Export Report',
    target: 'Monthly Security Report',
    timestamp: '2024-01-15T07:30:00Z',
    ip: '192.168.1.156',
    details: 'Generated PDF report for December 2023'
  },
  {
    id: 'a7',
    user: 'admin@company.com',
    action: 'Delete User',
    target: 'temp.user@company.com',
    timestamp: '2024-01-15T07:15:00Z',
    ip: '192.168.1.23',
    details: 'Removed temporary user account after project completion'
  },
  {
    id: 'a8',
    user: 'john.doe@company.com',
    action: 'Add Domain',
    target: 'staging.company.com',
    timestamp: '2024-01-15T07:00:00Z',
    ip: '192.168.1.45',
    details: 'Added new staging domain to monitoring list'
  },
  {
    id: 'a9',
    user: 'security@company.com',
    action: 'Configure Alert',
    target: 'Critical Vulnerability Alert',
    timestamp: '2024-01-15T06:45:00Z',
    ip: '192.168.1.89',
    details: 'Set up email notifications for critical vulnerabilities'
  },
  {
    id: 'a10',
    user: 'jane.smith@company.com',
    action: 'Run Manual Scan',
    target: 'admin.company.com',
    timestamp: '2024-01-15T06:30:00Z',
    ip: '192.168.1.67',
    details: 'Initiated emergency security scan due to suspicious activity'
  }
];

export function AuditLogsPage() {
  const { state, actions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('24h');

  // Get unique values for filters
  const uniqueUsers = Array.from(new Set(extendedAuditLogs.map(log => log.user)));
  const uniqueActions = Array.from(new Set(extendedAuditLogs.map(log => log.action)));

  // Filter logs based on search and filters
  const filteredLogs = extendedAuditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUser = selectedUser === 'all' || log.user === selectedUser;
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    
    // Date filtering (simplified for demo)
    const logDate = new Date(log.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);
    
    let matchesDate = true;
    switch (selectedDateRange) {
      case '1h':
        matchesDate = hoursDiff <= 1;
        break;
      case '24h':
        matchesDate = hoursDiff <= 24;
        break;
      case '7d':
        matchesDate = hoursDiff <= 168;
        break;
      case '30d':
        matchesDate = hoursDiff <= 720;
        break;
    }

    return matchesSearch && matchesUser && matchesAction && matchesDate;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('Scan')) return <Play className="h-4 w-4 text-blue-500" />;
    if (action.includes('Mark') || action.includes('Update')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (action.includes('Delete') || action.includes('Remove')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (action.includes('Export') || action.includes('Generate')) return <FileText className="h-4 w-4 text-purple-500" />;
    if (action.includes('Settings') || action.includes('Configure')) return <Settings className="h-4 w-4 text-orange-500" />;
    return <User className="h-4 w-4 text-gray-500" />;
  };

  const getSeverityBadge = (action: string) => {
    if (action.includes('Delete') || action.includes('Remove')) {
      return <Badge className="bg-red-100 text-red-800">High</Badge>;
    }
    if (action.includes('Update') || action.includes('Configure')) {
      return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Low</Badge>;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Activity summary stats
  const activityStats = {
    totalLogs: filteredLogs.length,
    uniqueUsers: new Set(filteredLogs.map(log => log.user)).size,
    highRiskActions: filteredLogs.filter(log => 
      log.action.includes('Delete') || log.action.includes('Remove')
    ).length,
    recentActivity: filteredLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const hoursDiff = (new Date().getTime() - logDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 1;
    }).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">
          Track user activities, system events, and security-related actions across the platform
        </p>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Events</span>
            </div>
            <div className="text-2xl font-bold">{activityStats.totalLogs}</div>
            <p className="text-xs text-muted-foreground">In selected timeframe</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Active Users</span>
            </div>
            <div className="text-2xl font-bold">{activityStats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Performed actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">High Risk</span>
            </div>
            <div className="text-2xl font-bold">{activityStats.highRiskActions}</div>
            <p className="text-xs text-muted-foreground">Critical actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Recent Activity</span>
            </div>
            <div className="text-2xl font-bold">{activityStats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedUser('all');
              setSelectedAction('all');
              setSelectedDateRange('24h');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results and Export */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {extendedAuditLogs.length} log entries
        </p>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            try {
              const allLogs = [...state.auditLogs, ...extendedAuditLogs];
              exportAuditLogs(filteredLogs.length > 0 ? filteredLogs : allLogs, { format: 'csv' });
              actions.addNotification({
                type: 'success',
                title: 'Export Successful',
                message: `${filteredLogs.length || allLogs.length} audit logs exported successfully`
              });
            } catch (error) {
              actions.addNotification({
                type: 'error',
                title: 'Export Failed',
                message: 'Failed to export audit logs'
              });
            }
          }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const timestamp = formatTimestamp(log.timestamp);
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{timestamp.relative}</div>
                          <div className="text-xs text-muted-foreground">
                            {timestamp.date} {timestamp.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span>{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{log.target}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-muted-foreground">
                          {log.ip}
                        </span>
                      </TableCell>
                      <TableCell>{getSeverityBadge(log.action)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                          {log.details}
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

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.slice(0, 5).map((log, index) => (
              <div key={log.id} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{log.user}</span>
                    <span className="text-sm text-muted-foreground">{log.action}</span>
                    <span className="font-mono text-sm">{log.target}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{formatTimestamp(log.timestamp).relative}</span>
                    <span>IP: {log.ip}</span>
                  </div>
                </div>
                {getSeverityBadge(log.action)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <AlertTriangle className="h-5 w-5" />
            Security Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Multiple failed login attempts detected for admin@company.com</span>
              <Badge variant="outline" className="text-xs">2m ago</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Unusual activity pattern: 5 bulk operations in 10 minutes</span>
              <Badge variant="outline" className="text-xs">15m ago</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>New IP address detected for user jane.smith@company.com</span>
              <Badge variant="outline" className="text-xs">1h ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}