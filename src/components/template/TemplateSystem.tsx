import React, { useState, useEffect } from 'react';
import { supabaseService } from '../../services/SupabaseService';
import type { Database } from '../../lib/supabase';
import { BuildingSelector } from './BuildingSelector';
import { TemplateSelector } from './TemplateSelector';
import { VariablePanel } from './VariablePanel';
import { TemplateEditor } from './TemplateEditor';
import { EmailPreview } from './EmailPreview';
import { Sparkles, Zap } from 'lucide-react';

// --- TYPY Z DATABÁZE ---
type Building = Database['public']['Tables']['buildings']['Row'];
type EmailTemplate = Database['public']['Tables']['email_templates']['Row'];
type GeneratedEmailFromDB = Database['public']['Tables']['generated_emails']['Row'];

// --- LOKÁLNÍ TYPY PRO TUTO KOMPONENTU ---
interface VariableGroup {
  name: string;
  variables: Array<{ name: string; value: string; description?: string }>;
  color: string;
}

// Přejmenováno, aby se to nepletlo s typem z DB
interface LocalGeneratedEmail {
  subject: string;
  body: string;
  buildingName: string;
  templateName: string;
}

// --- PROPS, KTERÉ KOMPONENTA PŘIJÍMÁ OD App.tsx ---
interface TemplateSystemProps {
  buildings: Building[];
  templates: EmailTemplate[];
  generatedEmails: GeneratedEmailFromDB[];
  onDataReload: () => void;
}

// --- KOMPONENTA ---
// Změna: Komponenta nyní správně přijímá props: { buildings, templates, ... }
export const TemplateSystem: React.FC<TemplateSystemProps> = ({ buildings, templates, generatedEmails, onDataReload }) => {
  // Odstraněno: useState pro buildings a templates, protože data přichází z props.
  // Odstraněno: useState pro loading, protože to řeší App.tsx.

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [variableGroups, setVariableGroups] = useState<VariableGroup[]>([]);
  const [generatedEmail, setGeneratedEmail] = useState<LocalGeneratedEmail | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Odstraněno: useEffect a funkce loadData(), protože komponenta už nenačítá vlastní data.
  // Data teď spravuje výhradně App.tsx.

  useEffect(() => {
    if (selectedBuilding) {
      loadVariableGroups(selectedBuilding.id);
    } else {
      setVariableGroups([]);
    }
  }, [selectedBuilding]);
  
  const loadVariableGroups = async (buildingId: string) => {
    try {
      const variables = await supabaseService.getAvailableVariables(buildingId);
      const groups: VariableGroup[] = [];
      
      if (variables.static.length > 0) {
        groups.push({
          name: 'Statické proměnné',
          variables: variables.static,
          color: 'bg-purple-100 text-purple-800'
        });
      }
      
      if (variables.dynamic.length > 0) {
        const building = buildings.find(b => b.id === buildingId);
        groups.push({
          name: `Údaje budovy: ${building?.name || 'Neznámá'}`,
          variables: variables.dynamic.map(v => ({ ...v, description: `Hodnota z budovy` })),
          color: 'bg-blue-100 text-blue-800'
        });
      }
      
      setVariableGroups(groups);
    } catch (error) {
      console.error('Chyba při načítání proměnných:', error);
    }
  };

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
    setGeneratedEmail(null);
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setGeneratedEmail(null);
  };

  const handleTemplateUpdate = async (updates: Partial<EmailTemplate>) => {
    if (selectedTemplate) {
      try {
        const usedVariables = supabaseService.extractVariables((updates.subject || selectedTemplate.subject) + ' ' + (updates.body || selectedTemplate.body));
        const updatedTemplate = await supabaseService.updateEmailTemplate(selectedTemplate.id, {
          ...updates,
          used_variables: usedVariables
        });
        setSelectedTemplate(updatedTemplate);
        // Změna: Místo lokální funkce voláme funkci z props pro obnovení dat v celé aplikaci.
        await onDataReload();
      } catch (error) {
        console.error('Chyba při aktualizaci šablony:', error);
      }
    }
  };

  const handleVariableInsert = (variableName: string) => {
    if ((window as any).insertVariableToEditor) {
      (window as any).insertVariableToEditor(variableName);
    }
  };

  const handleGenerateEmail = async () => {
    if (!selectedBuilding || !selectedTemplate) return;

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const generated = await supabaseService.generateEmail(selectedTemplate.id, selectedBuilding.id);
      setGeneratedEmail({
        subject: generated.subject,
        body: generated.body,
        buildingName: generated.buildingName,
        templateName: generated.templateName
      });
    } catch (error) {
      console.error('Chyba při generování e-mailu:', error);
    }
    
    setIsGenerating(false);
  };

  const canGenerate = selectedBuilding && selectedTemplate;

  // Odstraněno: Zobrazení "Načítám data...", protože to už řeší App.tsx.

  return (
    <div>
      {/* Statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budovy</p>
              <p className="text-3xl font-bold text-blue-600">{buildings.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Šablony</p>
              <p className="text-3xl font-bold text-green-600">{templates.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Proměnné</p>
              <p className="text-3xl font-bold text-purple-600">
                {variableGroups.reduce((sum, group) => sum + group.variables.length, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vygenerováno</p>
              {/* Opraveno: Nyní 'generatedEmails' přichází z props a je definované. */}
              <p className="text-3xl font-bold text-pink-600">
                {generatedEmails.length}
              </p>
            </div>
            <div className="bg-pink-100 p-3 rounded-xl">
              <Zap className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Hlavní obsah */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Levý sloupec - Výběr a editor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BuildingSelector
              buildings={buildings}
              selectedBuilding={selectedBuilding}
              onBuildingSelect={handleBuildingSelect}
            />
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>

          <TemplateEditor
            template={selectedTemplate}
            onTemplateUpdate={handleTemplateUpdate}
            onVariableInsert={handleVariableInsert}
          />

          <EmailPreview
            generatedEmail={generatedEmail}
            isGenerating={isGenerating}
            onGenerate={handleGenerateEmail}
            canGenerate={!!canGenerate}
          />
        </div>

        {/* Pravý sloupec - Panel proměnných */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <VariablePanel
              variableGroups={variableGroups}
              onVariableInsert={handleVariableInsert}
            />
          </div>
        </div>
      </div>
    </div>
  );
};