import React from 'react';
import { Property } from '../types';
import { Building2, ChevronDown } from 'lucide-react';

interface PropertySelectorProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
}

export const PropertySelector: React.FC<PropertySelectorProps> = ({
  properties,
  selectedProperty,
  onPropertySelect
}) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Building2 className="w-4 h-4" />
        Vyberte nemovitost
      </label>
      <div className="relative">
        <select
          value={selectedProperty?.property_id || ''}
          onChange={(e) => {
            const property = properties.find(p => p.property_id === e.target.value);
            if (property) onPropertySelect(property);
          }}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
        >
          <option value="">Vyberte nemovitost...</option>
          {properties.map((property) => (
            <option key={property.property_id} value={property.property_id}>
              {property.full_name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {selectedProperty && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">SVJ:</span> {selectedProperty.svj_name_full}</div>
            <div><span className="font-medium">Krátký název:</span> {selectedProperty.short_name}</div>
            {selectedProperty.notes && (
              <div><span className="font-medium">Poznámky:</span> {selectedProperty.notes}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};