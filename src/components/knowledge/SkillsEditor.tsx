import { useState } from 'react';
import { Save, X, Edit2, Eye, Code, FileText, AlertCircle, Check } from 'lucide-react';

interface SkillsEditorProps {
  skillContent: string;
  skillTitle: string;
  theme: 'dark' | 'light';
  onSave: (content: string) => void;
  onClose: () => void;
  title?: string;
  content?: string;
  description?: string;
}

export function SkillsEditor({ 
  skillContent, 
  skillTitle, 
  theme, 
  onSave, 
  onClose,
  title,
  content,
  description
}: SkillsEditorProps) {
  const [editContent, setEditContent] = useState(skillContent || content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave(editContent);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setIsEditing(false);
  };

  const parseSkillsMarkdown = (md: string) => {
    const sections: { [key: string]: string } = {};
    const lines = md.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('# ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.replace('# ', '').trim();
        currentContent = [];
      } else if (line.startsWith('## ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.replace('## ', '').trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    });

    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  };

  const sections = parseSkillsMarkdown(editContent);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div>
            <h3 className={`text-xl font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {skillTitle}
            </h3>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Agent Skills Specification (agentskills.io)
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className={`inline-flex rounded-lg p-1 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm ${
                  viewMode === 'preview'
                    ? 'bg-cyan-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm ${
                  viewMode === 'raw'
                    ? 'bg-cyan-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditContent(skillContent);
                    setIsEditing(false);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'raw' || isEditing ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                readOnly={!isEditing}
                className={`w-full h-[calc(90vh-200px)] px-4 py-3 rounded-lg border font-mono text-sm ${
                  theme === 'dark'
                    ? 'bg-black border-gray-800 text-gray-300'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  !isEditing ? 'cursor-default' : ''
                }`}
              />
            </div>
          ) : (
            <div className={`prose max-w-none ${
              theme === 'dark' ? 'prose-invert' : ''
            }`}>
              {/* Render parsed sections */}
              {Object.entries(sections).map(([title, content]) => (
                <div key={title} className="mb-6">
                  <h2 className={`text-lg font-semibold mb-3 pb-2 border-b ${
                    theme === 'dark' 
                      ? 'text-cyan-400 border-gray-800' 
                      : 'text-cyan-600 border-gray-200'
                  }`}>
                    {title}
                  </h2>
                  <div className={`whitespace-pre-wrap ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className={`px-6 py-3 border-t flex items-center gap-2 text-xs ${
          theme === 'dark' 
            ? 'border-gray-800 bg-gray-950 text-gray-500' 
            : 'border-gray-200 bg-gray-50 text-gray-600'
        }`}>
          <FileText className="w-3 h-3" />
          <span>Skills format follows agentskills.io specification</span>
          <span>•</span>
          <span>Markdown-based skill documentation</span>
        </div>
      </div>
    </div>
  );
}