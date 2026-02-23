import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Search, Filter, ChevronDown, ChevronRight, Calendar, TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle, XCircle, Network, Clock, Zap, MessageSquare, ArrowRight, Eye, X, Code, Database, FileText, Layers, ChevronUp, EyeOff, AlertTriangle, Copy, Check } from 'lucide-react';

interface ProductionMonitoringProps {
  selectedAgent: string | null;
  theme?: 'dark' | 'light';
}

type ViewMode = 'transactions' | 'analytics';
type TimeWindow = '1h' | '24h' | '7d' | '30d';

interface MetricScore {
  value: number;
  threshold: number;
  reasoning?: string;
}

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
  scores: {
    [key: string]: MetricScore;
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
  traceData?: any; // Raw OpenTelemetry trace data
}

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    taskId: 'task-20260223-001',
    timestamp: '2026-02-23T14:32:15Z',
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
        scores: {
          accuracy: { value: 98, threshold: 85, reasoning: 'Response accurately identifies both user needs and correctly routes to appropriate service.' },
          relevance: { value: 95, threshold: 80, reasoning: 'Highly relevant response addressing both password reset and billing update requests.' },
          coherence: { value: 96, threshold: 90, reasoning: 'Well-structured response with clear understanding of dual requests.' },
          groundedness: { value: 95, threshold: 90, reasoning: 'Grounded in session data and user profile retrieved from UserAuth service.' },
        },
        input: 'User query: I need help resetting my password and updating billing information\nContext: User is logged in, session ID: sess_abc123',
        output: 'I understand you need help with two things: resetting your password and updating billing information. Let me route this to our Tier 1 Support team who can assist you with both requests securely.',
        mcpTools: [
          {
            toolName: 'mcp__UserAuth_tool__getUserProfile',
            serverId: 'userauth-service',
            serverName: 'UserAuth',
            input: { sessionId: 'sess_abc123' },
            output: { userId: 'user_789', email: 'john.doe@example.com', status: 'active', lastLogin: '2026-02-23T14:30:00Z' },
            latency: 120,
            status: 'success',
            timestamp: '2026-02-23T14:32:15.100Z'
          },
          {
            toolName: 'mcp__KnowledgeBase_tool__searchArticles',
            serverId: 'kb-service',
            serverName: 'KnowledgeBase',
            input: { query: 'password reset billing update', category: 'account-management' },
            output: { articles: [{ id: 'kb-001', title: 'How to Reset Password', relevance: 0.95 }, { id: 'kb-002', title: 'Update Billing Info', relevance: 0.92 }] },
            latency: 240,
            status: 'success',
            timestamp: '2026-02-23T14:32:15.350Z'
          }
        ]
      },
      {
        agentId: 'agent-002',
        agentName: 'Tier 1 Support',
        score: 93,
        latency: 1450,
        status: 'success',
        scores: {
          accuracy: { value: 94, threshold: 85, reasoning: 'Correctly executed both password reset and billing verification processes.' },
          relevance: { value: 92, threshold: 80, reasoning: 'Relevant actions taken for both user requests.' },
          coherence: { value: 93, threshold: 90, reasoning: 'Clear communication about actions taken for both services.' },
          groundedness: { value: 93, threshold: 90, reasoning: 'Actions based on actual MCP tool calls to UserAuth and Billing services.' },
        },
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
            timestamp: '2026-02-23T14:32:16.200Z'
          },
          {
            toolName: 'mcp__Billing_tool__sendVerificationEmail',
            serverId: 'billing-service',
            serverName: 'Billing',
            input: { userId: 'user_789', purpose: 'billing-update' },
            output: { verificationSent: true, verificationCode: 'ver_def789' },
            latency: 420,
            status: 'success',
            timestamp: '2026-02-23T14:32:16.600Z'
          }
        ]
      }
    ],
    traceData: {
      traceId: 'trace-20260223-001',
      spanId: 'span-root-001',
      operationName: 'user.request.password_billing',
      startTime: '2026-02-23T14:32:15.000Z',
      duration: 2340,
      tags: {
        'service.name': 'agent-orchestrator',
        'http.method': 'POST',
        'user.id': 'user_789',
        'session.id': 'sess_abc123'
      },
      spans: [
        {
          spanId: 'span-001',
          parentSpanId: 'span-root-001',
          operationName: 'agent.customer_support.process',
          startTime: '2026-02-23T14:32:15.100Z',
          duration: 890,
          tags: { 'agent.id': 'agent-001', 'agent.name': 'Customer Support Agent' }
        },
        {
          spanId: 'span-002',
          parentSpanId: 'span-root-001',
          operationName: 'agent.tier1_support.process',
          startTime: '2026-02-23T14:32:16.000Z',
          duration: 1450,
          tags: { 'agent.id': 'agent-002', 'agent.name': 'Tier 1 Support' }
        }
      ]
    }
  },
  {
    taskId: 'task-20260223-002',
    timestamp: '2026-02-23T14:28:42Z',
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
        scores: {
          accuracy: { value: 85, threshold: 85, reasoning: 'Provides basic pricing information but lacks complete details.' },
          relevance: { value: 78, threshold: 80, reasoning: 'BELOW THRESHOLD: Somewhat relevant but immediately deflects to human representative.' },
          coherence: { value: 83, threshold: 90, reasoning: 'BELOW THRESHOLD: Response is coherent but creates unnecessary handoff.' },
          groundedness: { value: 82, threshold: 90, reasoning: 'BELOW THRESHOLD: Based on pricing data but could provide more detail from available info.' },
        },
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
            timestamp: '2026-02-23T14:28:42.200Z'
          }
        ]
      },
      {
        agentId: 'agent-001',
        agentName: 'Customer Support Agent',
        score: 74,
        latency: 1440,
        status: 'warning',
        scores: {
          accuracy: { value: 76, threshold: 85, reasoning: 'BELOW THRESHOLD: Generic response without utilizing available pricing data.' },
          relevance: { value: 72, threshold: 80, reasoning: 'BELOW THRESHOLD: Deflects to sales call without attempting to answer question.' },
          coherence: { value: 74, threshold: 90, reasoning: 'BELOW THRESHOLD: Coherent but doesn\'t add value to conversation.' },
          groundedness: { value: 75, threshold: 90, reasoning: 'BELOW THRESHOLD: Not grounded in the pricing information that was already retrieved.' },
        },
        input: 'Escalated from Sales Assistant: User asking about enterprise pricing but needs more detailed info',
        output: 'For enterprise pricing details, I recommend scheduling a call with our sales team. They can provide custom quotes based on your organization size and requirements.',
        mcpTools: []
      }
    ],
    traceData: {
      traceId: 'trace-20260223-002',
      spanId: 'span-root-002',
      operationName: 'user.request.pricing_inquiry',
      startTime: '2026-02-23T14:28:42.000Z',
      duration: 3120,
      tags: {
        'service.name': 'agent-orchestrator',
        'http.method': 'POST'
      }
    }
  },
  {
    taskId: 'task-20260223-003',
    timestamp: '2026-02-23T14:15:28Z',
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
        scores: {
          accuracy: { value: 90, threshold: 85, reasoning: 'Accurately identifies order status and delay reason.' },
          relevance: { value: 87, threshold: 80, reasoning: 'Relevant explanation of delay and appropriate escalation.' },
          coherence: { value: 89, threshold: 90, reasoning: 'BELOW THRESHOLD: Clear response but slightly lacking in empathy.' },
          groundedness: { value: 86, threshold: 90, reasoning: 'BELOW THRESHOLD: Grounded in order data from MCP tool call.' },
        },
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
            timestamp: '2026-02-23T14:15:28.350Z'
          }
        ]
      },
      {
        agentId: 'agent-003',
        agentName: 'Tier 2 Support',
        score: 58,
        latency: 2180,
        status: 'error',
        scores: {
          accuracy: { value: 62, threshold: 85, reasoning: 'BELOW THRESHOLD: Attempted refund but failed to handle error properly.' },
          relevance: { value: 55, threshold: 80, reasoning: 'BELOW THRESHOLD: Technical error handling not relevant to user needs.' },
          coherence: { value: 60, threshold: 90, reasoning: 'BELOW THRESHOLD: Confusing response about gateway issues.' },
          groundedness: { value: 56, threshold: 90, reasoning: 'BELOW THRESHOLD: Grounded in error state but lacks proper recovery strategy.' },
        },
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
            timestamp: '2026-02-23T14:15:30.200Z'
          }
        ]
      },
      {
        agentId: 'agent-002',
        agentName: 'Tier 1 Support',
        score: 42,
        latency: 1130,
        status: 'error',
        scores: {
          accuracy: { value: 45, threshold: 85, reasoning: 'BELOW THRESHOLD: Failed to provide solution, only created ticket.' },
          relevance: { value: 38, threshold: 80, reasoning: 'BELOW THRESHOLD: Creating ticket is not a direct solution to user request.' },
          coherence: { value: 44, threshold: 90, reasoning: 'BELOW THRESHOLD: Poor communication about failure and next steps.' },
          groundedness: { value: 42, threshold: 90, reasoning: 'BELOW THRESHOLD: Response not grounded in any successful action.' },
        },
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
            timestamp: '2026-02-23T14:15:32.800Z'
          }
        ]
      }
    ],
    traceData: {
      traceId: 'trace-20260223-003',
      spanId: 'span-root-003',
      operationName: 'user.request.refund_process',
      startTime: '2026-02-23T14:15:28.000Z',
      duration: 4230,
      tags: {
        'service.name': 'agent-orchestrator',
        'http.method': 'POST',
        'user.id': 'user_456',
        'order.id': '12345',
        'error': 'true'
      }
    }
  },
  {
    taskId: 'task-20260223-004',
    timestamp: '2026-02-23T14:08:11Z',
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
        scores: {
          accuracy: { value: 92, threshold: 85, reasoning: 'Provides accurate product recommendations based on purchase history.' },
          relevance: { value: 90, threshold: 80, reasoning: 'Highly relevant recommendations that complement previous purchase.' },
          coherence: { value: 91, threshold: 90, reasoning: 'Well-structured recommendation list with clear reasoning.' },
          groundedness: { value: 92, threshold: 90, reasoning: 'Recommendations grounded in actual purchase history and ML similarity scores.' },
        },
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
            timestamp: '2026-02-23T14:08:11.450Z'
          },
          {
            toolName: 'mcp__Recommendations_tool__getSimilarProducts',
            serverId: 'recommendations-service',
            serverName: 'Recommendations',
            input: { productId: 'prod_headphones_01', limit: 5 },
            output: { recommendations: [{ id: 'prod_earbuds_02', name: 'Premium earbuds', score: 0.94 }, { id: 'prod_speaker_03', name: 'Bluetooth speaker', score: 0.88 }] },
            latency: 680,
            status: 'success',
            timestamp: '2026-02-23T14:08:12.100Z'
          }
        ]
      }
    ],
    traceData: {
      traceId: 'trace-20260223-004',
      spanId: 'span-root-004',
      operationName: 'user.request.product_recommendations',
      startTime: '2026-02-23T14:08:11.000Z',
      duration: 1980,
      tags: {
        'service.name': 'agent-orchestrator',
        'http.method': 'POST',
        'user.id': 'user_321'
      }
    }
  }
];

