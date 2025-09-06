import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Shield,
  Search,
  Target,
  BarChart,
  Settings
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  details?: string;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'setup',
    name: 'Configuration',
    description: 'Initialize scan parameters and target validation',
    icon: Settings,
    status: 'pending',
    details: 'Domain validation, scope definition, scan profile selection'
  },
  {
    id: 'discovery',
    name: 'Discovery',
    description: 'Enumerate targets and map attack surface',
    icon: Search,
    status: 'pending',
    details: 'Port scanning, service detection, technology identification'
  },
  {
    id: 'analysis',
    name: 'Analysis',
    description: 'Deep security analysis of discovered assets',
    icon: Shield,
    status: 'pending',
    details: 'Static analysis, dynamic testing, configuration review'
  },
  {
    id: 'testing',
    name: 'Penetration Testing',
    description: 'Automated vulnerability exploitation attempts',
    icon: Target,
    status: 'pending',
    details: 'Payload execution, privilege escalation, lateral movement'
  },
  {
    id: 'validation',
    name: 'Validation',
    description: 'Verify and classify discovered vulnerabilities',
    icon: CheckCircle,
    status: 'pending',
    details: 'False positive filtering, CVSS scoring, impact assessment'
  },
  {
    id: 'reporting',
    name: 'Report Generation',
    description: 'Compile findings into comprehensive report',
    icon: FileText,
    status: 'pending',
    details: 'Executive summary, technical details, remediation guidance'
  },
  {
    id: 'scoring',
    name: 'Risk Scoring',
    description: 'Calculate overall risk score and SLA assignments',
    icon: BarChart,
    status: 'pending',
    details: 'Risk calculation, SLA deadline assignment, priority ranking'
  }
];

export function WorkflowVisualizerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState(workflowSteps);
  const [selectedDomain] = useState('app.company.com');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < steps.length) {
      interval = setInterval(() => {
        setSteps(prevSteps => {
          const newSteps = [...prevSteps];
          
          // Complete current step
          if (currentStep > 0) {
            newSteps[currentStep - 1].status = 'completed';
            newSteps[currentStep - 1].duration = Math.floor(Math.random() * 30) + 15;
          }
          
          // Start next step
          if (currentStep < newSteps.length) {
            newSteps[currentStep].status = 'running';
          }
          
          return newSteps;
        });
        
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, steps.length]);

  const resetWorkflow = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps(workflowSteps.map(step => ({ ...step, status: 'pending', duration: undefined })));
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const getStepIcon = (step: WorkflowStep) => {
    const Icon = step.icon;
    
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'running':
        return <Clock className="h-6 w-6 text-blue-500 animate-spin" />;
      default:
        return <Icon className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStepColor = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'failed':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'running':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      default:
        return 'border-gray-200 bg-white dark:bg-gray-900';
    }
  };

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // Mock real-time data
  const scanMetrics = {
    filesScanned: Math.floor(currentStep * 234 + Math.random() * 100),
    vulnerabilitiesFound: Math.floor(currentStep * 3.2 + Math.random() * 5),
    testsExecuted: Math.floor(currentStep * 45 + Math.random() * 20),
    timeElapsed: currentStep * 2 + Math.floor(Math.random() * 60)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">VAPT Workflow Visualizer</h1>
        <p className="text-muted-foreground">
          Interactive visualization of the Vulnerability Assessment and Penetration Testing process
        </p>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workflow Control</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Target: {selectedDomain}</Badge>
              <Badge className={isPlaying ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {isPlaying ? 'Running' : 'Paused'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button onClick={togglePlayback} className="flex items-center gap-2">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Start'} Workflow
              </Button>
              <Button variant="outline" onClick={resetWorkflow} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-2xl font-bold">{completedSteps}/{totalSteps}</div>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Step {currentStep + 1}: {steps[currentStep]?.name}</span>
            <span>{progressPercentage.toFixed(0)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Files Scanned</span>
            </div>
            <div className="text-2xl font-bold">{scanMetrics.filesScanned.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Vulnerabilities</span>
            </div>
            <div className="text-2xl font-bold">{scanMetrics.vulnerabilitiesFound}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Tests Executed</span>
            </div>
            <div className="text-2xl font-bold">{scanMetrics.testsExecuted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Time Elapsed</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.floor(scanMetrics.timeElapsed / 60)}:{(scanMetrics.timeElapsed % 60).toString().padStart(2, '0')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle>VAPT Process Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${getStepColor(step)}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getStepIcon(step)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{step.name}</h3>
                        {step.status === 'running' && (
                          <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                        )}
                        {step.duration && (
                          <Badge variant="outline" className="text-xs">
                            {step.duration}s
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <p className="text-xs text-muted-foreground">{step.details}</p>
                      
                      {step.status === 'running' && (
                        <div className="mt-3">
                          <Progress value={65} className="h-1" />
                          <div className="text-xs text-muted-foreground mt-1">Processing...</div>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-muted-foreground">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className={`h-5 w-5 ${
                      step.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Typical Workflow Timings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <step.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{step.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={Math.random() * 100} className="w-16 h-2" />
                    <span className="text-sm text-muted-foreground min-w-[3rem]">
                      ~{Math.floor(Math.random() * 45) + 15}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Average Completion Time</span>
                <span className="font-medium">4m 32s</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Most Common Failure Point</span>
                <span className="font-medium text-orange-600">Discovery Phase</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Average Vulnerabilities Found</span>
                <span className="font-medium">23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Run Full Scan
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configure Workflow
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export Timeline
        </Button>
      </div>
    </div>
  );
}