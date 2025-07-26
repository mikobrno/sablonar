import React, { useState, useEffect } from 'react';
import { Header } from '../Header';
import { Stats } from '../Stats';
import { PropertySelector } from '../PropertySelector';
import { TemplateSelector } from '../TemplateSelector';
import { EmailPreview } from '../template/EmailPreview';
import { supabaseService } from '../../services/SupabaseService';
import { ArrowLeft } from 'lucide-react';
import type { Database } from '../../lib/supabase';

type Building = Database['public']['Tables']['buildings']['Row'];
type EmailTemplate = Database['public']['Tables']['email_templates']['Row'];
type GeneratedEmail = Database['public']['Tables']['generated_emails']['Row'];

interface GeneratedEmailData {
  subject: string;
  body: string;
  buildingName: string;
  templateName: string;
  generatedAt?: string;
}

interface SimpleInterfaceProps {
  onViewChange: (view: 'advanced' | 'simple' | 'admin') => void;
}

export const SimpleInterface: React.FC<SimpleInterfaceProps> = ({ onViewChange }) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmailData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [buildingsData, templatesData, emailsData] = await Promise.all([
        supabaseService.getBuildings(),
        supabaseService.getEmailTemplates(),
        supabaseService.getGeneratedEmails()
      ]);
      setBuildings(buildingsData);
      setTemplates(templatesData);
      setGeneratedEmails(emailsData);
    } catch (error) {
      console.error('Chyba při načítání dat:', error);
    } finally {
      setLoading(false);
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
        templateName: generated.templateName,
        generatedAt: new Date().toISOString()
      });
      await loadData();
    } catch (error) {
      console.error('Chyba při generování e-mailu:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert data for legacy components
  const legacyProperties = buildings.map(building => ({
    property_id: building.id,
    full_name: building.name,
    short_name: building.data.zkraceny_nazev || building.name,
    salutation_general: building.data.osloveni_obecne || 'Dobrý den,',
    svj_name_full: building.data.nazev_svj || building.name,
    salutation_members: building.data.osloveni_clenu || 'Vážení členové,',
    notes: building.data.poznamky || undefined
  }));

  const legacyTemplates = templates.map(template => ({
    template_id: template.id,
    template_name: template.name,
    email_subject: template.subject,
    email_body: template.body
  }));

  const selectedLegacyProperty = selectedBuilding ? legacyProperties.find(p => p.property_id === selectedBuilding.id) || null : null;
  const selectedLegacyTemplate = selectedTemplate ? legacyTemplates.find(t => t.template_id === selectedTemplate.id) || null : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítám aplikaci...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Header />
      
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => onViewChange('advanced')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na pokročilé rozhraní
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stats 
          propertiesCount={buildings.length}
          templatesCount={templates.length}
          emailsGenerated={generatedEmails.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Selectors */}
          <div className="lg:col-span-1 space-y-6">
            <PropertySelector
              properties={legacyProperties}
              selectedProperty={selectedLegacyProperty}
              onPropertySelect={(property) => {
                const building = buildings.find(b => b.id === property.property_id);
                setSelectedBuilding(building || null);
              }}
            />
            
            <TemplateSelector
              templates={legacyTemplates}
              selectedTemplate={selectedLegacyTemplate}
              onTemplateSelect={(template) => {
                const emailTemplate = templates.find(t => t.id === template.template_id);
                setSelectedTemplate(emailTemplate || null);
              }}
            />
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Akce</h3>
                  <p className="text-gray-600 text-sm">Vygenerujte e-mail a odešlete do Gmailu</p>
                </div>
              </div>
              
              <button
                onClick={handleGenerateEmail}
                disabled={!selectedBuilding || !selectedTemplate || isGenerating}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generuji e-mail...
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-5 h-5" />
                    Vygenerovat e-mail
                  </>
                )}
              </button>
              
              {!selectedBuilding || !selectedTemplate ? (
                <div className="mt-4 text-sm text-gray-500 text-center">
                  Pro generování e-mailu vyberte budovu i šablonu
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            <EmailPreview
              generatedEmail={generatedEmail}
              isGenerating={isGenerating}
              onGenerate={handleGenerateEmail}
              canGenerate={!!(selectedBuilding && selectedTemplate)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};