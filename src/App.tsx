import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './components/pages/DashboardPage';
import { DomainDetailsPage } from './components/pages/DomainDetailsPage';
import { VulnerabilityExplorerPage } from './components/pages/VulnerabilityExplorerPage';
import { ThreatClassificationPage } from './components/pages/ThreatClassificationPage';
import { MLInsightsPage } from './components/pages/MLInsightsPage';
import { WorkflowVisualizerPage } from './components/pages/WorkflowVisualizerPage';
import { Top10ListsPage } from './components/pages/Top10ListsPage';
import { ScanningHealthPage } from './components/pages/ScanningHealthPage';
import { ComplianceSLAPage } from './components/pages/ComplianceSLAPage';
import { ReportsExportPage } from './components/pages/ReportsExportPage';
import { AuditLogsPage } from './components/pages/AuditLogsPage';
import { NotificationSystem } from './components/common/NotificationSystem';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'vulnerabilities':
        return <VulnerabilityExplorerPage />;
      case 'threats':
        return <ThreatClassificationPage />;
      case 'ml-insights':
        return <MLInsightsPage />;
      case 'domains':
        return <DomainDetailsPage />;
      case 'workflow':
        return <WorkflowVisualizerPage />;
      case 'top-lists':
        return <Top10ListsPage />;
      case 'scanning':
        return <ScanningHealthPage />;
      case 'compliance':
        return <ComplianceSLAPage />;
      case 'reports':
        return <ReportsExportPage />;
      case 'audit':
        return <AuditLogsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </DashboardLayout>
      <NotificationSystem />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}