import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
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
import { RefreshCw, Play, Square } from 'lucide-react';

export function RecentScansTable() {
  const { state, actions } = useApp();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates for running scans
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      state.scans
        .filter(scan => scan.status === 'running')
        .forEach(scan => {
          actions.updateScan(scan.id, {
            duration: scan.duration + Math.floor(Math.random() * 30) + 10,
            filesAnalyzed: scan.filesAnalyzed + Math.floor(Math.random() * 50) + 10
          });
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh, state.scans, actions]);

  const getStatusBadge = (status: string) => {
    const variants = {
      success: { variant: 'default', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      running: { variant: 'default', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      failed: { variant: 'destructive', color: '' }
    };

    const config = variants[status as keyof typeof variants] || variants.success;
    
    return (
      <Badge className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Scans</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-2"
            >
              {autoRefresh ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {autoRefresh ? 'Stop' : 'Start'} Auto-refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                actions.addNotification({
                  type: 'info',
                  title: 'Refreshed',
                  message: 'Scan data refreshed successfully'
                });
              }}
            >
              <RefreshCw className="h-4 w-4" />
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
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Files Analyzed</TableHead>
                <TableHead>Vulnerabilities</TableHead>
                <TableHead>Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.scans.slice(0, 10).map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="font-medium">{scan.domain}</TableCell>
                  <TableCell>{getStatusBadge(scan.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {formatDuration(scan.duration)}
                      {scan.status === 'running' && (
                        <div className="flex items-center gap-2">
                          <Progress value={65} className="w-16 h-1" />
                          <span className="text-xs text-muted-foreground">65%</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {scan.filesAnalyzed === 0 ? '-' : scan.filesAnalyzed.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {scan.vulnerabilitiesFound === 0 && scan.status !== 'success' 
                      ? '-' 
                      : scan.vulnerabilitiesFound
                    }
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTimestamp(scan.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Error Messages */}
        {state.scans.some(scan => scan.status === 'failed') && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recent Errors:</h4>
            <div className="space-y-1">
              {state.scans
                .filter(scan => scan.status === 'failed' && scan.errorMessage)
                .slice(0, 3)
                .map(scan => (
                  <div key={scan.id} className="text-sm text-red-600 dark:text-red-400">
                    <span className="font-medium">{scan.domain}:</span> {scan.errorMessage}
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}