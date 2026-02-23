import { useState } from 'react';
import { X, Search, Folder, BookOpen, ChevronRight, LinkIcon, FileText, MessageSquare, Network, ExternalLink } from 'lucide-react';
import { KnowledgeGraphViewer } from './knowledge/KnowledgeGraphViewer';
import { TextInstructionsViewer } from './knowledge/TextInstructionsViewer';

interface KnowledgeSource {
  id: string;
  type: 'link' | 'document' | 'text' | 'graph';
  title: string;
  content: string;
  description?: string;
  addedDate: Date;
  processName: string;
  domainName: string;
}

interface KnowledgeBrowserProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  onSelect: (sources: KnowledgeSource[]) => void;
  selectedKnowledge?: KnowledgeSource[];
}

// Mock knowledge base data (same structure as in KnowledgeBase component)
const mockKnowledgeBase = [
  {
    domain: 'Securities Settlements',
    processes: [
      {
        name: 'DVP Settlement Process',
        sources: [
          {
            id: '1',
            type: 'link' as const,
            title: 'DTCC Settlement Guidelines',
            content: 'https://dtcc.com/settlement-guidelines',
            description: 'Official DTCC documentation for DVP settlement',
            addedDate: new Date('2024-01-15'),
            processName: 'DVP Settlement Process',
            domainName: 'Securities Settlements'
          },
          {
            id: '2',
            type: 'document' as const,
            title: 'Internal Settlement SOP',
            content: 'settlement_procedures_v2.pdf',
            description: 'Internal standard operating procedures',
            addedDate: new Date('2024-01-20'),
            processName: 'DVP Settlement Process',
            domainName: 'Securities Settlements'
          }
        ]
      }
    ]
  },
  {
    domain: 'Corporate Actions',
    processes: [
      {
        name: 'Dividend Processing',
        sources: [
          {
            id: '3',
            type: 'text' as const,
            title: 'Dividend Processing Steps',
            content: 'Complete operational procedures for dividend processing',
            description: 'Step-by-step dividend processing guide',
            addedDate: new Date('2024-02-01'),
            processName: 'Dividend Processing',
            domainName: 'Corporate Actions'
          },
          {
            id: '4',
            type: 'graph' as const,
            title: 'Corporate Actions Knowledge Graph',
            content: 'https://graph.company.com/api/v1/corporate-actions',
            description: 'Graph database with corporate actions relationships',
            addedDate: new Date('2024-02-10'),
            processName: 'Dividend Processing',
            domainName: 'Corporate Actions'
          }
        ]
      }
    ]
  },
  {
    domain: 'Foreign Exchange (FX)',
    processes: [
      {
        name: 'FX Settlement',
        sources: [
          {
            id: '5',
            type: 'link' as const,
            title: 'CLS Settlement Documentation',
            content: 'https://cls-group.com/settlement',
            description: 'CLS settlement system documentation',
            addedDate: new Date('2024-01-25'),
            processName: 'FX Settlement',
            domainName: 'Foreign Exchange (FX)'
          }
        ]
      }
    ]
  }
];

