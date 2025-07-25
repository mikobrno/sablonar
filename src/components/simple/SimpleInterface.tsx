import React, { useState, useEffect } from 'react';
import { Header } from '../Header';
import { Stats } from '../Stats';
import { PropertySelector } from '../PropertySelector';
import { TemplateSelector } from '../TemplateSelector';
import { EmailPreview } from '../EmailPreview';
import { ActionButtons } from '../ActionButtons';
import { supabaseService } from '../../services/SupabaseService';
import { ArrowLeft } from 'lucide-react';
import type { Database } from '../../lib/supabase';

type Building = Database['public']['Tables']['buildings']['Row'];
type EmailTemplate = Database['public']['Tables']['email_templates']['Row'];
type GeneratedEmail = Database['public']['Tables']['generated_emails']['Row'];

interface EmailPreviewData {
  subject: string;
  body: string;
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
  const [emailPreview, setEmailPreview] = useState<EmailPreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBuilding && selectedTemplate) {
      generatePreview();
    } else {
      setEmailPreview(null);
    }
  }, [selectedBuilding, selectedTemplate]);

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

  const generatePreview = async () => {
    if (!selectedBuilding || !selectedTemplate) return;

    try {
      const generated = await supabaseService.generateEmail(selectedTemplate.id, selectedBuilding.id);
      setEmailPreview({
        subject: generated.subject,
        body: generated.body
      });
    } catch (error) {
      console.error('Chyba při generování náhledu:', error);
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedBuilding || !selectedTemplate) return;
    
    try {
      await supabaseService.generateEmail(selectedTemplate.id, selectedBuilding.id);
      await loadData(); // Reload data to update stats
    } catch (error) {
      console.error('Chyba při generování e-mailu:', error);
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
            
            <ActionButtons
              canGenerate={!!(selectedBuilding && selectedTemplate)}
              onGenerateDraft={handleGenerateDraft}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-2">
            <EmailPreview
              preview={emailPreview}
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};