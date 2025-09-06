import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  X, 
  AlertTriangle,
  Calendar,
  User
} from 'lucide-react';
import { mockVulnerabilities } from '../../data/mockData';

export function VulnerabilityExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Get unique values for filters
  const uniqueDomains = Array.from(new Set(mockVulnerabilities.map(v => v.domain)));
  const severityLevels = ['critical', 'high', 'medium', 'low'];
  const statusOptions = ['open', 'fixed', 'false-positive', 'accepted'];

  // Filter vulnerabilities based on search and filters
  const filteredVulnerabilities = useMemo(() => {
    return mockVulnerabilities.filter(vuln => {
      const matchesSearch = vuln.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vuln.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vuln.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = selectedSeverity === 'all' || vuln.severity === selectedSeverity;
      const matchesStatus = selectedStatus === 'all' || vuln.status === selectedStatus;
      const matchesDomain = selectedDomain === 'all' || vuln.domain === selectedDomain;

      return matchesSearch && matchesSeverity && matchesStatus && matchesDomain;
    });
  }, [searchQuery, selectedSeverity, selectedStatus, selectedDomain]);

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };

    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      fixed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'false-positive': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };

    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors]}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (slaDue: string) => {
    const dueDate = new Date(slaDue);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredVulnerabilities.map(v => v.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Vulnerability Explorer</h1>
        <p className="text-muted-foreground">
          Search, filter, and manage vulnerabilities across all monitored domains
        </p>
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
                placeholder="Search vulnerabilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                {severityLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {uniqueDomains.map(domain => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedSeverity('all');
              setSelectedStatus('all');
              setSelectedDomain('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredVulnerabilities.length} of {mockVulnerabilities.length} vulnerabilities
          </p>
          {selectedItems.length > 0 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {selectedItems.length} selected
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Mark as Fixed
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                False Positive
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Assign
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Vulnerabilities Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedItems.length === filteredVulnerabilities.length && filteredVulnerabilities.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Vulnerability</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>CVSS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Found</TableHead>
                  <TableHead>SLA Due</TableHead>
                  <TableHead>Days Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVulnerabilities.map((vuln) => {
                  const daysRemaining = getDaysRemaining(vuln.slaDue);
                  const isOverdue = daysRemaining < 0;
                  
                  return (
                    <TableRow key={vuln.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems.includes(vuln.id)}
                          onCheckedChange={(checked) => handleSelectItem(vuln.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vuln.name}</div>
                          <div className="text-xs text-muted-foreground">{vuln.owaspCategory}</div>
                        </div>
                      </TableCell>
                      <TableCell>{vuln.domain}</TableCell>
                      <TableCell>{getSeverityBadge(vuln.severity)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vuln.cvssScore}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(vuln.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(vuln.dateFound)}</TableCell>
                      <TableCell className="text-sm">{formatDate(vuln.slaDue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isOverdue ? (
                            <>
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-red-600 font-medium">
                                {Math.abs(daysRemaining)} days overdue
                              </span>
                            </>
                          ) : (
                            <span className={daysRemaining <= 2 ? 'text-orange-600 font-medium' : ''}>
                              {daysRemaining} days
                            </span>
                          )}
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

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">Critical</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {filteredVulnerabilities.filter(v => v.severity === 'critical').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">High</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {filteredVulnerabilities.filter(v => v.severity === 'high').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Medium</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {filteredVulnerabilities.filter(v => v.severity === 'medium').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Low</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {filteredVulnerabilities.filter(v => v.severity === 'low').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}