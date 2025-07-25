import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, Variable, Sparkles, Save } from 'lucide-react';
import { supabaseService } from '../../services/SupabaseService';
import type { Database } from '../../lib/supabase';

type StaticVariable = Database['public']['Tables']['static_variables']['Row'];

export const VariableManager: React.FC = () => {
  const [variables, setVariables] = useState<StaticVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVariable, setEditingVariable] = useState<StaticVariable | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    description: ''
  });

  React.useEffect(() => {
    loadVariables();
  }, []);

  const loadVariables = async () => {
    try {
      const data = await supabaseService.getStaticVariables();
      setVariables(data);
    } catch (error) {
      console.error('Chyba při načítání proměnných:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingVariable) {
        await supabaseService.updateStaticVariable(editingVariable.id, {
          name: formData.name,
          value: formData.value,
          description: formData.description || null
        });
      } else {
        await supabaseService.createStaticVariable({
          name: formData.name,
          value: formData.value,
          description: formData.description || null
        });
      }
      await loadVariables();
      setEditingVariable(null);
      setShowAddModal(false);
      setFormData({ name: '', value: '', description: '' });
    } catch (error) {
      console.error('Chyba při ukládání proměnné:', error);
    }
  };

  const handleEdit = (variable: StaticVariable) => {
    setEditingVariable(variable);
    setFormData({
      name: variable.name,
      value: variable.value,
      description: variable.description || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Opravdu chcete smazat tuto proměnnou?')) {
      try {
        await supabaseService.deleteStaticVariable(id);
        await loadVariables();
      } catch (error) {
        console.error('Chyba při mazání proměnné:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const formatValue = (value: string) => {
    if (value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return value;
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl shadow-lg border border-purple-200">
      <div className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Variable className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Statické proměnné</h3>
              <p className="text-purple-100 text-sm">Správa globálních konstant pro šablony</p>
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
      </div>

      <div className="p-6 bg-white/50">
        {variables.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Žádné proměnné</h4>
            <p className="text-gray-600 mb-6">Zatím nejsou definovány žádné statické proměnné</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 font-medium shadow-sm transition-all duration-200"
            >
              Vytvořit první proměnnou
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {variables.map(variable => (
              <div key={variable.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg">📝</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {variable.name}
                        </h4>
                        {variable.description && (
                          <p className="text-sm text-gray-600 mt-1">{variable.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 font-mono text-sm">
                      <span className="text-purple-600 font-semibold">{`{{${variable.name}}}`}</span>
                      <span className="text-gray-400 mx-2">→</span>
                      <span className="text-gray-900 font-medium">{formatValue(variable.value)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-3 flex gap-4">
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
                      onClick={() => handleDelete(variable.id)}
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

      {/* Modal pro přidání proměnné */}
      {showAddModal && (
        <VariableModal
          variable={editingVariable}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onClose={() => {
            setShowAddModal(false);
            setEditingVariable(null);
            setFormData({ name: '', value: '', description: '' });
          }}
        />
      )}
    </div>
  );
};

interface VariableModalProps {
  variable?: StaticVariable | null;
  formData: { name: string; value: string; description: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; value: string; description: string }>>;
  onSave: () => void;
  onClose: () => void;
}

const VariableModal: React.FC<VariableModalProps> = ({ 
  variable, 
  formData, 
  setFormData, 
  onSave, 
  onClose 
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-xl">
          <h3 className="text-xl font-bold">
            {variable ? 'Upravit proměnnou' : 'Přidat novou proměnnou'}
          </h3>
          <p className="text-purple-100 text-sm mt-1">
            {variable ? 'Upravte existující statickou proměnnou' : 'Vytvořte novou globální konstantu'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Název proměnné <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="např. nazev_firmy"
              required
              disabled={!!variable}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hodnota <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
              placeholder="Hodnota proměnné"
            />
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

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 font-medium shadow-sm transition-all duration-200"
              disabled={!formData.name || !formData.value}
            >
              {variable ? 'Aktualizovat' : 'Vytvořit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};