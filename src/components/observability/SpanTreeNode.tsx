// Span Tree Node Component
import { useState } from 'react';
import { ChevronDown, ChevronRight, Zap, Database, Network, GitBranch } from 'lucide-react';

type SpanStatus = 'STATUS_CODE_OK' | 'STATUS_CODE_ERROR' | 'STATUS_CODE_UNSET';

export interface ProcessedSpan {
  spanId: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  kind: string;
  status: SpanStatus;
  startTime: number;
  endTime: number;
  duration: number;
  attributes: Record<string, any>;
  children: ProcessedSpan[];
}

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

// Tree node component for span list
export function SpanTreeNode({ 
  span, 
  depth = 0, 
  selectedSpanId, 
  onSelectSpan,
  theme 
}: { 
  span: ProcessedSpan; 
  depth?: number;
  selectedSpanId: string | null;
  onSelectSpan: (spanId: string) => void;
  theme: 'dark' | 'light';
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = span.children.length > 0;

  const formatDuration = (ms: number) => {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(2)}s`;
    }
    return `${ms.toFixed(0)}ms`;
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors ${
          selectedSpanId === span.spanId
            ? theme === 'dark'
              ? 'bg-cyan-950 border-l-2 border-cyan-500'
              : 'bg-cyan-50 border-l-2 border-cyan-500'
            : theme === 'dark'
            ? 'hover:bg-gray-800'
            : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelectSpan(span.spanId)}
      >
        {hasChildren ? (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex-shrink-0 cursor-pointer"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </div>
        ) : (
          <div className="w-3" />
        )}
        
        <SpanIcon kind={span.name} status={span.status} />
        
        <span className={`flex-1 text-sm truncate ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {span.name}
        </span>
        
        <span className={`text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
        }`}>
          {formatDuration(span.duration)}
        </span>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {span.children.map(child => (
            <SpanTreeNode
              key={child.spanId}
              span={child}
              depth={depth + 1}
              selectedSpanId={selectedSpanId}
              onSelectSpan={onSelectSpan}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
}
