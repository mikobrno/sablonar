import React from 'react';
import { Building } from '../../types/template';
import { Building2, ChevronDown, MapPin } from 'lucide-react';

interface BuildingSelectorProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onBuildingSelect: (building: Building) => void;
}

export const BuildingSelector: React.FC<BuildingSelectorProps> = ({
  buildings,
  selectedBuilding,
  onBuildingSelect
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Výběr budovy</h3>
          <p className="text-gray-600 text-sm">Vyberte budovu pro generování e-mailu</p>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedBuilding?.id || ''}
          onChange={(e) => {
            const building = buildings.find(b => b.id === e.target.value);
            if (building) onBuildingSelect(building);
          }}
          className="w-full px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 appearance-none transition-all duration-200 text-gray-900 font-medium"
        >
          <option value="">🏢 Vyberte budovu...</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
      </div>

      {selectedBuilding && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-blue-900 mb-2">{selectedBuilding.name}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Zkrácený název:</span>
                  <div className="text-blue-600">{selectedBuilding.data.zkraceny_nazev || 'N/A'}</div>
                </div>
                <div>
                  <span className="font-medium text-blue-700">IČO:</span>
                  <div className="text-blue-600">{selectedBuilding.data.ico || 'N/A'}</div>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Telefon:</span>
                  <div className="text-blue-600">{selectedBuilding.data.telefon || 'N/A'}</div>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Dostupné proměnné:</span>
                  <div className="text-blue-600">{Object.keys(selectedBuilding.data).length}</div>
                </div>
              </div>
              {selectedBuilding.data.poznamky && (
                <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                  <span className="font-medium text-blue-700">Poznámky:</span>
                  <div className="text-blue-600 text-sm">{selectedBuilding.data.poznamky}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};