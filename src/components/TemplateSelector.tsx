import React from 'react';
import { EmailTemplate } from '../types';
import { Mail, ChevronDown } from 'lucide-react';

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  selectedTemplate: EmailTemplate | null;
  onTemplateSelect: (template: EmailTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Mail className="w-4 h-4" />
        Vyberte šablonu e-mailu
      </label>
      <div className="relative">
        <select
          value={selectedTemplate?.template_id || ''}
          onChange={(e) => {
            const template = templates.find(t => t.template_id === e.target.value);
            if (template) onTemplateSelect(template);
          }}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
        >
          <option value="">Vyberte šablonu...</option>
          {templates.map((template) => (
            <option key={template.template_id} value={template.template_id}>
              {template.template_name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {selectedTemplate && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm">
            <div><span className="font-medium">ID šablony:</span> {selectedTemplate.template_id}</div>
            <div className="mt-1 text-gray-600">Náhled se automaticky aktualizuje při výběru nemovitosti.</div>
          </div>
        </div>
      )}
    </div>
  );
};