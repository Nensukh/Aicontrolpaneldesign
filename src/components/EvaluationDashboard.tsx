import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle, XCircle, Play, RefreshCw, Download, Calendar, ChevronDown, ChevronUp, Star, History, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface EvaluationDashboardProps {
  selectedAgent: string | null;
  agentName?: string;
  theme: 'dark' | 'light';
}

interface TestRun {
  id: string;
  runDate: string;
  timestamp: string;
  aggregateScore: number;
  testCases: number;
  passed: number;
  warnings: number;
  failed: number;
  isBenchmark: boolean;
  trend: number;
}

interface MetricScore {
  value: number;
  threshold: number;
  reasoning?: string;
}

interface EvaluationResult {
  id: string;
  testCase: string;
  input: string;
  expected: string;
  actual: string;
  scores: {
    [key: string]: MetricScore;
  };
  overallScore: number;
  status: 'passed' | 'warning' | 'failed';
  tags?: string[];
}

const mockMetricsData = [
  { metric: 'Accuracy', score: 92, threshold: 85 },
  { metric: 'Relevance', score: 88, threshold: 80 },
  { metric: 'Coherence', score: 95, threshold: 90 },
  { metric: 'Helpfulness', score: 85, threshold: 80 },
  { metric: 'Safety', score: 98, threshold: 95 },
];

const mockTrendData = [
  { date: 'Jan 7', score: 85 },
  { date: 'Jan 8', score: 87 },
  { date: 'Jan 9', score: 86 },
  { date: 'Jan 10', score: 89 },
  { date: 'Jan 11', score: 90 },
  { date: 'Jan 12', score: 91 },
  { date: 'Jan 13', score: 90 },
];

// Mock previous test runs
const mockTestRuns: TestRun[] = [
  {
    id: 'run-001',
    runDate: 'Feb 23, 2026',
    timestamp: '2 hours ago',
    aggregateScore: 90,
    testCases: 8,
    passed: 6,
    warnings: 2,
    failed: 0,
    isBenchmark: true,
    trend: 5,
  },
  {
    id: 'run-002',
    runDate: 'Feb 22, 2026',
    timestamp: '1 day ago',
    aggregateScore: 85,
    testCases: 8,
    passed: 5,
    warnings: 2,
    failed: 1,
    isBenchmark: false,
    trend: -3,
  },
  {
    id: 'run-003',
    runDate: 'Feb 21, 2026',
    timestamp: '2 days ago',
    aggregateScore: 88,
    testCases: 8,
    passed: 6,
    warnings: 1,
    failed: 1,
    isBenchmark: false,
    trend: 2,
  },
  {
    id: 'run-004',
    runDate: 'Feb 20, 2026',
    timestamp: '3 days ago',
    aggregateScore: 86,
    testCases: 8,
    passed: 5,
    warnings: 3,
    failed: 0,
    isBenchmark: false,
    trend: -1,
  },
];

