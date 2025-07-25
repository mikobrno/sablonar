import React from 'react'
import { Building2, Variable, Mail, BarChart3, Database, Settings, Sliders } from 'lucide-react'

interface AdminNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'buildings', name: 'Budovy', icon: Building2, color: 'from-blue-500 to-indigo-600' },
    { id: 'variables', name: 'Statické proměnné', icon: Variable, color: 'from-purple-500 to-violet-600' },
    { id: 'dynamic-variables', name: 'Dynamické proměnné', icon: Sliders, color: 'from-indigo-500 to-purple-600' },
    { id: 'templates', name: 'Šablony', icon: Mail, color: 'from-orange-500 to-amber-600' },
    { id: 'emails', name: 'Vygenerované e-maily', icon: Database, color: 'from-green-500 to-emerald-600' },
    { id: 'stats', name: 'Statistiky', icon: BarChart3, color: 'from-pink-500 to-rose-600' },
  ]

  return (
    <div className="w-72 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-slate-800 to-gray-700 text-white">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Administrace</h3>
              <p className="text-gray-300 text-sm">Správa systému</p>
            </div>
          </div>
        </div>
        <nav className="p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 text-left rounded-xl transition-all duration-200 mb-2 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === tab.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-100'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{tab.name}</div>
                  <div className={`text-xs ${
                    activeTab === tab.id 
                      ? 'text-white/80' 
                      : 'text-gray-500'
                  }`}>
                    {tab.id === 'buildings' && 'Správa nemovitostí'}
                    {tab.id === 'variables' && 'Globální konstanty'}
                    {tab.id === 'dynamic-variables' && 'Uživatelské proměnné'}
                    {tab.id === 'templates' && 'E-mailové šablony'}
                    {tab.id === 'emails' && 'Historie e-mailů'}
                    {tab.id === 'stats' && 'Přehled systému'}
                  </div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}