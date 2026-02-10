// Agent Flow Diagram Component
import { Network, Zap, Database, ArrowRight } from 'lucide-react';
import { ProcessedSpan } from './SpanTreeNode';

export function AgentFlowDiagram({ spans, theme }: { spans: ProcessedSpan[]; theme: 'dark' | 'light' }) {
  // Extract agent spans (ones with agent.name attribute)
  const agentSpans: ProcessedSpan[] = [];
  
  const collectAgentSpans = (span: ProcessedSpan) => {
    if (span.attributes['agent.name']) {
      agentSpans.push(span);
    }
    span.children.forEach(collectAgentSpans);
  };
  
  spans.forEach(collectAgentSpans);

  if (agentSpans.length === 0) {
    return (
      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
        No agent interactions found in this trace
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {agentSpans.map((span, idx) => (
        <div key={span.spanId}>
          <div className={`p-3 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start gap-3">
              <Network className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold text-sm ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {span.attributes['agent.name']}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {span.attributes['agent.role'] || span.attributes['agent.type']}
                  </span>
                  <span className={`ml-auto text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {(span.duration / 1000).toFixed(2)}s
                  </span>
                </div>
                
                {/* Show key attributes */}
                <div className="space-y-0.5">
                  {Object.entries(span.attributes).map(([key, value]) => {
                    if (key.startsWith('input.') || key.startsWith('output.')) {
                      return (
                        <div key={key} className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <span className="font-mono text-xs">{key.replace('input.', '→ ').replace('output.', '← ')}</span>
                          <span className="ml-2">{String(value)}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Show child operations */}
                {span.children.length > 0 && (
                  <div className={`mt-2 pt-2 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex flex-wrap gap-2">
                      {span.children.map(child => {
                        const isLLM = child.name.includes('llm');
                        const isTool = child.name.includes('tool');
                        return (
                          <div
                            key={child.spanId}
                            className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${
                              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                            }`}
                          >
                            {isLLM && <Zap className="w-3 h-3 text-yellow-400" />}
                            {isTool && <Database className="w-3 h-3 text-purple-400" />}
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                              {child.attributes['tool.name'] || child.attributes['llm.model'] || child.name.split('.').pop()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {idx < agentSpans.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowRight className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
