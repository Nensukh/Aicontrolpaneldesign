import { useState } from 'react';
import { Search, ChevronRight, Network, Settings, Shield, Clock, Database, Plus, Target, Play, Sliders, GripVertical, X } from 'lucide-react';
import { AgentRegistry } from './AgentRegistry';
import { GroundTruthCapture } from './GroundTruthCapture';
import { EvaluationDashboard } from './EvaluationDashboard';
import { BenchmarkSetting } from './BenchmarkSetting';

interface Agent {
  id: string;
  name: string;
  description: string;
  platform: string;
  status: 'active' | 'inactive' | 'maintenance';
  model: string;
  parentId?: string;
  children?: string[];
  lastUpdated: string;
}

const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries and support tickets with high accuracy',
    platform: 'Azure AI Foundry',
    status: 'active',
    model: 'GPT-4',
    children: ['agent-002', 'agent-003'],
    lastUpdated: '2026-01-13T10:30:00Z',
  },
  {
    id: 'agent-002',
    name: 'Tier 1 Support',
    description: 'First-line support for common issues',
    platform: 'Azure AI Foundry',
    status: 'active',
    model: 'GPT-3.5-Turbo',
    parentId: 'agent-001',
    lastUpdated: '2026-01-13T09:15:00Z',
  },
  {
    id: 'agent-003',
    name: 'Tier 2 Support',
    description: 'Escalated technical support',
    platform: 'Azure AI Foundry',
    status: 'active',
    model: 'GPT-4',
    parentId: 'agent-001',
    lastUpdated: '2026-01-13T09:15:00Z',
  },
  {
    id: 'agent-004',
    name: 'Sales Assistant',
    description: 'Assists with product recommendations and sales queries',
    platform: 'OpenAI',
    status: 'active',
    model: 'GPT-4-Turbo',
    lastUpdated: '2026-01-12T16:45:00Z',
  },
  {
    id: 'agent-005',
    name: 'Content Moderator',
    description: 'Reviews and moderates user-generated content',
    platform: 'Azure AI Foundry',
    status: 'maintenance',
    model: 'GPT-4',
    lastUpdated: '2026-01-11T14:20:00Z',
  },
  {
    id: 'agent-006',
    name: 'Data Analytics Agent',
    description: 'Analyzes data patterns and generates insights',
    platform: 'Azure AI Foundry',
    status: 'active',
    model: 'GPT-4',
    lastUpdated: '2026-01-10T11:30:00Z',
  },
];

interface AgentInventoryProps {
  onSelectAgent: (agentId: string) => void;
  theme: 'dark' | 'light';
}

type AgentView = 'details' | 'groundtruth' | 'evaluation' | 'metrics';

