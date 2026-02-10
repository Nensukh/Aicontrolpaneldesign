import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Users, Target, TrendingUp, Database, Activity, ClipboardList, Bot, Eye, ChevronLeft, ChevronRight, LayoutDashboard, BarChart3 } from 'lucide-react';
import { AgentInventory } from './components/AgentInventory';
import { GroundTruthCapture } from './components/GroundTruthCapture';
import { BenchmarkSetting } from './components/BenchmarkSetting';
import { ProductionMonitoring } from './components/ProductionMonitoring';
import { MemoryManagement } from './components/MemoryManagement';
import { ObservabilityDashboard } from './components/ObservabilityDashboard';
import { EvaluationDashboard } from './components/EvaluationDashboard';
import { Worklist } from './components/Worklist';
import { Dashboard } from './components/Dashboard';
import { AgentPerformance } from './components/AgentPerformance';

type View = 
  | 'dashboard'
  | 'inventory'
  | 'worklist'
  | 'monitoring' 
  | 'memory' 
  | 'observability'
  | 'performance';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [worklistFilter, setWorklistFilter] = useState<{
    status?: string;
    priority?: string;
  } | undefined>(undefined);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('agents-hq-theme');
    return (saved as 'dark' | 'light') || 'dark';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('agents-hq-sidebar-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('agents-hq-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('agents-hq-sidebar-collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigateToWorklist = (filter?: { status?: string; priority?: string }) => {
    setWorklistFilter(filter);
    setCurrentView('worklist');
  };

  const navigation = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'worklist' as View, label: 'Worklist', icon: ClipboardList },
    { id: 'inventory' as View, label: 'Agents', icon: Users },
    { id: 'monitoring' as View, label: 'Agent Evaluation (Live)', icon: Activity },
    { id: 'memory' as View, label: 'Memory Management', icon: Database },
    { id: 'observability' as View, label: 'Observability', icon: Eye },
    { id: 'performance' as View, label: 'Agent Performance', icon: BarChart3 },
  ];

  return (
    <div className={`min-h-screen flex ${
      theme === 'dark' 
        ? 'bg-black text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} border-r flex flex-col transition-all duration-300 relative ${
        theme === 'dark' 
          ? 'bg-gray-950 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`${sidebarCollapsed ? 'p-4' : 'p-6'} border-b transition-all duration-300 relative ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-between' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-lg">Agents HQ</h1>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>AI Control Center</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className={`p-1.5 rounded transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {sidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                className={`p-1.5 rounded transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="text-sm font-medium flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all ${
              theme === 'dark'
                ? 'bg-gray-900 hover:bg-gray-800 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {currentView === 'inventory' && (
          <AgentInventory onSelectAgent={setSelectedAgent} theme={theme} />
        )}
        {currentView === 'worklist' && (
          <Worklist theme={theme} filter={worklistFilter} />
        )}
        {currentView === 'monitoring' && (
          <ProductionMonitoring selectedAgent={selectedAgent} theme={theme} />
        )}
        {currentView === 'memory' && (
          <MemoryManagement selectedAgent={selectedAgent} theme={theme} />
        )}
        {currentView === 'observability' && (
          <ObservabilityDashboard selectedAgent={selectedAgent} theme={theme} />
        )}
        {currentView === 'dashboard' && (
          <Dashboard theme={theme} onNavigateToWorklist={handleNavigateToWorklist} />
        )}
        {currentView === 'performance' && (
          <AgentPerformance selectedAgent={selectedAgent} theme={theme} />
        )}
      </div>
    </div>
  );
}