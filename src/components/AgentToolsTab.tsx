import { useState } from 'react';
import { Wrench, ChevronDown, ChevronRight, Server, FileCode, Lock, Key, CheckCircle2, AlertCircle } from 'lucide-react';

interface AgentToolsTabProps {
  agentId: string;
  agentName: string;
  theme: 'dark' | 'light';
}

interface ToolConfig {
  id: string;
  name: string;
  description: string;
  server: string;
  enabled: boolean;
  authMechanism: 'API Key' | 'OAuth 2.0' | 'Bearer Token' | 'Basic Auth' | 'None';
  swcComponentId: string;
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
}

// Mock tools data
const mockTools: ToolConfig[] = [
  {
    id: 'tool-001',
    name: 'Knowledge Base Search',
    description: 'Searches the knowledge base for relevant documents and articles to answer customer queries',
    server: 'https://api.knowledge.company.com',
    enabled: true,
    authMechanism: 'API Key',
    swcComponentId: 'KB-SEARCH-v2.3.1',
    inputParameters: [
      { name: 'query', type: 'string', required: true, description: 'The search query text' },
      { name: 'limit', type: 'integer', required: false, description: 'Maximum number of results to return (default: 10)' },
      { name: 'filters', type: 'object', required: false, description: 'Optional filters for category, tags, or date range' }
    ],
    outputSchema: {
      type: 'array',
      description: 'Array of search results with title, content, relevance score, and metadata'
    }
  },
  {
    id: 'tool-002',
    name: 'Ticket Management',
    description: 'Creates, updates, and retrieves support tickets from the ticketing system',
    server: 'https://tickets.company.com/api/v3',
    enabled: true,
    authMechanism: 'OAuth 2.0',
    swcComponentId: 'TICKET-MGR-v1.8.4',
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
    }
  },
  {
    id: 'tool-003',
    name: 'Email Integration',
    description: 'Sends emails to customers with customizable templates and attachments',
    server: 'https://mail.company.com/api',
    enabled: true,
    authMechanism: 'Bearer Token',
    swcComponentId: 'EMAIL-SVC-v3.1.0',
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
    }
  },
  {
    id: 'tool-004',
    name: 'Analytics Reporting',
    description: 'Generates analytics reports and retrieves performance metrics',
    server: 'https://analytics.company.com/api',
    enabled: true,
    authMechanism: 'API Key',
    swcComponentId: 'ANALYTICS-v2.5.2',
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
    }
  },
  {
    id: 'tool-005',
    name: 'User Profile Lookup',
    description: 'Retrieves customer profile information from the CRM system',
    server: 'https://crm.company.com/api/v2',
    enabled: false,
    authMechanism: 'OAuth 2.0',
    swcComponentId: 'CRM-LOOKUP-v1.4.0',
    inputParameters: [
      { name: 'userId', type: 'string', required: false, description: 'User ID in the CRM system' },
      { name: 'email', type: 'string', required: false, description: 'User email address' },
      { name: 'includeHistory', type: 'boolean', required: false, description: 'Include interaction history (default: false)' }
    ],
    outputSchema: {
      type: 'object',
      description: 'User profile with contact info, preferences, history, and account status'
    }
  }
];

export function AgentToolsTab({ agentId, agentName, theme }: AgentToolsTabProps) {
  const [tools] = useState<ToolConfig[]>(mockTools);
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

  const toggleTool = (toolId: string) => {
    setExpandedToolId(expandedToolId === toolId ? null : toolId);
  };

  const enabledTools = tools.filter(t => t.enabled);
  const disabledTools = tools.filter(t => !t.enabled);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-xl font-bold mb-2 flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Wrench className="w-6 h-6" />
              Tools & Capabilities
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Configure and manage tools available to {agentName}
            </p>
          </div>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              theme === 'dark'
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Add Tool
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Total Tools
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`}>
              {tools.length}
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
              {enabledTools.length}
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className={`text-xs mb-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Disabled
            </div>
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {disabledTools.length}
            </div>
          </div>
        </div>
      </div>

      {/* Enabled Tools */}
      {enabledTools.length > 0 && (
        <div className={`rounded-lg p-5 mb-4 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Enabled Tools
          </h4>
          <div className="space-y-2">
            {enabledTools.map((tool) => (
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
      )}

      {/* Disabled Tools */}
      {disabledTools.length > 0 && (
        <div className={`rounded-lg p-5 border ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
          <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <AlertCircle className="w-5 h-5 text-gray-500" />
            Disabled Tools
          </h4>
          <div className="space-y-2">
            {disabledTools.map((tool) => (
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
      )}
    </div>
  );
}

function ToolCard({
  tool,
  isExpanded,
  onToggle,
  theme
}: {
  tool: ToolConfig;
  isExpanded: boolean;
  onToggle: () => void;
  theme: 'dark' | 'light';
}) {
  return (
    <div className={`rounded-lg border transition-all ${
      tool.enabled
        ? theme === 'dark'
          ? 'bg-black border-gray-800'
          : 'bg-gray-50 border-gray-200'
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
                ? 'bg-cyan-900/30 text-cyan-400'
                : 'bg-cyan-100 text-cyan-600'
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
                  ? 'bg-gray-900 text-cyan-400'
                  : 'bg-white text-cyan-600'
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
                  ? 'bg-gray-900 text-green-400'
                  : 'bg-white text-green-600'
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
                ? 'bg-gray-900 text-orange-400'
                : 'bg-white text-orange-600'
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
                      ? 'bg-gray-900'
                      : 'bg-white'
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
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
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
                ? 'bg-gray-900'
                : 'bg-white'
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
