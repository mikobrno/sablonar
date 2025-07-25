import React, { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  canGenerate: boolean;
  onGenerateDraft: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ canGenerate, onGenerateDraft }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSuccess(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    setIsSuccess(true);
    onGenerateDraft();
    
    // Reset success state after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generuji koncept...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Koncept vytvořen!
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Vygenerovat koncept v Gmailu
          </>
        )}
      </button>
      
      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="space-y-1">
              <div className="font-medium text-green-800">Koncept byl úspěšně vytvořen</div>
              <div className="text-sm text-green-700">
                Nový koncept e-mailu byl přidán do vaší Gmail schránky a je připraven k odeslání.
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!canGenerate && (
        <div className="text-sm text-gray-500 text-center">
          Pro generování konceptu vyberte nemovitost i šablonu
        </div>
      )}
    </div>
  );
};