export function AgentInventory({ onSelectAgent, theme }: AgentInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [agentView, setAgentView] = useState<AgentView>('details');
  const [listWidth, setListWidth] = useState(() => {
    const saved = localStorage.getItem('agents-hq-list-width');
    return saved ? parseInt(saved) : 320;
  });
  const [isDragging, setIsDragging] = useState(false);

  const filteredAgents = mockAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    onSelectAgent(agentId);
    setAgentView('details');
  };

  const handleCloseDetails = () => {
    setSelectedAgentId(null);
    onSelectAgent('');
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const sidebar = document.querySelector('[class*="w-20"],[class*="w-64"]') as HTMLElement;
      const sidebarWidth = sidebar ? sidebar.offsetWidth : 256;
      const newWidth = e.clientX - sidebarWidth;
      if (newWidth >= 280 && newWidth <= 600) {
        setListWidth(newWidth);
        localStorage.setItem('agents-hq-list-width', newWidth.toString());
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectedAgent = mockAgents.find((a) => a.id === selectedAgentId);

  // Grid View (default when no agent is selected)
  if (!selectedAgentId) {
    return (
      <div className={`min-h-screen p-4 ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className={`mb-4 p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-900' 
              : 'bg-white shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold mb-1">Agent Inventory</h2>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage and monitor your AI agents
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Register Agent
              </button>
            </div>
            
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  theme === 'dark'
                    ? 'bg-black text-gray-100 placeholder-gray-500'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent.id)}
                className={`text-left p-4 rounded-lg transition-all hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-100'
                    }`}>
                      <Network className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      }`} />
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      agent.status === 'active'
                        ? theme === 'dark'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-green-100 text-green-700'
                        : agent.status === 'maintenance'
                        ? theme === 'dark'
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-yellow-100 text-yellow-700'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <h3 className={`font-semibold mb-1 ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {agent.name}
                </h3>
                <p className={`text-sm mb-3 line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {agent.description}
                </p>

                <div className={`flex items-center justify-between pt-3 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      <div className="font-semibold mb-0.5">Platform</div>
                      <div className="truncate max-w-[80px]">{agent.platform}</div>
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      <div className="font-semibold mb-0.5">Model</div>
                      <div>{agent.model}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                </div>

                {agent.children && agent.children.length > 0 && (
                  <div className={`mt-2 text-xs ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>
                    {agent.children.length} child agent{agent.children.length > 1 ? 's' : ''}
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className={`text-center py-12 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-200'
            }`}>
              <Database className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
              }`} />
              <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                No agents found matching your search
              </p>
            </div>
          )}
        </div>

        {/* Register Agent Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto border ${
              theme === 'dark' 
                ? 'bg-gray-950 border-gray-800' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`sticky top-0 border-b p-4 flex items-center justify-between ${
                theme === 'dark' 
                  ? 'bg-gray-950 border-gray-800' 
                  : 'bg-white border-gray-200'
              }`}>
                <h2 className="text-2xl font-bold">Register New Agent</h2>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className={theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <AgentRegistry onClose={() => setShowRegisterModal(false)} theme={theme} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View with Details Panel (when an agent is selected)
  return (
    <div 
      className="flex h-screen" 
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Agent List */}
      <div 
        className={`border-r flex flex-col ${
          theme === 'dark' 
            ? 'bg-gray-950 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}
        style={{ width: `${listWidth}px` }}
      >
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Agents</h2>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Register
            </button>
          </div>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-cyan-600 border ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {filteredAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => handleSelectAgent(agent.id)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                selectedAgentId === agent.id
                  ? theme === 'dark'
                    ? 'bg-gray-800 ring-2 ring-cyan-600'
                    : 'bg-cyan-50 ring-2 ring-cyan-500'
                  : theme === 'dark'
                  ? 'bg-gray-900 hover:bg-gray-800'
                  : 'bg-white hover:bg-gray-50 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {agent.name}
                    </h3>
                    {agent.children && agent.children.length > 0 && (
                      <Network className={`w-4 h-4 ${
                        theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'
                      }`} />
                    )}
                  </div>
                  <p className={`text-sm line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {agent.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    agent.status === 'active'
                      ? theme === 'dark'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-green-100 text-green-700'
                      : agent.status === 'maintenance'
                      ? theme === 'dark'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-yellow-100 text-yellow-700'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {agent.status}
                </span>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {agent.platform}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Resizable Divider */}
      <div 
        className={`w-1 relative group cursor-col-resize flex-shrink-0 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
        } ${isDragging ? 'bg-cyan-500' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className={`absolute inset-y-0 -left-1 -right-1 flex items-center justify-center transition-opacity ${
          isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <div className={`p-1 rounded ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
          }`}>
            <GripVertical className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Agent Details */}
      <div className="flex-1 overflow-auto">
        {selectedAgent && (
          <div className="h-full flex flex-col">
            {/* Header with tabs */}
            <div className={`border-b sticky top-0 z-10 ${
              theme === 'dark' 
                ? 'border-gray-800 bg-gray-950' 
                : 'border-gray-200 bg-white'
            }`}>
              <div className="p-6 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedAgent.name}</h2>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {selectedAgent.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedAgent.status === 'active'
                          ? theme === 'dark'
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-green-100 text-green-700'
                          : selectedAgent.status === 'maintenance'
                          ? theme === 'dark'
                            ? 'bg-yellow-900/50 text-yellow-400'
                            : 'bg-yellow-100 text-yellow-700'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {selectedAgent.status}
                    </span>
                    <button
                      onClick={handleCloseDetails}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                      title="Close details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setAgentView('details')}
                    className={`px-4 py-2 rounded-t-lg transition-colors ${
                      agentView === 'details'
                        ? theme === 'dark'
                          ? 'bg-gray-900 text-cyan-400 border-t border-l border-r border-gray-800'
                          : 'bg-gray-50 text-cyan-600 border-t border-l border-r border-gray-200'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setAgentView('groundtruth')}
                    className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
                      agentView === 'groundtruth'
                        ? theme === 'dark'
                          ? 'bg-gray-900 text-cyan-400 border-t border-l border-r border-gray-800'
                          : 'bg-gray-50 text-cyan-600 border-t border-l border-r border-gray-200'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    Ground Truth
                  </button>
                  <button
                    onClick={() => setAgentView('evaluation')}
                    className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
                      agentView === 'evaluation'
                        ? theme === 'dark'
                          ? 'bg-gray-900 text-cyan-400 border-t border-l border-r border-gray-800'
                          : 'bg-gray-50 text-cyan-600 border-t border-l border-r border-gray-200'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    Evaluation
                  </button>
                  <button
                    onClick={() => setAgentView('metrics')}
                    className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-2 ${
                      agentView === 'metrics'
                        ? theme === 'dark'
                          ? 'bg-gray-900 text-cyan-400 border-t border-l border-r border-gray-800'
                          : 'bg-gray-50 text-cyan-600 border-t border-l border-r border-gray-200'
                        : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    Metrics
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              {agentView === 'details' && (
                <div className="p-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className={`rounded-lg p-4 ${
                      theme === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-50'
                    }`}>
                      <div className={`text-xs mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Platform
                      </div>
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {selectedAgent.platform}
                      </div>
                    </div>
                    <div className={`rounded-lg p-4 ${
                      theme === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-50'
                    }`}>
                      <div className={`text-xs mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Model
                      </div>
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {selectedAgent.model}
                      </div>
                    </div>
                    <div className={`rounded-lg p-4 ${
                      theme === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-50'
                    }`}>
                      <div className={`text-xs mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Agent ID
                      </div>
                      <div className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {selectedAgent.id}
                      </div>
                    </div>
                    <div className={`rounded-lg p-4 ${
                      theme === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-50'
                    }`}>
                      <div className={`text-xs mb-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Last Updated
                      </div>
                      <div className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        {new Date(selectedAgent.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="space-y-6">
                    {/* System Prompt */}
                    <div className={`rounded-lg p-5 ${
                      theme === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Settings className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'
                        }`} />
                        <h3 className="font-semibold text-lg">System Prompt</h3>
                      </div>
                      <div className={`rounded p-4 font-mono text-sm ${
                        theme === 'dark'
                          ? 'bg-black text-gray-300'
                          : 'bg-white text-gray-700'
                      }`}>
                        You are a helpful {selectedAgent.name.toLowerCase()}. Your role is to{' '}
                        {selectedAgent.description.toLowerCase()}. Always be professional, accurate,
                        and provide clear explanations. Follow company guidelines and escalate when
                        necessary.
                      </div>
                    </div>

                    {/* Tools Configuration */}
                    <div className={`rounded-lg p-5 ${
                      theme === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-50'
                    }`}>
                      <h3 className="font-semibold text-lg mb-3">Tools & Capabilities</h3>
                      <div className="space-y-2">
                        {['Knowledge Base Search', 'Ticket Management', 'Email Integration', 'Analytics Reporting'].map(
                          (tool, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-3 rounded ${
                                theme === 'dark'
                                  ? 'bg-black'
                                  : 'bg-white'
                              }`}
                            >
                              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                {tool}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                theme === 'dark'
                                  ? 'bg-green-900/50 text-green-400'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                Enabled
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Governance */}
                    <div className={`rounded-lg p-5 ${
                      theme === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'
                        }`} />
                        <h3 className="font-semibold text-lg">Governance & Compliance</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className={`text-sm mb-1 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            Data Retention
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            90 days
                          </div>
                        </div>
                        <div>
                          <div className={`text-sm mb-1 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            Compliance Level
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            SOC 2, GDPR
                          </div>
                        </div>
                        <div>
                          <div className={`text-sm mb-1 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            Access Level
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            Restricted
                          </div>
                        </div>
                        <div>
                          <div className={`text-sm mb-1 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            Audit Logging
                          </div>
                          <div className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                            Enabled
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agent Topology */}
                    {(selectedAgent.children || selectedAgent.parentId) && (
                      <div className={`rounded-lg p-5 ${
                        theme === 'dark' 
                          ? 'bg-gray-900' 
                          : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Network className={`w-5 h-5 ${
                            theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'
                          }`} />
                          <h3 className="font-semibold text-lg">Agent Hierarchy</h3>
                        </div>
                        {selectedAgent.parentId && (
                          <div className="mb-3">
                            <div className={`text-sm mb-2 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              Parent Agent
                            </div>
                            <div className={`p-3 rounded ${
                              theme === 'dark'
                                ? 'bg-black text-gray-300'
                                : 'bg-white text-gray-700'
                            }`}>
                              {mockAgents.find((a) => a.id === selectedAgent.parentId)?.name}
                            </div>
                          </div>
                        )}
                        {selectedAgent.children && selectedAgent.children.length > 0 && (
                          <div>
                            <div className={`text-sm mb-2 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              Child Agents
                            </div>
                            <div className="space-y-2">
                              {selectedAgent.children.map((childId) => {
                                const child = mockAgents.find((a) => a.id === childId);
                                return child ? (
                                  <div
                                    key={childId}
                                    className={`p-3 rounded ${
                                      theme === 'dark'
                                        ? 'bg-black text-gray-300'
                                        : 'bg-white text-gray-700'
                                    }`}
                                  >
                                    {child.name}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Audit Trail */}
                    <div className={`rounded-lg p-5 ${
                      theme === 'dark' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-cyan-500' : 'text-cyan-600'
                        }`} />
                        <h3 className="font-semibold text-lg">Recent Audit Trail</h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          { action: 'Configuration Updated', user: 'admin@company.com', time: '2 hours ago' },
                          { action: 'Model Version Changed', user: 'ops@company.com', time: '1 day ago' },
                          { action: 'Agent Deployed', user: 'admin@company.com', time: '3 days ago' },
                        ].map((entry, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center justify-between p-3 rounded ${
                              theme === 'dark'
                                ? 'bg-black'
                                : 'bg-white'
                            }`}
                          >
                            <div>
                              <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                {entry.action}
                              </div>
                              <div className={`text-sm ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                {entry.user}
                              </div>
                            </div>
                            <div className={`text-sm ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {entry.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {agentView === 'groundtruth' && (
                <GroundTruthCapture selectedAgent={selectedAgentId} agentName={selectedAgent.name} theme={theme} />
              )}

              {agentView === 'evaluation' && (
                <EvaluationDashboard selectedAgent={selectedAgentId} agentName={selectedAgent.name} theme={theme} />
              )}

              {agentView === 'metrics' && (
                <BenchmarkSetting selectedAgent={selectedAgentId} agentName={selectedAgent.name} theme={theme} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Register Agent Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto border ${
            theme === 'dark' 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`sticky top-0 border-b p-4 flex items-center justify-between ${
              theme === 'dark' 
                ? 'bg-gray-950 border-gray-800' 
                : 'bg-white border-gray-200'
            }`}>
              <h2 className="text-2xl font-bold">Register New Agent</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className={theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <AgentRegistry onClose={() => setShowRegisterModal(false)} theme={theme} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}