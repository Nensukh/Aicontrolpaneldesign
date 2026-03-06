import { useState } from 'react';
import { Wrench, Search, Filter, ChevronDown, ChevronRight, Server, FileCode, Lock, Key, Layers } from 'lucide-react';

interface ToolsCatalogueProps {
  theme: 'dark' | 'light';
}

interface Tool {
  id: string;
  name: string;
  description: string;
  domain: string;
  server: string;
  enabled: boolean;
  authMechanism: 'API Key' | 'OAuth 2.0' | 'Bearer Token' | 'Basic Auth' | 'None';
  swcComponentId: string;
  version: string;
  inputParameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  outputSchema: {
    type: string;
    description: string;
  };
  usedByAgents: number;
}

// Mock tools data organized by domain
const mockToolsByDomain: Record<string, Tool[]> = {
  'Knowledge Management': [
    {
      id: 'tool-001',
      name: 'Knowledge Base Search',
      description: 'Searches the knowledge base for relevant documents and articles to answer customer queries',
      domain: 'Knowledge Management',
      server: 'https://api.knowledge.company.com',
      enabled: true,
      authMechanism: 'API Key',
      swcComponentId: 'KB-SEARCH-v2.3.1',
      version: '2.3.1',
      inputParameters: [
        { name: 'query', type: 'string', required: true, description: 'The search query text' },
        { name: 'limit', type: 'integer', required: false, description: 'Maximum number of results to return (default: 10)' },
        { name: 'filters', type: 'object', required: false, description: 'Optional filters for category, tags, or date range' }
      ],
      outputSchema: {
        type: 'array',
        description: 'Array of search results with title, content, relevance score, and metadata'
      },
      usedByAgents: 8
    },
    {
      id: 'tool-002',
      name: 'Document Indexer',
      description: 'Indexes new documents into the knowledge base with automatic tagging and categorization',
      domain: 'Knowledge Management',
      server: 'https://api.knowledge.company.com',
      enabled: true,
      authMechanism: 'API Key',
      swcComponentId: 'KB-INDEX-v1.5.2',
      version: '1.5.2',
      inputParameters: [
        { name: 'document', type: 'file', required: true, description: 'Document file to index' },
        { name: 'category', type: 'string', required: true, description: 'Primary category for the document' },
        { name: 'tags', type: 'array', required: false, description: 'Optional tags for classification' },
        { name: 'metadata', type: 'object', required: false, description: 'Additional metadata' }
      ],
      outputSchema: {
        type: 'object',
        description: 'Indexing result with document ID, status, and extracted metadata'
      },
      usedByAgents: 3
    }
  ],
  'Ticketing & Support': [
    {
      id: 'tool-003',
      name: 'Ticket Management',
      description: 'Creates, updates, and retrieves support tickets from the ticketing system',
      domain: 'Ticketing & Support',
      server: 'https://tickets.company.com/api/v3',
      enabled: true,
      authMechanism: 'OAuth 2.0',
      swcComponentId: 'TICKET-MGR-v1.8.4',
      version: '1.8.4',
      inputParameters: [
        { name: 'action', type: 'enum', required: true, description: 'Action type: create, update, get, list' },
        { name: 'ticketId', type: 'string', required: false, description: 'Ticket ID for update/get operations' },
        { name: 'subject', type: 'string', required: false, description: 'Ticket subject (required for create)' },
        { name: 'description', type: 'string', required: false, description: 'Ticket description (required for create)' },
        { name: 'priority', type: 'enum', required: false, description: 'Priority level: low, medium, high, urgent' }
      ],
      outputSchema: {
        type: 'object',
        description: 'Ticket object with id, status, assignee, timestamps, and full details'
      },
      usedByAgents: 12
    },
    {
      id: 'tool-004',
      name: 'SLA Monitor',
      description: 'Monitors and tracks SLA compliance for support tickets and alerts on violations',
      domain: 'Ticketing & Support',
      server: 'https://tickets.company.com/api/v3',
      enabled: true,
      authMechanism: 'OAuth 2.0',
      swcComponentId: 'SLA-MON-v2.1.0',
      version: '2.1.0',
      inputParameters: [
        { name: 'ticketId', type: 'string', required: true, description: 'Ticket ID to monitor' },
        { name: 'slaType', type: 'enum', required: true, description: 'SLA type: response_time, resolution_time' }
      ],
      outputSchema: {
        type: 'object',
        description: 'SLA status with time remaining, breach risk, and compliance percentage'
      },
      usedByAgents: 6
    }
  ],
  'Communication': [
    {
      id: 'tool-005',
      name: 'Email Integration',
      description: 'Sends emails to customers with customizable templates and attachments',
      domain: 'Communication',
      server: 'https://mail.company.com/api',
      enabled: true,
      authMechanism: 'Bearer Token',
      swcComponentId: 'EMAIL-SVC-v3.1.0',
      version: '3.1.0',
      inputParameters: [
        { name: 'to', type: 'string', required: true, description: 'Recipient email address' },
        { name: 'subject', type: 'string', required: true, description: 'Email subject line' },
        { name: 'body', type: 'string', required: true, description: 'Email body content (supports HTML)' },
        { name: 'template', type: 'string', required: false, description: 'Template ID to use for formatting' },
        { name: 'attachments', type: 'array', required: false, description: 'Array of attachment URLs or file IDs' }
      ],
      outputSchema: {
        type: 'object',
        description: 'Response with messageId, status, and delivery timestamp'
      },
      usedByAgents: 15
    },
    {
      id: 'tool-006',
      name: 'SMS Notification',
      description: 'Sends SMS notifications to customers for urgent updates and alerts',
      domain: 'Communication',
      server: 'https://sms.company.com/api/v2',
      enabled: true,
      authMechanism: 'API Key',
      swcComponentId: 'SMS-SVC-v2.4.1',
      version: '2.4.1',
      inputParameters: [
        { name: 'phoneNumber', type: 'string', required: true, description: 'Recipient phone number in E.164 format' },
        { name: 'message', type: 'string', required: true, description: 'SMS message text (max 160 characters)' },
        { name: 'priority', type: 'enum', required: false, description: 'Message priority: normal, high' }
      ],
      outputSchema: {
        type: 'object',
        description: 'Delivery status with messageId and timestamp'
      },
      usedByAgents: 7
    }
  ],
  'Analytics & Reporting': [
    {
      id: 'tool-007',
      name: 'Analytics Reporting',
      description: 'Generates analytics reports and retrieves performance metrics',
      domain: 'Analytics & Reporting',
      server: 'https://analytics.company.com/api',
      enabled: true,
      authMechanism: 'API Key',
      swcComponentId: 'ANALYTICS-v2.5.2',
      version: '2.5.2',
      inputParameters: [
        { name: 'reportType', type: 'enum', required: true, description: 'Report type: performance, usage, trends, custom' },
        { name: 'startDate', type: 'date', required: true, description: 'Start date for the report period' },
        { name: 'endDate', type: 'date', required: true, description: 'End date for the report period' },
        { name: 'metrics', type: 'array', required: false, description: 'Specific metrics to include in the report' },
        { name: 'groupBy', type: 'string', required: false, description: 'Group results by: day, week, month, agent' }
      ],
      outputSchema: {
        type: 'object',
        description: 'Report data with metrics, charts, and aggregated statistics'
      },
      usedByAgents: 10
    },
    {
      id: 'tool-008',
      name: 'Data Visualization',
      description: 'Creates interactive charts and visualizations from data sets',
      domain: 'Analytics & Reporting',
      server: 'https://analytics.company.com/api',
      enabled: true,
      authMechanism: 'API Key',
      swcComponentId: 'VIZ-SVC-v1.9.3',
      version: '1.9.3',
      inputParameters: [
        { name: 'data', type: 'array', required: true, description: 'Data array to visualize' },
        { name: 'chartType', type: 'enum', required: true, description: 'Chart type: bar, line, pie, scatter, heatmap' },
        { name: 'options', type: 'object', required: false, description: 'Visualization options and styling' }
      ],
      outputSchema: {
        type: 'object',
        description: 'Chart configuration and rendered visualization URL'
      },
      usedByAgents: 4
    }
  ],
  'CRM & Customer Data': [
    {
      id: 'tool-009',
      name: 'User Profile Lookup',
      description: 'Retrieves customer profile information from the CRM system',
      domain: 'CRM & Customer Data',
      server: 'https://crm.company.com/api/v2',
      enabled: true,
      authMechanism: 'OAuth 2.0',
      swcComponentId: 'CRM-LOOKUP-v1.4.0',
      version: '1.4.0',
      inputParameters: [
        { name: 'userId', type: 'string', required: false, description: 'User ID in the CRM system' },
        { name: 'email', type: 'string', required: false, description: 'User email address' },
        { name: 'includeHistory', type: 'boolean', required: false, description: 'Include interaction history (default: false)' }
      ],
      outputSchema: {
        type: 'object',
        description: 'User profile with contact info, preferences, history, and account status'
      },
      usedByAgents: 14
    },
    {
      id: 'tool-010',
      name: 'Customer Segmentation',
      description: 'Segments customers based on behavior, demographics, and engagement patterns',
      domain: 'CRM & Customer Data',
      server: 'https://crm.company.com/api/v2',
      enabled: false,
      authMechanism: 'OAuth 2.0',
      swcComponentId: 'CRM-SEG-v1.2.5',
      version: '1.2.5',
      inputParameters: [
        { name: 'criteria', type: 'object', required: true, description: 'Segmentation criteria and filters' },
        { name: 'limit', type: 'integer', required: false, description: 'Maximum number of customers to return' }
      ],
      outputSchema: {
        type: 'array',
        description: 'Array of customer segments with characteristics and member counts'
      },
      usedByAgents: 2
    }
  ]
};

