// Reusable Agent Execution Steps Component
import { useState } from 'react';
import { ChevronUp, ChevronDown, Bot, CheckCircle, AlertTriangle, Loader2, Clock } from 'lucide-react';

export interface AgentExecutionStep {
  id: string;
  agentName: string;
  action: string;
  input: string;
  output: string;
  confidence?: number;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'failed';
  duration?: number;
  metadata?: Record<string, any>;
}

interface AgentExecutionStepsProps {
  steps: AgentExecutionStep[];
  theme: 'dark' | 'light';
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function AgentExecutionSteps({ 
  steps, 
  theme, 
  collapsible = true,
  defaultExpanded = true 
}: AgentExecutionStepsProps) {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
    steps.reduce((acc, step) => ({ ...acc, [step.id]: defaultExpanded }), {})
  );
  const [showAllSteps, setShowAllSteps] = useState(true);

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (steps.length === 0) {
    return (
      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
        No execution steps available
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border ${
      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
    }`}>
      {collapsible && (
        <button
          onClick={() => setShowAllSteps(!showAllSteps)}
          className={`w-full flex items-center justify-between p-3 transition-colors ${
            theme === 'dark'
              ? 'bg-gray-900 hover:bg-gray-800'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bot className={`w-5 h-5 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`} />
            <span className={`font-semibold ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Agent Execution Steps
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              theme === 'dark' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
            }`}>
              {steps.length}
            </span>
          </div>
          {showAllSteps ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}

      {showAllSteps && (
        <div className={`p-4 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className="space-y-3">
            {steps.map((step, stepIndex) => (
              <div
                key={step.id}
                className={`rounded-lg overflow-hidden border ${
                  step.status === 'completed'
                    ? theme === 'dark'
                      ? 'border-green-800 bg-green-950/20'
                      : 'border-green-200 bg-green-50'
                    : step.status === 'in-progress'
                    ? theme === 'dark'
                      ? 'border-blue-800 bg-blue-950/20'
                      : 'border-blue-200 bg-blue-50'
                    : theme === 'dark'
                    ? 'border-red-800 bg-red-950/20'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedSteps((prev) => ({
                      ...prev,
                      [step.id]: !prev[step.id],
                    }))
                  }
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-white/5'
                      : 'hover:bg-black/5'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Step Number Badge */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      step.status === 'completed'
                        ? theme === 'dark'
                          ? 'bg-green-900 text-green-300 border-2 border-green-700'
                          : 'bg-green-200 text-green-800 border-2 border-green-400'
                        : step.status === 'in-progress'
                        ? theme === 'dark'
                          ? 'bg-blue-900 text-blue-300 border-2 border-blue-700'
                          : 'bg-blue-200 text-blue-800 border-2 border-blue-400'
                        : theme === 'dark'
                        ? 'bg-red-900 text-red-300 border-2 border-red-700'
                        : 'bg-red-200 text-red-800 border-2 border-red-400'
                    }`}>
                      {stepIndex + 1}
                    </div>

                    {/* Status Icon */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                      step.status === 'completed'
                        ? theme === 'dark'
                          ? 'bg-green-900/70 text-green-400'
                          : 'bg-green-200 text-green-700'
                        : step.status === 'in-progress'
                        ? theme === 'dark'
                          ? 'bg-blue-900/70 text-blue-400'
                          : 'bg-blue-200 text-blue-700'
                        : theme === 'dark'
                        ? 'bg-red-900/70 text-red-400'
                        : 'bg-red-200 text-red-700'
                    }`}>
                      {step.status === 'in-progress' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : step.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Bot className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        }`} />
                        <span className={`font-bold text-sm ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {step.agentName}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          theme === 'dark' 
                            ? 'bg-gray-800 text-gray-300' 
                            : 'bg-white text-gray-700'
                        }`}>
                          {step.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {step.confidence !== undefined && (
                          <div className={`text-xs font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Confidence: 
                            <span className={`ml-1 px-2 py-0.5 rounded font-bold ${
                              step.confidence >= 90
                                ? theme === 'dark'
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-green-200 text-green-800'
                                : step.confidence >= 70
                                ? theme === 'dark'
                                  ? 'bg-yellow-900 text-yellow-300'
                                  : 'bg-yellow-200 text-yellow-800'
                                : theme === 'dark'
                                ? 'bg-red-900 text-red-300'
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {step.confidence}%
                            </span>
                          </div>
                        )}
                        
                        {step.duration && (
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className={`w-3 h-3 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`} />
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                              {formatDuration(step.duration)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`text-xs uppercase font-semibold tracking-wider px-2 py-1 rounded ${
                          step.status === 'completed'
                            ? theme === 'dark'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-green-200 text-green-800'
                            : step.status === 'in-progress'
                            ? theme === 'dark'
                              ? 'bg-blue-900 text-blue-300'
                              : 'bg-blue-200 text-blue-800'
                            : theme === 'dark'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {step.status.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedSteps[step.id] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {expandedSteps[step.id] && (
                  <div className={`px-4 pb-4 space-y-3 text-sm border-t pt-3 ${
                    step.status === 'completed'
                      ? theme === 'dark'
                        ? 'border-green-800 bg-green-950/10'
                        : 'border-green-200 bg-green-50/50'
                      : step.status === 'in-progress'
                      ? theme === 'dark'
                        ? 'border-blue-800 bg-blue-950/10'
                        : 'border-blue-200 bg-blue-50/50'
                      : theme === 'dark'
                      ? 'border-red-800 bg-red-950/10'
                      : 'border-red-200 bg-red-50/50'
                  }`}>
                    {/* Timestamp */}
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {step.timestamp}
                    </div>

                    {/* Input */}
                    <div>
                      <div className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Input
                      </div>
                      <div className={`p-3 rounded-lg text-xs font-mono whitespace-pre-wrap ${
                        theme === 'dark' 
                          ? 'bg-gray-900 text-gray-300' 
                          : 'bg-white text-gray-700'
                      }`}>
                        {step.input}
                      </div>
                    </div>

                    {/* Output */}
                    <div>
                      <div className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Output
                      </div>
                      <div className={`p-3 rounded-lg text-xs font-mono whitespace-pre-wrap ${
                        theme === 'dark' 
                          ? 'bg-gray-900 text-gray-300' 
                          : 'bg-white text-gray-700'
                      }`}>
                        {step.output}
                      </div>
                    </div>

                    {/* Metadata */}
                    {step.metadata && Object.keys(step.metadata).length > 0 && (
                      <div>
                        <div className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Additional Details
                        </div>
                        <div className="space-y-1">
                          {Object.entries(step.metadata).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                {key}:
                              </span>
                              <span className={`text-xs ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
