import React, { useState } from 'react';
import { Table, Search, Plus, Edit2, Trash2, Database, Filter } from 'lucide-react';
import { adminService } from '../../services/AdminService';
import { TableSchema, TableRecord } from '../../types/admin';

export const DataTables: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TableRecord | null>(null);

  const tables = adminService.getTables();
  const currentTable = selectedTable ? adminService.getTable(selectedTable) : null;
  const records = selectedTable ? adminService.getRecords(selectedTable, searchFilter) : [];

  const handleAddRecord = (data: any) => {
    if (selectedTable) {
      const result = adminService.addRecord(selectedTable, data);
      if (result.success) {
        setShowAddModal(false);
      }
    }
  };

  const handleUpdateRecord = (recordId: string, data: any) => {
    if (selectedTable) {
      const result = adminService.updateRecord(selectedTable, recordId, data);
      if (result.success) {
        setEditingRecord(null);
      }
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    if (selectedTable && confirm('Are you sure you want to delete this record?')) {
      adminService.deleteRecord(selectedTable, recordId);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg border border-green-200">
      <div className="p-6 border-b border-green-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Datové tabulky</h3>
              <p className="text-green-100 text-sm">Správa strukturovaných dat</p>
            </div>
          </div>
          {selectedTable && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Přidat záznam
            </button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Filter className="w-5 h-5 text-white/80" />
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="px-4 py-2 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-gray-800 font-medium"
          >
            <option value="">Vyberte tabulku...</option>
            {tables.map(table => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>

          {selectedTable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Hledat záznamy..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/90 border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-gray-800"
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white/50">
        {!selectedTable ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Table className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Vyberte tabulku</h4>
            <p className="text-gray-600">Zvolte tabulku pro zobrazení a správu dat</p>
          </div>
        ) : !currentTable ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg font-medium">Tabulka nebyla nalezena</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Žádné záznamy</h4>
            <p className="text-gray-600 mb-6">Tabulka neobsahuje žádné záznamy</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-sm transition-all duration-200"
            >
              Přidat první záznam
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">ID</th>
                  {currentTable.fields.map(field => (
                    <th key={field.name} className="text-left py-4 px-6 font-semibold text-gray-900">
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </th>
                  ))}
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Akce</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600 font-mono bg-gray-50">{record.id}</td>
                    {currentTable.fields.map(field => (
                      <td key={field.name} className="py-4 px-6 text-sm text-gray-900">
                        {String(record[field.name] || '')}
                      </td>
                    ))}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingRecord(record)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Upravit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                          title="Smazat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal pro přidání záznamu */}
      {showAddModal && currentTable && (
        <RecordModal
          table={currentTable}
          onSave={handleAddRecord}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Modal pro úpravu záznamu */}
      {editingRecord && currentTable && (
        <RecordModal
          table={currentTable}
          record={editingRecord}
          onSave={(data) => handleUpdateRecord(editingRecord.id, data)}
          onClose={() => setEditingRecord(null)}
        />
      )}
    </div>
  );
};

interface RecordModalProps {
  table: TableSchema;
  record?: TableRecord;
  onSave: (data: any) => void;
  onClose: () => void;
}

const RecordModal: React.FC<RecordModalProps> = ({ table, record, onSave, onClose }) => {
  const [formData, setFormData] = useState<any>(
    record ? { ...record } : {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
          <h3 className="text-xl font-bold">
            {record ? 'Upravit záznam' : 'Přidat nový záznam'}
          </h3>
          <p className="text-green-100 text-sm mt-1">
            {record ? 'Upravte existující záznam' : 'Vytvořte nový záznam v tabulce'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {table.fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={formData[field.name] || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.checked
                  }))}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
              ) : field.type === 'select' && field.options ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.value
                  }))}
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                >
                  <option value="">Vyberte...</option>
                  {field.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: field.type === 'number' ? parseFloat(e.target.value) || '' : e.target.value
                  }))}
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-sm transition-all duration-200"
            >
              {record ? 'Aktualizovat' : 'Vytvořit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};