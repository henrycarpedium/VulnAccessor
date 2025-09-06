import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useApp } from '../../contexts/AppContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  MessageSquare,
  Send,
  Lightbulb,
  Activity
} from 'lucide-react';
import { mockMLInsights, mockRiskTimeline } from '../../data/mockData';

export function MLInsightsPage() {
  const { actions } = useApp();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'assistant',
      message: 'Hello! I can help you analyze security risks and provide insights. Try asking "Why did app.company.com risk spike?" or "What are the main threat patterns?"'
    }
  ]);

  // Prepare prediction data with confidence intervals
  const predictionData = mockRiskTimeline
    .filter(item => item.domain === 'app.company.com')
    .map(item => ({
      date: item.date,
      actual: item.predicted ? null : item.riskScore,
      predicted: item.predicted ? item.riskScore : null,
      confidenceLower: item.predicted ? item.riskScore - 0.8 : null,
      confidenceUpper: item.predicted ? item.riskScore + 0.5 : null
    }));

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = { type: 'user', message: chatInput };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        'Why did app.company.com risk spike?': 'The risk spike was caused by 3 new critical SQL injection vulnerabilities discovered in the authentication module. These were introduced in the latest deployment on Jan 10th.',
        'What are the main threat patterns?': 'Main patterns include: 1) SQL Injection (32% of vulnerabilities), 2) XSS (28%), 3) Authentication bypass (18%). Most occur during peak deployment hours.',
        'Predict next week\'s risks': 'Based on current trends, I predict a 15% increase in vulnerabilities next week due to the scheduled major release. Focus on input validation testing.',
        'Show vulnerability clusters': 'Vulnerability clusters identified: Authentication module (45% of critical issues), API endpoints (30%), and file upload functionality (25%).'
      };

      const response = responses[chatInput] || `I've analyzed your query "${chatInput}". Based on current data patterns, I recommend focusing on the highest-risk domains and implementing additional security controls for critical vulnerabilities.`;

      setChatMessages(prev => [...prev, { type: 'assistant', message: response }]);

      actions.addNotification({
        type: 'info',
        title: 'AI Analysis Complete',
        message: 'ML insights have been generated for your query'
      });
    }, 1000);

  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spike': return <TrendingUp className="h-4 w-4" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
      case 'trend': return <Activity className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">ML Insights & Predictions</h1>
        <p className="text-muted-foreground">
          AI-powered security analytics and risk forecasting based on historical patterns
        </p>
      </div>

      {/* Model Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Model Accuracy</span>
            </div>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Risk prediction model</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Anomalies Detected</span>
            </div>
            <div className="text-2xl font-bold">{mockMLInsights.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Last Trained</span>
            </div>
            <div className="text-2xl font-bold">2h ago</div>
            <p className="text-xs text-muted-foreground">Continuous learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Confidence</span>
            </div>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Avg prediction confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Prediction Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Score Forecast with Confidence Intervals</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={predictionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  value?.toFixed(1), 
                  name === 'actual' ? 'Historical' : name === 'predicted' ? 'Predicted' : name
                ]}
              />
              
              {/* Confidence interval */}
              <Area
                type="monotone"
                dataKey="confidenceUpper"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="confidenceLower"
                stroke="none"
                fill="white"
                fillOpacity={1}
              />
              
              {/* Actual data */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 4 }}
                connectNulls={false}
              />
              
              {/* Predicted data */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#ff7c7c"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#ff7c7c' }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-chart-1"></div>
              <span>Historical Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-400" style={{borderTop: '2px dashed'}}></div>
              <span>ML Predictions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-chart-1 opacity-20 rounded"></div>
              <span>Confidence Interval</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Insights List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent ML Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMLInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className={`border rounded-lg p-4 ${getInsightColor(insight.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <span className="font-medium capitalize">{insight.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <Badge className={insight.severity === 'high' ? 'bg-red-100 text-red-800' : 
                                    insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-green-100 text-green-800'}>
                      {insight.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm mb-2">{insight.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Domain: {insight.domain}</span>
                    <span>{new Date(insight.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Security AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto space-y-3 p-3 border rounded bg-muted/10">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about security patterns, risks, or predictions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Suggested Questions */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Why did domain X spike?",
                    "What are threat patterns?",
                    "Predict next week's risks",
                    "Show vulnerability clusters"
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setChatInput(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>Model Information & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Risk Prediction Model</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Algorithm:</span>
                  <span className="font-mono">Random Forest + LSTM</span>
                </div>
                <div className="flex justify-between">
                  <span>Training Data:</span>
                  <span>18 months, 50k+ scans</span>
                </div>
                <div className="flex justify-between">
                  <span>Features:</span>
                  <span>247 security metrics</span>
                </div>
                <div className="flex justify-between">
                  <span>Update Frequency:</span>
                  <span>Every 2 hours</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Precision:</span>
                  <span>91.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>Recall:</span>
                  <span>88.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>F1-Score:</span>
                  <span>89.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>False Positives:</span>
                  <span>4.2%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recent Improvements</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Added seasonal pattern detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Improved anomaly sensitivity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Enhanced confidence intervals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Next: Real-time threat correlation</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}