export function KnowledgeBrowser({ theme, onClose, onSelect, selectedKnowledge = [] }: KnowledgeBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDomains, setExpandedDomains] = useState<string[]>(['Corporate Actions']);
  const [selectedSources, setSelectedSources] = useState<KnowledgeSource[]>(selectedKnowledge);
  const [viewingSource, setViewingSource] = useState<KnowledgeSource | null>(null);

  const toggleDomain = (domain: string) => {
    setExpandedDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const toggleSourceSelection = (source: KnowledgeSource) => {
    setSelectedSources(prev => {
      const isSelected = prev.some(s => s.id === source.id);
      if (isSelected) {
        return prev.filter(s => s.id !== source.id);
      } else {
        return [...prev, source];
      }
    });
  };

  const isSourceSelected = (sourceId: string) => {
    return selectedSources.some(s => s.id === sourceId);
  };

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

  const handleViewSource = (source: KnowledgeSource, e: React.MouseEvent) => {
    e.stopPropagation();
    if (source.type === 'graph' || source.type === 'text') {
      setViewingSource(source);
    } else if (source.type === 'link') {
      window.open(source.content, '_blank');
    }
  };

  const handleSave = () => {
    onSelect(selectedSources);
    onClose();
  };

  // Filter knowledge base based on search
  const filteredKnowledgeBase = searchQuery
    ? mockKnowledgeBase.map(domain => ({
        ...domain,
        processes: domain.processes.map(process => ({
          ...process,
          sources: process.sources.filter(source =>
            source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            source.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })).filter(process => process.sources.length > 0)
      })).filter(domain => domain.processes.length > 0)
    : mockKnowledgeBase;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg w-full max-w-5xl h-[85vh] flex flex-col ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div>
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Browse Knowledge Base
              </h3>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Select knowledge sources to add to this agent
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className={`px-6 py-4 border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search knowledge sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredKnowledgeBase.length > 0 ? (
              <div className="space-y-4">
                {filteredKnowledgeBase.map((domain, domainIdx) => (
                  <div key={domainIdx} className={`rounded-lg border ${
                    theme === 'dark' ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'
                  }`}>
                    {/* Domain Header */}
                    <button
                      onClick={() => toggleDomain(domain.domain)}
                      className={`w-full p-4 flex items-center justify-between transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Folder className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        }`} />
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {domain.domain}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {domain.processes.reduce((acc, p) => acc + p.sources.length, 0)} sources
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        expandedDomains.includes(domain.domain) ? 'rotate-90' : ''
                      } ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    </button>

                    {/* Processes and Sources */}
                    {expandedDomains.includes(domain.domain) && (
                      <div className={`border-t ${
                        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                      }`}>
                        {domain.processes.map((process, processIdx) => (
                          <div key={processIdx} className={`p-4 ${
                            processIdx > 0 ? `border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}` : ''
                          }`}>
                            {/* Process Name */}
                            <div className="flex items-center gap-2 mb-3">
                              <BookOpen className={`w-4 h-4 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                              <span className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {process.name}
                              </span>
                            </div>

                            {/* Sources */}
                            <div className="space-y-2 ml-6">
                              {process.sources.map((source) => (
                                <div
                                  key={source.id}
                                  onClick={() => toggleSourceSelection(source)}
                                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSourceSelected(source.id)
                                      ? theme === 'dark'
                                        ? 'border-cyan-600 bg-cyan-900/20'
                                        : 'border-cyan-500 bg-cyan-50'
                                      : theme === 'dark'
                                      ? 'border-gray-800 hover:border-gray-700 bg-gray-900'
                                      : 'border-gray-200 hover:border-gray-300 bg-white'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {/* Checkbox */}
                                    <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                      isSourceSelected(source.id)
                                        ? 'bg-cyan-600 border-cyan-600'
                                        : theme === 'dark'
                                        ? 'border-gray-600'
                                        : 'border-gray-300'
                                    }`}>
                                      {isSourceSelected(source.id) && (
                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      )}
                                    </div>

                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg ${getSourceColor(source.type)}`}>
                                      {getSourceIcon(source.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
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

                                    {/* View Button */}
                                    {(source.type === 'graph' || source.type === 'text' || source.type === 'link') && (
                                      <button
                                        onClick={(e) => handleViewSource(source, e)}
                                        className={`p-2 rounded transition-colors ${
                                          theme === 'dark'
                                            ? 'hover:bg-gray-800 text-gray-500'
                                            : 'hover:bg-gray-100 text-gray-400'
                                        }`}
                                        title="View source"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No knowledge sources found</p>
                <p className="text-xs mt-1">Try adjusting your search query</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex items-center justify-between ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex items-center gap-3">
              <button
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
                onClick={handleSave}
                disabled={selectedSources.length === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSources.length === 0
                    ? theme === 'dark'
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                Add to Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Viewers */}
      {viewingSource && viewingSource.type === 'graph' && (
        <KnowledgeGraphViewer
          theme={theme}
          onClose={() => setViewingSource(null)}
          graphTitle={viewingSource.title}
          graphEndpoint={viewingSource.content}
        />
      )}

      {viewingSource && viewingSource.type === 'text' && (
        <TextInstructionsViewer
          theme={theme}
          onClose={() => setViewingSource(null)}
          title={viewingSource.title}
          content={viewingSource.content}
          description={viewingSource.description}
        />
      )}
    </>
  );
}
