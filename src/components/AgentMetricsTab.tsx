import { useState } from 'react';
import { Save, Settings, Sliders, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AgentMetricsTabProps {
  agentId: string;
  agentName: string;
  theme: 'dark' | 'light';
}

interface EvaluationMetric {
  id: string;
  name: string;
  description: string;
  threshold: number;
  enabled: boolean;
  category: 'quality' | 'performance' | 'safety';
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
];

export function AgentMetricsTab({ agentId, agentName, theme }: AgentMetricsTabProps) {
  const [metrics, setMetrics] = useState<EvaluationMetric[]>(defaultMetrics);
  const [hasChanges, setHasChanges] = useState(false);

  const handleMetricToggle = (id: string) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    setHasChanges(true);
  };

  const handleThresholdChange = (id: string, value: number) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, threshold: value } : m));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving metrics for agent:', agentId, metrics);
    alert(`Evaluation metrics saved successfully for ${agentName}!`);
    setHasChanges(false);
  };

  const enabledMetrics = metrics.filter(m => m.enabled);
  const qualityMetrics = metrics.filter(m => m.category === 'quality');
  const performanceMetrics = metrics.filter(m => m.category === 'performance');
  const safetyMetrics = metrics.filter(m => m.category === 'safety');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Sliders className="w-6 h-6" />
              Evaluation Metrics
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Configure which metrics to evaluate and set threshold values for {agentName}
            </p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Total Enabled
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`}>
              {enabledMetrics.length}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Quality Metrics
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {qualityMetrics.filter(m => m.enabled).length}/{qualityMetrics.length}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Performance
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {performanceMetrics.filter(m => m.enabled).length}/{performanceMetrics.length}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Safety
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>
              {safetyMetrics.filter(m => m.enabled).length}/{safetyMetrics.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      {qualityMetrics.length > 0 && (
        <div className={`rounded-lg p-5 mb-4 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Quality Metrics
          </h4>
          <div className="space-y-3">
            {qualityMetrics.map((metric) => (
              <MetricRow
                key={metric.id}
                metric={metric}
                onToggle={handleMetricToggle}
                onThresholdChange={handleThresholdChange}
                theme={theme}
              />
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {performanceMetrics.length > 0 && (
        <div className={`rounded-lg p-5 mb-4 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Performance Metrics
          </h4>
          <div className="space-y-3">
            {performanceMetrics.map((metric) => (
              <MetricRow
                key={metric.id}
                metric={metric}
                onToggle={handleMetricToggle}
                onThresholdChange={handleThresholdChange}
                theme={theme}
              />
            ))}
          </div>
        </div>
      )}

      {/* Safety Metrics */}
      {safetyMetrics.length > 0 && (
        <div className={`rounded-lg p-5 mb-4 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Safety Metrics
          </h4>
          <div className="space-y-3">
            {safetyMetrics.map((metric) => (
              <MetricRow
                key={metric.id}
                metric={metric}
                onToggle={handleMetricToggle}
                onThresholdChange={handleThresholdChange}
                theme={theme}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className={`rounded-lg p-4 border-l-4 ${
        theme === 'dark'
          ? 'bg-blue-900/20 border-blue-600'
          : 'bg-blue-50 border-blue-400'
      }`}>
        <div className="flex items-start gap-3">
          <Settings className={`w-5 h-5 mt-0.5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <div>
            <div className={`font-medium mb-1 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
            }`}>
              Threshold Configuration
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`}>
              Thresholds determine the minimum acceptable values for each metric. When evaluation results fall below these thresholds, alerts will be triggered in live monitoring.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ 
  metric, 
  onToggle, 
  onThresholdChange,
  theme 
}: { 
  metric: EvaluationMetric; 
  onToggle: (id: string) => void;
  onThresholdChange: (id: string, value: number) => void;
  theme: 'dark' | 'light';
}) {
  const isPerformance = metric.id === 'response_time';
  const unit = isPerformance ? 'ms' : '%';
  const maxValue = isPerformance ? 5000 : 100;
  const step = isPerformance ? 100 : 1;

  return (
    <div className={`rounded-lg p-4 border ${
      metric.enabled
        ? theme === 'dark'
          ? 'bg-black border-gray-800'
          : 'bg-gray-50 border-gray-200'
        : theme === 'dark'
        ? 'bg-gray-950 border-gray-900 opacity-60'
        : 'bg-gray-100 border-gray-300 opacity-60'
    }`}>
      <div className="flex items-start gap-4">
        {/* Toggle */}
        <label className="relative inline-flex items-center cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={metric.enabled}
            onChange={() => onToggle(metric.id)}
            className="sr-only peer"
          />
          <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${
            theme === 'dark'
              ? 'bg-gray-700 peer-checked:bg-cyan-600'
              : 'bg-gray-300 peer-checked:bg-cyan-500'
          }`}></div>
        </label>

        {/* Metric Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className={`font-medium flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {metric.name}
                {metric.enabled && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {metric.description}
              </div>
            </div>
          </div>

          {/* Threshold Control */}
          {metric.enabled && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Threshold
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={metric.threshold}
                    onChange={(e) => onThresholdChange(metric.id, parseFloat(e.target.value))}
                    min={isPerformance ? 100 : 0}
                    max={maxValue}
                    step={step}
                    className={`w-24 px-3 py-1.5 rounded border text-center font-semibold focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-gray-900 border-gray-800 text-gray-100 focus:ring-cyan-600 focus:border-cyan-600'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                    }`}
                  />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {unit}
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className={`h-2 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-full rounded-full transition-all ${
                    metric.threshold >= (isPerformance ? 3000 : 85)
                      ? 'bg-green-500'
                      : metric.threshold >= (isPerformance ? 2000 : 70)
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${(metric.threshold / maxValue) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
