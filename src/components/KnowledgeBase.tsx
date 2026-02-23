import { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Link as LinkIcon, 
  Upload, 
  MessageSquare, 
  Network,
  Search,
  Folder,
  ExternalLink,
  Trash2,
  Edit2,
  BookOpen,
  Globe
} from 'lucide-react';
import { KnowledgeGraphViewer } from './knowledge/KnowledgeGraphViewer';
import { TextInstructionsViewer } from './knowledge/TextInstructionsViewer';

interface KnowledgeSource {
  id: string;
  type: 'link' | 'document' | 'text' | 'graph';
  title: string;
  content: string; // URL, file name, or text content
  description?: string;
  addedDate: Date;
}

interface Process {
  id: string;
  name: string;
  description: string;
  sources: KnowledgeSource[];
}

interface Domain {
  id: string;
  name: string;
  description: string;
  processes: Process[];
}

interface KnowledgeBaseProps {
  theme: 'dark' | 'light';
}

// Mock initial data
const initialDomains: Domain[] = [
  {
    id: 'securities',
    name: 'Securities Settlements',
    description: 'Knowledge base for securities settlement operations',
    processes: [
      {
        id: 'dvp-settlement',
        name: 'DVP Settlement Process',
        description: 'Delivery versus Payment settlement workflows',
        sources: [
          {
            id: '1',
            type: 'link',
            title: 'DTCC Settlement Guidelines',
            content: 'https://dtcc.com/settlement-guidelines',
            description: 'Official DTCC documentation for DVP settlement',
            addedDate: new Date('2024-01-15')
          },
          {
            id: '2',
            type: 'document',
            title: 'Internal Settlement SOP',
            content: 'settlement_procedures_v2.pdf',
            description: 'Internal standard operating procedures',
            addedDate: new Date('2024-01-20')
          }
        ]
      },
      {
        id: 'fails-management',
        name: 'Fails Management',
        description: 'Managing settlement failures and exceptions',
        sources: []
      }
    ]
  },
  {
    id: 'corporate-actions',
    name: 'Corporate Actions',
    description: 'Knowledge base for corporate action processing',
    processes: [
      {
        id: 'dividend-processing',
        name: 'Dividend Processing',
        description: 'Cash and stock dividend workflows',
        sources: [
          {
            id: '3',
            type: 'text',
            title: 'Dividend Processing Steps',
            content: '1. Receive announcement from issuer\n2. Validate corporate action details\n3. Calculate entitlements\n4. Process payments\n5. Reconcile accounts',
            description: 'Step-by-step dividend processing guide',
            addedDate: new Date('2024-02-01')
          },
          {
            id: '4',
            type: 'graph',
            title: 'Corporate Actions Knowledge Graph',
            content: 'https://graph.company.com/api/v1/corporate-actions',
            description: 'Graph database with corporate actions relationships',
            addedDate: new Date('2024-02-10')
          }
        ]
      }
    ]
  },
  {
    id: 'fx',
    name: 'Foreign Exchange (FX)',
    description: 'Knowledge base for FX operations',
    processes: [
      {
        id: 'fx-settlement',
        name: 'FX Settlement',
        description: 'Foreign exchange trade settlement',
        sources: []
      }
    ]
  }
];

