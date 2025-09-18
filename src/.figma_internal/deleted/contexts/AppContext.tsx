import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockDomains, mockVulnerabilities, mockScans, mockAuditLogs, mockMLInsights, Domain, Vulnerability, ScanData, AuditLog, MLInsight } from '../data/mockData';

interface AppState {
  domains: Domain[];
  vulnerabilities: Vulnerability[];
  scans: ScanData[];
  auditLogs: AuditLog[];
  mlInsights: MLInsight[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_VULNERABILITY'; payload: { id: string; updates: Partial<Vulnerability> } }
  | { type: 'ADD_SCAN'; payload: ScanData }
  | { type: 'UPDATE_SCAN'; payload: { id: string; updates: Partial<ScanData> } }
  | { type: 'ADD_AUDIT_LOG'; payload: Omit<AuditLog, 'id' | 'timestamp'> }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_DOMAIN'; payload: { id: string; updates: Partial<Domain> } }
  | { type: 'BULK_UPDATE_VULNERABILITIES'; payload: { ids: string[]; updates: Partial<Vulnerability> } }
  | { type: 'DELETE_VULNERABILITY'; payload: string }
  | { type: 'RESET_DATA' };

const initialState: AppState = {
  domains: mockDomains,
  vulnerabilities: mockVulnerabilities,
  scans: mockScans,
  auditLogs: mockAuditLogs,
  mlInsights: mockMLInsights,
  notifications: [],
  loading: false,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'UPDATE_VULNERABILITY':
      return {
        ...state,
        vulnerabilities: state.vulnerabilities.map(vuln =>
          vuln.id === action.payload.id 
            ? { ...vuln, ...action.payload.updates }
            : vuln
        )
      };
    
    case 'BULK_UPDATE_VULNERABILITIES':
      return {
        ...state,
        vulnerabilities: state.vulnerabilities.map(vuln =>
          action.payload.ids.includes(vuln.id)
            ? { ...vuln, ...action.payload.updates }
            : vuln
        )
      };
    
    case 'DELETE_VULNERABILITY':
      return {
        ...state,
        vulnerabilities: state.vulnerabilities.filter(vuln => vuln.id !== action.payload)
      };
    
    case 'ADD_SCAN':
      return {
        ...state,
        scans: [action.payload, ...state.scans]
      };
    
    case 'UPDATE_SCAN':
      return {
        ...state,
        scans: state.scans.map(scan =>
          scan.id === action.payload.id
            ? { ...scan, ...action.payload.updates }
            : scan
        )
      };
    
    case 'UPDATE_DOMAIN':
      return {
        ...state,
        domains: state.domains.map(domain =>
          domain.id === action.payload.id
            ? { ...domain, ...action.payload.updates }
            : domain
        )
      };
    
    case 'ADD_AUDIT_LOG':
      const newLog: AuditLog = {
        ...action.payload,
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      return {
        ...state,
        auditLogs: [newLog, ...state.auditLogs]
      };
    
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: `notif_${Date.now()}`,
        timestamp: new Date(),
        read: false
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications]
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload
            ? { ...notif, read: true }
            : notif
        )
      };
    
