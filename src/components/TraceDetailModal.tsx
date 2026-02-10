import { X, Code, Database, FileText, Layers, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

interface TraceDetailModalProps {
  trace: Transaction;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export function TraceDetailModal({ trace, onClose, theme = 'dark' }: TraceDetailModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div 
        className={`w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          theme === 'dark' 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div>
            <h2 className="text-2xl font-bold mb-1">Full Trace Details</h2>
            <p className={`text-sm font-mono ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {trace.taskId}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Transaction Summary */}
          <div className={`rounded-lg p-5 mb-6 border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>Status</div>
                <div className="flex items-center gap-2">
                  <StatusIcon status={trace.status} />
                  <span className="capitalize font-semibold">{trace.status}</span>
                </div>
              </div>
              <div>
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>Overall Score</div>
                <div className={`text-xl font-bold ${getScoreColor(trace.overallScore)}`}>
                  {trace.overallScore.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>Total Latency</div>
                <div className="text-xl font-bold">{trace.totalLatency}ms</div>
              </div>
              <div>
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>Agents Involved</div>
                <div className="text-xl font-bold">{trace.agentChain.length}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className={`text-sm mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>User Query</div>
              <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                {trace.userQuery}
              </div>
            </div>
            <div className="mt-2">
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {new Date(trace.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Agent Chain Details */}
          <div className="space-y-6">
            {trace.agentChain.map((agent, index) => (
              <div key={agent.agentId} className={`rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                {/* Agent Header */}
                <div className={`p-5 border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded text-sm font-mono ${
                        theme === 'dark' 
                          ? 'bg-gray-900 text-gray-300' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        Step {index + 1}
                      </div>
                      <div>
                        <div className="text-lg font-bold">{agent.agentName}</div>
                        <div className={`text-sm font-mono ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {agent.agentId}
                        </div>
                      </div>
                      <StatusIcon status={agent.status} />
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(agent.score)}`}>
                        {agent.score}%
                      </div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {agent.latency}ms
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(agent.metrics).map(([metric, value]) => (
                      <div key={metric} className={`rounded p-3 ${
                        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                      }`}>
                        <div className={`text-xs uppercase mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {metric}
                        </div>
                        <div className={`text-lg font-semibold ${getScoreColor(value)}`}>
                          {value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-5 border-b border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-cyan-500" />
                    <h4 className="font-semibold">Input</h4>
                  </div>
                  <pre className={`p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap ${
                    theme === 'dark' 
                      ? 'bg-gray-900 text-gray-300' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {agent.input || 'No input data'}
                  </pre>
                </div>

                {/* Output */}
                <div className={`p-5 ${agent.mcpTools && agent.mcpTools.length > 0 ? 'border-b border-gray-700' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold">Output</h4>
                  </div>
                  <pre className={`p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap ${
                    theme === 'dark' 
                      ? 'bg-gray-900 text-gray-300' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {agent.output || 'No output data'}
                  </pre>
                </div>

                {/* MCP Tools */}
                {agent.mcpTools && agent.mcpTools.length > 0 && (
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Database className="w-5 h-5 text-purple-500" />
                      <h4 className="font-semibold">MCP Tools Called</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        theme === 'dark' 
                          ? 'bg-gray-900 text-gray-400' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {agent.mcpTools.length} tool{agent.mcpTools.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {agent.mcpTools.map((tool, toolIndex) => (
                        <div key={toolIndex} className={`rounded-lg p-4 border ${
                          tool.status === 'success'
                            ? theme === 'dark'
                              ? 'bg-green-900/10 border-green-800/50'
                              : 'bg-green-50 border-green-200'
                            : theme === 'dark'
                            ? 'bg-red-900/10 border-red-800/50'
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-mono font-bold mb-1">{tool.toolName}</div>
                              <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <span className="font-semibold">{tool.serverName}</span> • {tool.serverId}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                  tool.status === 'success'
                                    ? 'bg-green-900/50 text-green-400'
                                    : 'bg-red-900/50 text-red-400'
                                }`}>
                                  {tool.status}
                                </div>
                                <div className={`text-xs mt-1 ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                }`}>
                                  {tool.latency}ms
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className={`text-xs font-semibold mb-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Input
                              </div>
                              <pre className={`p-3 rounded text-xs overflow-x-auto ${
                                theme === 'dark' 
                                  ? 'bg-gray-900 text-gray-300' 
                                  : 'bg-gray-200 text-gray-800'
                              }`}>
                                {JSON.stringify(tool.input, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <div className={`text-xs font-semibold mb-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Output
                              </div>
                              <pre className={`p-3 rounded text-xs overflow-x-auto ${
                                theme === 'dark' 
                                  ? 'bg-gray-900 text-gray-300' 
                                  : 'bg-gray-200 text-gray-800'
                              }`}>
                                {JSON.stringify(tool.output, null, 2)}
                              </pre>
                            </div>
                          </div>

                          <div className={`mt-3 pt-3 border-t text-xs ${
                            theme === 'dark' 
                              ? 'border-gray-700 text-gray-500' 
                              : 'border-gray-300 text-gray-600'
                          }`}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {tool.timestamp}
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
      </div>
    </div>
  );
}
