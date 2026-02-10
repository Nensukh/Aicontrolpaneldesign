import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Filter, ChevronDown, ChevronRight, Calendar, TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle, XCircle, Network, Clock, Zap, MessageSquare, ArrowRight, Eye, X, Code, Database, FileText, Layers } from 'lucide-react';
import { TraceDetailModal } from './TraceDetailModal';

interface ProductionMonitoringProps {
  selectedAgent: string | null;
  theme?: 'dark' | 'light';
}

type ViewMode = 'transactions' | 'analytics';
type TimeWindow = '1h' | '24h' | '7d' | '30d';

interface MCPToolCall {
  toolName: string;
  serverId: string;
  serverName: string;
  input: Record<string, any>;
  output: Record<string, any>;
  latency: number;
  status: 'success' | 'error';
  timestamp: string;
}

interface AgentInTrace {
  agentId: string;
  agentName: string;
  score: number;
  latency: number;
  status: 'success' | 'warning' | 'error';
  metrics: {
    accuracy?: number;
    relevance?: number;
    coherence?: number;
    groundedness?: number;
  };
  input?: string;
  output?: string;
  mcpTools?: MCPToolCall[];
}

interface Transaction {
  taskId: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  overallScore: number;
  agentChain: AgentInTrace[];
  totalLatency: number;
  userQuery: string;
}

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    taskId: 'task-20260208-001',
    timestamp: '2026-02-08T14:32:15Z',
    status: 'success',
    overallScore: 94.5,
    totalLatency: 2340,
    userQuery: 'I need help resetting my password and updating billing information',
    agentChain: [
      {
        agentId: 'agent-001',
        agentName: 'Customer Support Agent',
        score: 96,
        latency: 890,
        status: 'success',
        metrics: { accuracy: 98, relevance: 95, coherence: 96, groundedness: 95 },
        input: 'User query: I need help resetting my password and updating billing information\nContext: User is logged in, session ID: sess_abc123',
        output: 'I understand you need help with two things: resetting your password and updating billing information. Let me route this to our Tier 1 Support team who can assist you with both requests securely.',
        mcpTools: [
          {
            toolName: 'mcp__UserAuth_tool__getUserProfile',
            serverId: 'userauth-service',
            serverName: 'UserAuth',
            input: { sessionId: 'sess_abc123' },
            output: { userId: 'user_789', email: 'john.doe@example.com', status: 'active', lastLogin: '2026-02-08T14:30:00Z' },
            latency: 120,
            status: 'success',
            timestamp: '2026-02-08T14:32:15.100Z'
          },
          {
            toolName: 'mcp__KnowledgeBase_tool__searchArticles',
            serverId: 'kb-service',
            serverName: 'KnowledgeBase',
            input: { query: 'password reset billing update', category: 'account-management' },
            output: { articles: [{ id: 'kb-001', title: 'How to Reset Password', relevance: 0.95 }, { id: 'kb-002', title: 'Update Billing Info', relevance: 0.92 }] },
            latency: 240,
            status: 'success',
            timestamp: '2026-02-08T14:32:15.350Z'
          }
        ]
      },
      {
        agentId: 'agent-002',
        agentName: 'Tier 1 Support',
        score: 93,
        latency: 1450,
        status: 'success',
        metrics: { accuracy: 94, relevance: 92, coherence: 93, groundedness: 93 },
        input: 'Routed request from Customer Support Agent:\nUser needs: password reset + billing update\nUser ID: user_789\nEmail: john.doe@example.com',
        output: 'I\'ve sent a password reset link to john.doe@example.com. For billing updates, please verify your identity by clicking the verification link I\'ve sent to your email. Once verified, you can update your payment method in the billing section.',
        mcpTools: [
          {
            toolName: 'mcp__UserAuth_tool__sendPasswordReset',
            serverId: 'userauth-service',
            serverName: 'UserAuth',
            input: { userId: 'user_789', email: 'john.doe@example.com' },
            output: { resetLinkSent: true, expiresIn: '15 minutes', resetToken: 'rst_xyz456' },
            latency: 380,
            status: 'success',
            timestamp: '2026-02-08T14:32:16.200Z'
          },
          {
            toolName: 'mcp__Billing_tool__sendVerificationEmail',
            serverId: 'billing-service',
            serverName: 'Billing',
            input: { userId: 'user_789', purpose: 'billing-update' },
            output: { verificationSent: true, verificationCode: 'ver_def789' },
            latency: 420,
            status: 'success',
            timestamp: '2026-02-08T14:32:16.600Z'
          }
        ]
      }
    ]
  },
  {
    taskId: 'task-20260208-002',
    timestamp: '2026-02-08T14:28:42Z',
    status: 'warning',
    overallScore: 78.2,
    totalLatency: 3120,
    userQuery: 'What are the pricing options for enterprise plans?',
    agentChain: [
      {
        agentId: 'agent-004',
        agentName: 'Sales Assistant',
        score: 82,
        latency: 1680,
        status: 'warning',
        metrics: { accuracy: 85, relevance: 78, coherence: 83, groundedness: 82 },
        input: 'User query: What are the pricing options for enterprise plans?\nUser profile: visitor (not logged in)',
        output: 'Our enterprise plans start at $999/month and include advanced features. However, I need to route you to a sales representative for detailed pricing as it varies based on your specific needs.',
        mcpTools: [
          {
            toolName: 'mcp__Pricing_tool__getEnterpriseOptions',
            serverId: 'pricing-service',
            serverName: 'Pricing',
            input: { planType: 'enterprise' },
            output: { basePrice: 999, currency: 'USD', features: ['Priority Support', 'Custom Integration', 'Dedicated Account Manager'] },
            latency: 180,
            status: 'success',
            timestamp: '2026-02-08T14:28:42.200Z'
          }
        ]
      },
      {
        agentId: 'agent-001',
        agentName: 'Customer Support Agent',
        score: 74,
        latency: 1440,
        status: 'warning',
        metrics: { accuracy: 76, relevance: 72, coherence: 74, groundedness: 75 },
        input: 'Escalated from Sales Assistant: User asking about enterprise pricing but needs more detailed info',
        output: 'For enterprise pricing details, I recommend scheduling a call with our sales team. They can provide custom quotes based on your organization size and requirements.',
        mcpTools: []
      }
    ]
  },
  {
    taskId: 'task-20260208-003',
    timestamp: '2026-02-08T14:15:28Z',
    status: 'error',
    overallScore: 62.8,
    totalLatency: 4230,
    userQuery: 'Process refund for order #12345 and explain why it was delayed',
    agentChain: [
      {
        agentId: 'agent-001',
        agentName: 'Customer Support Agent',
        score: 88,
        latency: 920,
        status: 'success',
        metrics: { accuracy: 90, relevance: 87, coherence: 89, groundedness: 86 },
        input: 'User query: Process refund for order #12345 and explain why it was delayed\nUser ID: user_456',
        output: 'I can see order #12345 was delayed due to inventory issues. Let me route this to Tier 2 Support to process your refund.',
        mcpTools: [
          {
            toolName: 'mcp__Orders_tool__getOrderDetails',
            serverId: 'orders-service',
            serverName: 'Orders',
            input: { orderId: '12345', userId: 'user_456' },
            output: { orderId: '12345', status: 'delayed', delayReason: 'inventory_shortage', amount: 149.99, orderDate: '2026-02-01' },
            latency: 320,
            status: 'success',
            timestamp: '2026-02-08T14:15:28.350Z'
          }
        ]
      },
      {
        agentId: 'agent-003',
        agentName: 'Tier 2 Support',
        score: 58,
        latency: 2180,
        status: 'error',
        metrics: { accuracy: 62, relevance: 55, coherence: 60, groundedness: 56 },
        input: 'Escalated refund request:\nOrder ID: 12345\nAmount: $149.99\nReason: delayed due to inventory shortage',
        output: 'I attempted to process the refund but encountered an issue with the payment gateway. Routing to Tier 1 Support for alternative processing.',
        mcpTools: [
          {
            toolName: 'mcp__Payment_tool__processRefund',
            serverId: 'payment-service',
            serverName: 'Payment',
            input: { orderId: '12345', amount: 149.99, reason: 'delay' },
            output: { error: 'Gateway timeout', code: 'ERR_GATEWAY_TIMEOUT' },
            latency: 1800,
            status: 'error',
            timestamp: '2026-02-08T14:15:30.200Z'
          }
        ]
      },
      {
        agentId: 'agent-002',
        agentName: 'Tier 1 Support',
        score: 42,
        latency: 1130,
        status: 'error',
        metrics: { accuracy: 45, relevance: 38, coherence: 44, groundedness: 42 },
        input: 'Manual refund needed for order #12345 after gateway failure',
        output: 'Unfortunately, I was unable to complete the refund due to system errors. A ticket has been created for manual processing by our finance team.',
        mcpTools: [
          {
            toolName: 'mcp__Ticketing_tool__createTicket',
            serverId: 'ticketing-service',
            serverName: 'Ticketing',
            input: { type: 'refund_manual', orderId: '12345', priority: 'high' },
            output: { ticketId: 'TKT-9876', status: 'created' },
            latency: 280,
            status: 'success',
            timestamp: '2026-02-08T14:15:32.800Z'
          }
        ]
      }
    ]
  },
  {
    taskId: 'task-20260208-004',
    timestamp: '2026-02-08T14:08:11Z',
    status: 'success',
    overallScore: 91.3,
    totalLatency: 1980,
    userQuery: 'Can you recommend products similar to what I bought last month?',
    agentChain: [
      {
        agentId: 'agent-004',
        agentName: 'Sales Assistant',
        score: 91,
        latency: 1980,
        status: 'success',
        metrics: { accuracy: 92, relevance: 90, coherence: 91, groundedness: 92 },
        input: 'User query: Can you recommend products similar to what I bought last month?\nUser ID: user_321\nPurchase history available',
        output: 'Based on your purchase of wireless headphones last month, I recommend: 1) Premium noise-cancelling earbuds ($199), 2) Bluetooth speaker system ($149), 3) Audio cable set ($29). These complement your recent purchase perfectly.',
        mcpTools: [
          {
            toolName: 'mcp__Orders_tool__getUserPurchaseHistory',
            serverId: 'orders-service',
            serverName: 'Orders',
            input: { userId: 'user_321', timeframe: '30days' },
            output: { purchases: [{ productId: 'prod_headphones_01', category: 'audio', price: 179.99, date: '2026-01-15' }] },
            latency: 420,
            status: 'success',
            timestamp: '2026-02-08T14:08:11.450Z'
          },
          {
            toolName: 'mcp__Recommendations_tool__getSimilarProducts',
            serverId: 'recommendations-service',
            serverName: 'Recommendations',
            input: { productId: 'prod_headphones_01', limit: 5 },
            output: { recommendations: [{ id: 'prod_earbuds_02', name: 'Premium earbuds', score: 0.94 }, { id: 'prod_speaker_03', name: 'Bluetooth speaker', score: 0.88 }] },
            latency: 680,
            status: 'success',
            timestamp: '2026-02-08T14:08:12.100Z'
          }
        ]
      }
    ]
  },
  {
    taskId: 'task-20260208-005',
    timestamp: '2026-02-08T13:54:33Z',
    status: 'success',
    overallScore: 89.7,
    totalLatency: 2560,
    userQuery: 'Report a bug in the mobile app checkout flow',
    agentChain: [
      {
        agentId: 'agent-001',
        agentName: 'Customer Support Agent',
        score: 92,
        latency: 1120,
        status: 'success',
        metrics: { accuracy: 93, relevance: 91, coherence: 92, groundedness: 92 },
        input: 'User query: Report a bug in the mobile app checkout flow\nUser ID: user_654\nDevice: iOS 17.2',
        output: 'Thank you for reporting this bug. Let me collect some details and create a bug report for our development team.',
        mcpTools: [
          {
            toolName: 'mcp__Analytics_tool__getUserSession',
            serverId: 'analytics-service',
            serverName: 'Analytics',
            input: { userId: 'user_654', sessionLimit: 1 },
            output: { sessionId: 'sess_bug_001', device: 'iPhone 14', os: 'iOS 17.2', appVersion: '3.2.1', timestamp: '2026-02-08T13:50:00Z' },
            latency: 280,
            status: 'success',
            timestamp: '2026-02-08T13:54:33.300Z'
          }
        ]
      },
      {
        agentId: 'agent-003',
        agentName: 'Tier 2 Support',
        score: 87,
        latency: 1440,
        status: 'success',
        metrics: { accuracy: 88, relevance: 86, coherence: 87, groundedness: 87 },
        input: 'Bug report escalation:\nIssue: Checkout flow bug on mobile\nDevice: iPhone 14, iOS 17.2\nApp version: 3.2.1',
        output: 'Bug report created successfully. Our development team will investigate the checkout flow issue. You should receive updates via email. Reference: BUG-2024.',
        mcpTools: [
          {
            toolName: 'mcp__Jira_tool__createIssue',
            serverId: 'jira-service',
            serverName: 'Jira',
            input: { project: 'MOBILE', type: 'bug', summary: 'Checkout flow issue iOS 17.2', priority: 'high', description: 'User reported bug in mobile checkout', labels: ['checkout', 'ios', 'production'] },
            output: { issueKey: 'MOBILE-2024', status: 'Open', assignee: 'dev-team' },
            latency: 820,
            status: 'success',
            timestamp: '2026-02-08T13:54:34.900Z'
          }
        ]
      }
    ]
  }
];