    case 'RESET_DATA':
      return initialState;
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    updateVulnerability: (id: string, updates: Partial<Vulnerability>) => void;
    bulkUpdateVulnerabilities: (ids: string[], updates: Partial<Vulnerability>) => void;
    deleteVulnerability: (id: string) => void;
    addScan: (scan: Omit<ScanData, 'id'>) => void;
    updateScan: (id: string, updates: Partial<ScanData>) => void;
    updateDomain: (id: string, updates: Partial<Domain>) => void;
    addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markNotificationRead: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    startScan: (domainId: string) => Promise<void>;
    generateReport: (template: string, options: any) => Promise<void>;
    markVulnerabilityFixed: (id: string) => void;
    markVulnerabilityFalsePositive: (id: string) => void;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    const savedState = localStorage.getItem('vulneraX_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Merge with initial state to ensure we have all required fields
        Object.keys(parsed).forEach(key => {
          if (key in initialState) {
            // @ts-ignore - dynamic key access
            initialState[key] = parsed[key];
          }
        });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Persist state changes
  useEffect(() => {
    const stateToSave = {
      domains: state.domains,
      vulnerabilities: state.vulnerabilities,
      scans: state.scans,
      auditLogs: state.auditLogs,
      notifications: state.notifications
    };
    localStorage.setItem('vulneraX_state', JSON.stringify(stateToSave));
  }, [state.domains, state.vulnerabilities, state.scans, state.auditLogs, state.notifications]);

  const actions = {
    updateVulnerability: (id: string, updates: Partial<Vulnerability>) => {
      dispatch({ type: 'UPDATE_VULNERABILITY', payload: { id, updates } });
      dispatch({ 
        type: 'ADD_AUDIT_LOG', 
        payload: {
          user: 'current.user@company.com',
          action: 'Update Vulnerability',
          target: state.vulnerabilities.find(v => v.id === id)?.name || 'Unknown',
          ip: '192.168.1.100',
          details: `Updated vulnerability status to ${updates.status || 'unknown'}`
        }
      });
    },

    bulkUpdateVulnerabilities: (ids: string[], updates: Partial<Vulnerability>) => {
      dispatch({ type: 'BULK_UPDATE_VULNERABILITIES', payload: { ids, updates } });
      dispatch({ 
        type: 'ADD_AUDIT_LOG', 
        payload: {
          user: 'current.user@company.com',
          action: 'Bulk Update Vulnerabilities',
          target: `${ids.length} vulnerabilities`,
          ip: '192.168.1.100',
          details: `Bulk updated ${ids.length} vulnerabilities`
        }
      });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'success',
          title: 'Bulk Update Complete',
          message: `Successfully updated ${ids.length} vulnerabilities`
        }
      });
    },

    deleteVulnerability: (id: string) => {
      const vuln = state.vulnerabilities.find(v => v.id === id);
      dispatch({ type: 'DELETE_VULNERABILITY', payload: id });
      dispatch({ 
        type: 'ADD_AUDIT_LOG', 
        payload: {
          user: 'current.user@company.com',
          action: 'Delete Vulnerability',
          target: vuln?.name || 'Unknown',
          ip: '192.168.1.100',
          details: 'Deleted vulnerability record'
        }
      });
    },

    addScan: (scanData: Omit<ScanData, 'id'>) => {
      const newScan: ScanData = {
        ...scanData,
        id: `scan_${Date.now()}`
      };
      dispatch({ type: 'ADD_SCAN', payload: newScan });
    },

    updateScan: (id: string, updates: Partial<ScanData>) => {
      dispatch({ type: 'UPDATE_SCAN', payload: { id, updates } });
    },

    updateDomain: (id: string, updates: Partial<Domain>) => {
      dispatch({ type: 'UPDATE_DOMAIN', payload: { id, updates } });
    },

    addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
      dispatch({ type: 'ADD_AUDIT_LOG', payload: log });
    },

    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    },

    markNotificationRead: (id: string) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    },

    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },

    setError: (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },

    startScan: async (domainId: string) => {
      const domain = state.domains.find(d => d.id === domainId);
      if (!domain) return;

      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newScan: ScanData = {
        id: `scan_${Date.now()}`,
        domain: domain.name,
        timestamp: new Date().toISOString(),
        status: 'running',
        duration: 0,
        filesAnalyzed: 0,
        vulnerabilitiesFound: 0
      };

      dispatch({ type: 'ADD_SCAN', payload: newScan });
      dispatch({ type: 'UPDATE_DOMAIN', payload: { id: domainId, updates: { status: 'scanning' } } });
      
      dispatch({ 
        type: 'ADD_AUDIT_LOG', 
        payload: {
          user: 'current.user@company.com',
          action: 'Start Manual Scan',
          target: domain.name,
          ip: '192.168.1.100',
          details: 'Initiated manual vulnerability scan'
        }
      });

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'info',
          title: 'Scan Started',
          message: `Vulnerability scan initiated for ${domain.name}`
        }
      });

      // Simulate scan completion
      setTimeout(() => {
        const vulnsFound = Math.floor(Math.random() * 10) + 1;
        dispatch({ 
          type: 'UPDATE_SCAN', 
          payload: { 
            id: newScan.id, 
            updates: { 
              status: 'success', 
              duration: Math.floor(Math.random() * 300) + 120,
              filesAnalyzed: Math.floor(Math.random() * 1000) + 500,
              vulnerabilitiesFound: vulnsFound
            } 
          } 
        });
        dispatch({ type: 'UPDATE_DOMAIN', payload: { id: domainId, updates: { status: 'active' } } });
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'success',
            title: 'Scan Complete',
            message: `Scan completed for ${domain.name}. Found ${vulnsFound} vulnerabilities.`
          }
        });
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 5000);
    },

    generateReport: async (template: string, options: any) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      dispatch({ 
        type: 'ADD_AUDIT_LOG', 
        payload: {
          user: 'current.user@company.com',
          action: 'Generate Report',
          target: template,
          ip: '192.168.1.100',
          details: `Generated ${template} report with custom options`
        }
      });

      // Simulate report generation
      setTimeout(() => {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'success',
            title: 'Report Generated',
            message: `${template} report has been generated and is ready for download.`
          }
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        
        // Simulate file download
        const blob = new Blob(['Mock report content'], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 3000);
    },

    markVulnerabilityFixed: (id: string) => {
      actions.updateVulnerability(id, { status: 'fixed' });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'success',
          title: 'Vulnerability Marked Fixed',
          message: 'Vulnerability status updated to fixed'
        }
      });
    },

    markVulnerabilityFalsePositive: (id: string) => {
      actions.updateVulnerability(id, { status: 'false-positive' });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'info',
          title: 'Marked as False Positive',
          message: 'Vulnerability marked as false positive'
        }
      });
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
