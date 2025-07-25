import React from 'react';
import { EmailPreview as EmailPreviewType } from '../types';
import { Eye, Mail } from 'lucide-react';

interface EmailPreviewProps {
  preview: EmailPreviewType | null;
  isLoading?: boolean;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ preview, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Eye className="w-4 h-4" />
          Náhled e-mailu
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Eye className="w-4 h-4" />
          Náhled e-mailu
        </div>
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Vyberte nemovitost a šablonu pro zobrazení náhledu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Eye className="w-4 h-4" />
        Náhled e-mailu
      </div>
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {/* Email Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Předmět:</span>
            </div>
            <div className="font-medium text-gray-900">{preview.subject}</div>
          </div>
        </div>
        
        {/* Email Body */}
        <div className="p-6">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: preview.body }}
          />
        </div>
      </div>
    </div>
  );
};