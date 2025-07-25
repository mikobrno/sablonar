import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TemplateSystem } from './components/template/TemplateSystem';
import { SimpleInterface } from './components/simple/SimpleInterface';
import { supabaseService } from './services/SupabaseService';
import { Settings, Sparkles, Mail, Database as DatabaseIcon, Zap } from 'lucide-react';
import type { Database } from './lib/supabase';

type Building = Database['public']['Tables']['buildings']['Row'];
type EmailTemplate = Database['public']['Tables']['email_templates']['Row'];
type GeneratedEmail = Database['public']['Tables']['generated_emails']['Row'];

type AppView = 'advanced' | 'simple' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('advanced');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
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

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  if (currentView === 'simple') {
    return (
      <SimpleInterface 
        onViewChange={setCurrentView}
      />
    );
  }

  // Advanced view (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hlavička s navigací */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Systém e-mailových šablon
                </h1>
                <p className="text-sm text-gray-300">
                  Pokročilé generování e-mailů pro SVJ a bytová družstva
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">v3.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Režim zobrazení</h2>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setCurrentView('advanced')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    currentView === 'advanced'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  Pokročilé rozhraní
                </button>
                <button
                  onClick={() => setCurrentView('simple')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    currentView === 'simple'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  Jednoduché rozhraní
                </button>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    currentView === 'admin'
                      ? 'bg-gradient-to-r from-gray-800 to-slate-800 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <DatabaseIcon className="w-5 h-5" />
                  Administrace
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Aktuální režim: <span className="font-semibold text-purple-600">Pokročilé rozhraní</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pokročilý systém šablon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <TemplateSystem
  buildings={buildings}
  templates={templates}
  generatedEmails={generatedEmails}
  onDataReload={loadData}
/>
      </div>
    </div>
  );
}

export default App;