import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Play, RefreshCw, Download, Calendar } from 'lucide-react';

interface EvaluationDashboardProps {
  selectedAgent: string | null;
  agentName?: string;
  theme: 'dark' | 'light';
}

const mockMetricsData = [
  { metric: 'Accuracy', score: 92 },
  { metric: 'Relevance', score: 88 },
  { metric: 'Coherence', score: 95 },
  { metric: 'Helpfulness', score: 85 },
  { metric: 'Safety', score: 98 },
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

const mockEvaluationResults = [
  {
    id: 'eval-001',
    testCase: 'Password reset query',
    input: 'How do I reset my password?',
    expected: 'To reset your password, click on "Forgot Password"...',
    actual: 'To reset your password, please click on "Forgot Password" on the login page...',
    scores: { accuracy: 95, relevance: 92, coherence: 98 },
    overallScore: 95,
    status: 'passed',
  },
  {
    id: 'eval-002',
    testCase: 'Business hours inquiry',
    input: 'What are your business hours?',
    expected: 'Our business hours are Monday to Friday, 9 AM to 6 PM EST...',
    actual: 'We are open Monday through Friday from 9 AM to 6 PM Eastern Time...',
    scores: { accuracy: 88, relevance: 90, coherence: 92 },
    overallScore: 90,
    status: 'passed',
  },
  {
    id: 'eval-003',
    testCase: 'Refund policy question',
    input: 'What is your refund policy?',
    expected: 'Our refund policy allows returns within 30 days...',
    actual: 'You can return items within 14 days for a full refund...',
    scores: { accuracy: 65, relevance: 70, coherence: 88 },
    overallScore: 74,
    status: 'warning',
  },
  {
    id: 'eval-004',
    testCase: 'Email support response',
    input: 'Dear Support Team,\n\nI am experiencing issues with my account login...',
    expected: 'Thank you for contacting us. I understand you\'re having trouble logging in...',
    actual: 'Thank you for reaching out. Let me help you with your login issue...',
    scores: { accuracy: 92, relevance: 94, coherence: 96 },
    overallScore: 94,
    status: 'passed',
  },
];

export function EvaluationDashboard({ selectedAgent, agentName, theme }: EvaluationDashboardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  
  const aggregateScore = 90;
  const passedTests = mockEvaluationResults.filter(r => r.status === 'passed').length;
  const warningTests = mockEvaluationResults.filter(r => r.status === 'warning').length;

  const handleRunEvaluation = () => {
    setIsRunning(true);
    setShowRunModal(false);
    // Simulate evaluation running
    setTimeout(() => {
      setIsRunning(false);
      alert('Evaluation completed successfully!');
    }, 3000);
  };

  if (!selectedAgent) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-500">Please select an agent from the Agent Inventory to continue</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Evaluation - {agentName}</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                View evaluation results and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRunModal(true)}
                disabled={isRunning}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  isRunning
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Evaluation
                  </>
                )}
              </button>
              <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Aggregate Score Card */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Aggregate Score</div>
              <div className="text-5xl font-bold text-cyan-400">{aggregateScore}%</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">+5% from last evaluation</span>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Test Cases</div>
                <div className="text-3xl font-bold text-gray-200">
                  {mockEvaluationResults.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Passed</div>
                <div className="text-3xl font-bold text-green-400">
                  {passedTests}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Warnings</div>
                <div className="text-3xl font-bold text-yellow-400">
                  {warningTests}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <Calendar className="w-4 h-4" />
                Last Run
              </div>
              <div className="text-sm text-gray-300">Feb 8, 2026</div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {mockMetricsData.map((metric) => (
            <div
              key={metric.metric}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <div className="text-sm text-gray-500 mb-2">{metric.metric}</div>
              <div className="text-2xl font-bold text-gray-200">{metric.score}%</div>
              <div className="mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={mockMetricsData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF' }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Score Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Evaluation Results</h3>
          <div className="space-y-4">
            {mockEvaluationResults.map((result) => (
              <div
                key={result.id}
                className="bg-black border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-200">{result.testCase}</div>
                      <div className="text-sm text-gray-500">ID: {result.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">
                      {result.overallScore}%
                    </div>
                    <div className="text-xs text-gray-500">Overall Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {Object.entries(result.scores).map(([metric, score]) => (
                    <div key={metric} className="bg-gray-900 p-3 rounded border border-gray-800">
                      <div className="text-xs text-gray-500 mb-1 capitalize">{metric}</div>
                      <div className="font-semibold text-gray-200">{score}%</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Input</div>
                    <div className="bg-gray-900 p-3 rounded border border-gray-800 text-sm text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {result.input}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Expected Output</div>
                    <div className="bg-gray-900 p-3 rounded border border-gray-800 text-sm text-gray-300">
                      {result.expected}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Actual Output</div>
                    <div className="bg-gray-900 p-3 rounded border border-gray-800 text-sm text-gray-300">
                      {result.actual}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Run Evaluation Modal */}
      {showRunModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-lg w-full max-w-2xl">
            <div className="border-b border-gray-800 p-6">
              <h3 className="text-2xl font-bold">Run Evaluation</h3>
              <p className="text-gray-400 mt-1">Configure and run evaluation tests for {agentName}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Evaluation Settings</h4>
                <div className="space-y-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-cyan-600 focus:ring-cyan-600"
                      />
                      <div>
                        <div className="font-medium text-gray-200">Use all ground truth entries</div>
                        <div className="text-sm text-gray-500">Evaluate against all available test cases</div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-cyan-600 focus:ring-cyan-600"
                      />
                      <div>
                        <div className="font-medium text-gray-200">Include custom metrics</div>
                        <div className="text-sm text-gray-500">Apply custom evaluation metrics from benchmark settings</div>
                      </div>
                    </label>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Evaluation Model
                    </label>
                    <select className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-600">
                      <option>GPT-4 (Recommended)</option>
                      <option>GPT-3.5-Turbo</option>
                      <option>Claude-3-Opus</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-900/20 border border-cyan-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-cyan-400">Ready to run</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {mockEvaluationResults.length} test cases will be evaluated. Estimated time: ~2 minutes
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRunModal(false)}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRunEvaluation}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}