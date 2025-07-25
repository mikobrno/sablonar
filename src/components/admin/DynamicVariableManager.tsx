import React, { useState, useEffect } from 'react';
import { Variable, Plus, Edit2, Trash2, Search, Save, X, AlertCircle, Check } from 'lucide-react';
import { supabaseService } from '../../services/SupabaseService';
import type { Database } from '../../lib/supabase';

type StaticVariable = Database['public']['Tables']['static_variables']['Row'];

interface FormData {
  name: string;
  value: string;
  description: string;
}

interface ValidationErrors {
  name?: string;
  value?: string;
}

export const DynamicVariableManager: React.FC = () => {
  const [variables, setVariables] = useState<StaticVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVariable, setEditingVariable] = useState<StaticVariable | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    value: '',
    description: ''
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadVariables();
  }, []);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const loadVariables = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getStaticVariables();
      setVariables(data);
    } catch (error) {
      console.error('Chyba při načítání proměnných:', error);
      setErrorMessage('Nepodařilo se načíst proměnné');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.name.trim()) {
      errors.name = 'Název proměnné je povinný';
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(data.name)) {
      errors.name = 'Název může obsahovat pouze písmena, číslice a podtržítka, musí začínat písmenem nebo podtržítkem';
    } else if (!editingVariable && variables.some(v => v.name === data.name)) {
      errors.name = 'Proměnná s tímto názvem již existuje';
    }

    if (!data.value.trim()) {
      errors.value = 'Hodnota proměnné je povinná';
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingVariable) {
        await supabaseService.updateStaticVariable(editingVariable.id, {
          name: formData.name,
          value: formData.value,
          description: formData.description || null
        });
        setSuccessMessage('Proměnná byla úspěšně aktualizována');
      } else {
        await supabaseService.createStaticVariable({
          name: formData.name,
          value: formData.value,
          description: formData.description || null
        });
        setSuccessMessage('Proměnná byla úspěšně vytvořena');
      }
      
      await loadVariables();
      handleCloseModal();
    } catch (error) {
      console.error('Chyba při ukládání proměnné:', error);
      setErrorMessage('Nepodařilo se uložit proměnnou');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (variable: StaticVariable) => {
    setEditingVariable(variable);
    setFormData({
      name: variable.name,
      value: variable.value,
      description: variable.description || ''
    });
    setValidationErrors({});
    setShowAddModal(true);
  };

  const handleDelete = async (variable: StaticVariable) => {
    if (!confirm(`Opravdu chcete smazat proměnnou "${variable.name}"?`)) {
      return;
    }

    try {
      await supabaseService.deleteStaticVariable(variable.id);
      setSuccessMessage('Proměnná byla úspěšně smazána');
      await loadVariables();
    } catch (error) {
      console.error('Chyba při mazání proměnné:', error);
      setErrorMessage('Nepodařilo se smazat proměnnou');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingVariable(null);
    setFormData({ name: '', value: '', description: '' });
    setValidationErrors({});
  };

  const filteredVariables = variables.filter(variable =>
    variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (variable.description && variable.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl shadow-lg border border-purple-200">
      {/* Header */}
      <div className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Variable className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Správa dynamických proměnných</h3>
              <p className="text-purple-100 text-sm">Spravujte globální proměnné pro e-mailové šablony</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Přidat proměnnou
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            type="text"
            placeholder="Hledat proměnné..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/30 text-white placeholder-white/60"
          />
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-green-800 text-sm">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-red-800 text-sm">{errorMessage}</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6 bg-white/50">
        {filteredVariables.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Variable className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'Žádné výsledky' : 'Žádné proměnné'}
            </h4>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `Nenalezeny žádné proměnné odpovídající "${searchTerm}"`
                : 'Zatím nejsou definovány žádné dynamické proměnné'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 font-medium shadow-sm transition-all duration-200"
              >
                Vytvořit první proměnnou
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredVariables.map(variable => (
              <div key={variable.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg">🔧</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {variable.name}
                        </h4>
                        {variable.description && (
                          <p className="text-sm text-gray-600 mt-1">{variable.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600 font-semibold font-mono text-sm">{`{{${variable.name}}}`}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <div className="flex-1">
                          <div className="text-gray-900 font-medium break-words">
                            {variable.value.length > 200 
                              ? `${variable.value.substring(0, 200)}...` 
                              : variable.value
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 flex gap-4">
                      <span>Vytvořeno: {new Date(variable.created_at).toLocaleDateString('cs-CZ')}</span>
                      <span>Upraveno: {new Date(variable.updated_at).toLocaleDateString('cs-CZ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(variable)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Upravit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(variable)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                      title="Smazat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-xl">
              <h3 className="text-xl font-bold">
                {editingVariable ? 'Upravit proměnnou' : 'Přidat novou proměnnou'}
              </h3>
              <p className="text-purple-100 text-sm mt-1">
                {editingVariable ? 'Upravte existující dynamickou proměnnou' : 'Vytvořte novou globální proměnnou'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Název proměnné <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (validationErrors.name) {
                      setValidationErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="např. nazev_firmy"
                  disabled={!!editingVariable}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 bg-white shadow-sm ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Název bude použit jako {`{{${formData.name || 'nazev_promenne'}}}`} v šablonách
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hodnota <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.value}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, value: e.target.value }));
                    if (validationErrors.value) {
                      setValidationErrors(prev => ({ ...prev, value: undefined }));
                    }
                  }}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm ${
                    validationErrors.value ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Hodnota proměnné"
                />
                {validationErrors.value && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.value}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Popis
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Volitelný popis proměnné"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-purple-900 mb-2">💡 Tipy:</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Název proměnné může obsahovat pouze písmena, číslice a podtržítka</li>
                  <li>• Proměnná bude dostupná ve všech e-mailových šablonách</li>
                  <li>• Použijte popisný název pro snadnou identifikaci</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || !formData.name || !formData.value}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Ukládám...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingVariable ? 'Aktualizovat' : 'Vytvořit'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};