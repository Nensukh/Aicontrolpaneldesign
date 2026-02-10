import { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Zap, DollarSign, AlertCircle, CheckCircle, XCircle, Activity, ArrowUp, ArrowDown, Minus, BarChart3, Users, MessageSquare, Database, Bell, Filter } from 'lucide-react';

interface AgentPerformanceProps {
  selectedAgent?: string | null;
  theme?: 'dark' | 'light';
}

// Mock data - replace with actual data from your backend
const agentPerformanceData = [
  {
    id: 'agent-001',
    name: 'Customer Support Agent',
    totalRequests: 12450,
    successRate: 97.8,
    avgResponseTime: 2.3,
    totalTokens: 2450000,
    estimatedCost: 245.50,
    trend: 'up',
    trendValue: 12.5,
    status: 'healthy',
    lastActive: '2 mins ago',
    p95ResponseTime: 4.1,
    errorRate: 2.2
  },
  {
    id: 'agent-002',
    name: 'Order Processing Agent',
    totalRequests: 8920,
    successRate: 99.2,
    avgResponseTime: 1.8,
    totalTokens: 1780000,
    estimatedCost: 178.00,
    trend: 'up',
    trendValue: 8.3,
    status: 'healthy',
    lastActive: '5 mins ago',
    p95ResponseTime: 3.2,
    errorRate: 0.8
  },
  {
    id: 'agent-003',
    name: 'Policy Checker Agent',
    totalRequests: 7340,
    successRate: 94.5,
    avgResponseTime: 3.1,
    totalTokens: 1468000,
    estimatedCost: 146.80,
    trend: 'down',
    trendValue: -5.2,
    status: 'warning',
    lastActive: '1 min ago',
    p95ResponseTime: 5.8,
    errorRate: 5.5
  },
  {
    id: 'agent-004',
    name: 'Refund Processing Agent',
    totalRequests: 5680,
    successRate: 98.1,
    avgResponseTime: 2.7,
    totalTokens: 1136000,
    estimatedCost: 113.60,
    trend: 'up',
    trendValue: 15.7,
    status: 'healthy',
    lastActive: '3 mins ago',
    p95ResponseTime: 4.5,
    errorRate: 1.9
  },
  {
    id: 'agent-005',
    name: 'Analytics Agent',
    totalRequests: 4230,
    successRate: 96.3,
    avgResponseTime: 4.2,
    totalTokens: 1269000,
    estimatedCost: 126.90,
    trend: 'stable',
    trendValue: 0.5,
    status: 'healthy',
    lastActive: '8 mins ago',
    p95ResponseTime: 7.3,
    errorRate: 3.7
  },
  {
    id: 'agent-006',
    name: 'Inventory Agent',
    totalRequests: 3890,
    successRate: 91.2,
    avgResponseTime: 5.8,
    totalTokens: 1167000,
    estimatedCost: 116.70,
    trend: 'down',
    trendValue: -8.9,
    status: 'critical',
    lastActive: '15 mins ago',
    p95ResponseTime: 9.4,
    errorRate: 8.8
  }
];

const systemAlerts = [
  {
    id: 'alert-001',
    severity: 'critical',
    agent: 'Inventory Agent',
    message: 'Error rate exceeds threshold (8.8% > 5%)',
    timestamp: '2 mins ago',
    category: 'performance'
  },
  {
    id: 'alert-002',
    severity: 'critical',
    agent: 'Inventory Agent',
    message: 'Average response time degraded (5.8s vs 3.2s baseline)',
    timestamp: '5 mins ago',
    category: 'latency'
  },
  {
    id: 'alert-003',
    severity: 'warning',
    agent: 'Policy Checker Agent',
    message: 'Success rate below 95% threshold (94.5%)',
    timestamp: '12 mins ago',
    category: 'reliability'
  },
  {
    id: 'alert-004',
    severity: 'warning',
    agent: 'Customer Support Agent',
    message: 'Token usage increased by 45% in last hour',
    timestamp: '18 mins ago',
    category: 'cost'
  },
  {
    id: 'alert-005',
    severity: 'info',
    agent: 'Order Processing Agent',
    message: 'Peak performance detected - 99.2% success rate',
    timestamp: '25 mins ago',
    category: 'performance'
  }
];

const systemMetrics = {
  totalRequests: 42510,
  totalRequestsChange: 8.7,
  overallSuccessRate: 96.8,
  successRateChange: -1.2,
  avgResponseTime: 3.1,
  responseTimeChange: 5.3,
  totalCost: 927.50,
  costChange: 12.4,
  activeAgents: 15,
  healthyAgents: 12,
  warningAgents: 2,
  criticalAgents: 1
};

