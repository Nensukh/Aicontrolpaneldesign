import { useState, useRef } from 'react';
import { Plus, Trash2, Save, Upload, File, Mail, FileText, X, Play, CheckCircle2 } from 'lucide-react';

interface GroundTruthEntry {
  id: string;
  input: string;
  inputType: 'text' | 'document' | 'email';
  fileName?: string;
  expectedOutput: string;
  category: string;
  tags: string[];
  createdAt: string;
}

interface GroundTruthCaptureProps {
  selectedAgent: string | null;
  agentName?: string;
  theme: 'dark' | 'light';
}

export function GroundTruthCapture({ selectedAgent, agentName, theme }: GroundTruthCaptureProps) {
  const [entries, setEntries] = useState<GroundTruthEntry[]>([
    {
      id: 'gt-001',
      input: 'How do I reset my password?',
      inputType: 'text',
      expectedOutput: 'To reset your password, please click on "Forgot Password" on the login page and follow the instructions sent to your email.',
      category: 'Account Management',
      tags: ['password', 'authentication'],
      createdAt: '2026-01-13T10:00:00Z',
    },
    {
      id: 'gt-002',
      input: 'What are your business hours?',
      inputType: 'text',
      expectedOutput: 'Our business hours are Monday to Friday, 9 AM to 6 PM EST. We are closed on weekends and major holidays.',
      category: 'General Information',
      tags: ['hours', 'availability'],
      createdAt: '2026-01-13T09:30:00Z',
    },
    {
      id: 'gt-003',
      input: 'Dear Support Team,\\n\\nI am experiencing issues with my account login. Every time I try to access my dashboard, I receive an error message saying "Invalid credentials" even though I\'m certain my password is correct.\\n\\nCould you please help me resolve this issue?\\n\\nBest regards,\\nJohn Doe',
      inputType: 'email',
      fileName: 'support_email_001.txt',
      expectedOutput: 'Thank you for contacting us. I understand you\'re having trouble logging in. Let me help you with that:\\n\\n1. First, try clearing your browser cache and cookies\\n2. If that doesn\'t work, use the "Forgot Password" feature to reset your password\\n3. Make sure Caps Lock is off when entering your credentials\\n\\nIf the issue persists, please let me know and I\'ll escalate this to our technical team for further investigation.',
      category: 'Technical Support',
      tags: ['login', 'authentication', 'email'],
      createdAt: '2026-01-12T14:20:00Z',
    },
    {
      id: 'gt-004',
      input: 'I need to update my billing information. How can I do that?',
      inputType: 'text',
      expectedOutput: 'You can update your billing information by going to Settings > Billing & Payments. From there, you can add, edit, or remove payment methods.',
      category: 'Billing',
      tags: ['billing', 'payment', 'settings'],
      createdAt: '2026-01-11T16:45:00Z',
    },
    {
      id: 'gt-005',
      input: 'Can I export my data to a CSV file?',
      inputType: 'text',
      expectedOutput: 'Yes! You can export your data by navigating to the Data Export section in your dashboard. Select the date range and format (CSV, JSON, or Excel), then click Export.',
      category: 'Data Management',
      tags: ['export', 'data', 'csv'],
      createdAt: '2026-01-10T11:20:00Z',
    },
  ]);

  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const [newEntry, setNewEntry] = useState({
    input: '',
    inputType: 'text' as 'text' | 'document' | 'email',
    fileName: '',
    expectedOutput: '',
    category: '',
    tags: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddEntry = () => {
    if (newEntry.input.trim() && newEntry.expectedOutput.trim()) {
      const entry: GroundTruthEntry = {
        id: `gt-${Date.now()}`,
        input: newEntry.input,
        inputType: newEntry.inputType,
        fileName: newEntry.fileName || undefined,
        expectedOutput: newEntry.expectedOutput,
        category: newEntry.category || 'Uncategorized',
        tags: newEntry.tags.split(',').map((t) => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };
      setEntries([entry, ...entries]);
      setNewEntry({ input: '', inputType: 'text', fileName: '', expectedOutput: '', category: '', tags: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
    setSelectedEntries(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setNewEntry({
          ...newEntry,
          input: text,
          fileName: file.name,
          inputType: file.name.includes('.eml') || file.name.includes('email') ? 'email' : 'document',
        });
      };
      reader.readAsText(file);
    }
  };

  const handleBulkImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      // Mock CSV import functionality
      alert('CSV import functionality would parse the file and add multiple entries');
    }
  };

  const toggleEntrySelection = (id: string) => {
    setSelectedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedEntries.size === entries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(entries.map(e => e.id)));
    }
  };

  const handleRunEvaluation = () => {
    if (selectedEntries.size === 0) {
      alert('Please select at least one ground truth entry to run evaluation');
      return;
    }
    
    const selectedCount = selectedEntries.size;
    const selectedIds = Array.from(selectedEntries).join(', ');
    
    alert(`Running evaluation for ${selectedCount} ground truth ${selectedCount === 1 ? 'entry' : 'entries'} on ${agentName}.\n\nSelected IDs: ${selectedIds}\n\nThis will initiate the evaluation process and results will be available in the Evaluation tab.`);
  };

  const getInputTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">Ground Truth - {agentName}</h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Define expected inputs and outputs for agent evaluation
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedEntries.size > 0 && (
              <button
                onClick={handleRunEvaluation}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Play className="w-4 h-4" />
                Run Evaluation ({selectedEntries.size})
              </button>
            )}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Ground Truth
              </button>
            )}
          </div>
        </div>

        {/* Add New Entry Form (Conditional) */}
        {showAddForm && (
          <div className={`rounded-lg p-4 mb-4 border-2 ${
            theme === 'dark' 
              ? 'bg-gray-900 border-cyan-800' 
              : 'bg-white border-cyan-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold">Add New Ground Truth Entry</h4>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewEntry({ input: '', inputType: 'text', fileName: '', expectedOutput: '', category: '', tags: '' });
                }}
                className={theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Input Type Selector */}
            <div className="mb-3">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Input Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setNewEntry({ ...newEntry, inputType: 'text', fileName: '' })}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    newEntry.inputType === 'text'
                      ? 'bg-cyan-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Text
                  </div>
                </button>
                <button
                  onClick={() => setNewEntry({ ...newEntry, inputType: 'document' })}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    newEntry.inputType === 'document'
                      ? 'bg-cyan-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4" />
                    Document
                  </div>
                </button>
                <button
                  onClick={() => setNewEntry({ ...newEntry, inputType: 'email' })}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    newEntry.inputType === 'email'
                      ? 'bg-cyan-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* File Upload for Document/Email */}
              {(newEntry.inputType === 'document' || newEntry.inputType === 'email') && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Upload {newEntry.inputType === 'email' ? 'Email' : 'Document'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.eml,.doc,.docx,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </button>
                    {newEntry.fileName && (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
                      }`}>
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {newEntry.fileName}
                        </span>
                        <button
                          onClick={() => setNewEntry({ ...newEntry, input: '', fileName: '' })}
                          className={theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Input / Query {newEntry.inputType !== 'text' && '(or paste content)'}
                </label>
                <textarea
                  value={newEntry.input}
                  onChange={(e) => setNewEntry({ ...newEntry, input: e.target.value })}
                  placeholder={
                    newEntry.inputType === 'email'
                      ? 'Paste email content or upload a file'
                      : newEntry.inputType === 'document'
                      ? 'Paste document content or upload a file'
                      : 'Enter the user input or query'
                  }
                  rows={newEntry.inputType !== 'text' ? 5 : 2}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm ${
                    theme === 'dark'
                      ? 'bg-black text-gray-100 placeholder-gray-600'
                      : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Expected Output
                </label>
                <textarea
                  value={newEntry.expectedOutput}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, expectedOutput: e.target.value })
                  }
                  placeholder="Enter the expected response from the agent"
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-black text-gray-100 placeholder-gray-600'
                      : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                    placeholder="e.g., Account Management"
                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      theme === 'dark'
                        ? 'bg-black text-gray-100 placeholder-gray-600'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                    placeholder="e.g., password, authentication"
                    className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      theme === 'dark'
                        ? 'bg-black text-gray-100 placeholder-gray-600'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddEntry}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Entry
                </button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleBulkImport}
                  className="hidden"
                  id="bulk-import"
                />
                <label
                  htmlFor="bulk-import"
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Import CSV
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div className={`rounded-lg p-4 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h4 className="text-base font-semibold">Ground Truth Entries ({entries.length})</h4>
              {entries.length > 0 && (
                <button
                  onClick={toggleSelectAll}
                  className={`text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'text-cyan-400 hover:text-cyan-300'
                      : 'text-cyan-600 hover:text-cyan-700'
                  }`}
                >
                  {selectedEntries.size === entries.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            <button className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}>
              <Save className="w-4 h-4" />
              Export All
            </button>
          </div>

          {selectedEntries.size > 0 && (
            <div className={`mb-4 p-3 rounded-lg border-l-4 ${
              theme === 'dark'
                ? 'bg-green-900/20 border-green-600'
                : 'bg-green-50 border-green-400'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-5 h-5 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-700'
                }`}>
                  {selectedEntries.size} {selectedEntries.size === 1 ? 'entry' : 'entries'} selected for evaluation
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-lg p-4 border transition-all ${
                  selectedEntries.has(entry.id)
                    ? theme === 'dark'
                      ? 'bg-cyan-900/20 border-cyan-700'
                      : 'bg-cyan-50 border-cyan-300'
                    : theme === 'dark'
                    ? 'bg-black border-gray-800'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selectedEntries.has(entry.id)}
                      onChange={() => toggleEntrySelection(entry.id)}
                      className={`w-5 h-5 rounded cursor-pointer focus:ring-offset-gray-900 ${
                        theme === 'dark'
                          ? 'bg-gray-900 border-gray-700 text-cyan-600 focus:ring-cyan-600'
                          : 'bg-white border-gray-300 text-cyan-500 focus:ring-cyan-500'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-1 text-xs rounded font-medium flex items-center gap-1 ${
                            theme === 'dark'
                              ? 'bg-purple-900/50 text-purple-400'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {getInputTypeIcon(entry.inputType)}
                            {entry.inputType}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            theme === 'dark'
                              ? 'bg-cyan-900/50 text-cyan-400'
                              : 'bg-cyan-100 text-cyan-700'
                          }`}>
                            {entry.category}
                          </span>
                          {entry.fileName && (
                            <span className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                              theme === 'dark'
                                ? 'bg-gray-800 text-gray-400'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              <FileText className="w-3 h-3" />
                              {entry.fileName}
                            </span>
                          )}
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 text-xs rounded ${
                                theme === 'dark'
                                  ? 'bg-gray-800 text-gray-400'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className={`text-xs mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Input
                        </div>
                        <div className={`p-3 rounded whitespace-pre-wrap font-mono text-sm max-h-48 overflow-y-auto ${
                          theme === 'dark'
                            ? 'text-gray-300 bg-gray-900'
                            : 'text-gray-700 bg-white'
                        }`}>
                          {entry.input}
                        </div>
                      </div>
                      <div>
                        <div className={`text-xs mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Expected Output
                        </div>
                        <div className={`p-3 rounded whitespace-pre-wrap ${
                          theme === 'dark'
                            ? 'text-gray-300 bg-gray-900'
                            : 'text-gray-700 bg-white'
                        }`}>
                          {entry.expectedOutput}
                        </div>
                      </div>
                    </div>

                    <div className={`mt-2 text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      Added on {new Date(entry.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
