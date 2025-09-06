import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { mockDomains } from '../../data/mockData';

export function RiskTrendCards() {
  const increasingRisk = mockDomains.filter(d => d.trend === 'up');
  const decreasingRisk = mockDomains.filter(d => d.trend === 'down');
  const stableRisk = mockDomains.filter(d => d.trend === 'stable');

  const cardData = [
    {
      title: 'Increasing Risk',
      count: increasingRisk.length,
      domains: increasingRisk,
      icon: TrendingUp,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Stable Risk',
      count: stableRisk.length,
      domains: stableRisk,
      icon: Minus,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Decreasing Risk',
      count: decreasingRisk.length,
      domains: decreasingRisk,
      icon: TrendingDown,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cardData.map((data, index) => {
        const Icon = data.icon;
        
        return (
          <Card key={index} className={`${data.bgColor} ${data.borderColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
              <Icon className={`h-4 w-4 ${data.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{data.count}</div>
              
              <div className="space-y-2">
                {data.domains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{domain.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {domain.riskScore.toFixed(1)}
                      </Badge>
                      {domain.riskScore >= 8.0 && (
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {data.domains.length === 0 && (
                <p className="text-xs text-muted-foreground">No domains in this category</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}