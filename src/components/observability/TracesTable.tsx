// Traces Table Component - List view of all traces
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

interface TracesSummary {
  traceId: string;
  sessionId: string;
  timestamp: number;
  duration: number;
  status: 'STATUS_CODE_OK' | 'STATUS_CODE_ERROR' | 'STATUS_CODE_UNSET';
  spanCount: number;
  userRequest: string;
  agentName: string;
  totalTokens: number;
}

interface TracesTableProps {
  traces: TracesSummary[];
  onSelectTrace: (traceId: string) => void;
  theme: 'dark' | 'light';
}

export function TracesTable({ traces, onSelectTrace, theme }: TracesTableProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestampMs: number) => {
    const date = new Date(timestampMs);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Show relative time if within last 24 hours
    if (diffMs < 24 * 60 * 60 * 1000) {
      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(minutes / 60);
      
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      return `${hours}h ago`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'STATUS_CODE_OK':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'STATUS_CODE_ERROR':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (traces.length === 0) {
    return (
      <div className={`text-center py-16 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
      }`}>
        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg">No traces found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Table Header */}
      <div className={`grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wide border-b ${
        theme === 'dark' 
          ? 'bg-gray-800 text-gray-400 border-gray-700' 
          : 'bg-gray-50 text-gray-600 border-gray-200'
      }`}>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Trace ID</div>
        <div className="col-span-2">Session ID</div>
        <div className="col-span-3">Request</div>
        <div className="col-span-1">Agent</div>
        <div className="col-span-1">Duration</div>
        <div className="col-span-1">Spans</div>
        <div className="col-span-1">Timestamp</div>
      </div>

      {/* Table Body */}
      <div className={`divide-y ${
        theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'
      }`}>
        {traces.map((trace) => (
          <button
            key={trace.traceId}
            onClick={() => onSelectTrace(trace.traceId)}
            className={`w-full grid grid-cols-12 gap-4 px-4 py-3 text-left transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            {/* Status */}
            <div className="col-span-1 flex items-center">
              {getStatusIcon(trace.status)}
            </div>

            {/* Trace ID */}
            <div className="col-span-2 flex items-center">
              <span className={`font-mono text-xs truncate ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {trace.traceId.slice(0, 12)}...
              </span>
            </div>

            {/* Session ID */}
            <div className="col-span-2 flex items-center">
              <span className={`font-mono text-xs truncate ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {trace.sessionId}
              </span>
            </div>

            {/* Request */}
            <div className="col-span-3 flex items-center">
              <span className={`text-sm truncate ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {trace.userRequest || 'No request message'}
              </span>
            </div>

            {/* Agent */}
            <div className="col-span-1 flex items-center">
              <span className={`text-xs px-2 py-0.5 rounded ${
                theme === 'dark' 
                  ? 'bg-cyan-900/30 text-cyan-400' 
                  : 'bg-cyan-100 text-cyan-700'
              }`}>
                {trace.agentName}
              </span>
            </div>

            {/* Duration */}
            <div className="col-span-1 flex items-center">
              <div className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {formatDuration(trace.duration)}
                </span>
              </div>
            </div>

            {/* Spans */}
            <div className="col-span-1 flex items-center">
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {trace.spanCount}
              </span>
            </div>

            {/* Timestamp */}
            <div className="col-span-1 flex items-center justify-between">
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {formatTimestamp(trace.timestamp)}
              </span>
              <ChevronRight className={`w-4 h-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
