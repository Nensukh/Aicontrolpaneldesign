// Trace View Component - Display raw trace JSON
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface TraceViewProps {
  traceData: any;
  theme: 'dark' | 'light';
}

export function TraceView({ traceData, theme }: TraceViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(traceData, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg p-6 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Raw Trace Data
        </h3>
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy JSON</span>
            </>
          )}
        </button>
      </div>

      <div className={`rounded-lg p-4 overflow-auto ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`} style={{ maxHeight: 'calc(100vh - 280px)' }}>
        <pre className={`text-xs font-mono ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {JSON.stringify(traceData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