const mockEvaluationResults: EvaluationResult[] = [
  {
    id: 'eval-001',
    testCase: 'Password reset query',
    input: 'How do I reset my password?',
    expected: 'To reset your password, click on "Forgot Password"...',
    actual: 'To reset your password, please click on "Forgot Password" on the login page...',
    scores: {
      accuracy: { value: 95, threshold: 85, reasoning: 'Response accurately addresses the password reset process with clear step-by-step instructions.' },
      relevance: { value: 92, threshold: 80, reasoning: 'Highly relevant to the user query, directly answering the password reset question.' },
      coherence: { value: 98, threshold: 90, reasoning: 'Well-structured and logically organized response with excellent flow.' },
      helpfulness: { value: 94, threshold: 80, reasoning: 'Provides actionable guidance that will help the user complete the task.' },
    },
    overallScore: 95,
    status: 'passed',
    tags: ['authentication', 'password'],
  },
  {
    id: 'eval-002',
    testCase: 'Business hours inquiry',
    input: 'What are your business hours?',
    expected: 'Our business hours are Monday to Friday, 9 AM to 6 PM EST...',
    actual: 'We are open Monday through Friday from 9 AM to 6 PM Eastern Time...',
    scores: {
      accuracy: { value: 88, threshold: 85, reasoning: 'Contains accurate timing information but uses slightly different phrasing.' },
      relevance: { value: 90, threshold: 80, reasoning: 'Directly answers the business hours question with no extraneous information.' },
      coherence: { value: 92, threshold: 90, reasoning: 'Clear and easy to understand, good sentence structure.' },
      helpfulness: { value: 89, threshold: 80, reasoning: 'Provides the exact information needed by the customer.' },
    },
    overallScore: 90,
    status: 'passed',
    tags: ['general', 'hours'],
  },
  {
    id: 'eval-003',
    testCase: 'Refund policy question',
    input: 'What is your refund policy?',
    expected: 'Our refund policy allows returns within 30 days...',
    actual: 'You can return items within 14 days for a full refund...',
    scores: {
      accuracy: { value: 65, threshold: 85, reasoning: 'BELOW THRESHOLD: Incorrect timeframe stated (14 days instead of 30 days). This is a factual error.' },
      relevance: { value: 70, threshold: 80, reasoning: 'BELOW THRESHOLD: While addressing refunds, the incorrect timeframe makes it less relevant.' },
      coherence: { value: 88, threshold: 90, reasoning: 'BELOW THRESHOLD: Response is coherent but the factual error undermines clarity.' },
      helpfulness: { value: 60, threshold: 80, reasoning: 'BELOW THRESHOLD: Misleading information could cause customer dissatisfaction.' },
    },
    overallScore: 74,
    status: 'warning',
    tags: ['policy', 'refund'],
  },
  {
    id: 'eval-004',
    testCase: 'Email support response',
    input: 'Dear Support Team,\n\nI am experiencing issues with my account login...',
    expected: 'Thank you for contacting us. I understand you\'re having trouble logging in...',
    actual: 'Thank you for reaching out. Let me help you with your login issue...',
    scores: {
      accuracy: { value: 92, threshold: 85, reasoning: 'Acknowledges the issue appropriately and offers assistance.' },
      relevance: { value: 94, threshold: 80, reasoning: 'Directly addresses the login problem mentioned in the inquiry.' },
      coherence: { value: 96, threshold: 90, reasoning: 'Professional tone and well-structured empathetic response.' },
      helpfulness: { value: 91, threshold: 80, reasoning: 'Sets expectation of assistance and demonstrates willingness to help.' },
    },
    overallScore: 94,
    status: 'passed',
    tags: ['support', 'authentication'],
  },
  {
    id: 'eval-005',
    testCase: 'Product availability check',
    input: 'Is the Galaxy X Pro available in stock?',
    expected: 'The Galaxy X Pro is currently in stock and available for immediate shipping...',
    actual: 'I\'m not sure about stock availability. Please check our website...',
    scores: {
      accuracy: { value: 45, threshold: 85, reasoning: 'BELOW THRESHOLD: Does not provide definitive answer about stock status.' },
      relevance: { value: 55, threshold: 80, reasoning: 'BELOW THRESHOLD: Avoids the direct question and redirects without helpful info.' },
      coherence: { value: 75, threshold: 90, reasoning: 'BELOW THRESHOLD: Response is coherent but lacks substance.' },
      helpfulness: { value: 40, threshold: 80, reasoning: 'BELOW THRESHOLD: Not helpful; creates additional work for customer.' },
    },
    overallScore: 54,
    status: 'failed',
    tags: ['inventory', 'product'],
  },
  {
    id: 'eval-006',
    testCase: 'Shipping time estimate',
    input: 'How long will it take to ship to California?',
    expected: 'Standard shipping to California typically takes 3-5 business days...',
    actual: 'Shipping to California usually takes 3-5 business days for standard delivery...',
    scores: {
      accuracy: { value: 97, threshold: 85, reasoning: 'Provides accurate shipping timeframe information.' },
      relevance: { value: 96, threshold: 80, reasoning: 'Perfectly addresses the California shipping question.' },
      coherence: { value: 95, threshold: 90, reasoning: 'Clear, concise, and well-articulated response.' },
      helpfulness: { value: 95, threshold: 80, reasoning: 'Gives specific timeframe that helps customer plan.' },
    },
    overallScore: 96,
    status: 'passed',
    tags: ['shipping', 'logistics'],
  },
  {
    id: 'eval-007',
    testCase: 'Payment method inquiry',
    input: 'Do you accept PayPal?',
    expected: 'Yes, we accept PayPal along with major credit cards...',
    actual: 'Yes, PayPal is accepted as a payment method...',
    scores: {
      accuracy: { value: 90, threshold: 85, reasoning: 'Confirms PayPal acceptance accurately.' },
      relevance: { value: 88, threshold: 80, reasoning: 'Directly answers the PayPal question.' },
      coherence: { value: 92, threshold: 90, reasoning: 'Simple and straightforward response.' },
      helpfulness: { value: 87, threshold: 80, reasoning: 'Answers the question but could mention other payment options.' },
    },
    overallScore: 89,
    status: 'passed',
    tags: ['payment', 'checkout'],
  },
  {
    id: 'eval-008',
    testCase: 'Technical troubleshooting',
    input: 'The app keeps crashing on my iPhone 15. What should I do?',
    expected: 'Please try updating to the latest version of the app and restart your device...',
    actual: 'That sounds frustrating. Have you tried turning it off and on?',
    scores: {
      accuracy: { value: 72, threshold: 85, reasoning: 'BELOW THRESHOLD: Generic advice without specific troubleshooting steps.' },
      relevance: { value: 75, threshold: 80, reasoning: 'BELOW THRESHOLD: Somewhat relevant but lacks technical detail.' },
      coherence: { value: 85, threshold: 90, reasoning: 'BELOW THRESHOLD: Coherent but overly casual for technical support.' },
      helpfulness: { value: 68, threshold: 80, reasoning: 'BELOW THRESHOLD: Basic advice that may not resolve the specific issue.' },
    },
    overallScore: 75,
    status: 'warning',
    tags: ['technical', 'troubleshooting'],
  },
];

