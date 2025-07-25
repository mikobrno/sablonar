import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, HelpCircle, Sparkles } from 'lucide-react';
import { adminService } from '../../services/AdminService';
import { CommandResult } from '../../types/admin';

interface CommandHistory {
  command: string;
  result: CommandResult;
  timestamp: Date;
}

export const CommandInterface: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = async (cmd: string): Promise<CommandResult> => {
    const parts = cmd.trim().toLowerCase().split(' ');
    
    try {
      if (parts[0] === 'help' || parts[0] === 'napoveda') {
        const commands = adminService.getCommands();
        return {
          success: true,
          message: 'Dostupné příkazy:',
          data: commands
        };
      }

      if ((parts[0] === 'vytvor' || parts[0] === 'create') && (parts[1] === 'tabulku' || parts[1] === 'table')) {
        // Parse: vytvor tabulku zakaznici s poli: jmeno:text, email:email
        const match = cmd.match(/(vytvor tabulku|create table) (\w+) (s poli|with fields): (.+)/i);
        if (!match) {
          return { success: false, message: 'Neplatná syntaxe. Použijte: vytvor tabulku <nazev> s poli: <pole1:typ>, <pole2:typ>' };
        }

        const tableName = match[2];
        const fieldsStr = match[4];
        const fields = fieldsStr.split(',').map(field => {
          const [name, type] = field.trim().split(':');
          return { name: name.trim(), type: type.trim() as any, required: true };
        });

        return adminService.createTable(tableName, fields);
      }

      if ((parts[0] === 'pridej' || parts[0] === 'add') && (parts[1] === 'zaznam' || parts[1] === 'record')) {
        // Parse: pridej zaznam do zakaznici s jmeno=Jan Novák, email=jan@example.com
        const match = cmd.match(/(pridej zaznam|add record) (do|to) (\w+) (s|with) (.+)/i);
        if (!match) {
          return { success: false, message: 'Neplatná syntaxe. Použijte: pridej zaznam do <tabulka> s <pole>=<hodnota>' };
        }

        const tableName = match[3];
        const dataStr = match[5];
        const data: any = {};
        
        dataStr.split(',').forEach(pair => {
          const [key, value] = pair.trim().split('=');
          data[key.trim()] = value.trim().replace(/"/g, '');
        });

        return adminService.addRecord(tableName, data);
      }

      if ((parts[0] === 'vytvor' || parts[0] === 'create') && (parts[1] === 'promennou' || parts[1] === 'variable')) {
        // Parse: vytvor promennou nazev_firmy="Moje firma" typ:text
        const match = cmd.match(/(vytvor promennou|create variable) (\w+)=(.+?) (typ|type):(\w+)/i);
        if (!match) {
          return { success: false, message: 'Neplatná syntaxe. Použijte: vytvor promennou <nazev>=<hodnota> typ:<typ>' };
        }

        const name = match[2];
        let value: any = match[3].replace(/"/g, '');
        const type = match[5] as any;

        if (type === 'number') value = parseFloat(value);
        if (type === 'boolean') value = value.toLowerCase() === 'true';

        return adminService.createVariable(name, value, type);
      }

      if ((parts[0] === 'vytvor' || parts[0] === 'create') && (parts[1] === 'sablonu' || parts[1] === 'template')) {
        // Parse: vytvor sablonu vitani kategorie:uvitani predmet:"Vítejte {{jmeno}}" telo:"Dobrý den {{jmeno}}"
        const match = cmd.match(/(vytvor sablonu|create template) (\w+) (kategorie|category):(\w+) (predmet|subject):"([^"]+)" (telo|body):"([^"]+)"/i);
        if (!match) {
          return { success: false, message: 'Neplatná syntaxe. Použijte: vytvor sablonu <nazev> kategorie:<kategorie> predmet:"<predmet>" telo:"<telo>"' };
        }

        const name = match[2];
        const category = match[4];
        const subject = match[6];
        const body = match[8];
        return adminService.createTemplate(name, category, subject, body);
      }

      if ((parts[0] === 'vygeneruj' || parts[0] === 'generate') && (parts[1] === 'email' || parts[1] === 'mail')) {
        // Parse: vygeneruj email sablona:sab_001 zaznam:nem_001 tabulka:nemovitosti
        const templateMatch = cmd.match(/(sablona|template):(\w+)/i);
        const recordMatch = cmd.match(/(zaznam|record):(\w+)/i);
        const tableMatch = cmd.match(/(tabulka|table):(\w+)/i);

        if (!templateMatch || !recordMatch || !tableMatch) {
          return { success: false, message: 'Neplatná syntaxe. Použijte: vygeneruj email sablona:<id_sablony> zaznam:<id_zaznamu> tabulka:<id_tabulky>' };
        }

        return adminService.generateEmail(templateMatch[2], recordMatch[2], tableMatch[2]);
      }

      if (parts[0] === 'seznam' || parts[0] === 'list') {
        if (parts[1] === 'tabulky' || parts[1] === 'tables') {
          const tables = adminService.getTables();
          return { success: true, message: 'Dostupné tabulky:', data: tables };
        }
        if (parts[1] === 'promenne' || parts[1] === 'variables') {
          const variables = adminService.getVariables();
          return { success: true, message: 'Dostupné proměnné:', data: variables };
        }
        if (parts[1] === 'sablony' || parts[1] === 'templates') {
          const templates = adminService.getTemplates();
          return { success: true, message: 'Dostupné šablony:', data: templates };
        }
      }

      if ((parts[0] === 'zobraz' || parts[0] === 'show') && (parts[1] === 'zaznamy' || parts[1] === 'records')) {
        const tableName = parts[2];
        if (!tableName) {
          return { success: false, message: 'Prosím zadejte název tabulky. Použijte: zobraz zaznamy <nazev_tabulky>' };
        }
        const records = adminService.getRecords(tableName);
        return { success: true, message: `Záznamy v tabulce '${tableName}':`, data: records };
      }

      return { success: false, message: `Neznámý příkaz: ${parts[0]}. Napište 'napoveda' pro dostupné příkazy.` };
    } catch (error) {
      return { success: false, message: `Chyba při zpracování příkazu: ${error}` };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;

    setIsProcessing(true);
    const result = await processCommand(command);
    
    setHistory(prev => [...prev, {
      command,
      result,
      timestamp: new Date()
    }]);

    setCommand('');
    setIsProcessing(false);
    inputRef.current?.focus();
  };

  const renderResult = (result: CommandResult, data?: any) => {
    if (!result.success) {
      return (
        <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="font-medium flex items-center gap-2">
            <span className="text-red-500">❌</span>
            Chyba:
          </div>
          <div>{result.message}</div>
        </div>
      );
    }

    return (
      <div className="text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="font-medium flex items-center gap-2">
          <span className="text-green-500">✅</span>
          Úspěch:
        </div>
        <div>{result.message}</div>
        {result.data && (
          <div className="mt-2">
            {Array.isArray(result.data) ? (
              <div className="space-y-2">
                {result.data.map((item, index) => (
                  <div key={index} className="bg-white p-2 rounded border text-gray-800 text-sm">
                    {typeof item === 'object' ? (
                      <div className="space-y-1">
                        {Object.entries(item).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="font-medium text-blue-600">{key}:</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>{String(item)}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : typeof result.data === 'object' ? (
              <div className="bg-white p-2 rounded border text-gray-800 text-sm">
                <div className="space-y-1">
                  {Object.entries(result.data).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium text-blue-600">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-2 rounded border text-gray-800 text-sm">
                {String(result.data)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 p-6 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="bg-white/20 p-2 rounded-lg">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">Příkazové rozhraní</h3>
          <p className="text-blue-100 text-sm">Interaktivní správa dat a šablon</p>
        </div>
        <button
          onClick={() => setCommand('napoveda')}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          Nápověda
        </button>
      </div>

      <div 
        ref={historyRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 bg-white/50 font-mono text-sm"
        style={{ maxHeight: '400px' }}
      >
        {history.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Vítejte v administračním systému!</h4>
            <p className="text-gray-600 mb-4">Začněte psaním příkazů pro správu dat, proměnných a šablon</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
              <p className="text-sm text-blue-800 font-medium mb-2">💡 Rychlý start:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <code className="bg-blue-100 px-1 rounded">napoveda</code> - zobrazí všechny příkazy</li>
                <li>• <code className="bg-blue-100 px-1 rounded">seznam tabulky</code> - ukáže dostupné tabulky</li>
                <li>• <code className="bg-blue-100 px-1 rounded">seznam sablony</code> - zobrazí e-mailové šablony</li>
              </ul>
            </div>
          </div>
        )}
        
        {history.map((entry, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg border border-gray-200">
              <span className="text-blue-600 font-bold">➤</span>
              <span className="flex-1">{entry.command}</span>
              <span className="text-xs text-gray-400 ml-auto">
                {entry.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {renderResult(entry.result)}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <span className="text-blue-600 font-bold text-lg">➤</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Zadejte příkaz... (napište 'napoveda' pro dostupné příkazy)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white shadow-sm"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!command.trim() || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm transition-all duration-200"
          >
            <Send className="w-4 h-4" />
            {isProcessing ? 'Zpracovávám...' : 'Spustit'}
          </button>
        </div>
      </form>
    </div>
  );
};