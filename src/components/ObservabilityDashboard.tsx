import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, ArrowLeft, X } from 'lucide-react';
import { traceData } from '../data/traces';
import { allTracesData } from '../data/allTraces';
import { GraphView } from './GraphView';
import { BusinessView } from './BusinessView';
import { SpanTreeNode, ProcessedSpan } from './observability/SpanTreeNode';
import { SpanDetails } from './observability/SpanDetails';
import { TraceView } from './observability/TraceView';
import { TracesTable } from './observability/TracesTable';

interface ObservabilityDashboardProps {
  selectedAgent: string | null;
  theme?: 'dark' | 'light';
}

type SpanStatus = 'STATUS_CODE_OK' | 'STATUS_CODE_ERROR' | 'STATUS_CODE_UNSET';
type TabType = 'info' | 'attributes';
type MainTabType = 'execution' | 'graph' | 'business' | 'trace';
type ViewMode = 'list' | 'detail';

// OpenTelemetry Attribute structure
interface OTelAttribute {
  key: string;
  value: {
    stringValue?: string;
    intValue?: number;
    doubleValue?: number;
    boolValue?: boolean;
  };
}

// OpenTelemetry Span structure
interface OTelSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  kind: string;
  startTimeUnixNano: string;
  endTimeUnixNano: string;
  attributes: OTelAttribute[];
  status: {
    code: SpanStatus;
  };
}

// Parse OpenTelemetry trace data
function parseOTelTrace(otelData: typeof traceData): ProcessedSpan[] {
  const spans: OTelSpan[] = [];
  
  // Extract all spans from the nested structure
  otelData.resourceSpans.forEach(resourceSpan => {
    resourceSpan.scopeSpans.forEach(scopeSpan => {
      spans.push(...scopeSpan.spans);
    });
  });

  // Process spans and convert attributes
  const processedSpans: ProcessedSpan[] = spans.map(span => {
    const attributes: Record<string, any> = {};
    span.attributes.forEach(attr => {
      const value = attr.value.stringValue ?? 
                   attr.value.intValue ?? 
                   attr.value.doubleValue ?? 
                   attr.value.boolValue ?? 
                   null;
      attributes[attr.key] = value;
    });

    const startTime = parseInt(span.startTimeUnixNano) / 1000000; // Convert to milliseconds
    const endTime = parseInt(span.endTimeUnixNano) / 1000000;

    return {
      spanId: span.spanId,
      traceId: span.traceId,
      parentSpanId: span.parentSpanId,
      name: span.name,
      kind: span.kind,
      status: span.status.code,
      startTime,
      endTime,
      duration: endTime - startTime,
      attributes,
      children: []
    };
  });

  // Build hierarchy
  const spanMap = new Map<string, ProcessedSpan>();
  processedSpans.forEach(span => spanMap.set(span.spanId, span));

  const rootSpans: ProcessedSpan[] = [];
  processedSpans.forEach(span => {
    if (span.parentSpanId) {
      const parent = spanMap.get(span.parentSpanId);
      if (parent) {
        parent.children.push(span);
      }
    } else {
      rootSpans.push(span);
    }
  });

  return rootSpans;
}