// Analytics data for time-based views
const performanceOverTime = [
  { time: '00:00', avgScore: 92.3, successRate: 94 },
  { time: '04:00', avgScore: 91.8, successRate: 96 },
  { time: '08:00', avgScore: 89.5, successRate: 88 },
  { time: '12:00', avgScore: 87.2, successRate: 85 },
  { time: '16:00', avgScore: 83.4, successRate: 78 },
  { time: '20:00', avgScore: 86.7, successRate: 82 },
  { time: '23:59', avgScore: 90.1, successRate: 90 },
];

const agentPerformanceData = [
  { name: 'Customer Support', score: 89.5, tasks: 1234, avgLatency: 2100 },
  { name: 'Sales Assistant', score: 86.7, tasks: 892, avgLatency: 1950 },
  { name: 'Tier 1 Support', score: 84.2, tasks: 567, avgLatency: 2340 },
  { name: 'Tier 2 Support', score: 81.8, tasks: 423, avgLatency: 2680 },
  { name: 'Content Moderator', score: 92.1, tasks: 3421, avgLatency: 850 },
];

const statusDistribution = [
  { name: 'Success', value: 2847, color: '#10B981' },
  { name: 'Warning', value: 423, color: '#F59E0B' },
  { name: 'Error', value: 156, color: '#EF4444' },
];