export function ToolCatalogue({ theme }: ToolsCatalogueProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

  const domains = ['all', ...Object.keys(mockToolsByDomain)];

  // Flatten all tools for filtering
  const allTools = Object.values(mockToolsByDomain).flat();

  // Filter tools based on search and domain
  const filteredTools = allTools.filter(tool => {
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.domain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDomain = selectedDomain === 'all' || tool.domain === selectedDomain;
    
    return matchesSearch && matchesDomain;
  });

  // Group filtered tools by domain
  const groupedFilteredTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.domain]) {
      acc[tool.domain] = [];
    }
    acc[tool.domain].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const toggleTool = (toolId: string) => {
    setExpandedToolId(expandedToolId === toolId ? null : toolId);
  };

  const totalTools = allTools.length;
  const enabledTools = allTools.filter(t => t.enabled).length;
  const totalAgentUsage = allTools.reduce((sum, t) => sum + t.usedByAgents, 0);

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b ${
        theme === 'dark' ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-800'
                  : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'
              }`}>
                <Wrench className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                }`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Tools
                </h1>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Browse and explore all available tools across domains
                </p>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Register New Tool
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className={`rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Total Tools
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`}>
                {totalTools}
              </div>
            </div>
            <div className={`rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Enabled
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {enabledTools}
              </div>
            </div>
            <div className={`rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Domains
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`}>
                {Object.keys(mockToolsByDomain).length}
              </div>
            </div>
            <div className={`rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <div className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Agent Usage
              </div>
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {totalAgentUsage}
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools by name, description, or domain..."
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-600 focus:ring-orange-600 focus:border-orange-600'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500'
                }`}
              />
            </div>
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className={`pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-800 text-gray-100 focus:ring-orange-600 focus:border-orange-600'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-500 focus:border-orange-500'
                }`}
              >
                <option value="all">All Domains</option>
                {Object.keys(mockToolsByDomain).map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tool List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {Object.keys(groupedFilteredTools).length === 0 ? (
          <div className={`rounded-lg p-12 text-center border ${
            theme === 'dark'
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}>
            <Wrench className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No Tools Found
            </h3>
            <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFilteredTools).map(([domain, tools]) => (
              <div key={domain}>
                <div className="flex items-center gap-3 mb-4">
                  <Layers className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                  <h2 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {domain}
                  </h2>
                  <span className={`px-2 py-1 text-xs rounded ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-gray-400'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                  </span>
                </div>

                <div className="space-y-3">
                  {tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isExpanded={expandedToolId === tool.id}
                      onToggle={() => toggleTool(tool.id)}
                      theme={theme}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolCard({
  tool,
  isExpanded,
  onToggle,
  theme
}: {
  tool: Tool;
  isExpanded: boolean;
  onToggle: () => void;
  theme: 'dark' | 'light';
}) {
  return (
    <div className={`rounded-lg border transition-all ${
      tool.enabled
        ? theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
        : theme === 'dark'
        ? 'bg-gray-950 border-gray-900 opacity-75'
        : 'bg-gray-100 border-gray-300 opacity-75'
    }`}>
      {/* Tool Header - Clickable */}
      <button
        onClick={onToggle}
        className={`w-full p-4 flex items-center justify-between hover:bg-opacity-80 transition-colors ${
          isExpanded ? 'rounded-t-lg' : 'rounded-lg'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <div className={`p-2 rounded ${
            tool.enabled
              ? theme === 'dark'
                ? 'bg-orange-900/30 text-orange-400'
                : 'bg-orange-100 text-orange-600'
              : theme === 'dark'
              ? 'bg-gray-800 text-gray-500'
              : 'bg-gray-200 text-gray-500'
          }`}>
            <Wrench className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
            }`}>
              {tool.name}
              <span className={`px-2 py-0.5 text-xs rounded ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-400'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                v{tool.version}
              </span>
              {tool.enabled && (
                <span className={`px-2 py-0.5 text-xs rounded ${
                  theme === 'dark'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-green-100 text-green-700'
                }`}>
                  Enabled
                </span>
              )}
            </div>
            <div className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {tool.description}
            </div>
            <div className={`text-xs mt-2 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
            }`}>
              Used by {tool.usedByAgents} {tool.usedByAgents === 1 ? 'agent' : 'agents'}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className={`w-5 h-5 flex-shrink-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
        ) : (
          <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
        )}
      </button>

      {/* Tool Details - Expandable */}
      {isExpanded && (
        <div className={`border-t p-4 space-y-4 ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {/* Server & Component ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={`text-xs font-medium mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Server className="w-4 h-4" />
                Server
              </div>
              <div className={`text-sm font-mono px-3 py-2 rounded ${
                theme === 'dark'
                  ? 'bg-black text-cyan-400'
                  : 'bg-gray-50 text-cyan-600'
              }`}>
                {tool.server}
              </div>
            </div>
            <div>
              <div className={`text-xs font-medium mb-2 flex items-center gap-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <FileCode className="w-4 h-4" />
                SWC Component ID
              </div>
              <div className={`text-sm font-mono px-3 py-2 rounded ${
                theme === 'dark'
                  ? 'bg-black text-green-400'
                  : 'bg-gray-50 text-green-600'
              }`}>
                {tool.swcComponentId}
              </div>
            </div>
          </div>

          {/* Auth Mechanism */}
          <div>
            <div className={`text-xs font-medium mb-2 flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Lock className="w-4 h-4" />
              Authentication Mechanism
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded ${
              theme === 'dark'
                ? 'bg-black text-orange-400'
                : 'bg-gray-50 text-orange-600'
            }`}>
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">{tool.authMechanism}</span>
            </div>
          </div>

          {/* Input Parameters */}
          <div>
            <div className={`text-xs font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Input Parameters
            </div>
            <div className="space-y-2">
              {tool.inputParameters.map((param, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded ${
                    theme === 'dark'
                      ? 'bg-black'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <code className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {param.name}
                      </code>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        theme === 'dark'
                          ? 'bg-gray-900 text-gray-400'
                          : 'bg-white text-gray-600'
                      }`}>
                        {param.type}
                      </span>
                    </div>
                    {param.required && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        theme === 'dark'
                          ? 'bg-red-900/50 text-red-400'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        Required
                      </span>
                    )}
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {param.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output Schema */}
          <div>
            <div className={`text-xs font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Output Schema
            </div>
            <div className={`p-3 rounded ${
              theme === 'dark'
                ? 'bg-black'
                : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <code className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {tool.outputSchema.type}
                </code>
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {tool.outputSchema.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}