export function ObservabilityDashboard({ selectedAgent, theme = 'dark' }: ObservabilityDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | '1h' | '6h' | '24h'>('all');
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [mainTab, setMainTab] = useState<MainTabType>('execution');

  // Parse the trace data (for detail view)
  const processedSpans = parseOTelTrace(traceData);
  const rootSpan = processedSpans[0];
  
  // Flatten all spans for selection
  const allSpans: ProcessedSpan[] = [];
  const flattenSpans = (span: ProcessedSpan) => {
    allSpans.push(span);
    span.children.forEach(flattenSpans);
  };
  if (rootSpan) {
    flattenSpans(rootSpan);
  }

  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(rootSpan?.spanId || null);
  const selectedSpan = allSpans.find(s => s.spanId === selectedSpanId);

  // Generate trace summaries for table
  const tracesSummaries = useMemo(() => {
    return allTracesData.map(trace => {
      // For demo, generate random but consistent data based on trace ID
      const hash = trace.traceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const spanCount = 8 + (hash % 15);
      const duration = 15000 + (hash % 10000);
      const totalTokens = 1000 + (hash % 2000);

      return {
        traceId: trace.traceId,
        sessionId: trace.sessionId,
        timestamp: trace.timestamp,
        duration,
        status: trace.status as SpanStatus,
        spanCount,
        userRequest: trace.userRequest,
        agentName: trace.agentName,
        totalTokens
      };
    });
  }, []);

  // Filter traces based on search and filters
  const filteredTraces = useMemo(() => {
    let filtered = tracesSummaries;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(trace =>
        trace.traceId.toLowerCase().includes(search) ||
        trace.sessionId.toLowerCase().includes(search) ||
        trace.userRequest.toLowerCase().includes(search) ||
        trace.agentName.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(trace => {
        if (statusFilter === 'success') return trace.status === 'STATUS_CODE_OK';
        if (statusFilter === 'error') return trace.status === 'STATUS_CODE_ERROR';
        return true;
      });
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = Date.now();
      const timeMap = {
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000
      };
      const timeWindow = timeMap[timeFilter];
      filtered = filtered.filter(trace => (now - trace.timestamp) <= timeWindow);
    }

    return filtered;
  }, [tracesSummaries, searchTerm, statusFilter, timeFilter]);

  const handleSelectTrace = (traceId: string) => {
    setSelectedTraceId(traceId);
    setViewMode('detail');
    setMainTab('execution');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTraceId(null);
  };

  // Extract trace metadata (for detail view)
  const traceId = rootSpan?.traceId || '';
  const sessionId = rootSpan?.attributes['session.id'] || '';
  const userRequest = rootSpan?.attributes['user.request'] || '';

  const formatDuration = (ms: number) => {
    if (ms >= 1000) {
      return `${(ms / 1000).toFixed(2)}s`;
    }
    return `${ms.toFixed(0)}ms`;
  };

  // Calculate total tokens
  const totalTokens = allSpans.reduce((sum, span) => {
    return sum + (span.attributes['llm.usage.total_tokens'] || 0);
  }, 0);

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className={`min-h-screen p-6 ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-4">
            <h2 className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Trace Observability
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Monitor and analyze OpenTelemetry traces from multi-agent workflows
            </p>
          </div>

          {/* Filters Bar */}
          <div className={`rounded-lg p-4 mb-4 space-y-3 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search by Trace ID, Session ID, Request, Agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-black text-gray-200 placeholder-gray-500 border border-gray-800'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200'
                } outline-none focus:ring-2 focus:ring-cyan-500`}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`} />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Filters:
                </span>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {['all', 'success', 'error'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as typeof statusFilter)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? theme === 'dark'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-cyan-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status === 'success' ? 'Success' : 'Error'}
                  </button>
                ))}
              </div>

              {/* Time Filter */}
              <div className="flex items-center gap-2 ml-4">
                <Calendar className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`} />
                <div className="flex gap-2">
                  {['all', '1h', '6h', '24h'].map(time => (
                    <button
                      key={time}
                      onClick={() => setTimeFilter(time as typeof timeFilter)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        timeFilter === time
                          ? theme === 'dark'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-cyan-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {time === 'all' ? 'All Time' : `Last ${time.toUpperCase()}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || statusFilter !== 'all' || timeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTimeFilter('all');
                  }}
                  className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <X className="w-3 h-3" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Traces
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {filteredTraces.length}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Success Rate
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {filteredTraces.length > 0
                  ? Math.round((filteredTraces.filter(t => t.status === 'STATUS_CODE_OK').length / filteredTraces.length) * 100)
                  : 0}%
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Avg Duration
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {filteredTraces.length > 0
                  ? formatDuration(filteredTraces.reduce((sum, t) => sum + t.duration, 0) / filteredTraces.length)
                  : '0ms'}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Spans
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {filteredTraces.reduce((sum, t) => sum + t.spanCount, 0)}
              </div>
            </div>
          </div>

          {/* Traces Table */}
          <TracesTable 
            traces={filteredTraces} 
            onSelectTrace={handleSelectTrace}
            theme={theme}
          />
        </div>
      </div>
    );
  }

  // DETAIL VIEW
  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-[1800px] mx-auto">
        {/* Header with Back Button */}
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Trace Details
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Detailed view of trace execution and performance
            </p>
          </div>
        </div>

        {/* Trace Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Trace ID
            </div>
            <div className={`font-mono text-xs truncate ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`}>
              {traceId}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Session ID
            </div>
            <div className={`font-mono text-xs ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {sessionId}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total Duration
            </div>
            <div className={`text-lg font-bold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {rootSpan ? formatDuration(rootSpan.duration) : '0ms'}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total Tokens
            </div>
            <div className={`text-lg font-bold ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              {totalTokens.toLocaleString()}
            </div>
          </div>
        </div>

        {/* User Request */}
        {userRequest && (
          <div className={`p-3 rounded-lg mb-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className={`text-xs mb-1 font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              User Request
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {userRequest}
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <div className={`rounded-lg mb-4 ${
          theme === 'dark' ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-200'
        }`}>
          <div className="flex gap-6 px-4">
            {(['execution', 'graph', 'business', 'trace'] as MainTabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`py-3 border-b-2 transition-colors text-sm font-medium ${
                  mainTab === tab
                    ? 'border-cyan-500 text-cyan-400'
                    : theme === 'dark'
                    ? 'border-transparent text-gray-500 hover:text-gray-300'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'execution' ? 'Execution' :
                 tab === 'graph' ? 'Graph View' :
                 tab === 'business' ? 'Business View' :
                 'Trace'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {rootSpan && (
          <>
            {/* Execution Tab - Two Panel Layout */}
            {mainTab === 'execution' && (
              <div className="grid grid-cols-12 gap-4">
                {/* Left Panel - Span Tree */}
                <div className={`col-span-4 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-900' 
                    : 'bg-white'
                }`}>
                  <div className={`px-4 py-2 ${
                    theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
                  }`}>
                    <h3 className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      Trace Timeline
                    </h3>
                    <div className={`text-xs mt-0.5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      <div>Spans: {allSpans.length}</div>
                      <div>Status: <span className={rootSpan.status === 'STATUS_CODE_OK' ? 'text-green-400' : 'text-red-400'}>
                        {rootSpan.status === 'STATUS_CODE_OK' ? 'SUCCESS' : 'ERROR'}
                      </span></div>
                    </div>
                  </div>

                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
                    <SpanTreeNode
                      span={rootSpan}
                      depth={0}
                      selectedSpanId={selectedSpanId}
                      onSelectSpan={setSelectedSpanId}
                      theme={theme}
                    />
                  </div>
                </div>

                {/* Right Panel - Span Details */}
                <div className={`col-span-8 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-900' 
                    : 'bg-white'
                }`}>
                  {selectedSpan && (
                    <SpanDetails
                      span={selectedSpan}
                      theme={theme}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      processedSpans={processedSpans}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Graph Tab */}
            {mainTab === 'graph' && (
              <div className={`rounded-lg p-6 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}>
                <GraphView spans={processedSpans} theme={theme} />
              </div>
            )}

            {/* Business Tab */}
            {mainTab === 'business' && (
              <div className={`rounded-lg p-6 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}>
                <BusinessView spans={processedSpans} theme={theme} />
              </div>
            )}

            {/* Trace Tab */}
            {mainTab === 'trace' && (
              <TraceView traceData={traceData} theme={theme} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
