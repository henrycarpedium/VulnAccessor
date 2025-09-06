import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { mockRiskTimeline, mockDomains } from '../../data/mockData';

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

const timeRanges: TimeRange[] = [
  { label: '7D', value: '7d', days: 7 },
  { label: '30D', value: '30d', days: 30 },
  { label: '90D', value: '90d', days: 90 }
];

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export function RiskTimelineChart() {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [showForecast, setShowForecast] = useState(true);

  // Group timeline data by date
  const groupedData = mockRiskTimeline.reduce((acc, item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing[item.domain] = item.riskScore;
      if (item.predicted) {
        existing[`${item.domain}_predicted`] = true;
      }
    } else {
      acc.push({
        date: item.date,
        [item.domain]: item.riskScore,
        ...(item.predicted && { [`${item.domain}_predicted`]: true })
      });
    }
    return acc;
  }, [] as any[]);

  // Sort by date
  groupedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const uniqueDomains = Array.from(new Set(mockRiskTimeline.map(item => item.domain)));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{`Date: ${new Date(label).toLocaleDateString()}`}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey.includes('_predicted')) return null;
            const isPredicted = payload.find((p: any) => p.dataKey === `${entry.dataKey}_predicted`);
            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {`${entry.dataKey}: ${entry.value.toFixed(1)} ${isPredicted ? '(Predicted)' : ''}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Risk Score Timeline</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={showForecast ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowForecast(!showForecast)}
            >
              ML Forecast
            </Button>
            <div className="flex rounded-lg border p-1">
              {timeRanges.map(range => (
                <Button
                  key={range.value}
                  variant={selectedRange === range.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedRange(range.value)}
                  className="px-3 py-1"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={groupedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              domain={[0, 10]} 
              tick={{ fontSize: 12 }}
              label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {uniqueDomains.map((domain, index) => (
              <Line
                key={domain}
                type="monotone"
                dataKey={domain}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                strokeDasharray={showForecast ? undefined : undefined}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend for prediction styling */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-chart-1"></div>
            <span>Historical Data</span>
          </div>
          {showForecast && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-chart-1 opacity-60" style={{borderTop: '2px dashed'}}></div>
              <span>ML Predictions</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}