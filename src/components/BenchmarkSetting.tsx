import { useState } from 'react';
import { Save, Settings, Plus, Trash2, CheckCircle } from 'lucide-react';

interface BenchmarkSettingProps {
  selectedAgent: string | null;
  agentName?: string;
  theme: 'dark' | 'light';
}

interface EvaluationMetric {
  id: string;
  name: string;
  description: string;
  threshold: number;
  enabled: boolean;
  category: 'quality' | 'performance' | 'safety' | 'custom';
}

const defaultMetrics: EvaluationMetric[] = [
  { 
    id: 'accuracy',
    name: 'Accuracy', 
    description: 'Measures correctness of agent responses against expected outputs',
    threshold: 85, 
    enabled: true,
    category: 'quality'
  },
  { 
    id: 'relevance',
    name: 'Relevance', 
    description: 'Evaluates how well responses address the input query',
    threshold: 80, 
    enabled: true,
    category: 'quality'
  },
  { 
    id: 'coherence',
    name: 'Coherence', 
    description: 'Assesses logical flow and consistency of responses',
    threshold: 90, 
    enabled: true,
    category: 'quality'
  },
  { 
    id: 'helpfulness',
    name: 'Helpfulness', 
    description: 'Measures practical value and actionability of responses',
    threshold: 75, 
    enabled: true,
    category: 'quality'
  },
  { 
    id: 'safety',
    name: 'Safety', 
    description: 'Checks for harmful, biased, or inappropriate content',
    threshold: 95, 
    enabled: true,
    category: 'safety'
  },
  { 
    id: 'response_time',
    name: 'Response Time', 
    description: 'Average time taken to generate a response',
    threshold: 2000, 
    enabled: true,
    category: 'performance'
  },
  { 
    id: 'conciseness',
    name: 'Conciseness', 
    description: 'Evaluates brevity while maintaining completeness',
    threshold: 80, 
    enabled: false,
    category: 'quality'
  },
  { 
    id: 'tone',
    name: 'Tone Appropriateness', 
    description: 'Assesses whether tone matches context and expectations',
    threshold: 85, 
    enabled: false,
    category: 'quality'
  },
  { 
    id: 'factuality',
    name: 'Factual Accuracy', 
    description: 'Verifies factual correctness and up-to-date information',
    threshold: 90, 
    enabled: false,
    category: 'quality'
  },
];