const mockMetricsData = [
  { metric: 'Accuracy', score: 86, threshold: 85 },
  { metric: 'Relevance', score: 82, threshold: 80 },
  { metric: 'Coherence', score: 88, threshold: 90 },
  { metric: 'Groundedness', score: 85, threshold: 90 },
];

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
  const [showReasoningFor, setShowReasoningFor] = useState<string | null>(null);
  const [showTraceFor, setShowTraceFor] = useState<string | null>(null);
  const [copiedTrace, setCopiedTrace] = useState(false);

  const filteredTransactions = mockTransactions.filter(t => 
    t.taskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.userQuery.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getMetricColor = (value: number, threshold: number) => {
    if (value >= threshold) {
      return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    } else if (value >= threshold - 10) {
      return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    } else {
      return theme === 'dark' ? 'text-red-400' : 'text-red-600';
    }
  };

  const getMetricBg = (value: number, threshold: number) => {
    if (value >= threshold) {
      return theme === 'dark' ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200';
    } else if (value >= threshold - 10) {
      return theme === 'dark' ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200';
    } else {
      return theme === 'dark' ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'success': return <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />;
      case 'warning': return <AlertCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />;
      case 'error': return <XCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />;
      default: return null;
    }
  };

  const copyTraceToClipboard = (traceData: any) => {
    const jsonString = JSON.stringify(traceData, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Agent Evaluation (Live)
          </h2>
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
            {/* Metrics Overview with Thresholds */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {mockMetricsData.map((metric) => {
                const isAboveThreshold = metric.score >= metric.threshold;
                return (
                  <div
                    key={metric.metric}
                    className={`rounded-lg p-4 border ${
                      isAboveThreshold
                        ? theme === 'dark'
                          ? 'bg-gray-900 border-gray-800'
                          : 'bg-white border-gray-200'
                        : theme === 'dark'
                        ? 'bg-yellow-900/20 border-yellow-800/50'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {metric.metric}
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <div className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {metric.score}%
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        / {metric.threshold}%
                      </div>
                    </div>
                    <div className={`mt-2 rounded-full h-2 overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAboveThreshold
                            ? theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-600'
                            : theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-600'
                        }`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                    {!isAboveThreshold && (
                      <div className={`text-xs mt-2 flex items-center gap-1 ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                      }`}>
                        <AlertTriangle className="w-3 h-3" />
                        Below threshold
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

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
                    placeholder="Search by task ID, correlation ID, or query..."
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
            <div className={`rounded-lg p-6 border ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Live Evaluation Results ({filteredTransactions.length} Transactions)
              </h3>
              
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.taskId}
                    className={`rounded-lg border transition-all ${
                      theme === 'dark'
                        ? 'bg-black border-gray-800'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {/* Compact Transaction Header */}
                    <div
                      onClick={() => setExpandedTransaction(
                        expandedTransaction === transaction.taskId ? null : transaction.taskId
                      )}
                      className={`p-4 cursor-pointer hover:bg-opacity-80 transition-all ${
                        theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <StatusIcon status={transaction.status} />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`font-mono text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {transaction.taskId}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                transaction.status === 'success'
                                  ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                                  : transaction.status === 'warning'
                                  ? theme === 'dark' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                  : theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'
                              }`}>
                                {transaction.status}
                              </span>
                              <div className={`flex items-center gap-1 text-sm ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                <Clock className="w-4 h-4" />
                                {transaction.totalLatency}ms
                              </div>
                              <div className="flex items-center gap-2">
                                <Network className="w-4 h-4 text-cyan-500" />
                                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {transaction.agentChain.length} agent{transaction.agentChain.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            <p className={`mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {transaction.userQuery}
                            </p>
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {new Date(transaction.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(transaction.overallScore)}`}>
                              {transaction.overallScore.toFixed(1)}%
                            </div>
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              Overall
                            </div>
                          </div>
                          {expandedTransaction === transaction.taskId ? (
                            <ChevronUp className={`w-5 h-5 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                          ) : (
                            <ChevronDown className={`w-5 h-5 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Agent Chain Details */}
                    {expandedTransaction === transaction.taskId && (
                      <div className={`border-t px-4 pb-4 ${
                        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                      }`}>
                        {/* View Trace Button */}
                        <div className="mt-4 mb-4 flex items-center justify-between">
                          <h4 className={`font-semibold flex items-center gap-2 ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            <Network className="w-5 h-5 text-cyan-500" />
                            Agent Execution Chain
                          </h4>
                          <button
                            onClick={() => setShowTraceFor(
                              showTraceFor === transaction.taskId ? null : transaction.taskId
                            )}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                                : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <Code className="w-4 h-4" />
                            {showTraceFor === transaction.taskId ? 'Hide Trace' : 'View Trace'}
                          </button>
                        </div>

                        {/* Trace Data Display */}
                        {showTraceFor === transaction.taskId && transaction.traceData && (
                          <div className={`rounded-lg p-4 mb-4 border ${
                            theme === 'dark'
                              ? 'bg-gray-950 border-gray-700'
                              : 'bg-gray-100 border-gray-300'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <h5 className={`text-sm font-semibold ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                OpenTelemetry Trace Data
                              </h5>
                              <button
                                onClick={() => copyTraceToClipboard(transaction.traceData)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-sm ${
                                  theme === 'dark'
                                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                              >
                                {copiedTrace ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy JSON
                                  </>
                                )}
                              </button>
                            </div>
                            <div className={`rounded p-3 overflow-auto max-h-64 ${
                              theme === 'dark' ? 'bg-black' : 'bg-white'
                            }`}>
                              <pre className={`text-xs font-mono ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {JSON.stringify(transaction.traceData, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                        
                        {/* Agent Chain */}
                        <div className="space-y-4">
                          {transaction.agentChain.map((agent, index) => (
                            <div key={`${agent.agentId}-${index}`} className={`rounded-lg p-4 border ${
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
                              {/* Agent Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`px-2 py-1 rounded text-xs font-mono ${
                                    theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                                  }`}>
                                    Step {index + 1}
                                  </div>
                                  <div>
                                    <div className={`font-semibold ${
                                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}>
                                      {agent.agentName}
                                    </div>
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
                                  <div className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                  }`}>
                                    {agent.latency}ms
                                  </div>
                                </div>
                              </div>

                              {/* Metrics with Thresholds */}
                              <div className="grid grid-cols-4 gap-3 mb-4">
                                {Object.entries(agent.scores).map(([metric, scoreData]) => (
                                  <div 
                                    key={metric} 
                                    className={`p-3 rounded border ${
                                      getMetricBg(scoreData.value, scoreData.threshold)
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className={`text-xs capitalize font-medium ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                      }`}>
                                        {metric}
                                      </div>
                                      {scoreData.reasoning && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowReasoningFor(
                                              showReasoningFor === `${agent.agentId}-${index}-${metric}` 
                                                ? null 
                                                : `${agent.agentId}-${index}-${metric}`
                                            );
                                          }}
                                          className={`p-1 rounded transition-colors ${
                                            theme === 'dark'
                                              ? 'hover:bg-gray-800'
                                              : 'hover:bg-gray-200'
                                          }`}
                                          title="View reasoning"
                                        >
                                          {showReasoningFor === `${agent.agentId}-${index}-${metric}` ? (
                                            <EyeOff className="w-3 h-3" />
                                          ) : (
                                            <Eye className="w-3 h-3" />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                      <div className={`text-xl font-bold ${
                                        getMetricColor(scoreData.value, scoreData.threshold)
                                      }`}>
                                        {scoreData.value}%
                                      </div>
                                      <div className={`text-xs ${
                                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                      }`}>
                                        / {scoreData.threshold}%
                                      </div>
                                    </div>
                                    <div className={`mt-2 rounded-full h-1.5 overflow-hidden ${
                                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                                    }`}>
                                      <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                          scoreData.value >= scoreData.threshold
                                            ? 'bg-green-500'
                                            : scoreData.value >= scoreData.threshold - 10
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                        }`}
                                        style={{ width: `${scoreData.value}%` }}
                                      />
                                    </div>
                                    {showReasoningFor === `${agent.agentId}-${index}-${metric}` && scoreData.reasoning && (
                                      <div className={`mt-3 p-2 rounded text-xs ${
                                        theme === 'dark'
                                          ? 'bg-gray-900 text-gray-400'
                                          : 'bg-white text-gray-600'
                                      }`}>
                                        {scoreData.reasoning}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Input/Output (NO Expected Output for Live) */}
                              <div className="space-y-3">
                                <div>
                                  <div className={`text-xs font-medium mb-1 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    Input
                                  </div>
                                  <div className={`p-3 rounded border text-sm whitespace-pre-wrap max-h-32 overflow-y-auto ${
                                    theme === 'dark'
                                      ? 'bg-gray-900 border-gray-800 text-gray-300'
                                      : 'bg-white border-gray-200 text-gray-700'
                                  }`}>
                                    {agent.input}
                                  </div>
                                </div>
                                <div>
                                  <div className={`text-xs font-medium mb-1 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    Actual Output
                                  </div>
                                  <div className={`p-3 rounded border text-sm ${
                                    theme === 'dark'
                                      ? 'bg-gray-900 border-gray-800 text-gray-300'
                                      : 'bg-white border-gray-200 text-gray-700'
                                  }`}>
                                    {agent.output}
                                  </div>
                                </div>

                                {/* MCP Tools Called */}
                                {agent.mcpTools && agent.mcpTools.length > 0 && (
                                  <div>
                                    <div className={`text-xs font-medium mb-2 flex items-center gap-2 ${
                                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                      <Layers className="w-3 h-3" />
                                      MCP Tools Called ({agent.mcpTools.length})
                                    </div>
                                    <div className="space-y-2">
                                      {agent.mcpTools.map((tool, toolIndex) => (
                                        <div
                                          key={toolIndex}
                                          className={`p-3 rounded border text-xs ${
                                            theme === 'dark'
                                              ? 'bg-gray-950 border-gray-700'
                                              : 'bg-white border-gray-300'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              <Database className="w-3 h-3 text-cyan-500" />
                                              <span className={`font-mono ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                              }`}>
                                                {tool.toolName}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className={`px-2 py-0.5 rounded text-xs ${
                                                tool.status === 'success'
                                                  ? theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                                                  : theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'
                                              }`}>
                                                {tool.status}
                                              </span>
                                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                                                {tool.latency}ms
                                              </span>
                                            </div>
                                          </div>
                                          <div className={`text-xs ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                          }`}>
                                            {tool.serverName} • {tool.timestamp}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Analytics View */}
        {viewMode === 'analytics' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-800'
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              }`}>
                <div className={`text-sm mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Success Rate
                </div>
                <div className={`text-4xl font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  83.2%
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    +2.3% from yesterday
                  </span>
                </div>
              </div>

              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-800'
                  : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200'
              }`}>
                <div className={`text-sm mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Avg Score
                </div>
                <div className={`text-4xl font-bold ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                  87.4%
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    +1.8% improvement
                  </span>
                </div>
              </div>

              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-800'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
              }`}>
                <div className={`text-sm mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Transactions
                </div>
                <div className={`text-4xl font-bold ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  3,426
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Activity className={`w-4 h-4 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Last {timeWindow}
                  </span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Performance Over Time */}
              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Performance Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceOverTime}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
                    />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} 
                    />
                    <YAxis 
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} 
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px',
                        color: theme === 'dark' ? '#FFFFFF' : '#000000',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      stroke={theme === 'dark' ? '#06B6D4' : '#0891B2'}
                      strokeWidth={2}
                      dot={{ fill: theme === 'dark' ? '#06B6D4' : '#0891B2', r: 4 }}
                      name="Avg Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Agent Performance Radar */}
              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Metrics Radar
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={mockMetricsData}>
                    <PolarGrid stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} 
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }} 
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke={theme === 'dark' ? '#06B6D4' : '#0891B2'}
                      fill={theme === 'dark' ? '#06B6D4' : '#0891B2'}
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Distribution & Agent Performance */}
            <div className="grid grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
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
              </div>

              {/* Agent Performance */}
              <div className={`rounded-lg p-6 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800'
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Agent Performance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentPerformanceData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 10 }} 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} 
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill={theme === 'dark' ? '#06B6D4' : '#0891B2'}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