export function ProductionMonitoring({ selectedAgent, theme = 'dark' }: ProductionMonitoringProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('transactions');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('24h');
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);

  const filteredTransactions = mockTransactions.filter(t => 
    t.taskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.userQuery.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTrace = selectedTraceId ? mockTransactions.find(t => t.taskId === selectedTraceId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'warning': return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'error': return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    if (score >= 70) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    return theme === 'dark' ? 'text-red-400' : 'text-red-600';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Agent Evaluation (Live)</h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Real-time evaluation of agent performance based on OpenTelemetry traces
          </p>
        </div>

        {/* View Toggle & Time Window */}
        <div className="flex items-center justify-between mb-6">
          <div className={`inline-flex rounded-lg p-1 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'
          }`}>
            <button
              onClick={() => setViewMode('transactions')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'transactions'
                  ? 'bg-cyan-600 text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'analytics'
                  ? 'bg-cyan-600 text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>

          <div className={`inline-flex rounded-lg p-1 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'
          }`}>
            {(['1h', '24h', '7d', '30d'] as TimeWindow[]).map((window) => (
              <button
                key={window}
                onClick={() => setTimeWindow(window)}
                className={`px-3 py-2 rounded-md transition-colors text-sm ${
                  timeWindow === window
                    ? 'bg-cyan-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {window}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions View */}
        {viewMode === 'transactions' && (
          <>
            {/* Search & Filter */}
            <div className={`rounded-lg p-4 mb-6 border ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search by task ID or query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-600 ${
                      theme === 'dark'
                        ? 'bg-black border-gray-800 text-gray-100 placeholder-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}>
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.taskId}
                  className={`rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-800'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Transaction Header */}
                  <button
                    onClick={() => setExpandedTransaction(
                      expandedTransaction === transaction.taskId ? null : transaction.taskId
                    )}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <StatusIcon status={transaction.status} />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`font-mono text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {transaction.taskId}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              transaction.status === 'success'
                                ? 'bg-green-900/50 text-green-400'
                                : transaction.status === 'warning'
                                ? 'bg-yellow-900/50 text-yellow-400'
                                : 'bg-red-900/50 text-red-400'
                            }`}>
                              {transaction.status}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {transaction.totalLatency}ms
                            </div>
                          </div>
                          <p className={`mb-3 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {transaction.userQuery}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                              {new Date(transaction.timestamp).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Network className="w-4 h-4 text-cyan-500" />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {transaction.agentChain.length} agent{transaction.agentChain.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">Overall Score</div>
                          <div className={`text-2xl font-bold ${getScoreColor(transaction.overallScore)}`}>
                            {transaction.overallScore.toFixed(1)}%
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform ${
                          expandedTransaction === transaction.taskId ? 'rotate-180' : ''
                        } ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Agent Chain Details */}
                  {expandedTransaction === transaction.taskId && (
                    <div className={`border-t px-6 py-4 ${
                      theme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Network className="w-5 h-5 text-cyan-500" />
                        Agent Execution Chain
                      </h4>
                      
                      <div className="space-y-4">
                        {transaction.agentChain.map((agent, index) => (
                          <div key={agent.agentId}>
                            <div className={`rounded-lg p-4 border ${
                              agent.status === 'success'
                                ? theme === 'dark'
                                  ? 'bg-green-900/10 border-green-800/50'
                                  : 'bg-green-50 border-green-200'
                                : agent.status === 'warning'
                                ? theme === 'dark'
                                  ? 'bg-yellow-900/10 border-yellow-800/50'
                                  : 'bg-yellow-50 border-yellow-200'
                                : theme === 'dark'
                                ? 'bg-red-900/10 border-red-800/50'
                                : 'bg-red-50 border-red-200'
                            }`}>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`px-2 py-1 rounded text-xs font-mono ${
                                    theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                                  }`}>
                                    Step {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold">{agent.agentName}</div>
                                    <div className={`text-sm ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                    }`}>
                                      {agent.agentId}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-xl font-bold ${getScoreColor(agent.score)}`}>
                                    {agent.score}%
                                  </div>
                                  <div className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                  }`}>
                                    {agent.latency}ms
                                  </div>
                                </div>
                              </div>

                              {/* Metrics Breakdown */}
                              <div className="grid grid-cols-4 gap-3 mt-3">
                                {Object.entries(agent.metrics).map(([metric, value]) => (
                                  <div key={metric} className={`rounded p-2 ${
                                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                                  }`}>
                                    <div className={`text-xs capitalize mb-1 ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                    }`}>
                                      {metric}
                                    </div>
                                    <div className={`text-sm font-semibold ${getScoreColor(value)}`}>
                                      {value}%
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* MCP Tools Used */}
                              {agent.mcpTools && agent.mcpTools.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="text-sm font-semibold mb-2">MCP Tools Used</h5>
                                  <ul className="list-disc pl-5">
                                    {agent.mcpTools.map((tool, toolIndex) => (
                                      <li key={toolIndex} className="mb-2">
                                        <div className="font-bold">{tool.toolName}</div>
                                        <div className="text-sm text-gray-500">
                                          <span className="font-mono">Server:</span> {tool.serverName} ({tool.serverId})
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          <span className="font-mono">Input:</span> {JSON.stringify(tool.input)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          <span className="font-mono">Output:</span> {JSON.stringify(tool.output)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          <span className="font-mono">Latency:</span> {tool.latency}ms
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          <span className="font-mono">Status:</span> {tool.status}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          <span className="font-mono">Timestamp:</span> {tool.timestamp}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {index < transaction.agentChain.length - 1 && (
                              <div className="flex items-center justify-center py-2">
                                <ArrowRight className={`w-5 h-5 ${
                                  theme === 'dark' ? 'text-gray-700' : 'text-gray-400'
                                }`} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                        onClick={() => setSelectedTraceId(transaction.taskId)}
                        >
                          <Eye className="w-4 h-4" />
                          View Full Trace
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Analytics View */}
        {viewMode === 'analytics' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className={`rounded-lg p-5 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>Total Tasks</div>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold">3,426</div>
                <div className="text-sm text-green-400 mt-1">+8.2% vs last period</div>
              </div>

              <div className={`rounded-lg p-5 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>Avg Score</div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400">88.7%</div>
                <div className="text-sm text-green-400 mt-1">+2.3% improvement</div>
              </div>

              <div className={`rounded-lg p-5 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>Success Rate</div>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold">83.1%</div>
                <div className="text-sm text-gray-500 mt-1">2,847 successful</div>
              </div>

              <div className={`rounded-lg p-5 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>Avg Latency</div>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold">2.1s</div>
                <div className="text-sm text-yellow-400 mt-1">+120ms vs target</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceOverTime}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                    <XAxis dataKey="time" tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
                    <YAxis domain={[75, 100]} tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgScore"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  {statusDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent Performance Table */}
            <div className={`rounded-lg p-6 border ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Agent Performance Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      <th className={`text-left py-3 px-4 font-semibold ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Agent Name</th>
                      <th className={`text-left py-3 px-4 font-semibold ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Avg Score</th>
                      <th className={`text-left py-3 px-4 font-semibold ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Total Tasks</th>
                      <th className={`text-left py-3 px-4 font-semibold ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Avg Latency</th>
                      <th className={`text-left py-3 px-4 font-semibold ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformanceData.map((agent, index) => (
                      <tr
                        key={index}
                        className={`border-b transition-colors ${
                          theme === 'dark'
                            ? 'border-gray-800 hover:bg-gray-800'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-4">{agent.name}</td>
                        <td className="py-4 px-4">
                          <span className={`font-semibold ${getScoreColor(agent.score)}`}>
                            {agent.score}%
                          </span>
                        </td>
                        <td className="py-4 px-4">{agent.tasks.toLocaleString()}</td>
                        <td className="py-4 px-4">{agent.avgLatency}ms</td>
                        <td className="py-4 px-4">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                agent.score >= 85 ? 'bg-green-500' :
                                agent.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${agent.score}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Trace Detail Modal */}
      {selectedTrace && (
        <TraceDetailModal
          trace={selectedTrace}
          onClose={() => setSelectedTraceId(null)}
          theme={theme}
        />
      )}
    </div>
  );
}