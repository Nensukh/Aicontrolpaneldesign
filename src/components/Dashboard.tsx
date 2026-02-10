import { useState, useEffect } from 'react';
import {
  Inbox,
  Clock,
  Activity,
  Pause,
  Bot,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  XCircle,
  Users,
  BarChart3,
} from 'lucide-react';
import { mockWorkItems, type WorkItem, type QueueSelection } from './Worklist';
import { QueueFilter } from './QueueFilter';

interface DashboardProps {
  theme: 'dark' | 'light';
  onNavigateToWorklist: (filter?: {
    status?: string;
    priority?: string;
  }) => void;
}

export function Dashboard({ theme, onNavigateToWorklist }: DashboardProps) {
  const [selectedQueues, setSelectedQueues] = useState<QueueSelection[]>([]);

  // Filter work items based on selected queues
  const filteredWorkItems = selectedQueues.length === 0 
    ? mockWorkItems 
    : mockWorkItems.filter((item) => {
        return selectedQueues.some((selection) => {
          if (selection.type === 'businessFunction') {
            return item.businessFunction === selection.businessFunction;
          } else if (selection.type === 'team') {
            return item.businessFunction === selection.businessFunction && item.team === selection.team;
          } else {
            return (
              item.businessFunction === selection.businessFunction &&
              item.team === selection.team &&
              item.queue === selection.queue
            );
          }
        });
      });

  const workItems = filteredWorkItems;
  const totalItems = workItems.length;
  const pendingItems = workItems.filter(item => item.status === 'pending');
  const processingItems = workItems.filter(item => item.status === 'processing');
  const waitingApprovalItems = workItems.filter(item => item.status === 'waiting-approval');
  const completedItems = workItems.filter(item => item.status === 'completed');
  const failedItems = workItems.filter(item => item.status === 'failed');
  const highPriorityItems = workItems.filter(item => item.priority === 'high');

  // Get active agents
  const activeAgents = Array.from(new Set(
    workItems
      .filter(item => item.assignedAgent && item.status === 'processing')
      .map(item => item.assignedAgent)
  ));

  // Get human-in-the-loop items
  const humanLoopItems = workItems.filter(
    item => item.status === 'waiting-approval' || item.awaitingInput
  );

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Team Dashboard</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Monitor work items, agent activity, and team performance
            </p>
          </div>
        </div>

        {/* Queue Filter */}
        <QueueFilter 
          theme={theme}
          selectedQueues={selectedQueues}
          setSelectedQueues={setSelectedQueues}
          allowMultiple={true}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Key Metrics */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            Work Items Overview
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {/* Total Items Card */}
            <button
              onClick={() => onNavigateToWorklist()}
              className={`rounded-lg p-4 text-left transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Items
                </span>
                <Inbox className={`w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>
              <div className="text-3xl font-bold mb-1">{totalItems}</div>
              <div className="flex items-center gap-1">
                <ChevronRight className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  View all items
                </span>
              </div>
            </button>

            {/* Pending Items Card */}
            <button
              onClick={() => onNavigateToWorklist({ status: 'pending' })}
              className={`rounded-lg p-4 text-left transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'bg-gray-900 hover:bg-gray-800 border border-yellow-900/30' 
                  : 'bg-white hover:bg-yellow-50 border border-yellow-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Pending
                </span>
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{pendingItems.length}</div>
              <div className="flex items-center gap-1">
                <ChevronRight className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Awaiting processing
                </span>
              </div>
            </button>

            {/* Processing Items Card */}
            <button
              onClick={() => onNavigateToWorklist({ status: 'processing' })}
              className={`rounded-lg p-4 text-left transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'bg-gray-900 hover:bg-gray-800 border border-blue-900/30' 
                  : 'bg-white hover:bg-blue-50 border border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Processing
                </span>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{processingItems.length}</div>
              <div className="flex items-center gap-1">
                <ChevronRight className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Agents working
                </span>
              </div>
            </button>

            {/* Needs Approval Card */}
            <button
              onClick={() => onNavigateToWorklist({ status: 'waiting-approval' })}
              className={`rounded-lg p-4 text-left transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'bg-gray-900 hover:bg-gray-800 border border-orange-900/30' 
                  : 'bg-white hover:bg-orange-50 border border-orange-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Needs Approval
                </span>
                <Pause className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{waitingApprovalItems.length}</div>
              <div className="flex items-center gap-1">
                <ChevronRight className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Human in the loop
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Completed Items Card */}
            <button
              onClick={() => onNavigateToWorklist({ status: 'completed' })}
              className={`rounded-lg p-4 text-left transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'bg-gray-900 hover:bg-gray-800 border border-green-900/30' 
                  : 'bg-white hover:bg-green-50 border border-green-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Completed
                </span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{completedItems.length}</div>
              <div className="flex items-center gap-1">
                <ChevronRight className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Successfully resolved
                </span>
              </div>
            </button>

            {/* Failed Items Card */}
            <button
              onClick={() => onNavigateToWorklist({ status: 'failed' })}
              className={`rounded-lg p-4 text-left transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'bg-gray-900 hover:bg-gray-800 border border-red-900/30' 
                  : 'bg-white hover:bg-red-50 border border-red-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Failed
                </span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{failedItems.length}</div>
              <div className="flex items-center gap-1">
                <ChevronRight className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Requires attention
                </span>
              </div>
            </button>

            {/* High Priority Card */}
            <button
              onClick={() => onNavigateToWorklist({ priority: 'high' })}
              className={`rounded-lg p-4 text-left transition-all hover:scale-105 ${
                theme === 'dark' 
                  ? 'bg-gray-900 hover:bg-gray-800 border border-purple-900/30' 
                  : 'bg-white hover:bg-purple-50 border border-purple-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  High Priority
                </span>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{highPriorityItems.length}</div>
              <div className="flex items-center gap-1">
                <ChevronRight className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Urgent items
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Active Agents */}
          <div className={`rounded-lg p-5 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-gray-800' 
              : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Bot className={`w-5 h-5 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
              }`} />
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Active Agents
              </h3>
              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'dark' 
                  ? 'bg-cyan-900/30 text-cyan-400' 
                  : 'bg-cyan-100 text-cyan-700'
              }`}>
                {activeAgents.length} Active
              </span>
            </div>
            <div className="space-y-3">
              {activeAgents.length > 0 ? (
                activeAgents.map((agent, idx) => {
                  const agentItems = workItems.filter(
                    item => item.assignedAgent === agent && item.status === 'processing'
                  );
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === 'dark' 
                          ? 'bg-gray-800 hover:bg-gray-750' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div>
                          <div className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            {agent}
                          </div>
                          <div className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Processing tasks
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 text-blue-400' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {agentItems.length} {agentItems.length === 1 ? 'task' : 'tasks'}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <Bot className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <div className="text-sm">No active agents</div>
                </div>
              )}
            </div>
          </div>

          {/* Human-in-the-Loop Items */}
          <div className={`rounded-lg p-5 ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-gray-800' 
              : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className={`w-5 h-5 ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`} />
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Human-in-the-Loop
              </h3>
              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                theme === 'dark' 
                  ? 'bg-orange-900/30 text-orange-400' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {humanLoopItems.length} Waiting
              </span>
            </div>
            <div className="space-y-3">
              {humanLoopItems.length > 0 ? (
                humanLoopItems.slice(0, 5).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onNavigateToWorklist({ status: 'waiting-approval' })}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-750' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                        theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {item.subject}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {item.assignedAgent || 'Unassigned'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </button>
                ))
              ) : (
                <div className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <div className="text-sm">No items waiting for approval</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}