// Business View Component - Shows workflow in business-friendly language
import { ProcessedSpan } from './GraphView';
import { AgentExecutionSteps, AgentExecutionStep } from './AgentExecutionSteps';
import { Users, CheckCircle, Clock, DollarSign, MessageSquare } from 'lucide-react';

interface BusinessViewProps {
  spans: ProcessedSpan[];
  theme: 'dark' | 'light';
}

export function BusinessView({ spans, theme }: BusinessViewProps) {
  // Flatten all spans
  const allSpans: ProcessedSpan[] = [];
  const flattenSpans = (span: ProcessedSpan) => {
    allSpans.push(span);
    span.children.forEach(flattenSpans);
  };
  spans.forEach(flattenSpans);

  // Extract business-level information
  const rootSpan = spans[0];
  const userRequest = rootSpan?.attributes['user.request'] || 'N/A';
  const sessionId = rootSpan?.attributes['session.id'] || 'N/A';
  const userId = rootSpan?.attributes['user.id'] || 'N/A';
  
  // Calculate total duration
  const totalDuration = rootSpan?.duration || 0;
  
  // Count agents involved
  const agentSpans = allSpans.filter(s => s.attributes['agent.name']);
  const uniqueAgents = new Set(agentSpans.map(s => s.attributes['agent.name']));
  
  // Count LLM calls and total tokens
  const llmSpans = allSpans.filter(s => s.attributes['llm.model']);
  const totalTokens = llmSpans.reduce((sum, s) => sum + (s.attributes['llm.usage.total_tokens'] || 0), 0);
  
  // Count tools used
  const toolSpans = allSpans.filter(s => s.attributes['tool.name']);
  
  // Convert spans to execution steps format
  const executionSteps: AgentExecutionStep[] = allSpans
    .filter(span => {
      // Include agent spans, tool calls, and routing decisions (exclude LLM calls)
      return span.attributes['agent.name'] || 
             span.name.includes('tool') || 
             span.name.includes('route');
    })
    .map((span, index) => {
      const isAgent = span.attributes['agent.name'];
      const isTool = span.name.includes('tool');
      const isRouting = span.name.includes('route');
      
      // Determine action
      let action = 'Execute';
      if (isAgent) action = span.attributes['agent.role'] || 'Process';
      else if (isTool) action = 'Tool Execution';
      else if (isRouting) action = 'Route Decision';
      
      // Extract input
      let input = '';
      if (isAgent) {
        const inputKeys = Object.keys(span.attributes).filter(k => k.startsWith('input.'));
        if (inputKeys.length > 0) {
          input = inputKeys.map(k => `${k.replace('input.', '')}: ${span.attributes[k]}`).join('\n');
        } else {
          input = span.attributes['user.request'] || 'Processing request...';
        }
      } else if (isTool) {
        const toolInput = span.attributes['tool.input.order_id'] || 
                         span.attributes['tool.input.transaction_id'] ||
                         span.attributes['tool.input'];
        input = toolInput ? `Query: ${toolInput}` : 'Execute tool operation';
      } else if (isRouting) {
        input = span.attributes['extracted.order_id'] ? 
                `Analyze request for order: ${span.attributes['extracted.order_id']}` :
                'Analyze user request';
      }
      
      // Extract output
      let output = '';
      if (isAgent) {
        const outputKeys = Object.keys(span.attributes).filter(k => k.startsWith('output.'));
        if (outputKeys.length > 0) {
          output = outputKeys.map(k => `${k.replace('output.', '')}: ${span.attributes[k]}`).join('\n');
        } else {
          output = 'Agent processing completed successfully';
        }
      } else if (isTool) {
        const toolOutput = span.attributes['tool.output'];
        if (toolOutput) {
          output = typeof toolOutput === 'object' ? JSON.stringify(toolOutput, null, 2) : String(toolOutput);
        } else {
          // Build output from tool.output.* attributes
          const outputKeys = Object.keys(span.attributes).filter(k => k.startsWith('tool.output.'));
          if (outputKeys.length > 0) {
            output = outputKeys.map(k => `${k.replace('tool.output.', '')}: ${span.attributes[k]}`).join('\n');
          } else {
            output = 'Tool execution completed';
          }
        }
      } else if (isRouting) {
        const decision = span.attributes['routing.decision'];
        const reason = span.attributes['routing.reason'];
        output = decision ? 
                `Decision: ${decision.replace('invoke_', '').replace('_agent', '')}\nReason: ${reason || 'Routing logic'}` :
                'Routing decision made';
      }
      
      // Calculate confidence (placeholder - would come from actual span data)
      const confidence = span.status === 'STATUS_CODE_OK' ? 95 : 50;
      
      // Get metadata
      const metadata: Record<string, any> = {};
      if (span.attributes['tool.name']) {
        metadata['Tool'] = span.attributes['tool.name'];
      }
      if (span.attributes['agent.type']) {
        metadata['Agent Type'] = span.attributes['agent.type'];
      }
      
      return {
        id: span.spanId,
        agentName: span.attributes['agent.name'] || 
                  span.attributes['tool.name'] || 
                  span.name.split('.').pop() || 'System',
        action,
        input,
        output,
        confidence,
        timestamp: new Date(span.startTime).toLocaleString(),
        status: span.status === 'STATUS_CODE_OK' ? 'completed' : 'failed',
        duration: span.duration,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      } as AgentExecutionStep;
    });

  // Extract business outcomes
  const outcomes: { label: string; value: string; icon: any; color: string }[] = [];
  
  // Check for policy decisions
  const policySpan = allSpans.find(s => s.attributes['output.policy_status']);
  if (policySpan) {
    outcomes.push({
      label: 'Policy Check',
      value: policySpan.attributes['output.policy_status'].replace(/_/g, ' '),
      icon: CheckCircle,
      color: 'text-green-400'
    });
  }
  
  // Check for refund info
  const refundSpan = allSpans.find(s => s.attributes['output.refund_percentage']);
  if (refundSpan) {
    outcomes.push({
      label: 'Refund Approved',
      value: `${refundSpan.attributes['output.refund_percentage']}%`,
      icon: DollarSign,
      color: 'text-yellow-400'
    });
  }
  
  // Check for order status
  const orderStatusSpan = allSpans.find(s => s.attributes['tool.output.order_status']);
  if (orderStatusSpan) {
    outcomes.push({
      label: 'Order Status',
      value: orderStatusSpan.attributes['tool.output.order_status'],
      icon: CheckCircle,
      color: 'text-blue-400'
    });
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Business Summary */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Workflow Summary
        </h3>
        
        <div className="space-y-4">
          {/* User Request */}
          <div>
            <div className={`text-sm font-semibold mb-1 flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <MessageSquare className="w-4 h-4" />
              Customer Request
            </div>
            <div className={`text-base ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {userRequest}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t" style={{
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
          }}>
            <div>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Total Duration
              </div>
              <div className={`text-lg font-bold flex items-center gap-1 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                <Clock className="w-4 h-4" />
                {formatDuration(totalDuration)}
              </div>
            </div>
            
            <div>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Agents Involved
              </div>
              <div className={`text-lg font-bold flex items-center gap-1 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                <Users className="w-4 h-4" />
                {uniqueAgents.size}
              </div>
            </div>
            
            <div>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                LLM Calls
              </div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                {llmSpans.length}
              </div>
            </div>
            
            <div>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Total Tokens
              </div>
              <div className={`text-lg font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {totalTokens.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Outcomes */}
      {outcomes.length > 0 && (
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Business Outcomes
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            {outcomes.map((outcome, idx) => {
              const Icon = outcome.icon;
              return (
                <div key={idx} className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 ${outcome.color}`} />
                    <span className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {outcome.label}
                    </span>
                  </div>
                  <div className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {outcome.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Execution Steps */}
      <AgentExecutionSteps 
        steps={executionSteps} 
        theme={theme}
        collapsible={true}
        defaultExpanded={false}
      />

      {/* Session Details */}
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
              Session ID:
            </span>
            <span className={`ml-2 font-mono ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {sessionId}
            </span>
          </div>
          <div>
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
              User ID:
            </span>
            <span className={`ml-2 font-mono ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {userId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}