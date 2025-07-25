import React, { useState } from 'react';
import { VariableGroup } from '../../types/template';
import { Variable, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface VariablePanelProps {
  variableGroups: VariableGroup[];
  onVariableInsert: (variableName: string) => void;
}

export const VariablePanel: React.FC<VariablePanelProps> = ({
  variableGroups,
  onVariableInsert
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Statické proměnné']));
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const handleVariableClick = (variableName: string) => {
    onVariableInsert(variableName);
    setCopiedVariable(variableName);
    setTimeout(() => setCopiedVariable(null), 1000);
  };

  if (variableGroups.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl">
            <Variable className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Dostupné proměnné</h3>
            <p className="text-gray-600 text-sm">Vyberte budovu pro zobrazení proměnných</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Variable className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Nejprve vyberte budovu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-3 rounded-xl">
          <Variable className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Dostupné proměnné</h3>
          <p className="text-gray-600 text-sm">Klikněte na proměnnou pro vložení</p>
        </div>
      </div>

      <div className="space-y-4">
        {variableGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.name);
          
          return (
            <div key={group.name} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleGroup(group.name)}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 flex items-center justify-between transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="font-semibold text-gray-900">{group.name}</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {group.variables.length}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 bg-white">
                  <div className="grid gap-2">
                    {group.variables.map((variable) => (
                      <button
                        key={variable.name}
                        onClick={() => handleVariableClick(variable.name)}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-200 group"
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                              {`{{${variable.name}}}`}
                            </code>
                            {variable.type === 'static' && (
                              <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
                                Statická
                              </span>
                            )}
                          </div>
                          {variable.description && (
                            <div className="text-sm text-purple-600 mt-1">{variable.description}</div>
                          )}
                          <div className="text-xs text-purple-500 mt-1 font-medium truncate">
                            Hodnota: {variable.value}
                          </div>
                        </div>
                        <div className="ml-3">
                          {copiedVariable === variable.name ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-2">💡 Tip:</h4>
        <p className="text-sm text-purple-700">
          Klikněte na libovolnou proměnnou pro automatické vložení do editoru šablony. 
          Proměnné se automaticky nahradí skutečnými hodnotami při generování e-mailu.
        </p>
      </div>
    </div>
  );
};