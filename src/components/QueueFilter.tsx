import { useState } from 'react';
import { Filter, ChevronDown, X, Building2, Users, Inbox } from 'lucide-react';
import { queueHierarchies, type QueueSelection } from './Worklist';

interface QueueFilterProps {
  theme: 'dark' | 'light';
  selectedQueues: QueueSelection[];
  setSelectedQueues: (queues: QueueSelection[]) => void;
  allowMultiple?: boolean;
}

export function QueueFilter({ 
  theme, 
  selectedQueues, 
  setSelectedQueues,
  allowMultiple = true 
}: QueueFilterProps) {
  const [showQueueSelector, setShowQueueSelector] = useState(false);

  // Group queues by business function and team
  const groupedQueues = queueHierarchies.reduce((acc, item) => {
    if (!acc[item.businessFunction]) {
      acc[item.businessFunction] = {};
    }
    if (!acc[item.businessFunction][item.team]) {
      acc[item.businessFunction][item.team] = [];
    }
    acc[item.businessFunction][item.team].push(item.queue);
    return acc;
  }, {} as { [bf: string]: { [team: string]: string[] } });

  // Helper functions for queue selection
  const isBusinessFunctionSelected = (bf: string) => {
    return selectedQueues.some(
      (sel) => sel.type === 'businessFunction' && sel.businessFunction === bf
    );
  };

  const isTeamSelected = (bf: string, team: string) => {
    return selectedQueues.some(
      (sel) =>
        (sel.type === 'team' && sel.businessFunction === bf && sel.team === team) ||
        (sel.type === 'businessFunction' && sel.businessFunction === bf)
    );
  };

  const isQueueSelected = (bf: string, team: string, queue: string) => {
    return selectedQueues.some(
      (sel) =>
        (sel.type === 'queue' && sel.businessFunction === bf && sel.team === team && sel.queue === queue) ||
        (sel.type === 'team' && sel.businessFunction === bf && sel.team === team) ||
        (sel.type === 'businessFunction' && sel.businessFunction === bf)
    );
  };

  const toggleBusinessFunction = (bf: string) => {
    if (isBusinessFunctionSelected(bf)) {
      if (allowMultiple) {
        setSelectedQueues(
          selectedQueues.filter(
            (sel) => !(sel.type === 'businessFunction' && sel.businessFunction === bf)
          )
        );
      }
    } else {
      if (allowMultiple) {
        setSelectedQueues([...selectedQueues, { type: 'businessFunction', businessFunction: bf }]);
      } else {
        setSelectedQueues([{ type: 'businessFunction', businessFunction: bf }]);
      }
    }
  };

  const toggleTeam = (bf: string, team: string) => {
    if (isTeamSelected(bf, team) && !isBusinessFunctionSelected(bf)) {
      if (allowMultiple) {
        setSelectedQueues(
          selectedQueues.filter(
            (sel) => !(sel.type === 'team' && sel.businessFunction === bf && sel.team === team)
          )
        );
      }
    } else {
      if (allowMultiple) {
        setSelectedQueues([...selectedQueues, { type: 'team', businessFunction: bf, team }]);
      } else {
        setSelectedQueues([{ type: 'team', businessFunction: bf, team }]);
      }
    }
  };

  const toggleQueue = (bf: string, team: string, queue: string) => {
    if (isQueueSelected(bf, team, queue)) {
      if (allowMultiple) {
        setSelectedQueues(
          selectedQueues.filter(
            (sel) =>
              !(
                sel.type === 'queue' &&
                sel.businessFunction === bf &&
                sel.team === team &&
                sel.queue === queue
              )
          )
        );
      }
    } else {
      if (allowMultiple) {
        setSelectedQueues([...selectedQueues, { type: 'queue', businessFunction: bf, team, queue }]);
      } else {
        setSelectedQueues([{ type: 'queue', businessFunction: bf, team, queue }]);
      }
    }
  };

  const getSelectedQueuesSummary = () => {
    if (selectedQueues.length === 0) return 'All Queues';
    if (selectedQueues.length === 1) {
      const sel = selectedQueues[0];
      if (sel.type === 'businessFunction') return `All ${sel.businessFunction}`;
      if (sel.type === 'team') return `${sel.businessFunction} - ${sel.team}`;
      return `${sel.businessFunction} - ${sel.team} - ${sel.queue}`;
    }
    return `${selectedQueues.length} selections`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowQueueSelector(!showQueueSelector)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>{getSelectedQueuesSummary()}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {/* Queue Selector Dropdown */}
      {showQueueSelector && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowQueueSelector(false)}
          />
          {/* Dropdown */}
          <div className={`fixed top-32 left-4 bottom-4 w-96 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className={`p-3 border-b ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h3 className="font-semibold text-sm">Select Queues</h3>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                Select at Business Function, Team, or Queue level
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {Object.entries(groupedQueues).map(([bf, teams]) => (
                <div key={bf} className="mb-4">
                  {/* Business Function Level */}
                  <button
                    onClick={() => toggleBusinessFunction(bf)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                      isBusinessFunctionSelected(bf)
                        ? theme === 'dark'
                          ? 'bg-cyan-900/50 text-cyan-400'
                          : 'bg-cyan-100 text-cyan-700'
                        : theme === 'dark'
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isBusinessFunctionSelected(bf)}
                      onChange={() => {}}
                      className="rounded pointer-events-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">{bf}</span>
                  </button>

                  {/* Team Level */}
                  {Object.entries(teams).map(([team, queues]) => (
                    <div key={team} className="ml-4 mt-1">
                      <button
                        onClick={() => toggleTeam(bf, team)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                          isTeamSelected(bf, team)
                            ? theme === 'dark'
                              ? 'bg-cyan-900/50 text-cyan-400'
                              : 'bg-cyan-100 text-cyan-700'
                            : theme === 'dark'
                            ? 'hover:bg-gray-800 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isTeamSelected(bf, team)}
                          onChange={() => {}}
                          className="rounded pointer-events-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Users className="w-3 h-3" />
                        <span className="text-sm font-medium">{team}</span>
                      </button>

                      {/* Queue Level */}
                      <div className="ml-4 space-y-1 mt-1">
                        {queues.map((queue) => (
                          <button
                            key={queue}
                            onClick={() => toggleQueue(bf, team, queue)}
                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-2 ${
                              isQueueSelected(bf, team, queue)
                                ? theme === 'dark'
                                  ? 'bg-cyan-900/50 text-cyan-400'
                                  : 'bg-cyan-100 text-cyan-700'
                                : theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-300'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isQueueSelected(bf, team, queue)}
                              onChange={() => {}}
                              className="rounded pointer-events-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Inbox className="w-3 h-3" />
                            {queue}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
