import { useState } from 'react';
import { Upload, File, Database, GitBranch, Calendar, Trash2, Plus, Search } from 'lucide-react';

interface MemoryManagementProps {
  selectedAgent: string | null;
  theme?: 'dark' | 'light';
}

type MemoryType = 'document' | 'knowledge-graph' | 'user-memory' | 'event-memory';

interface MemoryItem {
  id: string;
  type: MemoryType;
  name: string;
  description: string;
  size: string;
  lastAccessed: string;
  accessCount: number;
  agentId: string;
}

const mockAgents = [
  { id: 'agent-001', name: 'Customer Support Agent' },
  { id: 'agent-002', name: 'Sales Assistant' },
  { id: 'agent-003', name: 'Technical Support Bot' },
  { id: 'agent-004', name: 'HR Assistant' },
];

const mockMemoryItems: MemoryItem[] = [
  {
    id: 'mem-001',
    type: 'document',
    name: 'Product Documentation.pdf',
    description: 'Complete product manual and user guides',
    size: '2.4 MB',
    lastAccessed: '2026-01-13T10:30:00Z',
    accessCount: 342,
    agentId: 'agent-001',
  },
  {
    id: 'mem-002',
    type: 'document',
    name: 'FAQ Database.txt',
    description: 'Frequently asked questions and answers',
    size: '156 KB',
    lastAccessed: '2026-01-13T09:15:00Z',
    accessCount: 521,
    agentId: 'agent-001',
  },
  {
    id: 'mem-003',
    type: 'knowledge-graph',
    name: 'Product Relationships',
    description: 'Knowledge graph of product features and relationships',
    size: '4.8 MB',
    lastAccessed: '2026-01-13T08:45:00Z',
    accessCount: 198,
    agentId: 'agent-001',
  },
  {
    id: 'mem-004',
    type: 'user-memory',
    name: 'User Preferences',
    description: 'Stored user preferences and interaction history',
    size: '892 KB',
    lastAccessed: '2026-01-13T11:00:00Z',
    accessCount: 756,
    agentId: 'agent-002',
  },
  {
    id: 'mem-005',
    type: 'event-memory',
    name: 'Interaction Events',
    description: 'Historical interaction and conversation logs',
    size: '12.3 MB',
    lastAccessed: '2026-01-13T10:50:00Z',
    accessCount: 1243,
    agentId: 'agent-002',
  },
];

export function MemoryManagement({ selectedAgent, theme = 'dark' }: MemoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<MemoryType | 'all'>('all');
  const [memoryItems] = useState<MemoryItem[]>(mockMemoryItems);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-001');

  const filteredItems = memoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesAgent = item.agentId === selectedAgentId;
    return matchesSearch && matchesType && matchesAgent;
  });

  const getTypeIcon = (type: MemoryType) => {
    switch (type) {
      case 'document':
        return <File className="w-5 h-5 text-blue-400" />;
      case 'knowledge-graph':
        return <GitBranch className="w-5 h-5 text-purple-400" />;
      case 'user-memory':
        return <Database className="w-5 h-5 text-green-400" />;
      case 'event-memory':
        return <Calendar className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getTypeColor = (type: MemoryType) => {
    switch (type) {
      case 'document':
        return 'bg-blue-900/50 text-blue-400';
      case 'knowledge-graph':
        return 'bg-purple-900/50 text-purple-400';
      case 'user-memory':
        return 'bg-green-900/50 text-green-400';
      case 'event-memory':
        return 'bg-yellow-900/50 text-yellow-400';
    }
  };

  const totalSize = memoryItems.reduce((acc, item) => {
    const sizeInMB = item.size.includes('MB')
      ? parseFloat(item.size)
      : parseFloat(item.size) / 1024;
    return acc + sizeInMB;
  }, 0);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Long-term Memory Management</h2>
            <p className="text-gray-400">
              Manage documents, knowledge graphs, and memory used by your agent
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Select Agent:</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="px-4 py-2 bg-gray-900 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              {mockAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Memory Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Documents</div>
            <div className="text-2xl font-bold text-blue-400">
              {filteredItems.filter((i) => i.type === 'document').length}
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Knowledge Graphs</div>
            <div className="text-2xl font-bold text-purple-400">
              {filteredItems.filter((i) => i.type === 'knowledge-graph').length}
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">User Memory</div>
            <div className="text-2xl font-bold text-green-400">
              {filteredItems.filter((i) => i.type === 'user-memory').length}
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Event Memory</div>
            <div className="text-2xl font-bold text-yellow-400">
              {filteredItems.filter((i) => i.type === 'event-memory').length}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search memory items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as MemoryType | 'all')}
              className="px-4 py-2 bg-black rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option value="all">All Types</option>
              <option value="document">Documents</option>
              <option value="knowledge-graph">Knowledge Graphs</option>
              <option value="user-memory">User Memory</option>
              <option value="event-memory">Event Memory</option>
            </select>

            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" />
              Upload
            </button>

            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        {/* Memory Items */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Memory Items ({filteredItems.length})
          </h3>
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-black rounded-lg p-5 hover:bg-gray-950 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{getTypeIcon(item.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-200">{item.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(
                            item.type
                          )}`}
                        >
                          {item.type.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Database className="w-4 h-4" />
                          <span>{item.size}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Last accessed:{' '}
                            {new Date(item.lastAccessed).toLocaleDateString()}
                          </span>
                        </div>
                        <div>Access count: {item.accessCount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors">
                      <File className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Usage Breakdown */}
        <div className="mt-6 bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Memory Usage Breakdown</h3>
          <div className="space-y-3">
            {[
              { type: 'Documents', size: 2.5, color: 'bg-blue-500' },
              { type: 'Knowledge Graphs', size: 4.8, color: 'bg-purple-500' },
              { type: 'User Memory', size: 0.9, color: 'bg-green-500' },
              { type: 'Event Memory', size: 12.3, color: 'bg-yellow-500' },
            ].map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{item.type}</span>
                  <span className="text-sm font-semibold text-gray-200">
                    {item.size} MB
                  </span>
                </div>
                <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{ width: `${(item.size / totalSize) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}