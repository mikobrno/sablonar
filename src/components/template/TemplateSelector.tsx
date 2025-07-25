import React from 'react';
import type { Database } from '../../lib/supabase'; // Upravte cestu, pokud je potřeba
import { FileText, ChevronDown, Tag, Calendar } from 'lucide-react';

// Předpokládáme, že typ Template je definován takto
type Template = Database['public']['Tables']['email_templates']['Row'];

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  const getCategoryColor = (category: string | null) => {
    const colors = {
      'upozorneni': 'bg-red-100 text-red-800 border-red-200',
      'vyuctovani': 'bg-green-100 text-green-800 border-green-200',
      'pozvanka': 'bg-blue-100 text-blue-800 border-blue-200',
      'pripominky': 'bg-orange-100 text-orange-800 border-orange-200',
      'oznameni': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    if (category && colors[category as keyof typeof colors]) {
      return colors[category as keyof typeof colors];
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case 'upozorneni': return '⚠️';
      case 'vyuctovani': return '💰';
      case 'pozvanka': return '📅';
      case 'pripominky': return '📝';
      case 'oznameni': return '📢';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Výběr šablony</h3>
          <p className="text-gray-600 text-sm">Vyberte e-mailovou šablonu</p>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedTemplate?.id || ''}
          onChange={(e) => {
            const template = templates.find(t => t.id === e.target.value);
            if (template) onTemplateSelect(template);
          }}
          className="w-full px-4 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 appearance-none transition-all duration-200 text-gray-900 font-medium"
        >
          <option value="">📧 Vyberte šablonu...</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {getCategoryIcon(template.category)} {template.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getCategoryIcon(selectedTemplate.category)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h4 className="font-bold text-green-900">{selectedTemplate.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(selectedTemplate.category)}`}>
                  {selectedTemplate.category || 'bez kategorie'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-green-700 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Předmět:
                  </span>
                  <div className="text-green-600 bg-green-100 p-2 rounded-lg mt-1 font-medium">
                    {selectedTemplate.subject}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Vytvořeno:
                    </span>
                    {/* OPRAVENO: Přidána kontrola, zda 'created_at' existuje, než se ho pokusíme formátovat. */}
                    <div className="text-green-600">
                      {selectedTemplate.created_at
                        ? new Date(selectedTemplate.created_at).toLocaleDateString('cs-CZ')
                        : 'Neznámé datum'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Proměnné:</span>
                    {/* VYLEPŠENO: Přidána kontrola pro případ, že by 'usedVariables' bylo prázdné (null). */}
                    <div className="text-green-600">{(selectedTemplate.used_variables || []).length} použitých</div>
                  </div>
                </div>

                {/* VYLEPŠENO: Stejná kontrola jako výše, aby aplikace nespadla. */}
                {(selectedTemplate.used_variables || []).length > 0 && (
                  <div>
                    <span className="font-medium text-green-700 block mb-2">Použité proměnné:</span>
                    <div className="flex flex-wrap gap-2">
                      {(selectedTemplate.used_variables || []).slice(0, 6).map(variable => (
                        <span key={variable} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-mono font-semibold">
                          {`{{${variable}}}`}
                        </span>
                      ))}
                      {(selectedTemplate.used_variables || []).length > 6 && (
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                          +{(selectedTemplate.used_variables || []).length - 6} dalších
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};