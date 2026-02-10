// Graph View Component - Visual flow diagram using React Flow
import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Network, Zap, Database, CheckCircle, XCircle, Clock, ArrowRight, AlertCircle } from 'lucide-react';

export interface ProcessedSpan {
  spanId: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  kind: string;
  status: 'STATUS_CODE_OK' | 'STATUS_CODE_ERROR' | 'STATUS_CODE_UNSET';
  startTime: number;
  endTime: number;
  duration: number;
  attributes: Record<string, any>;
  children: ProcessedSpan[];
}

// Custom node component
function CustomNode({ data }: { data: any }) {
  const { span, theme, isRoot } = data;
  const isAgent = span.attributes['agent.name'];
  const isLLM = span.name.includes('llm');
  const isTool = span.name.includes('tool');
  const isRouting = span.name.includes('route');
  
  const Icon = isAgent ? Network : isLLM ? Zap : isTool ? Database : AlertCircle;
  
  const getNodeColor = () => {
    if (isRoot) return theme === 'dark' ? '#0891b2' : '#06b6d4';
    if (isAgent) return theme === 'dark' ? '#0891b2' : '#06b6d4';
    if (isLLM) return theme === 'dark' ? '#9333ea' : '#a855f7';
    if (isTool) return theme === 'dark' ? '#059669' : '#10b981';
    if (isRouting) return theme === 'dark' ? '#f59e0b' : '#fbbf24';
    return theme === 'dark' ? '#6b7280' : '#9ca3af';
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getNodeType = () => {
    if (isAgent) return 'Agent';
    if (isLLM) return 'LLM Call';
    if (isTool) return 'Tool';
    if (isRouting) return 'Routing';
    return 'Operation';
  };

  // Extract key input/output data
  const getKeyData = () => {
    const data: { label: string; value: string }[] = [];
    
    // For routing decisions
    if (span.attributes['routing.decision']) {
      data.push({ 
        label: 'Decision', 
        value: span.attributes['routing.decision'].replace('invoke_', '').replace('_agent', '')
      });
    }
    
    // For extracted data
    if (span.attributes['extracted.order_id']) {
      data.push({ label: 'Order', value: span.attributes['extracted.order_id'] });
    }
    
    // For policy output
    if (span.attributes['output.policy_status']) {
      data.push({ label: 'Status', value: span.attributes['output.policy_status'].replace(/_/g, ' ') });
    }
    
    if (span.attributes['output.refund_percentage']) {
      data.push({ label: 'Refund', value: `${span.attributes['output.refund_percentage']}%` });
    }
    
    // For tool data
    if (span.attributes['tool.output.order_status']) {
      data.push({ label: 'Order Status', value: span.attributes['tool.output.order_status'] });
    }
    
    if (span.attributes['tool.output.order_total']) {
      data.push({ label: 'Total', value: `$${span.attributes['tool.output.order_total']}` });
    }
    
    // For LLM
    if (span.attributes['llm.model']) {
      data.push({ label: 'Model', value: span.attributes['llm.model'].replace('gpt-', 'GPT-') });
    }
    
    return data;
  };

  const keyData = getKeyData();
  const displayName = span.attributes['agent.name'] || 
                      span.attributes['tool.name'] || 
                      span.name.split('.').pop();

  return (
    <div
      className={`rounded-lg shadow-lg min-w-[220px] max-w-[280px] ${
        span.status === 'STATUS_CODE_OK'
          ? 'border-2'
          : 'border-2 border-red-500'
      }`}
      style={{
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        borderColor: span.status === 'STATUS_CODE_OK' ? getNodeColor() : '#ef4444',
      }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" style={{ background: getNodeColor() }} />
      
      {/* Header */}
      <div
        className="px-3 py-2 rounded-t-lg"
        style={{ backgroundColor: getNodeColor() }}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white/80 uppercase tracking-wide">
              {getNodeType()}
            </div>
            <div className="text-sm font-semibold text-white truncate">
              {displayName}
            </div>
          </div>
          {span.status === 'STATUS_CODE_OK' ? (
            <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-white flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Body */}
      <div className={`px-3 py-2 space-y-1.5 ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {/* Role/Type Badge */}
        {span.attributes['agent.role'] && (
          <div className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
            theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            {span.attributes['agent.role'].replace(/_/g, ' ')}
          </div>
        )}
        
        {/* Duration */}
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className={`w-3 h-3 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`} />
          <span>{formatDuration(span.duration)}</span>
        </div>
        
        {/* Token usage for LLM */}
        {span.attributes['llm.usage.total_tokens'] && (
          <div className={`text-xs ${
            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
          }`}>
            {span.attributes['llm.usage.total_tokens']} tokens
          </div>
        )}
        
        {/* Key Data */}
        {keyData.length > 0 && (
          <div className={`pt-1.5 border-t text-xs space-y-0.5 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {keyData.map((item, idx) => (
              <div key={idx} className="flex justify-between gap-2">
                <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                  {item.label}:
                </span>
                <span className={`font-medium truncate ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" style={{ background: getNodeColor() }} />
    </div>
  );
}

const nodeTypes = {
  customNode: CustomNode,
};

export function GraphView({ spans, theme }: { spans: ProcessedSpan[]; theme: 'dark' | 'light' }) {
  // Filter state
  const [filters, setFilters] = useState({
    agent: true,
    llm: true,
    tool: true,
    routing: true,
  });

  const toggleFilter = (type: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Flatten all spans
  const allSpans: ProcessedSpan[] = [];
  const flattenSpans = (span: ProcessedSpan) => {
    allSpans.push(span);
    span.children.forEach(flattenSpans);
  };
  spans.forEach(flattenSpans);

  // Filter spans based on selected filters
  const filteredSpans = useMemo(() => {
    return allSpans.filter(span => {
      const isAgent = span.attributes['agent.name'];
      const isLLM = span.name.includes('llm');
      const isTool = span.name.includes('tool');
      const isRouting = span.name.includes('route');

      // Always include the root span
      if (!span.parentSpanId) return true;

      if (isAgent && !filters.agent) return false;
      if (isLLM && !filters.llm) return false;
      if (isTool && !filters.tool) return false;
      if (isRouting && !filters.routing) return false;

      return true;
    });
  }, [allSpans, filters]);

  // Create nodes and edges with detailed information exchange
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    if (filteredSpans.length === 0) return { nodes, edges };

    // Build a map for quick lookup
    const spanMap = new Map<string, ProcessedSpan>();
    filteredSpans.forEach(span => spanMap.set(span.spanId, span));

    // Track positions for layout
    const nodeWidth = 250;
    const nodeHeight = 180;
    const horizontalGap = 100;
    const verticalGap = 120;
    
    // Recalculate levels only for filtered spans
    const levelMap = new Map<string, number>();
    const filteredSpanIds = new Set(filteredSpans.map(s => s.spanId));
    
    const calculateLevel = (spanId: string, parentLevel = -1): number => {
      if (levelMap.has(spanId)) return levelMap.get(spanId)!;
      
      const span = spanMap.get(spanId);
      if (!span) return 0;
      
      // Find the level based on parent that's also in filtered set
      let level = 0;
      if (span.parentSpanId && filteredSpanIds.has(span.parentSpanId)) {
        const parentLevel = calculateLevel(span.parentSpanId);
        level = parentLevel + 1;
      }
      
      levelMap.set(spanId, level);
      return level;
    };
    
    // Calculate levels for all filtered spans
    filteredSpans.forEach(span => calculateLevel(span.spanId));

    // Group spans by their level
    const spansByLevel = new Map<number, ProcessedSpan[]>();
    filteredSpans.forEach(span => {
      const level = levelMap.get(span.spanId) || 0;
      if (!spansByLevel.has(level)) {
        spansByLevel.set(level, []);
      }
      spansByLevel.get(level)!.push(span);
    });

    // Create nodes with proper positioning
    spansByLevel.forEach((levelSpans, level) => {
      levelSpans.forEach((span, index) => {
        const xPosition = (index - (levelSpans.length - 1) / 2) * (nodeWidth + horizontalGap);
        const yPosition = level * (nodeHeight + verticalGap);
        
        nodes.push({
          id: span.spanId,
          type: 'customNode',
          position: { x: xPosition, y: yPosition },
          data: { 
            span, 
            theme,
            isRoot: level === 0
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });
      });
    });

    // Create edges only between visible nodes
    filteredSpans.forEach(span => {
      if (span.parentSpanId && filteredSpanIds.has(span.parentSpanId)) {
        const parent = spanMap.get(span.parentSpanId);
        if (parent) {
          // Determine edge label based on data flow
          let edgeLabel = '';
          let edgeColor = theme === 'dark' ? '#6b7280' : '#9ca3af';
          
          // For routing decisions
          if (span.name.includes('route')) {
            edgeLabel = 'Analyze Request';
            edgeColor = theme === 'dark' ? '#f59e0b' : '#fbbf24';
          }
          
          // For agent invocations
          if (parent.attributes['routing.decision'] && span.attributes['agent.name']) {
            const orderId = parent.attributes['extracted.order_id'];
            edgeLabel = orderId ? `Order: ${orderId}` : 'Route to Agent';
            edgeColor = theme === 'dark' ? '#0891b2' : '#06b6d4';
          }
          
          // For LLM calls
          if (span.name.includes('llm')) {
            edgeLabel = 'Query LLM';
            edgeColor = theme === 'dark' ? '#9333ea' : '#a855f7';
          }
          
          // For tool calls
          if (span.name.includes('tool')) {
            const inputData = span.attributes['tool.input.order_id'] || 
                            span.attributes['tool.input.transaction_id'];
            if (inputData) {
              edgeLabel = `Fetch: ${inputData}`;
            } else {
              edgeLabel = span.attributes['tool.name'] || 'Execute Tool';
            }
            edgeColor = theme === 'dark' ? '#059669' : '#10b981';
          }
          
          // For data returns
          if (span.attributes['output.policy_status']) {
            edgeLabel = `Result: ${span.attributes['output.policy_status']}`;
            edgeColor = theme === 'dark' ? '#10b981' : '#22c55e';
          }
          
          if (span.attributes['tool.output.order_status']) {
            edgeLabel = `Status: ${span.attributes['tool.output.order_status']}`;
            edgeColor = theme === 'dark' ? '#10b981' : '#22c55e';
          }

          edges.push({
            id: `${span.parentSpanId}-${span.spanId}`,
            source: span.parentSpanId,
            target: span.spanId,
            type: 'smoothstep',
            animated: span.status === 'STATUS_CODE_OK',
            label: edgeLabel,
            labelStyle: {
              fill: theme === 'dark' ? '#e5e7eb' : '#374151',
              fontSize: 11,
              fontWeight: 500,
            },
            labelBgStyle: {
              fill: theme === 'dark' ? '#1f2937' : '#ffffff',
              fillOpacity: 0.9,
            },
            labelBgPadding: [4, 6] as [number, number],
            labelBgBorderRadius: 4,
            style: { 
              stroke: edgeColor,
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: edgeColor,
              width: 20,
              height: 20,
            },
          });
        }
      }
    });
    
    return { nodes, edges };
  }, [filteredSpans, theme]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  if (allSpans.length === 0) {
    return (
      <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
        No trace data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className={`flex items-center justify-between gap-4 p-3 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="flex items-center gap-6">
          {/* Agent Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.agent}
              onChange={() => toggleFilter('agent')}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: theme === 'dark' ? '#0891b2' : '#06b6d4' }}
            />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme === 'dark' ? '#0891b2' : '#06b6d4' }} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Agent</span>
          </label>
          
          {/* LLM Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.llm}
              onChange={() => toggleFilter('llm')}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: theme === 'dark' ? '#9333ea' : '#a855f7' }}
            />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme === 'dark' ? '#9333ea' : '#a855f7' }} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>LLM</span>
          </label>
          
          {/* Tool Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.tool}
              onChange={() => toggleFilter('tool')}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: theme === 'dark' ? '#059669' : '#10b981' }}
            />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme === 'dark' ? '#059669' : '#10b981' }} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tool</span>
          </label>
          
          {/* Routing Filter */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.routing}
              onChange={() => toggleFilter('routing')}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: theme === 'dark' ? '#f59e0b' : '#fbbf24' }}
            />
            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme === 'dark' ? '#f59e0b' : '#fbbf24' }} />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Routing</span>
          </label>
        </div>
        <div className={`ml-auto text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
          {filteredSpans.length} / {allSpans.length} nodes • Edges show data flow
        </div>
      </div>

      {/* Graph */}
      <div 
        className={`rounded-lg border ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`} 
        style={{ height: '700px' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          minZoom={0.3}
          maxZoom={1.5}
        >
          <Background 
            color={theme === 'dark' ? '#374151' : '#e5e7eb'} 
            gap={16}
            size={1}
          />
          <Controls 
            className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          />
          <MiniMap 
            nodeColor={(node) => {
              const span = node.data.span;
              if (span.attributes['agent.name']) return '#0891b2';
              if (span.name.includes('llm')) return '#9333ea';
              if (span.name.includes('tool')) return '#059669';
              if (span.name.includes('route')) return '#f59e0b';
              return '#6b7280';
            }}
            className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
            maskColor={theme === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
