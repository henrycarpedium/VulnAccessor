import React, { useState } from 'react';
import { 
  Shield, 
  Home, 
  Search, 
  TrendingUp, 
  Brain, 
  Workflow, 
  Trophy, 
  Activity, 
  Clock, 
  FileText, 
  History,
  Settings,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'domains', label: 'Domain Details', icon: Shield },
  { id: 'vulnerabilities', label: 'Vulnerability Explorer', icon: Search },
  { id: 'threats', label: 'Threat Classification', icon: TrendingUp },
  { id: 'ml-insights', label: 'ML Insights', icon: Brain },
  { id: 'workflow', label: 'VAPT Workflow', icon: Workflow },
  { id: 'top-lists', label: 'Top 10 Lists', icon: Trophy },
  { id: 'scanning', label: 'Scanning Health', icon: Activity },
  { id: 'compliance', label: 'Compliance & SLA', icon: Clock },
  { id: 'reports', label: 'Reports & Export', icon: FileText },
  { id: 'audit', label: 'Audit Logs', icon: History }
];

export function DashboardLayout({ 
  children, 
  currentPage = 'dashboard', 
  onPageChange 
}: DashboardLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handlePageChange = (pageId: string) => {
    onPageChange?.(pageId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">VulnerAccessor</h1>
                <p className="text-xs text-muted-foreground">Security Risk Management</p>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">JD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-16 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out md:relative md:inset-y-0 md:translate-x-0`}>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePageChange(item.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                        isActive ? 'bg-primary text-primary-foreground' : 'text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Status Card at bottom of sidebar */}
            <div className="p-4">
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium">System Status</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All scanners operational
                </p>
                <p className="text-xs text-muted-foreground">
                  Last update: 2 min ago
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}