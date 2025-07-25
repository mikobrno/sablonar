import React, { useState, useEffect } from 'react'
import { Building2, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { supabaseService } from '../../services/SupabaseService'
import type { Database } from '../../lib/supabase'

type Building = Database['public']['Tables']['buildings']['Row']

export const BuildingManager: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    data: {} as Record<string, any>
  })

  useEffect(() => {
    loadBuildings()
  }, [])

  const loadBuildings = async () => {
    try {
      const data = await supabaseService.getBuildings()
      setBuildings(data)
    } catch (error) {
      console.error('Chyba při načítání budov:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingBuilding) {
        await supabaseService.updateBuilding(editingBuilding.id, {
          name: formData.name,
          data: formData.data
        })
      } else {
        await supabaseService.createBuilding({
          name: formData.name,
          data: formData.data
        })
      }
      await loadBuildings()
      setEditingBuilding(null)
      setShowAddForm(false)
      setFormData({ name: '', data: {} })
    } catch (error) {
      console.error('Chyba při ukládání budovy:', error)
    }
  }

  const handleEdit = (building: Building) => {
    setEditingBuilding(building)
    setFormData({
      name: building.name,
      data: building.data
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Opravdu chcete smazat tuto budovu?')) {
      try {
        await supabaseService.deleteBuilding(id)
        await loadBuildings()
      } catch (error) {
        console.error('Chyba při mazání budovy:', error)
      }
    }
  }

  const handleAddField = () => {
    const fieldName = prompt('Název nového pole:')
    if (fieldName) {
      setFormData(prev => ({
        ...prev,
        data: {
          ...prev.data,
          [fieldName]: ''
        }
      }))
    }
  }

  const handleRemoveField = (fieldName: string) => {
    setFormData(prev => {
      const newData = { ...prev.data }
      delete newData[fieldName]
      return {
        ...prev,
        data: newData
      }
    })
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [fieldName]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200">
      <div className="p-6 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Správa budov</h3>
              <p className="text-blue-100 text-sm">Spravujte nemovitosti a jejich data</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Přidat budovu
          </button>
        </div>
      </div>

      <div className="p-6 bg-white/50">
        {buildings.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Žádné budovy</h4>
            <p className="text-gray-600 mb-6">Zatím nejsou vytvořeny žádné budovy</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-sm transition-all duration-200"
            >
              Vytvořit první budovu
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {buildings.map(building => (
              <div key={building.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{building.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {Object.entries(building.data).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-blue-700">{key}:</span>
                          <div className="text-blue-600 truncate">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-3">
                      Vytvořeno: {new Date(building.created_at).toLocaleDateString('cs-CZ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(building)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Upravit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(building.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                      title="Smazat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal pro přidání/úpravu budovy */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
              <h3 className="text-xl font-bold">
                {editingBuilding ? 'Upravit budovu' : 'Přidat novou budovu'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Název budovy <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  placeholder="např. Dřevařská 851/4, Brno"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Data budovy (proměnné)
                  </label>
                  <button
                    onClick={handleAddField}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                  >
                    + Přidat pole
                  </button>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(formData.data).map(([key, value]) => (
                    <div key={key} className="flex gap-3">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newKey = e.target.value
                          const newData = { ...formData.data }
                          delete newData[key]
                          newData[newKey] = value
                          setFormData(prev => ({ ...prev, data: newData }))
                        }}
                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Název pole"
                      />
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Hodnota"
                      />
                      <button
                        onClick={() => handleRemoveField(key)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingBuilding(null)
                    setFormData({ name: '', data: {} })
                  }}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.name}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingBuilding ? 'Aktualizovat' : 'Vytvořit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}