import React, { useState } from 'react';
import { Mail, Plus, Edit2, Trash2, Eye, FileText, Sparkles, Save } from 'lucide-react';
import { supabaseService } from '../../services/SupabaseService';
import type { Database } from '../../lib/supabase';

type EmailTemplate = Database['public']['Tables']['email_templates']['Row'];

export const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subject: '',
    body: ''
  });

  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await supabaseService.getEmailTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Chyba při načítání šablon:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(templates.map(t => t.category))];
  const filteredTemplates = selectedCategory 
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  const handleSave = async () => {
    try {
      const usedVariables = supabaseService.extractVariables(formData.subject + ' ' + formData.body);
      
      if (editingTemplate) {
        await supabaseService.updateEmailTemplate(editingTemplate.id, {
          name: formData.name,
          category: formData.category,
          subject: formData.subject,
          body: formData.body,
          used_variables: usedVariables
        });
      } else {
        await supabaseService.createEmailTemplate({
          name: formData.name,
          category: formData.category,
          subject: formData.subject,
          body: formData.body,
          used_variables: usedVariables
        });
      }
      await loadTemplates();
      setEditingTemplate(null);
      setShowAddModal(false);
      setFormData({ name: '', category: '', subject: '', body: '' });
    } catch (error) {
      console.error('Chyba při ukládání šablony:', error);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subject: template.subject,
      body: template.body
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Opravdu chcete smazat tuto šablonu?')) {
      try {
        await supabaseService.deleteEmailTemplate(id);
        await loadTemplates();
      } catch (error) {
        console.error('Chyba při mazání šablony:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'upozorneni': 'bg-red-100 text-red-800 border-red-200',
      'vyuctovani': 'bg-green-100 text-green-800 border-green-200',
      'pozvanka': 'bg-blue-100 text-blue-800 border-blue-200',
      'pripominky': 'bg-orange-100 text-orange-800 border-orange-200',
      'oznameni': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
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
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl shadow-lg border border-orange-200">
      <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">E-mailové šablony</h3>
              <p className="text-orange-100 text-sm">Správa šablon pro hromadnou korespondenci</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Přidat šablonu
          </button>
        </div>

        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-orange-100 text-sm font-medium mr-2">Kategorie:</span>
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === '' 
                  ? 'bg-white text-orange-600 font-semibold' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              All ({templates.length})
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category 
                    ? 'bg-white text-orange-600 font-semibold' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {category} ({templates.filter(t => t.category === category).length})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-white/50">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedCategory ? `Žádné šablony v kategorii '${selectedCategory}'` : 'Žádné e-mailové šablony'}
            </h4>
            <p className="text-gray-600 mb-6">
              {selectedCategory ? 'V této kategorii zatím nejsou žádné šablony' : 'Zatím nejsou vytvořeny žádné e-mailové šablony'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 font-medium shadow-sm transition-all duration-200"
            >
              Vytvořit první šablonu
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Předmět:</strong> {template.subject}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Proměnné: {template.used_variables.length}</span>
                      <span>Vytvořeno: {new Date(template.created_at).toLocaleDateString('cs-CZ')}</span>
                      <span>Upraveno: {new Date(template.updated_at).toLocaleDateString('cs-CZ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Náhled"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Upravit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                      title="Smazat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {template.used_variables.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Proměnné šablony:</div>
                    <div className="flex flex-wrap gap-2">
                      {template.used_variables.map(variable => (
                        <span key={variable} className="bg-white border border-orange-200 px-3 py-1 rounded-full text-xs font-mono text-orange-700 font-semibold">
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal pro přidání šablony */}
      {showAddModal && (
        <TemplateModal
          template={editingTemplate}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onClose={() => {
            setShowAddModal(false);
            setEditingTemplate(null);
            setFormData({ name: '', category: '', subject: '', body: '' });
          }}
        />
      )}

      {/* Modal náhledu */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
};

interface TemplateModalProps {
  template?: EmailTemplate | null;
  formData: { name: string; category: string; subject: string; body: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; category: string; subject: string; body: string }>>;
  onSave: () => void;
  onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ 
  template, 
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
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-xl">
          <h3 className="text-xl font-bold">
            {template ? 'Upravit šablonu' : 'Přidat novou šablonu'}
          </h3>
          <p className="text-orange-100 text-sm mt-1">
            {template ? 'Upravte existující e-mailovou šablonu' : 'Vytvořte novou e-mailovou šablonu'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Název šablony <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="např. Uvítací e-mail"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategorie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="např. upozorneni, vyuctovani"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Předmět e-mailu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="např. Vítejte {{jmeno_zakaznika}} v naší službě"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tělo e-mailu <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Zadejte text e-mailové šablony. Použijte {{nazev_promenne}} pro dynamický obsah."
              required
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-orange-900 mb-2">💡 Tipy pro použití proměnných:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Použijte <code className="bg-orange-100 px-2 py-1 rounded">{`{{nazev_promenne}}`}</code> pro vložení dynamického obsahu</li>
              <li>• Proměnné budou nahrazeny skutečnými daty při generování e-mailů</li>
              <li>• Běžné proměnné: <code className="bg-orange-100 px-1 rounded">jmeno</code>, <code className="bg-orange-100 px-1 rounded">email</code>, <code className="bg-orange-100 px-1 rounded">firma</code></li>
            </ul>
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
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 font-medium shadow-sm transition-all duration-200"
              disabled={!formData.name || !formData.category || !formData.subject || !formData.body}
            >
              {template ? 'Aktualizovat' : 'Vytvořit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface TemplatePreviewModalProps {
  template: EmailTemplate;
  onClose: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ template, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Náhled šablony</h3>
              <p className="text-orange-100 text-sm">Zobrazení e-mailové šablony</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h4 className="text-xl font-semibold text-gray-900">{template.name}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(template.category)}`}>
              {template.category}
            </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Předmět:</label>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 rounded-lg font-medium text-gray-900">
                {template.subject}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Tělo e-mailu:</label>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 rounded-lg whitespace-pre-wrap text-gray-900">
                {template.body}
              </div>
            </div>

            {template.variables.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Použité proměnné:</label>
                <div className="flex flex-wrap gap-2">
                  {template.used_variables.map(variable => (
                    <span key={variable} className="bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full text-sm font-mono font-semibold">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};