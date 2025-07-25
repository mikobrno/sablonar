import React from 'react';
// Ujistěte se, že typ GeneratedEmail obsahuje i pole 'generatedAt'
import type { GeneratedEmail } from '../../types/template'; 
import { Mail, Calendar, Building2, FileText, Download, Send } from 'lucide-react';

interface EmailPreviewProps {
  generatedEmail: GeneratedEmail | null;
  isGenerating?: boolean;
  onGenerate?: () => void;
  canGenerate?: boolean;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  generatedEmail,
  isGenerating = false,
  onGenerate,
  canGenerate = false
}) => {
  const handleExport = () => {
    if (!generatedEmail) return;
    
    // Použijeme replaceAll pro případ, že by tagy byly vnořené
    const emailContent = `Předmět: ${generatedEmail.subject}\n\nTělo e-mailu:\n${generatedEmail.body.replaceAll(/<[^>]*>/g, '')}`;
    const blob = new Blob([emailContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-${generatedEmail.buildingName}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Náhled e-mailu</h3>
            <p className="text-gray-600 text-sm">Vygenerovaný e-mail připravený k odeslání</p>
          </div>
        </div>

        {onGenerate && (
          <button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generuji...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Vygenerovat e-mail
              </>
            )}
          </button>
        )}
      </div>

      {!generatedEmail && !isGenerating ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-pink-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Připraveno k generování</h4>
          <p className="text-gray-600 mb-6">Vyberte budovu a šablonu, poté klikněte na "Vygenerovat e-mail"</p>
          {!canGenerate && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-amber-800 text-sm">
                💡 Pro generování e-mailu je potřeba vybrat budovu i šablonu
              </p>
            </div>
          )}
        </div>
      ) : isGenerating ? (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Generuji e-mail...</h4>
          <p className="text-gray-600">Zpracovávám šablonu a nahrazuji proměnné</p>
        </div>
      ) : generatedEmail && ( // Přidána kontrola, zda generatedEmail opravdu existuje
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-pink-600" />
              <div>
                <div className="text-sm font-medium text-pink-700">Budova</div>
                <div className="text-pink-900 font-semibold">{generatedEmail.buildingName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-pink-600" />
              <div>
                <div className="text-sm font-medium text-pink-700">Šablona</div>
                <div className="text-pink-900 font-semibold">{generatedEmail.templateName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-pink-600" />
              <div>
                <div className="text-sm font-medium text-pink-700">Vygenerováno</div>
                <div className="text-pink-900 font-semibold">
                  {/* OPRAVENO: Přidána kontrola, zda 'generatedAt' existuje */}
                  {generatedEmail.generatedAt 
                    ? new Date(generatedEmail.generatedAt).toLocaleString('cs-CZ') 
                    : 'Právě teď'}
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold">Předmět:</span>
                </div>
                <div className="text-lg font-bold text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                  {generatedEmail.subject}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white">
              <div 
                className="prose prose-sm max-w-none text-gray-900 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: generatedEmail.body }}
              />
            </div>

            <div className="p-4 flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportovat
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
                <Send className="w-4 h-4" />
                Odeslat e-mail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};