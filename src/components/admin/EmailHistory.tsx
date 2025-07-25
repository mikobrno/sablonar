import React, { useState, useEffect } from 'react'
import { Mail, Calendar, Building2, FileText, Download, Eye } from 'lucide-react'
import { supabaseService } from '../../services/SupabaseService'
import type { Database } from '../../lib/supabase'

type GeneratedEmail = Database['public']['Tables']['generated_emails']['Row']

export const EmailHistory: React.FC = () => {
  const [emails, setEmails] = useState<GeneratedEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [previewEmail, setPreviewEmail] = useState<GeneratedEmail | null>(null)

  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = async () => {
    try {
      const data = await supabaseService.getGeneratedEmails()
      setEmails(data)
    } catch (error) {
      console.error('Chyba při načítání e-mailů:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (email: GeneratedEmail) => {
    const emailContent = `Předmět: ${email.subject}\n\n${email.body.replace(/<[^>]*>/g, '')}`
    const blob = new Blob([emailContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `email-${email.building_name}-${new Date(email.generated_at).toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg border border-green-200">
      <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Vygenerované e-maily</h3>
            <p className="text-green-100 text-sm">Historie všech vygenerovaných e-mailů</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white/50">
        {emails.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Žádné e-maily</h4>
            <p className="text-gray-600">Zatím nebyly vygenerovány žádné e-maily</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map(email => (
              <div key={email.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{email.subject}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Budova:</span>
                        <span className="text-sm font-medium text-gray-900">{email.building_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Šablona:</span>
                        <span className="text-sm font-medium text-gray-900">{email.template_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Vygenerováno:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(email.generated_at).toLocaleString('cs-CZ')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div 
                        className="text-sm text-green-800 line-clamp-3"
                        dangerouslySetInnerHTML={{ 
                          __html: email.body.length > 200 
                            ? email.body.substring(0, 200) + '...' 
                            : email.body 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => setPreviewEmail(email)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Náhled"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExport(email)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                      title="Exportovat"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal náhledu */}
      {previewEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Náhled e-mailu</h3>
                  <p className="text-green-100 text-sm">
                    {previewEmail.building_name} • {previewEmail.template_name}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewEmail(null)}
                  className="text-white/80 hover:text-white text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Předmět:</label>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg font-medium text-gray-900">
                    {previewEmail.subject}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Tělo e-mailu:</label>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-lg">
                    <div 
                      className="prose prose-sm max-w-none text-gray-900"
                      dangerouslySetInnerHTML={{ __html: previewEmail.body }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => handleExport(previewEmail)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportovat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}