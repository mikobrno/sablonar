import React, { useState, useRef, useEffect } from 'react';
import type { Database } from '../../lib/supabase'; // Předpokládám, že typ Template je zde
import { Edit3, Save, Eye, EyeOff, Type, Mail } from 'lucide-react';

// Nahraďte 'any' správným typem, pokud ho máte definovaný v supabase.ts
type Template = Database['public']['Tables']['email_templates']['Row'];

interface TemplateEditorProps {
  template: Template | null;
  onTemplateUpdate: (updates: Partial<Template>) => void;
  // onVariableInsert je nyní nepotřebný, komunikace jde přes globální funkci
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onTemplateUpdate,
}) => {
  // --- VŠECHNY HOOKY JSOU ZDE NAHOŘE ---
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Tento useEffect synchronizuje stav editoru, když se změní vybraná šablona
  useEffect(() => {
    if (template) {
      setEditedSubject(template.subject || '');
      setEditedBody(template.body || '');
    } else {
      // Reset, pokud není vybrána žádná šablona
      setEditedSubject('');
      setEditedBody('');
    }
  }, [template]);
  
  // Tato funkce bude volána z jiné komponenty (VariablePanel)
  const insertVariable = (variableName: string) => {
    const variableText = `{{${variableName}}}`;
    
    const activeElement = document.activeElement;
    
    if (subjectRef.current && activeElement === subjectRef.current) {
      const start = subjectRef.current.selectionStart || 0;
      const newSubject = editedSubject.slice(0, start) + variableText + editedSubject.slice(start);
      setEditedSubject(newSubject);
      
      setTimeout(() => subjectRef.current?.setSelectionRange(start + variableText.length, start + variableText.length), 0);
    } 
    else if (bodyRef.current && activeElement === bodyRef.current) {
      const start = bodyRef.current.selectionStart || 0;
      const newBody = editedBody.slice(0, start) + variableText + editedBody.slice(start);
      setEditedBody(newBody);

      setTimeout(() => bodyRef.current?.setSelectionRange(start + variableText.length, start + variableText.length), 0);
    }
    // Pokud není aktivní žádné pole, nevkládáme nic, aby nedošlo k nechtěným změnám
  };

  // PŘESUNUTO: Tento Hook musí být nahoře, před jakýmkoliv 'return'.
  // Zpřístupní funkci 'insertVariable' globálně, aby ji mohla zavolat jiná komponenta.
  useEffect(() => {
    (window as any).insertVariableToEditor = insertVariable;
    return () => {
      // Po odmontování komponenty globální funkci smažeme, abychom předešli chybám.
      delete (window as any).insertVariableToEditor;
    };
  }, [editedSubject, editedBody]); // Závislosti zajišťují, že globální funkce má vždy přístup k aktuálnímu stavu

  // ODSTRANĚNO: Druhý, problematický useEffect, který přepisoval props.

  const handleSave = () => {
    if (template) {
      onTemplateUpdate({
        subject: editedSubject,
        body: editedBody,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (template) {
      setEditedSubject(template.subject || '');
      setEditedBody(template.body || '');
    }
    setIsEditing(false);
  };

  // --- PODMÍNĚNÝ RETURN ZŮSTÁVÁ ZDE ---
  // Všechny Hooky již byly zavolány, takže je to v pořádku.
  if (!template) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Editor šablony</h3>
            <p className="text-gray-600 text-sm">Vyberte šablonu pro úpravy</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Nejprve vyberte šablonu</p>
        </div>
      </div>
    );
  }

  // --- VYKRESLENÍ KOMPONENTY, KDYŽ JE ŠABLONA VYBRÁNA ---
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Editor šablony</h3>
            <p className="text-gray-600 text-sm">{template.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              showPreview 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Skrýt náhled' : 'Zobrazit náhled'}
          </button>
          
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">
                Zrušit
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-200 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Uložit
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 font-medium transition-all duration-200 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Upravit
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type className="w-4 h-4" />
            Předmět e-mailu
          </label>
          {isEditing ? (
            <input
              ref={subjectRef}
              type="text"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 font-medium"
              placeholder="Zadejte předmět e-mailu..."
            />
          ) : (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl">
              <div className="font-medium text-orange-900">{template.subject}</div>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Mail className="w-4 h-4" />
            Tělo e-mailu
          </label>
          {isEditing ? (
            <textarea
              ref={bodyRef}
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 font-mono text-sm resize-none"
              placeholder="Zadejte obsah e-mailu..."
            />
          ) : showPreview ? (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl">
              <div 
                className="prose prose-sm max-w-none text-orange-900"
                dangerouslySetInnerHTML={{ __html: template.body || '' }}
              />
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl">
              <pre className="whitespace-pre-wrap font-mono text-sm text-orange-900 overflow-x-auto">
                {template.body}
              </pre>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-2">💡 Tipy pro editaci:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Klikněte do pole a poté na proměnnou v panelu vpravo pro automatické vložení</li>
              <li>• Použijte HTML tagy pro formátování: <code className="bg-orange-100 px-1 rounded">&lt;p&gt;</code>, <code className="bg-orange-100 px-1 rounded">&lt;strong&gt;</code>, <code className="bg-orange-100 px-1 rounded">&lt;ul&gt;</code></li>
              <li>• Proměnné ve formátu <code className="bg-orange-100 px-1 rounded">{`{{nazev_promenne}}`}</code> se automaticky nahradí</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};