export function EvaluationDashboard({ selectedAgent, agentName, theme }: EvaluationDashboardProps) {
  const [selectedRun, setSelectedRun] = useState<TestRun>(mockTestRuns[0]);
  const [showPreviousRuns, setShowPreviousRuns] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [showReasoningFor, setShowReasoningFor] = useState<string | null>(null);
  
  const aggregateScore = selectedRun.aggregateScore;
  const passedTests = selectedRun.passed;
  const warningTests = selectedRun.warnings;
  const failedTests = selectedRun.failed;

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedResults(newExpanded);
  };

  const setBenchmark = (runId: string) => {
    // In a real app, this would update the backend
    const updatedRuns = mockTestRuns.map(run => ({
      ...run,
      isBenchmark: run.id === runId
    }));
    const newSelectedRun = updatedRuns.find(r => r.id === runId);
    if (newSelectedRun) {
      setSelectedRun(newSelectedRun);
    }
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
  
  if (!selectedAgent) {
    return (
      <div className={`min-h-screen p-6 ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className={`rounded-lg p-12 text-center border ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
              Please select an agent from the Agent Inventory to continue
            </p>
          </div>
        </div>
      </div>
    );
  }

  const benchmarkRun = mockTestRuns.find(r => r.isBenchmark);

  return (
    <div className={`p-6 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Evaluation Results - {agentName}
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                View evaluation results and performance metrics from executed tests
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowPreviousRuns(!showPreviousRuns)}
                className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                }`}
              >
                <History className="w-5 h-5" />
                Previous Runs
              </button>
              <button className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
              }`}>
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Previous Runs Panel */}
        {showPreviousRuns && (
          <div className={`rounded-lg p-4 mb-6 border ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}>
            <h4 className={`text-sm font-semibold mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Test Run History
            </h4>
            <div className="space-y-2">
              {mockTestRuns.map((run) => (
                <div
                  key={run.id}
                  onClick={() => setSelectedRun(run)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRun.id === run.id
                      ? theme === 'dark'
                        ? 'bg-purple-900/30 border-purple-700'
                        : 'bg-purple-50 border-purple-300'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {run.isBenchmark && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      <div>
                        <div className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {run.runDate}
                          {run.isBenchmark && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                              theme === 'dark'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              Benchmark
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {run.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        }`}>
                          {run.aggregateScore}%
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className={`${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`}>
                            {run.passed} passed
                          </span>
                          {run.warnings > 0 && (
                            <span className={`${
                              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                            }`}>
                              • {run.warnings} warnings
                            </span>
                          )}
                          {run.failed > 0 && (
                            <span className={`${
                              theme === 'dark' ? 'text-red-400' : 'text-red-600'
                            }`}>
                              • {run.failed} failed
                            </span>
                          )}
                        </div>
                      </div>
                      {!run.isBenchmark && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBenchmark(run.id);
                          }}
                          className={`p-2 rounded hover:bg-opacity-80 transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-gray-200'
                          }`}
                          title="Set as benchmark"
                        >
                          <Star className={`w-4 h-4 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benchmark Comparison */}
        {benchmarkRun && selectedRun.id !== benchmarkRun.id && (
          <div className={`rounded-lg p-4 mb-6 border ${
            theme === 'dark'
              ? 'bg-yellow-900/20 border-yellow-800/50'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className={`w-5 h-5 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <div>
                  <div className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
                  }`}>
                    Comparing to Benchmark
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-yellow-400/70' : 'text-yellow-700'
                  }`}>
                    Benchmark: {benchmarkRun.runDate} - {benchmarkRun.aggregateScore}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Current vs Benchmark:
                </span>
                <span className={`text-lg font-bold flex items-center gap-1 ${
                  selectedRun.aggregateScore >= benchmarkRun.aggregateScore
                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  {selectedRun.aggregateScore >= benchmarkRun.aggregateScore ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  {selectedRun.aggregateScore - benchmarkRun.aggregateScore > 0 ? '+' : ''}
                  {selectedRun.aggregateScore - benchmarkRun.aggregateScore}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Aggregate Score Card */}
        <div className={`rounded-lg p-6 mb-6 border ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-800'
            : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm mb-1 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Aggregate Score
                {selectedRun.isBenchmark && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    Benchmark Run
                  </span>
                )}
              </div>
              <div className={`text-5xl font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {aggregateScore}%
              </div>
              {selectedRun.trend !== 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {selectedRun.trend > 0 ? (
                    <TrendingUp className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                  ) : (
                    <TrendingDown className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`} />
                  )}
                  <span className={`text-sm ${
                    selectedRun.trend > 0
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {selectedRun.trend > 0 ? '+' : ''}{selectedRun.trend}% from last evaluation
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Test Cases
                </div>
                <div className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {selectedRun.testCases}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Passed
                </div>
                <div className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  {passedTests}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Warnings
                </div>
                <div className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  {warningTests}
                </div>
              </div>
              {failedTests > 0 && (
                <div className="text-center">
                  <div className={`text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Failed
                  </div>
                  <div className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {failedTests}
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-2 text-sm mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Calendar className="w-4 h-4" />
                Run Date
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {selectedRun.runDate}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {selectedRun.timestamp}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Overview with Thresholds */}
        <div className="grid grid-cols-5 gap-4 mb-6">
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

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <div className={`rounded-lg p-6 border ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Performance Radar
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

          {/* Trend Chart */}
          <div className={`rounded-lg p-6 border ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Score Trend (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} 
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280', fontSize: 12 }} 
                />
                <YAxis 
                  domain={[80, 100]} 
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
                  dataKey="score"
                  stroke={theme === 'dark' ? '#06B6D4' : '#0891B2'}
                  strokeWidth={2}
                  dot={{ fill: theme === 'dark' ? '#06B6D4' : '#0891B2', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Results */}
        <div className={`rounded-lg p-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Evaluation Results ({mockEvaluationResults.length} Test Cases)
          </h3>
          <div className="space-y-3">
            {mockEvaluationResults.map((result) => {
              const isExpanded = expandedResults.has(result.id);
              return (
                <div
                  key={result.id}
                  className={`rounded-lg border transition-all ${
                    theme === 'dark'
                      ? 'bg-black border-gray-800'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Compact Header */}
                  <div
                    onClick={() => toggleExpanded(result.id)}
                    className={`p-4 cursor-pointer hover:bg-opacity-80 transition-all ${
                      theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {result.status === 'passed' ? (
                          <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`} />
                        ) : result.status === 'warning' ? (
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                          }`} />
                        ) : (
                          <XCircle className={`w-5 h-5 flex-shrink-0 ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                          }`} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            {result.testCase}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              ID: {result.id}
                            </span>
                            {result.tags && result.tags.map(tag => (
                              <span
                                key={tag}
                                className={`text-xs px-2 py-0.5 rounded ${
                                  theme === 'dark'
                                    ? 'bg-gray-800 text-gray-400'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Metrics Summary */}
                      <div className="flex items-center gap-4 mr-4">
                        {Object.entries(result.scores).slice(0, 4).map(([metric, scoreData]) => (
                          <div key={metric} className="text-center">
                            <div className={`text-xs mb-1 capitalize ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {metric}
                            </div>
                            <div className={`text-sm font-bold ${
                              getMetricColor(scoreData.value, scoreData.threshold)
                            }`}>
                              {scoreData.value}%
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                          }`}>
                            {result.overallScore}%
                          </div>
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            Overall
                          </div>
                        </div>
                        {isExpanded ? (
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

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className={`px-4 pb-4 border-t ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      {/* All Metrics with Thresholds */}
                      <div className="grid grid-cols-4 gap-3 mt-4 mb-4">
                        {Object.entries(result.scores).map(([metric, scoreData]) => (
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
                                      showReasoningFor === `${result.id}-${metric}` 
                                        ? null 
                                        : `${result.id}-${metric}`
                                    );
                                  }}
                                  className={`p-1 rounded transition-colors ${
                                    theme === 'dark'
                                      ? 'hover:bg-gray-800'
                                      : 'hover:bg-gray-200'
                                  }`}
                                  title="View reasoning"
                                >
                                  {showReasoningFor === `${result.id}-${metric}` ? (
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
                            {showReasoningFor === `${result.id}-${metric}` && scoreData.reasoning && (
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

                      {/* Input/Output Details */}
                      <div className="space-y-3 mt-4">
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
                            {result.input}
                          </div>
                        </div>
                        <div>
                          <div className={`text-xs font-medium mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Expected Output
                          </div>
                          <div className={`p-3 rounded border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-900 border-gray-800 text-gray-300'
                              : 'bg-white border-gray-200 text-gray-700'
                          }`}>
                            {result.expected}
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
                            {result.actual}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