export function AgentPerformance({ selectedAgent = null, theme = 'dark' }: AgentPerformanceProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [sortBy, setSortBy] = useState<'requests' | 'successRate' | 'responseTime' | 'cost'>('requests');

  const filteredAgents = agentPerformanceData
    .filter(agent => filterStatus === 'all' || agent.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'requests': return b.totalRequests - a.totalRequests;
        case 'successRate': return b.successRate - a.successRate;
        case 'responseTime': return a.avgResponseTime - b.avgResponseTime;
        case 'cost': return b.estimatedCost - a.estimatedCost;
        default: return 0;
      }
    });

  const top5Agents = filteredAgents.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return theme === 'dark' 
          ? 'bg-green-900/30 text-green-300 border-green-700'
          : 'bg-green-50 text-green-700 border-green-300';
      case 'warning':
        return theme === 'dark'
          ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700'
          : 'bg-yellow-50 text-yellow-700 border-yellow-300';
      case 'critical':
        return theme === 'dark'
          ? 'bg-red-900/30 text-red-300 border-red-700'
          : 'bg-red-50 text-red-700 border-red-300';
      default:
        return theme === 'dark'
          ? 'bg-gray-800 text-gray-300 border-gray-700'
          : 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return theme === 'dark'
          ? 'bg-red-900/30 border-red-700'
          : 'bg-red-50 border-red-200';
      case 'warning':
        return theme === 'dark'
          ? 'bg-yellow-900/30 border-yellow-700'
          : 'bg-yellow-50 border-yellow-200';
      case 'info':
        return theme === 'dark'
          ? 'bg-blue-900/30 border-blue-700'
          : 'bg-blue-50 border-blue-200';
      default:
        return theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4" />;
      case 'down': return <ArrowDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className={`text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Agent Performance
              </h2>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Monitor agent-level metrics and system health
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className={`flex gap-2 p-1 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              {['1h', '6h', '24h', '7d', '30d'].map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedTimeRange === range
                      ? 'bg-cyan-600 text-white'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System-wide Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Requests
              </div>
              <Activity className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {systemMetrics.totalRequests.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              systemMetrics.totalRequestsChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {systemMetrics.totalRequestsChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(systemMetrics.totalRequestsChange)}%</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Success Rate
              </div>
              <CheckCircle className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {systemMetrics.overallSuccessRate}%
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              systemMetrics.successRateChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {systemMetrics.successRateChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(systemMetrics.successRateChange)}%</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Avg Response Time
              </div>
              <Clock className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {systemMetrics.avgResponseTime}s
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              systemMetrics.responseTimeChange <= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {systemMetrics.responseTimeChange <= 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span>{Math.abs(systemMetrics.responseTimeChange)}%</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Cost (24h)
              </div>
              <DollarSign className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              ${systemMetrics.totalCost}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              systemMetrics.costChange <= 0 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {systemMetrics.costChange <= 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span>{Math.abs(systemMetrics.costChange)}%</span>
            </div>
          </div>
        </div>

        {/* Agent Health Overview */}
        <div className={`p-4 rounded-lg mb-6 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Agent Health Overview
            </h3>
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {systemMetrics.activeAgents} Active Agents
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-900/20 border border-green-700">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">{systemMetrics.healthyAgents}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Healthy
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-900/20 border border-yellow-700">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-yellow-400">{systemMetrics.warningAgents}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Warning
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-900/20 border border-red-700">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-red-400">{systemMetrics.criticalAgents}</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Critical
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Top 5 Agents */}
          <div className="col-span-7">
            <div className={`rounded-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className={`p-4 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Top Performing Agents
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    {/* Filter */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className={`px-3 py-1.5 text-sm rounded border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-gray-300'
                          : 'bg-white border-gray-300 text-gray-700'
                      }`}
                    >
                      <option value="all">All Status</option>
                      <option value="healthy">Healthy</option>
                      <option value="warning">Warning</option>
                      <option value="critical">Critical</option>
                    </select>
                    
                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className={`px-3 py-1.5 text-sm rounded border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-gray-300'
                          : 'bg-white border-gray-300 text-gray-700'
                      }`}
                    >
                      <option value="requests">Requests</option>
                      <option value="successRate">Success Rate</option>
                      <option value="responseTime">Response Time</option>
                      <option value="cost">Cost</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {top5Agents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {agent.name}
                          </h4>
                          <div className={`text-xs mt-0.5 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            Last active: {agent.lastActive}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        getStatusColor(agent.status)
                      }`}>
                        {agent.status}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <div className={`text-xs mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Requests
                        </div>
                        <div className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {agent.totalRequests.toLocaleString()}
                        </div>
                        <div className={`flex items-center gap-1 text-xs mt-0.5 ${
                          getTrendColor(agent.trend)
                        }`}>
                          {getTrendIcon(agent.trend)}
                          <span>{Math.abs(agent.trendValue)}%</span>
                        </div>
                      </div>

                      <div>
                        <div className={`text-xs mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Success Rate
                        </div>
                        <div className={`font-semibold ${
                          agent.successRate >= 95 ? 'text-green-400' :
                          agent.successRate >= 90 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {agent.successRate}%
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Error: {agent.errorRate}%
                        </div>
                      </div>

                      <div>
                        <div className={`text-xs mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Response Time
                        </div>
                        <div className={`font-semibold ${
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        }`}>
                          {agent.avgResponseTime}s
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          P95: {agent.p95ResponseTime}s
                        </div>
                      </div>

                      <div>
                        <div className={`text-xs mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Cost (24h)
                        </div>
                        <div className={`font-semibold ${
                          theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                        }`}>
                          ${agent.estimatedCost}
                        </div>
                        <div className={`text-xs mt-0.5 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {(agent.totalTokens / 1000).toFixed(0)}K tokens
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Alerts */}
          <div className="col-span-5">
            <div className={`rounded-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className={`p-4 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Active Alerts
                    </h3>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                  }`}>
                    {systemAlerts.filter(a => a.severity === 'critical').length} Critical
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      getAlertSeverityColor(alert.severity)
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {alert.severity === 'critical' ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : alert.severity === 'warning' ? (
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            alert.severity === 'critical' ? 'bg-red-900/50 text-red-300' :
                            alert.severity === 'warning' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-blue-900/50 text-blue-300'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {alert.category}
                          </span>
                        </div>
                        
                        <div className={`text-sm font-medium mb-1 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {alert.agent}
                        </div>
                        
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {alert.message}
                        </div>
                        
                        <div className={`text-xs mt-2 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {alert.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}