export function BenchmarkSetting({ selectedAgent, agentName, theme }: BenchmarkSettingProps) {
  const [metrics, setMetrics] = useState<EvaluationMetric[]>(defaultMetrics);
  const [newMetricName, setNewMetricName] = useState('');
  const [newMetricDescription, setNewMetricDescription] = useState('');
  const [showAddMetric, setShowAddMetric] = useState(false);

  const [alertSettings, setAlertSettings] = useState({
    emailNotifications: true,
    slackNotifications: false,
    alertThreshold: 3,
    recipients: 'admin@company.com',
  });

  const handleMetricChange = (id: string, field: keyof EvaluationMetric, value: any) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleAddCustomMetric = () => {
    if (newMetricName.trim()) {
      const newMetric: EvaluationMetric = {
        id: `custom_${Date.now()}`,
        name: newMetricName.trim(),
        description: newMetricDescription.trim() || 'Custom evaluation metric',
        threshold: 80,
        enabled: true,
        category: 'custom',
      };
      setMetrics([...metrics, newMetric]);
      setNewMetricName('');
      setNewMetricDescription('');
      setShowAddMetric(false);
    }
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
  };

  const handleSave = () => {
    console.log('Saving evaluation metrics for agent:', selectedAgent, metrics);
    alert(`Evaluation metrics configuration saved successfully for ${agentName}!`);
  };

  const enabledMetrics = metrics.filter(m => m.enabled);
  const qualityMetrics = metrics.filter(m => m.category === 'quality');
  const performanceMetrics = metrics.filter(m => m.category === 'performance');
  const safetyMetrics = metrics.filter(m => m.category === 'safety');
  const customMetrics = metrics.filter(m => m.category === 'custom');

  if (!selectedAgent) {
    return (
      <div className={`min-h-screen p-6 ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="max-w-5xl mx-auto">
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

  return (
    <div className={`p-6 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Evaluation Metrics Configuration - {agentName}
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Select and configure which metrics to evaluate for this agent
              </p>
            </div>
            <div className="text-right">
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Enabled Metrics
              </div>
              <div className={`text-xl font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {enabledMetrics.length}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className={`rounded-lg p-5 mb-6 border ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-800'
            : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className={`w-5 h-5 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`} />
            <span className={`font-semibold ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              Active Configuration
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className={`mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Quality Metrics
              </div>
              <div className={`font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {qualityMetrics.filter(m => m.enabled).length} / {qualityMetrics.length}
              </div>
            </div>
            <div>
              <div className={`mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Performance Metrics
              </div>
              <div className={`font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {performanceMetrics.filter(m => m.enabled).length} / {performanceMetrics.length}
              </div>
            </div>
            <div>
              <div className={`mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Safety Metrics
              </div>
              <div className={`font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {safetyMetrics.filter(m => m.enabled).length} / {safetyMetrics.length}
              </div>
            </div>
            <div>
              <div className={`mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Custom Metrics
              </div>
              <div className={`font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {customMetrics.filter(m => m.enabled).length} / {customMetrics.length}
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className={`rounded-lg p-6 mb-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className={`w-6 h-6 ${
                theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'
              }`} />
              <h4 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Evaluation Metrics
              </h4>
            </div>
            <button
              onClick={() => setShowAddMetric(!showAddMetric)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Custom Metric
            </button>
          </div>

          {/* Add Custom Metric Form */}
          {showAddMetric && (
            <div className={`mb-6 p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-black border-gray-800'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <h5 className={`font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                Add Custom Metric
              </h5>
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Metric Name
                  </label>
                  <input
                    type="text"
                    value={newMetricName}
                    onChange={(e) => setNewMetricName(e.target.value)}
                    placeholder="e.g., Empathy Score"
                    className={`w-full px-3 py-2 rounded border focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-600 focus:border-cyan-600'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={newMetricDescription}
                    onChange={(e) => setNewMetricDescription(e.target.value)}
                    placeholder="Describe what this metric evaluates"
                    rows={2}
                    className={`w-full px-3 py-2 rounded border focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-600 focus:border-cyan-600'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
                    }`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCustomMetric}
                    className={`px-4 py-2 rounded transition-colors ${
                      theme === 'dark'
                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }`}
                  >
                    Add Metric
                  </button>
                  <button
                    onClick={() => {
                      setShowAddMetric(false);
                      setNewMetricName('');
                      setNewMetricDescription('');
                    }}
                    className={`px-4 py-2 rounded transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Metrics List */}
          <div className="space-y-3">
            {/* Quality Metrics */}
            {qualityMetrics.length > 0 && (
              <div>
                <div className={`text-sm font-semibold mb-2 uppercase tracking-wide ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Quality Metrics
                </div>
                <div className="space-y-2">
                  {qualityMetrics.map((metric) => (
                    <MetricItem
                      key={metric.id}
                      metric={metric}
                      onChange={handleMetricChange}
                      onDelete={metric.category === 'custom' ? handleDeleteMetric : undefined}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            {performanceMetrics.length > 0 && (
              <div className="mt-6">
                <div className={`text-sm font-semibold mb-2 uppercase tracking-wide ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Performance Metrics
                </div>
                <div className="space-y-2">
                  {performanceMetrics.map((metric) => (
                    <MetricItem
                      key={metric.id}
                      metric={metric}
                      onChange={handleMetricChange}
                      onDelete={metric.category === 'custom' ? handleDeleteMetric : undefined}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Safety Metrics */}
            {safetyMetrics.length > 0 && (
              <div className="mt-6">
                <div className={`text-sm font-semibold mb-2 uppercase tracking-wide ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Safety Metrics
                </div>
                <div className="space-y-2">
                  {safetyMetrics.map((metric) => (
                    <MetricItem
                      key={metric.id}
                      metric={metric}
                      onChange={handleMetricChange}
                      onDelete={metric.category === 'custom' ? handleDeleteMetric : undefined}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Custom Metrics */}
            {customMetrics.length > 0 && (
              <div className="mt-6">
                <div className={`text-sm font-semibold mb-2 uppercase tracking-wide ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Custom Metrics
                </div>
                <div className="space-y-2">
                  {customMetrics.map((metric) => (
                    <MetricItem
                      key={metric.id}
                      metric={metric}
                      onChange={handleMetricChange}
                      onDelete={handleDeleteMetric}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alert Configuration */}
        <div className={`rounded-lg p-6 mb-6 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-xl font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Alert Configuration
          </h4>

          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-black border-gray-800'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div>
                <div className={`font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Email Notifications
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Receive alerts via email when metrics fall below thresholds
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSettings.emailNotifications}
                  onChange={(e) =>
                    setAlertSettings({
                      ...alertSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${
                  theme === 'dark'
                    ? 'bg-gray-700 peer-checked:bg-cyan-600'
                    : 'bg-gray-300 peer-checked:bg-cyan-500'
                }`}></div>
              </label>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-black border-gray-800'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div>
                <div className={`font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Slack Notifications
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Send alerts to Slack channel for real-time monitoring
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertSettings.slackNotifications}
                  onChange={(e) =>
                    setAlertSettings({
                      ...alertSettings,
                      slackNotifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${
                  theme === 'dark'
                    ? 'bg-gray-700 peer-checked:bg-cyan-600'
                    : 'bg-gray-300 peer-checked:bg-cyan-500'
                }`}></div>
              </label>
            </div>

            <div className={`p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-black border-gray-800'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <label className="block mb-3">
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Alert Threshold
                </span>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Number of consecutive failures before triggering an alert
                </p>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={alertSettings.alertThreshold}
                onChange={(e) =>
                  setAlertSettings({
                    ...alertSettings,
                    alertThreshold: parseInt(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 text-gray-100 focus:border-cyan-600'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                }`}
              />
            </div>

            <div className={`p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-black border-gray-800'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <label className="block mb-3">
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Email Recipients
                </span>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Comma-separated list of email addresses
                </p>
              </label>
              <input
                type="text"
                value={alertSettings.recipients}
                onChange={(e) =>
                  setAlertSettings({ ...alertSettings, recipients: e.target.value })
                }
                placeholder="admin@company.com, ops@company.com"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-600 focus:border-cyan-600'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
          >
            <Save className="w-5 h-5" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

// Separate component for metric items
function MetricItem({ 
  metric, 
  onChange, 
  onDelete,
  theme
}: { 
  metric: EvaluationMetric; 
  onChange: (id: string, field: keyof EvaluationMetric, value: any) => void;
  onDelete?: (id: string) => void;
  theme: 'dark' | 'light';
}) {
  return (
    <div className={`rounded-lg p-4 border transition-colors ${
      theme === 'dark'
        ? 'bg-black border-gray-800 hover:border-gray-700'
        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex items-center pt-1">
          <input
            type="checkbox"
            checked={metric.enabled}
            onChange={(e) => onChange(metric.id, 'enabled', e.target.checked)}
            className={`w-5 h-5 rounded focus:ring-offset-gray-900 ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-700 text-cyan-600 focus:ring-cyan-600'
                : 'bg-white border-gray-300 text-cyan-500 focus:ring-cyan-500'
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className={`font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {metric.name}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {metric.description}
              </div>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(metric.id)}
                className={`transition-colors ml-2 ${
                  theme === 'dark'
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-500 hover:text-red-600'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-3">
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Threshold:
              </div>
              <input
                type="number"
                value={metric.threshold}
                onChange={(e) => onChange(metric.id, 'threshold', parseFloat(e.target.value))}
                disabled={!metric.enabled}
                className={`w-20 px-3 py-1 rounded border text-center text-sm font-semibold focus:outline-none disabled:opacity-50 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 text-gray-100 focus:border-cyan-600'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-cyan-500'
                }`}
              />
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {metric.id === 'response_time' ? 'ms' : '%'}
              </span>
            </div>

            <div className="flex-1 max-w-xs">
              <div className={`rounded-full h-2 overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-full rounded-full transition-all ${
                    metric.enabled 
                      ? theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-600'
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
                  }`}
                  style={{
                    width: metric.id === 'response_time'
                      ? '50%'
                      : `${Math.min(metric.threshold, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