export function KnowledgeBase({ theme }: KnowledgeBaseProps) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(domains[0]);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingSource, setViewingSource] = useState<KnowledgeSource | null>(null);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'text':
        return <MessageSquare className="w-4 h-4" />;
      case 'graph':
        return <Network className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'link':
        return theme === 'dark' ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-100';
      case 'document':
        return theme === 'dark' ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100';
      case 'text':
        return theme === 'dark' ? 'text-purple-400 bg-purple-900/30' : 'text-purple-600 bg-purple-100';
      case 'graph':
        return theme === 'dark' ? 'text-orange-400 bg-orange-900/30' : 'text-orange-600 bg-orange-100';
      default:
        return theme === 'dark' ? 'text-gray-400 bg-gray-900/30' : 'text-gray-600 bg-gray-100';
    }
  };

  const handleSourceClick = (source: KnowledgeSource) => {
    if (source.type === 'graph') {
      // Show knowledge graph viewer
      setViewingSource(source);
    } else if (source.type === 'text') {
      // Show text instructions viewer
      setViewingSource(source);
    } else if (source.type === 'link') {
      window.open(source.content, '_blank');
    } else if (source.type === 'document') {
      // In a real app, this would download or open the document
      alert(`Opening document: ${source.content}`);
    }
  };

  const handleAddProcess = (processName: string, description: string) => {
    if (!selectedDomain) return;

    const newProcess: Process = {
      id: `process-${Date.now()}`,
      name: processName,
      description,
      sources: []
    };

    setDomains(domains.map(domain => 
      domain.id === selectedDomain.id
        ? { ...domain, processes: [...domain.processes, newProcess] }
        : domain
    ));

    setShowAddProcessModal(false);
  };

  const handleAddSource = (sourceData: Omit<KnowledgeSource, 'id' | 'addedDate'>) => {
    if (!selectedProcess || !selectedDomain) return;

    const newSource: KnowledgeSource = {
      ...sourceData,
      id: `source-${Date.now()}`,
      addedDate: new Date()
    };

    setDomains(domains.map(domain =>
      domain.id === selectedDomain.id
        ? {
            ...domain,
            processes: domain.processes.map(process =>
              process.id === selectedProcess.id
                ? { ...process, sources: [...process.sources, newSource] }
                : process
            )
          }
        : domain
    ));

    setShowAddSourceModal(false);
  };

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Knowledge Base
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Curate and manage domain knowledge for AI agents
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Domains */}
          <div className={`col-span-3 rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Domains
              </h3>
            </div>

            <div className="space-y-2">
              {domains.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => {
                    setSelectedDomain(domain);
                    setSelectedProcess(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDomain?.id === domain.id
                      ? theme === 'dark'
                        ? 'bg-cyan-900/30 border-cyan-600 border'
                        : 'bg-cyan-50 border-cyan-500 border'
                      : theme === 'dark'
                      ? 'hover:bg-gray-800 border border-transparent'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Folder className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      selectedDomain?.id === domain.id
                        ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm mb-1 ${
                        selectedDomain?.id === domain.id
                          ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                          : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {domain.name}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {domain.processes.length} processes
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle Column - Processes */}
          <div className={`col-span-4 rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedDomain ? `${selectedDomain.name} - Processes` : 'Processes'}
              </h3>
              {selectedDomain && (
                <button
                  onClick={() => setShowAddProcessModal(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  }`}
                  title="Add Process"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedDomain ? (
              <div className="space-y-2">
                {selectedDomain.processes.map(process => (
                  <button
                    key={process.id}
                    onClick={() => setSelectedProcess(process)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProcess?.id === process.id
                        ? theme === 'dark'
                          ? 'bg-cyan-900/30 border-cyan-600 border'
                          : 'bg-cyan-50 border-cyan-500 border'
                        : theme === 'dark'
                        ? 'hover:bg-gray-800 border border-transparent'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        selectedProcess?.id === process.id
                          ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm mb-1 ${
                          selectedProcess?.id === process.id
                            ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                            : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {process.name}
                        </div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {process.description}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                          {process.sources.length} sources
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Select a domain to view processes
              </div>
            )}
          </div>

          {/* Right Column - Knowledge Sources */}
          <div className={`col-span-5 rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedProcess ? `${selectedProcess.name} - Sources` : 'Knowledge Sources'}
              </h3>
              {selectedProcess && (
                <button
                  onClick={() => setShowAddSourceModal(true)}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                    theme === 'dark'
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Source
                </button>
              )}
            </div>

            {selectedProcess ? (
              selectedProcess.sources.length > 0 ? (
                <div className="space-y-3">
                  {selectedProcess.sources.map(source => (
                    <div
                      key={source.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        theme === 'dark'
                          ? 'border-gray-800 hover:border-gray-700 hover:bg-gray-800'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSourceClick(source)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getSourceColor(source.type)}`}>
                          {getSourceIcon(source.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className={`font-medium text-sm mb-1 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {source.title}
                              </div>
                              <div className={`text-xs mb-2 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                {source.description}
                              </div>
                            </div>
                            <ExternalLink className={`w-4 h-4 flex-shrink-0 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                          }`}>
                            <span className={`px-2 py-0.5 rounded ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                              {source.type.toUpperCase()}
                            </span>
                            <span>•</span>
                            <span>Added {source.addedDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No sources added yet</p>
                  <p className="text-xs mt-1">Click "Add Source" to get started</p>
                </div>
              )
            ) : (
              <div className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Select a process to view knowledge sources
              </div>
            )}
          </div>
        </div>

        {/* Add Source Modal */}
        {showAddSourceModal && (
          <AddSourceModal
            theme={theme}
            onClose={() => setShowAddSourceModal(false)}
            onAdd={handleAddSource}
          />
        )}

        {/* Add Process Modal */}
        {showAddProcessModal && (
          <AddProcessModal
            theme={theme}
            onClose={() => setShowAddProcessModal(false)}
            onAdd={handleAddProcess}
          />
        )}

        {/* View Source Modal */}
        {viewingSource && (
          <ViewTextSourceModal
            theme={theme}
            source={viewingSource}
            onClose={() => setViewingSource(null)}
          />
        )}
      </div>
    </div>
  );
}

// Add Source Modal Component
function AddSourceModal({ 
  theme, 
  onClose, 
  onAdd 
}: { 
  theme: 'dark' | 'light'; 
  onClose: () => void; 
  onAdd: (source: Omit<KnowledgeSource, 'id' | 'addedDate'>) => void;
}) {
  const [sourceType, setSourceType] = useState<'link' | 'document' | 'text' | 'graph'>('link');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onAdd({ type: sourceType, title, content, description });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Add Knowledge Source
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Source Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Source Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'link' as const, icon: LinkIcon, label: 'Documentation Link' },
                { type: 'document' as const, icon: Upload, label: 'Upload Document' },
                { type: 'text' as const, icon: MessageSquare, label: 'Text Instructions' },
                { type: 'graph' as const, icon: Network, label: 'Knowledge Graph' }
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSourceType(type)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    sourceType === type
                      ? theme === 'dark'
                        ? 'border-cyan-600 bg-cyan-900/30'
                        : 'border-cyan-500 bg-cyan-50'
                      : theme === 'dark'
                      ? 'border-gray-800 hover:border-gray-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-1 ${
                    sourceType === type
                      ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`} />
                  <div className={`text-xs ${
                    sourceType === type
                      ? theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          {/* Content */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {sourceType === 'link' ? 'URL *' : 
               sourceType === 'document' ? 'File Name *' :
               sourceType === 'text' ? 'Instructions *' :
               'API Endpoint *'}
            </label>
            {sourceType === 'text' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter detailed instructions or knowledge content"
                required
                rows={6}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              />
            ) : (
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  sourceType === 'link' ? 'https://...' :
                  sourceType === 'document' ? 'document.pdf' :
                  'https://api.graph.com/endpoint'
                }
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional: Add a description for this source"
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              Add Source
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Process Modal Component
function AddProcessModal({ 
  theme, 
  onClose, 
  onAdd 
}: { 
  theme: 'dark' | 'light'; 
  onClose: () => void; 
  onAdd: (name: string, description: string) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onAdd(name, description);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-lg w-full ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Add Process
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Process Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter process name"
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this process"
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              Add Process
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View Source Modal Component
function ViewTextSourceModal({ 
  theme, 
  source, 
  onClose 
}: { 
  theme: 'dark' | 'light'; 
  source: KnowledgeSource; 
  onClose: () => void; 
}) {
  // If it's a graph, show the Knowledge Graph Viewer
  if (source.type === 'graph') {
    return (
      <KnowledgeGraphViewer
        theme={theme}
        onClose={onClose}
        graphTitle={source.title}
        graphEndpoint={source.content}
      />
    );
  }
  
  // If it's text, show the Text Instructions Viewer
  if (source.type === 'text') {
    return (
      <TextInstructionsViewer
        theme={theme}
        onClose={onClose}
        title={source.title}
        content={source.content}
        description={source.description}
      />
    );
  }
  
  return null;
}