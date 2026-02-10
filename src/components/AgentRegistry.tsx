import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

interface AgentRegistryProps {
  onClose?: () => void;
}

export function AgentRegistry({ onClose }: AgentRegistryProps = {}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: 'Azure AI Foundry',
    model: 'GPT-4',
    systemPrompt: '',
    parentAgent: '',
    dataRetention: '90',
    complianceLevel: '',
    accessLevel: 'restricted',
    tools: [] as string[],
  });

  const [newTool, setNewTool] = useState('');

  const platforms = ['Azure AI Foundry', 'OpenAI', 'Anthropic', 'Google AI', 'AWS Bedrock'];
  const models = ['GPT-4', 'GPT-4-Turbo', 'GPT-3.5-Turbo', 'Claude-3', 'Gemini-Pro'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registering agent:', formData);
    // Mock registration
    alert('Agent registered successfully!');
    if (onClose) {
      onClose();
    }
  };

  const addTool = () => {
    if (newTool.trim()) {
      setFormData({ ...formData, tools: [...formData.tools, newTool.trim()] });
      setNewTool('');
    }
  };

  const removeTool = (index: number) => {
    setFormData({
      ...formData,
      tools: formData.tools.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-black">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Customer Support Agent"
                  className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the agent's purpose and capabilities"
                  rows={3}
                  className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platform *
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-600"
                  >
                    {platforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model *
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-600"
                  >
                    {models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">System Prompt</h3>
            <textarea
              required
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              placeholder="Enter the system prompt that defines the agent's behavior and instructions"
              rows={6}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-cyan-600"
            />
          </div>

          {/* Tools & Capabilities */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Tools & Capabilities</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                  placeholder="Add a tool or capability"
                  className="flex-1 px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-600"
                />
                <button
                  type="button"
                  onClick={addTool}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {formData.tools.length > 0 && (
                <div className="space-y-2">
                  {formData.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg"
                    >
                      <span className="text-gray-300">{tool}</span>
                      <button
                        type="button"
                        onClick={() => removeTool(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hierarchy */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Agent Hierarchy</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Parent Agent (Optional)
              </label>
              <select
                value={formData.parentAgent}
                onChange={(e) => setFormData({ ...formData, parentAgent: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-600"
              >
                <option value="">None - This is a root agent</option>
                <option value="agent-001">Customer Support Agent</option>
                <option value="agent-004">Sales Assistant</option>
              </select>
            </div>
          </div>

          {/* Governance & Compliance */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Governance & Compliance</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Data Retention (days) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.dataRetention}
                    onChange={(e) =>
                      setFormData({ ...formData, dataRetention: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Access Level *
                  </label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, accessLevel: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="restricted">Restricted</option>
                    <option value="confidential">Confidential</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Compliance Standards
                </label>
                <input
                  type="text"
                  value={formData.complianceLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, complianceLevel: e.target.value })
                  }
                  placeholder="e.g., SOC 2, GDPR, HIPAA"
                  className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-600"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              Register Agent
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}