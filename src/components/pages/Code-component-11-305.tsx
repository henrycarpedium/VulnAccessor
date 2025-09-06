import React from 'react';
import { MetricCard } from '../dashboard/MetricCard';
import { RiskTimelineChart } from '../dashboard/RiskTimelineChart';
import { RecentScansTable } from '../dashboard/RecentScansTable';
import { RiskTrendCards } from '../dashboard/RiskTrendCards';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Target,
  Gauge
} from 'lucide-react';
import { globalMetrics } from '../../data/mockData';

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <p className="text-muted-foreground">
          Global overview of vulnerability risk management across all monitored domains
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Domains Monitored"
          value={globalMetrics.domainsMonitored}
          description="Active monitoring"
          icon={Shield}
          trend={{ value: 5.2, isPositive: true }}
        />
        
        <MetricCard
          title="Active Scans"
          value={globalMetrics.activeScans}
          description="Currently running"
          icon={Activity}
          status="info"
        />
        
        <MetricCard
          title="Total Vulnerabilities"
          value={globalMetrics.totalVulnerabilities}
          description="Across all domains"
          icon={AlertTriangle}
          trend={{ value: -12.3, isPositive: true }}
          status="warning"
        />
        
        <MetricCard
          title="Average Risk Score"
          value={globalMetrics.averageRiskScore.toFixed(1)}
          description="Scale: 0-10"
          icon={Gauge}
          trend={{ value: 8.7, isPositive: false }}
          status="danger"
        />
        
        <MetricCard
          title="SLA Compliance"
          value={`${globalMetrics.slaCompliance.toFixed(0)}%`}
          description="Meeting deadlines"
          icon={CheckCircle}
          trend={{ value: 3.2, isPositive: true }}
          status={globalMetrics.slaCompliance >= 80 ? "success" : "warning"}
        />
        
        <MetricCard
          title="MTTD"
          value={`${globalMetrics.mttd}h`}
          description="Mean Time to Detection"
          icon={Target}
          trend={{ value: -15.4, isPositive: true }}
          status="success"
        />
        
        <MetricCard
          title="MTTR" 
          value={`${globalMetrics.mttr}h`}
          description="Mean Time to Resolution"
          icon={Clock}
          trend={{ value: 7.8, isPositive: false }}
          status="warning"
        />
        
        <MetricCard
          title="Risk Trend"
          value="↗ Rising"
          description="Overall trajectory"
          icon={TrendingUp}
          status="danger"
        />
      </div>

      {/* Risk Timeline Chart */}
      <RiskTimelineChart />

      {/* Risk Trend Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Risk Analysis by Domain</h2>
        <RiskTrendCards />
      </div>

      {/* Recent Scans Table */}
      <RecentScansTable />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Quick Scan</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Run an immediate vulnerability scan on priority domains
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Start Scan
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Generate Report</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Create executive summary of current security posture
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Create Report
          </button>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Review Alerts</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Check critical vulnerabilities requiring immediate attention
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            View Alerts
          </button>
        </div>
      </div>
    </div>
  );
}