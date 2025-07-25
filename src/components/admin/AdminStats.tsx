import React, { useState, useEffect } from 'react'
import { Building2, Variable, Mail, BarChart3, TrendingUp, Calendar } from 'lucide-react'
import { supabaseService } from '../../services/SupabaseService'
import { webhookService } from '../../services/WebhookService'

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState({
    buildings: 0,
    variables: 0,
    dynamicVariables: 0,
    templates: 0,
    emails: 0
  })
  const [loading, setLoading] = useState(true)
  const [webhookStatus, setWebhookStatus] = useState<{
    isConnected: boolean;
    message: string;
    testing: boolean;
  }>({
    isConnected: false,
    message: 'Netestováno',
    testing: false
  })

  useEffect(() => {
    loadStats()
    testWebhookConnection()
  }, [])

  const loadStats = async () => {
    try {
      const [buildings, variables, templates, emails] = await Promise.all([
        supabaseService.getBuildings(),
        supabaseService.getStaticVariables(),
        supabaseService.getEmailTemplates(),
        supabaseService.getGeneratedEmails()
      ])

      setStats({
        buildings: buildings.length,
        variables: variables.length,
        dynamicVariables: variables.length, // Same as variables for now, but could be different in future
        templates: templates.length,
        emails: emails.length
      })
    } catch (error) {
      console.error('Chyba při načítání statistik:', error)
    } finally {
      setLoading(false)
    }
  }

  const testWebhookConnection = async () => {
    setWebhookStatus(prev => ({ ...prev, testing: true }))
    
    try {
      const result = await webhookService.testConnection()
      setWebhookStatus({
        isConnected: result.success,
        message: result.message,
        testing: false
      })
    } catch (error) {
      setWebhookStatus({
        isConnected: false,
        message: 'Chyba při testování připojení',
        testing: false
      })
    }
  }
  const statItems = [
    {
      name: 'Budovy',
      value: stats.buildings,
      icon: Building2,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'Globální proměnné',
      value: stats.variables,
      icon: Variable,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      name: 'Dynamické proměnné',
      value: stats.dynamicVariables,
      icon: Variable,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      name: 'E-mailové šablony',
      value: stats.templates,
      icon: Mail,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      name: 'Vygenerované e-maily',
      value: stats.emails,
      icon: BarChart3,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Přehled systému</h3>
              <p className="text-pink-100 text-sm">Aktuální stav administračního systému</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat) => (
              <div key={stat.name} className={`${stat.bgColor} rounded-xl p-6 text-center border border-gray-200 hover:shadow-md transition-all duration-200`}>
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${stat.color} mb-4 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className={`text-sm font-semibold ${stat.textColor}`}>{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Webhook Status */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <h4 className="font-bold text-lg">Gmail Integrace (n8n)</h4>
            </div>
            <button
              onClick={testWebhookConnection}
              disabled={webhookStatus.testing}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {webhookStatus.testing ? 'Testuji...' : 'Test připojení'}
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                webhookStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium text-gray-900">
                Webhook Status: {webhookStatus.isConnected ? 'Připojeno' : 'Nepřipojeno'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              URL: {webhookService.getWebhookUrl()}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {webhookStatus.message}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            <h4 className="font-bold text-lg">Rychlé akce</h4>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left">
              <Building2 className="w-6 h-6 text-blue-600 mb-2" />
              <div className="font-semibold text-blue-900">Přidat budovu</div>
              <div className="text-sm text-blue-600">Nová nemovitost</div>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left">
              <Variable className="w-6 h-6 text-purple-600 mb-2" />
              <div className="font-semibold text-purple-900">Nová proměnná</div>
              <div className="text-sm text-purple-600">Statická hodnota</div>
            </button>
            
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors text-left">
              <Mail className="w-6 h-6 text-orange-600 mb-2" />
              <div className="font-semibold text-orange-900">Nová šablona</div>
              <div className="text-sm text-orange-600">E-mailová šablona</div>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left">
              <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
              <div className="font-semibold text-green-900">Generovat e-mail</div>
              <div className="text-sm text-green-600">Nový e-mail</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}