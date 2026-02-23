import { useState } from 'react';
import { GroundTruthCapture } from './GroundTruthCapture';
import { EvaluationDashboard } from './EvaluationDashboard';
import { FlaskConical, Database, Target } from 'lucide-react';

interface AgentEvaluationExperimentsProps {
  theme: 'dark' | 'light';
}

type ExperimentTab = 'ground-truth' | 'evaluation';

// Mock agents data - in a real app, this would come from your data store
const mockAgents = [
  { id: 'agent-001', name: 'Customer Support Agent', status: 'active' },
  { id: 'agent-002', name: 'Sales Assistant', status: 'active' },
  { id: 'agent-003', name: 'Technical Support Bot', status: 'active' },
  { id: 'agent-004', name: 'HR Assistant', status: 'active' },
  { id: 'agent-005', name: 'Financial Advisor', status: 'testing' },
];

export function AgentEvaluationExperiments({ theme }: AgentEvaluationExperimentsProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(mockAgents[0].id);
  const [activeTab, setActiveTab] = useState<ExperimentTab>('ground-truth');

  const selectedAgentData = mockAgents.find(a => a.id === selectedAgent);

  const tabs = [
    { id: 'ground-truth' as ExperimentTab, label: 'Ground Truth', icon: Database },
    { id: 'evaluation' as ExperimentTab, label: 'Evaluation', icon: Target },
  ];

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
                  ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'
              }`}>
                <FlaskConical className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Agent Evaluation (Experiments)
                </h1>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Manage ground truth data and run evaluations for agent testing
                </p>
              </div>
            </div>
          </div>

          {/* Agent Selector */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Select Agent
            </label>
            <select
              value={selectedAgent || ''}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className={`w-full max-w-md px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800 text-gray-100 focus:ring-purple-600 focus:border-purple-600'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
              }`}
            >
              <option value="">Select an agent...</option>
              {mockAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.status})
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          {selectedAgent && (
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-all ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-black text-purple-400 border-b-2 border-purple-400'
                          : 'bg-gray-50 text-purple-600 border-b-2 border-purple-600'
                        : theme === 'dark'
                        ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        {!selectedAgent ? (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className={`rounded-lg p-12 text-center border ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : 'bg-white border-gray-200'
            }`}>
              <FlaskConical className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                No Agent Selected
              </h3>
              <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                Please select an agent to manage ground truth and run evaluations
              </p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'ground-truth' && (
              <GroundTruthCapture 
                selectedAgent={selectedAgent}
                agentName={selectedAgentData?.name}
                theme={theme}
              />
            )}
            {activeTab === 'evaluation' && (
              <EvaluationDashboard 
                selectedAgent={selectedAgent}
                agentName={selectedAgentData?.name}
                theme={theme}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}