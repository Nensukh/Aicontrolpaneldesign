// Span Details Component
import { Copy, Zap, Database, Network, GitBranch } from 'lucide-react';
import { ProcessedSpan } from './SpanTreeNode';

type SpanStatus = 'STATUS_CODE_OK' | 'STATUS_CODE_ERROR' | 'STATUS_CODE_UNSET';
type TabType = 'info' | 'attributes';

// Span icon component
function SpanIcon({ kind, status }: { kind: string; status: SpanStatus }) {
  const getColor = () => {
    if (status !== 'STATUS_CODE_OK') return 'text-red-400';
    if (kind.includes('llm') || kind === 'SPAN_KIND_CLIENT') return 'text-yellow-400';
    if (kind.includes('tool')) return 'text-purple-400';
    if (kind.includes('agent') || kind.includes('Agent')) return 'text-cyan-400';
    return 'text-blue-400';
  };

  const Icon = kind.includes('llm') || kind === 'SPAN_KIND_CLIENT' ? Zap :
               kind.includes('tool') ? Database :
               kind.includes('Agent') ? Network :
               GitBranch;

  return <Icon className={`w-4 h-4 ${getColor()}`} />;
}

interface SpanDetailsProps {
  span: ProcessedSpan;
  theme: 'dark' | 'light';
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  processedSpans: ProcessedSpan[];
}

export function SpanDetails({
  span,
  theme,
  activeTab,
  setActiveTab,
  processedSpans,
}: SpanDetailsProps) {
  const formatDuration = (ms: number) => {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(2)}s`;
    }
    return `${ms.toFixed(0)}ms`;
  };

  const formatTimestamp = (timestampMs: number) => {
    const date = new Date(timestampMs);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* Span Header */}
      <div className={`px-4 py-3 ${
        theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <SpanIcon kind={span.name} status={span.status} />
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
            }`}>
              {span.name}
            </h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              span.status === 'STATUS_CODE_OK'
                ? 'bg-green-900 text-green-300'
                : 'bg-red-900 text-red-300'
            }`}>
              {span.status === 'STATUS_CODE_OK' ? 'OK' : 'ERROR'}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(span.spanId)}
            className={`p-2 rounded transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title="Copy Span ID"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-3">
          <div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Start Time
            </div>
            <div className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatTimestamp(span.startTime)}
            </div>
          </div>
          <div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              End Time
            </div>
            <div className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatTimestamp(span.endTime)}
            </div>
          </div>
          <div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Duration
            </div>
            <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {formatDuration(span.duration)}
            </div>
          </div>
          {span.attributes['llm.usage.total_tokens'] && (
            <div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                Tokens
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {span.attributes['llm.usage.total_tokens']}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`${theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
        <div className="flex gap-6 px-4">
          {(['info', 'attributes'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 border-b-2 transition-colors capitalize text-sm ${
                activeTab === tab
                  ? 'border-cyan-500 text-cyan-400'
                  : theme === 'dark'
                  ? 'border-transparent text-gray-500 hover:text-gray-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'info' ? 'Details' : 
               'Attributes'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 440px)' }}>
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-3">
            {/* LLM Messages */}
            {span.attributes['llm.input.messages'] && (
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className={`font-semibold mb-2 text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  LLM Input
                </div>
                <pre className={`text-xs whitespace-pre-wrap overflow-x-auto ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {span.attributes['llm.input.messages']}
                </pre>
              </div>
            )}

            {span.attributes['llm.output.content'] && (
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className={`font-semibold mb-2 text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  LLM Output
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {span.attributes['llm.output.content']}
                </div>
              </div>
            )}

            {/* Tool Output */}
            {span.attributes['tool.output'] && (
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className={`font-semibold mb-2 text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Tool Output
                </div>
                <pre className={`text-xs whitespace-pre-wrap overflow-x-auto ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {span.attributes['tool.output']}
                </pre>
              </div>
            )}

            {/* Key Attributes Summary */}
            <div className="grid grid-cols-2 gap-3">
              {span.attributes['llm.model'] && (
                <div className={`p-2 rounded ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className={`text-xs mb-0.5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    LLM Model
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {span.attributes['llm.model']}
                  </div>
                </div>
              )}
              
              {span.attributes['tool.name'] && (
                <div className={`p-2 rounded ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className={`text-xs mb-0.5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    Tool Name
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {span.attributes['tool.name']}
                  </div>
                </div>
              )}
              
              {span.attributes['llm.usage.prompt_tokens'] && (
                <div className={`p-2 rounded ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className={`text-xs mb-0.5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    Prompt Tokens
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {span.attributes['llm.usage.prompt_tokens']}
                  </div>
                </div>
              )}
              
              {span.attributes['llm.usage.completion_tokens'] && (
                <div className={`p-2 rounded ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className={`text-xs mb-0.5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    Completion Tokens
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {span.attributes['llm.usage.completion_tokens']}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attributes Tab */}
        {activeTab === 'attributes' && (
          <div className="space-y-2">
            {Object.entries(span.attributes).map(([key, value]) => (
              <div key={key} className={`flex items-start gap-4 p-2 rounded ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className={`text-xs font-mono flex-shrink-0 min-w-[200px] ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                  {key}
                </div>
                <div className={`text-xs flex-1 break-all ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}