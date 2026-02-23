import { useState } from 'react';
import { BookOpen, Plus, LinkIcon, FileText, MessageSquare, Network, ExternalLink, Trash2 } from 'lucide-react';
import { KnowledgeBrowser } from './KnowledgeBrowser';
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

interface AgentKnowledgeTabProps {
  agentId: string;
  agentName: string;
  theme: 'dark' | 'light';
}

// Mock initial knowledge for agents
const mockAgentKnowledge: { [agentId: string]: KnowledgeSource[] } = {
  'agent-001': [
    {
      id: '1',
      type: 'link',
      title: 'DTCC Settlement Guidelines',
      content: 'https://dtcc.com/settlement-guidelines',
      description: 'Official DTCC documentation for DVP settlement',
      addedDate: new Date('2024-01-15'),
      processName: 'DVP Settlement Process',
      domainName: 'Securities Settlements'
    },
    {
      id: '3',
      type: 'text',
      title: 'Dividend Processing Steps',
      content: 'Complete operational procedures for dividend processing',
      description: 'Step-by-step dividend processing guide',
      addedDate: new Date('2024-02-01'),
      processName: 'Dividend Processing',
      domainName: 'Corporate Actions'
    },
    {
      id: '4',
      type: 'graph',
      title: 'Corporate Actions Knowledge Graph',
      content: 'https://graph.company.com/api/v1/corporate-actions',
      description: 'Graph database with corporate actions relationships',
      addedDate: new Date('2024-02-10'),
      processName: 'Dividend Processing',
      domainName: 'Corporate Actions'
    }
  ]
};

export function AgentKnowledgeTab({ agentId, agentName, theme }: AgentKnowledgeTabProps) {
  const [agentKnowledge, setAgentKnowledge] = useState<KnowledgeSource[]>(
    mockAgentKnowledge[agentId] || []
  );
  const [showBrowser, setShowBrowser] = useState(false);
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

  const handleAddKnowledge = (sources: KnowledgeSource[]) => {
    // Add new sources, avoiding duplicates
    const newSources = sources.filter(
      source => !agentKnowledge.some(existing => existing.id === source.id)
    );
    setAgentKnowledge([...agentKnowledge, ...newSources]);
  };

  const handleRemoveKnowledge = (sourceId: string) => {
    setAgentKnowledge(agentKnowledge.filter(s => s.id !== sourceId));
  };

  const handleViewSource = (source: KnowledgeSource) => {
    if (source.type === 'graph' || source.type === 'text') {
      setViewingSource(source);
    } else if (source.type === 'link') {
      window.open(source.content, '_blank');
    } else if (source.type === 'document') {
      // In a real app, this would download or open the document
      alert(`Opening document: ${source.content}`);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className={`mb-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-900/50 border border-gray-800' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <BookOpen className={`w-5 h-5 mt-0.5 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`} />
            <div>
              <h4 className={`font-semibold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Knowledge References
              </h4>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Knowledge sources added here will be provided to {agentName} during inference to enhance its responses with domain-specific information.
              </p>
            </div>
          </div>
        </div>

        {/* Knowledge List */}
        <div className={`rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Linked Knowledge ({agentKnowledge.length})
            </h3>
            <button
              onClick={() => setShowBrowser(true)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Knowledge
            </button>
          </div>

          {agentKnowledge.length > 0 ? (
            <div className="space-y-3">
              {agentKnowledge.map((source) => (
                <div
                  key={source.id}
                  className={`p-4 rounded-lg border transition-all ${
                    theme === 'dark'
                      ? 'border-gray-800 bg-gray-950 hover:border-gray-700'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getSourceColor(source.type)}`}>
                      {getSourceIcon(source.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {source.title}
                          </h4>
                          <p className={`text-sm mb-2 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {source.description}
                          </p>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {source.type.toUpperCase()}
                        </span>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                          {source.domainName} → {source.processName}
                        </span>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                          Added {source.addedDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleViewSource(source)}
                        className={`p-2 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-gray-800 text-gray-500 hover:text-gray-300'
                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                        }`}
                        title="View source"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveKnowledge(source.id)}
                        className={`p-2 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-red-900/30 text-red-500 hover:text-red-400'
                            : 'hover:bg-red-100 text-red-500 hover:text-red-600'
                        }`}
                        title="Remove knowledge"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-1">No knowledge sources added yet</p>
              <p className="text-sm">Click "Add Knowledge" to browse and select from the Knowledge Base</p>
            </div>
          )}
        </div>

        {/* Inference Info */}
        <div className={`mt-6 p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
        }`}>
          <h4 className={`font-medium mb-2 text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            How Knowledge Works
          </h4>
          <ul className={`space-y-1 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <li>• Knowledge sources are retrieved and provided to the agent's context during inference</li>
            <li>• Links and documents are fetched in real-time when needed</li>
            <li>• Knowledge graphs are queried to provide relevant entity relationships</li>
            <li>• Text instructions are directly injected into the system prompt</li>
          </ul>
        </div>
      </div>

      {/* Knowledge Browser Modal */}
      {showBrowser && (
        <KnowledgeBrowser
          theme={theme}
          onClose={() => setShowBrowser(false)}
          onSelect={handleAddKnowledge}
          selectedKnowledge={agentKnowledge}
        />
      )}

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
