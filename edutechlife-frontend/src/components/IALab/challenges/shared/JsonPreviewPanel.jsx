import React, { useState } from 'react';
import { Icon } from '../../../../utils/iconMapping.jsx';

const JsonPreviewPanel = ({ functionName, description, parameters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const schema = {
    name: functionName || 'yourFunction',
    description: description || 'Describe what this function does',
    parameters: {
      type: 'object',
      properties: Object.fromEntries(
        parameters.map(p => [
          p.name || `param${parameters.indexOf(p) + 1}`,
          {
            type: p.type || 'string',
            description: `The ${p.name || 'parameter'} value`,
          }
        ])
      ),
      required: parameters.filter(p => p.required).map(p => p.name || ''),
    },
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        aria-expanded={isOpen}
        aria-controls="json-preview-content"
      >
        <div className="flex items-center gap-2">
          <Icon name="fa-code" className="text-corporate" />
          <span className="text-sm font-medium text-slate-700">JSON Preview</span>
        </div>
        <Icon name={isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} className="text-slate-400" />
      </button>
      {isOpen && (
        <div className="p-4 bg-navy-900 overflow-x-auto" id="json-preview-content">
          <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(schema, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JsonPreviewPanel;
