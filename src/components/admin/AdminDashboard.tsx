import React, { useState } from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { AdminNavigation } from './AdminNavigation';
import { BuildingManager } from './BuildingManager';
import { VariableManager } from './VariableManager';
import { DynamicVariableManager } from './DynamicVariableManager';
import { TemplateManager } from './TemplateManager';
import { EmailHistory } from './EmailHistory';
import { AdminStats } from './AdminStats';

type AdminTab = 'buildings' | 'variables' | 'dynamic-variables' | 'templates' | 'emails' | 'stats';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('buildings');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'buildings':
        return <BuildingManager />;
      case 'variables':
        return <VariableManager />;
      case 'dynamic-variables':
        return <DynamicVariableManager />;
      case 'templates':
        return <TemplateManager />;
      case 'emails':
        return <EmailHistory />;
      case 'stats':
        return <AdminStats />;
      default:
        return <BuildingManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Administrační systém
                </h1>
                <p className="text-sm text-gray-300">
                  Komplexní správa dat a šablon
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Hlavní obsah */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};