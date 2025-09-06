import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { mockThreats, mockDomains } from '../../data/mockData';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#ffb347', '#87ceeb'];

export function ThreatClassificationPage() {
  const [selectedView, setSelectedView] = useState('categories');

  // Prepare data for pie chart
  const pieData = mockThreats.map(threat => ({
    name: threat.category.replace('A0', '').replace(':2021 – ', ''),
    value: threat.count,
    fullName: threat.category
  }));

  // Prepare data for bar chart showing severity breakdown
  const barData = mockThreats.map(threat => ({
    category: threat.category.replace('A0', '').replace(':2021 – ', '').substring(0, 20),
    Critical: threat.severity.critical,
    High: threat.severity.high,
    Medium: threat.severity.medium,
    Low: threat.severity.low,
    total: threat.count
  }));

  // Prepare heatmap data (domains vs categories)
  const heatmapData = mockDomains.map(domain => {
    const domainData = { domain: domain.name };
    mockThreats.forEach(threat => {
      const shortName = threat.category.replace('A0', '').replace(':2021 – ', '');
      // Simulate vulnerability counts for each domain/category combination
      const count = Math.floor(Math.random() * threat.count / mockDomains.length) + 1;
      domainData[shortName] = count;
    });
    return domainData;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-1">{data.fullName}</p>
          <p className="text-sm">Count: {data.value}</p>
          <p className="text-sm">
            Percentage: {((data.value / mockThreats.reduce((acc, t) => acc + t.count, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Threat Classification</h1>
        <p className="text-muted-foreground">
          Analyze vulnerability distribution across OWASP categories and security domains
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {mockThreats.reduce((acc, t) => acc + t.count, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Vulnerabilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {mockThreats.reduce((acc, t) => acc + t.severity.critical, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Critical Severity</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{mockThreats.length}</div>
            <p className="text-sm text-muted-foreground">OWASP Categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(mockThreats.reduce((acc, t) => acc + t.count, 0) / mockDomains.length)}
            </div>
            <p className="text-sm text-muted-foreground">Avg per Domain</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OWASP Categories Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>OWASP Top 10 Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Breakdown - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Severity Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Critical" stackId="a" fill="#dc2626" />
                <Bar dataKey="High" stackId="a" fill="#ea580c" />
                <Bar dataKey="Medium" stackId="a" fill="#d97706" />
                <Bar dataKey="Low" stackId="a" fill="#65a30d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Vulnerabilities by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Most Affected Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockThreats
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((threat, index) => {
                const total = threat.count;
                const criticalPercent = (threat.severity.critical / total) * 100;
                const highPercent = (threat.severity.high / total) * 100;
                const mediumPercent = (threat.severity.medium / total) * 100;
                const lowPercent = (threat.severity.low / total) * 100;

                return (
                  <div key={threat.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{threat.category}</h4>
                      <p className="text-sm text-muted-foreground">
                        {total} vulnerabilities across all domains
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Severity Distribution */}
                      <div className="flex gap-2 text-xs">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          {threat.severity.critical}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          {threat.severity.high}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          {threat.severity.medium}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {threat.severity.low}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full flex">
                          <div 
                            className="bg-red-500" 
                            style={{ width: `${criticalPercent}%` }}
                          ></div>
                          <div 
                            className="bg-orange-500" 
                            style={{ width: `${highPercent}%` }}
                          ></div>
                          <div 
                            className="bg-yellow-500" 
                            style={{ width: `${mediumPercent}%` }}
                          ></div>
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${lowPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      <span className="font-medium text-lg min-w-[3rem] text-right">
                        {total}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Domain vs Category Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Heatmap: Domains vs Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div></div> {/* Empty corner cell */}
                {mockThreats.slice(0, 7).map(threat => (
                  <div key={threat.category} className="text-xs font-medium text-center p-1">
                    {threat.category.replace('A0', '').replace(':2021 – ', '').substring(0, 12)}
                  </div>
                ))}
              </div>
              
              {heatmapData.map(row => (
                <div key={row.domain} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="text-xs font-medium p-2 truncate">
                    {row.domain}
                  </div>
                  {mockThreats.slice(0, 7).map(threat => {
                    const shortName = threat.category.replace('A0', '').replace(':2021 – ', '');
                    const value = row[shortName] as number || 0;
                    const intensity = Math.min(value / 10, 1); // Normalize to 0-1
                    
                    return (
                      <div
                        key={threat.category}
                        className="h-8 rounded text-xs flex items-center justify-center font-medium"
                        style={{
                          backgroundColor: `rgba(239, 68, 68, ${intensity})`,
                          color: intensity > 0.5 ? 'white' : 'black'
                        }}
                        title={`${row.domain}: ${value} vulnerabilities in ${shortName}`}
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>Vulnerability Count:</span>
            <div className="flex items-center gap-1">
              <span>Low</span>
              <div className="flex gap-1">
                <div className="w-4 h-3 bg-red-100"></div>
                <div className="w-4 h-3 bg-red-200"></div>
                <div className="w-4 h-3 bg-red-400"></div>
                <div className="w-4 h-3 bg-red-600"></div>
              </div>
              <span>High</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}