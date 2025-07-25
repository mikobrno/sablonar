import { 
  TableSchema, 
  TableRecord, 
  CustomVariable, 
  EmailTemplate, 
  AdminCommand,
  CommandResult,
  TableField 
} from '../types/admin';

class AdminService {
  private tables: Map<string, TableSchema> = new Map();
  private records: Map<string, TableRecord[]> = new Map();
  private variables: Map<string, CustomVariable> = new Map();
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Inicializace s daty nemovitostí z vašich příloh
    const propertySchema: TableSchema = {
      id: 'nemovitosti',
      name: 'Nemovitosti',
      fields: [
        { name: 'plny_nazev', type: 'text', required: true },
        { name: 'zkraceny_nazev', type: 'text', required: true },
        { name: 'osloveni_obecne', type: 'text', required: true },
        { name: 'nazev_svj', type: 'text', required: true },
        { name: 'osloveni_clenu', type: 'text', required: true },
        { name: 'poznamky', type: 'text', required: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tables.set('nemovitosti', propertySchema);
    
    // Vzorové záznamy nemovitostí z vašich dat
    const propertyRecords: TableRecord[] = [
      {
        id: 'nem_001',
        plny_nazev: 'Dřevařská 851/4, Brno',
        zkraceny_nazev: 'Dřevařská',
        osloveni_obecne: 'Dobrý den,',
        nazev_svj: 'Společenství vlastníků jednotek Dřevařská 4, Brno',
        osloveni_clenu: 'Vážení členové Společenství vlastníků jednotek Dřevařská 4',
        poznamky: 'Kontakt: p. Novák'
      },
      {
        id: 'nem_002',
        plny_nazev: 'Knihnická 318, Brno',
        zkraceny_nazev: 'Knihnická',
        osloveni_obecne: 'Dobrý den, paní Kučerová,',
        nazev_svj: 'Společenství vlastníků pro dům Neptun',
        osloveni_clenu: 'Vážení členové Společenství vlastníků pro dům Neptun',
        poznamky: 'Nová budova'
      },
      {
        id: 'nem_003',
        plny_nazev: 'Vídeňská 125, Brno',
        zkraceny_nazev: 'Vídeňská',
        osloveni_obecne: 'Dobrý den,',
        nazev_svj: 'Bytové družstvo Vídeňská 125',
        osloveni_clenu: 'Vážení členové bytového družstva',
        poznamky: 'Historická budova'
      }
    ];

    this.records.set('nemovitosti', propertyRecords);

    // Inicializace e-mailových šablon z vašich dat
    const emailTemplates: EmailTemplate[] = [
      {
        id: 'sab_001',
        name: 'Upozornění na vysokou spotřebu vody',
        category: 'upozorneni',
        subject: '❗️ {{zkraceny_nazev}} - Upozornění na vysokou spotřebu vody',
        body: `<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>dovolte mi upozornit Vás na neobvykle vysokou spotřebu vody v budově {{plny_nazev}} za poslední měsíc.</p>

<p>Spotřeba vzrostla oproti stejnému období minulého roku o více než 30%. Prosím, zkontrolujte:</p>

<ul>
<li>Možné úniky vody v bytech</li>
<li>Funkčnost všech uzávěrů</li>
<li>Stav společných rozvodů</li>
</ul>

<p>V případě zjištění problému mě prosím kontaktujte na tomto e-mailu.</p>

<p>Děkuji za pozornost a spolupráci.</p>

<p>{{osloveni_vyboru}}</p>`,
        variables: ['osloveni_obecne', 'osloveni_clenu', 'zkraceny_nazev', 'plny_nazev', 'nazev_svj', 'osloveni_vyboru'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sab_002',
        name: 'Vyúčtování nákladů na vytápění',
        category: 'vyuctovani',
        subject: '🧾 {{zkraceny_nazev}} - Vyúčtování nákladů na vytápění',
        body: `<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>zasíláme Vám vyúčtování nákladů na vytápění pro budovu {{plny_nazev}} za uplynulé období.</p>

<p><strong>Souhrnné informace:</strong></p>
<ul>
<li>Celkové náklady na vytápění: bude doplněno</li>
<li>Průměrná cena za m²: bude doplněno</li>
<li>Způsob rozdělení: dle podlahové plochy</li>
</ul>

<p>Detailní vyúčtování podle jednotlivých bytů naleznete v příloze tohoto e-mailu.</p>

<p>Případné dotazy směřujte na tento e-mail nebo telefonicky.</p>

<p>{{osloveni_vyboru}}</p>`,
        variables: ['osloveni_obecne', 'osloveni_clenu', 'plny_nazev', 'nazev_svj', 'osloveni_vyboru'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sab_003',
        name: 'Pozvánka na schůzi vlastníků',
        category: 'pozvanka',
        subject: '📅 {{zkraceny_nazev}} - Pozvánka na schůzi vlastníků',
        body: `<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>tímto Vás zvu na řádnou schůzi {{nazev_svj}}, která se bude konat:</p>

<p><strong>Datum:</strong> [DOPLNIT DATUM]<br>
<strong>Čas:</strong> [DOPLNIT ČAS]<br>
<strong>Místo:</strong> {{plny_nazev}}, společná místnost</p>

<p><strong>Program schůze:</strong></p>
<ol>
<li>Zahájení, prezence, volba předsednictva</li>
<li>Zpráva o hospodaření</li>
<li>Plán oprav a investic</li>
<li>Různé a diskuse</li>
<li>Závěr</li>
</ol>

<p>Prosím o potvrzení účasti odpovědí na tento e-mail.</p>

<p>Těším se na Vaši účast.</p>

<p>{{osloveni_vyboru}}</p>`,
        variables: ['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'plny_nazev', 'osloveni_vyboru'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    emailTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });

    // Inicializace vzorových proměnných
    const sampleVariables: CustomVariable[] = [
      {
        id: 'var_001',
        name: 'osloveni_vyboru',
        value: 'S pozdravem,\nJan Novák\nSprávce nemovitostí\nTel: +420 123 456 789\nEmail: spravce@nemovitosti.cz',
        type: 'text', 
        description: 'Standardní oslovení výboru',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'var_002',
        name: 'nazev_spolecnosti',
        value: 'Správa nemovitostí s.r.o.',
        type: 'text',
        description: 'Výchozí název společnosti',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'var_003',
        name: 'kontaktni_telefon',
        value: '+420 123 456 789',
        type: 'text',
        description: 'Hlavní kontaktní telefonní číslo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'var_004',
        name: 'email_podpora',
        value: 'podpora@sprava-nemovitosti.cz',
        type: 'text',
        description: 'E-mail pro technickou podporu',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleVariables.forEach(variable => {
      this.variables.set(variable.id, variable);
    });
  }

  // Správa tabulek
  createTable(name: string, fields: TableField[]): CommandResult {
    const id = name.toLowerCase().replace(/\s+/g, '_');
    
    if (this.tables.has(id)) {
      return { success: false, message: `Tabulka '${name}' již existuje` };
    }

    const schema: TableSchema = {
      id,
      name,
      fields,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tables.set(id, schema);
    this.records.set(id, []);

    return { 
      success: true, 
      message: `Tabulka '${name}' byla úspěšně vytvořena`,
      data: schema
    };
  }

  getTables(): TableSchema[] {
    return Array.from(this.tables.values());
  }

  getTable(id: string): TableSchema | null {
    return this.tables.get(id) || null;
  }

  deleteTable(id: string): CommandResult {
    if (!this.tables.has(id)) {
      return { success: false, message: `Tabulka '${id}' nebyla nalezena` };
    }

    this.tables.delete(id);
    this.records.delete(id);

    return { success: true, message: `Tabulka '${id}' byla úspěšně smazána` };
  }

  // Správa záznamů
  addRecord(tableId: string, data: Omit<TableRecord, 'id'>): CommandResult {
    const table = this.tables.get(tableId);
    if (!table) {
      return { success: false, message: `Tabulka '${tableId}' nebyla nalezena` };
    }

    // Validace povinných polí
    for (const field of table.fields) {
      if (field.required && !data[field.name]) {
        return { 
          success: false, 
          message: `Povinné pole '${field.name}' chybí` 
        };
      }
    }

    const record: TableRecord = {
      id: `${tableId}_${Date.now()}`,
      ...data
    };

    const records = this.records.get(tableId) || [];
    records.push(record);
    this.records.set(tableId, records);

    return { 
      success: true, 
      message: 'Záznam byl úspěšně přidán',
      data: record
    };
  }

  getRecords(tableId: string, filter?: string): TableRecord[] {
    const records = this.records.get(tableId) || [];
    
    if (!filter) return records;

    return records.filter(record => 
      Object.values(record).some(value => 
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }

  updateRecord(tableId: string, recordId: string, data: Partial<TableRecord>): CommandResult {
    const records = this.records.get(tableId) || [];
    const index = records.findIndex(r => r.id === recordId);

    if (index === -1) {
      return { success: false, message: `Záznam '${recordId}' nebyl nalezen` };
    }

    records[index] = { ...records[index], ...data };
    this.records.set(tableId, records);

    return { 
      success: true, 
      message: 'Záznam byl úspěšně aktualizován',
      data: records[index]
    };
  }

  deleteRecord(tableId: string, recordId: string): CommandResult {
    const records = this.records.get(tableId) || [];
    const index = records.findIndex(r => r.id === recordId);

    if (index === -1) {
      return { success: false, message: `Záznam '${recordId}' nebyl nalezen` };
    }

    records.splice(index, 1);
    this.records.set(tableId, records);

    return { success: true, message: 'Záznam byl úspěšně smazán' };
  }

  // Správa proměnných
  createVariable(name: string, value: any, type: CustomVariable['type'], description?: string): CommandResult {
    const id = `var_${Date.now()}`;
    
    if (Array.from(this.variables.values()).some(v => v.name === name)) {
      return { success: false, message: `Proměnná '${name}' již existuje` };
    }

    const variable: CustomVariable = {
      id,
      name,
      value,
      type,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.variables.set(id, variable);

    return { 
      success: true, 
      message: `Proměnná '${name}' byla úspěšně vytvořena`,
      data: variable
    };
  }

  getVariables(): CustomVariable[] {
    return Array.from(this.variables.values());
  }

  updateVariable(name: string, value: any): CommandResult {
    const variable = Array.from(this.variables.values()).find(v => v.name === name);
    
    if (!variable) {
      return { success: false, message: `Proměnná '${name}' nebyla nalezena` };
    }

    variable.value = value;
    variable.updatedAt = new Date();
    this.variables.set(variable.id, variable);

    return { 
      success: true, 
      message: `Proměnná '${name}' byla úspěšně aktualizována`,
      data: variable
    };
  }

  deleteVariable(name: string): CommandResult {
    const variable = Array.from(this.variables.values()).find(v => v.name === name);
    
    if (!variable) {
      return { success: false, message: `Proměnná '${name}' nebyla nalezena` };
    }

    this.variables.delete(variable.id);

    return { success: true, message: `Proměnná '${name}' byla úspěšně smazána` };
  }

  // Správa šablon
  createTemplate(name: string, category: string, subject: string, body: string): CommandResult {
    const id = `sab_${Date.now()}`;
    
    // Extrakce proměnných ze šablony
    const variableRegex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = variableRegex.exec(subject + ' ' + body)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    const template: EmailTemplate = {
      id,
      name,
      category,
      subject,
      body,
      variables,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(id, template);

    return { 
      success: true, 
      message: `Šablona '${name}' byla úspěšně vytvořena`,
      data: template
    };
  }

  getTemplates(): EmailTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplate(id: string): EmailTemplate | null {
    return this.templates.get(id) || null;
  }

  updateTemplate(id: string, updates: Partial<EmailTemplate>): CommandResult {
    const template = this.templates.get(id);
    
    if (!template) {
      return { success: false, message: `Šablona '${id}' nebyla nalezena` };
    }

    const updatedTemplate = { ...template, ...updates, updatedAt: new Date() };
    
    // Opětovná extrakce proměnných při změně předmětu nebo těla
    if (updates.subject || updates.body) {
      const variableRegex = /\{\{(\w+)\}\}/g;
      const variables: string[] = [];
      let match;
      
      while ((match = variableRegex.exec(updatedTemplate.subject + ' ' + updatedTemplate.body)) !== null) {
        if (!variables.includes(match[1])) {
          variables.push(match[1]);
        }
      }
      
      updatedTemplate.variables = variables;
    }

    this.templates.set(id, updatedTemplate);

    return { 
      success: true, 
      message: `Šablona '${id}' byla úspěšně aktualizována`,
      data: updatedTemplate
    };
  }

  deleteTemplate(id: string): CommandResult {
    if (!this.templates.has(id)) {
      return { success: false, message: `Šablona '${id}' nebyla nalezena` };
    }

    this.templates.delete(id);

    return { success: true, message: `Šablona '${id}' byla úspěšně smazána` };
  }

  // Generování e-mailů
  generateEmail(templateId: string, recordId: string, tableId: string): CommandResult {
    const template = this.templates.get(templateId);
    const records = this.records.get(tableId) || [];
    const record = records.find(r => r.id === recordId);

    if (!template) {
      return { success: false, message: `Šablona '${templateId}' nebyla nalezena` };
    }

    if (!record) {
      return { success: false, message: `Záznam '${recordId}' nebyl nalezen` };
    }

    let subject = template.subject;
    let body = template.body;

    // Nahrazení proměnných šablony daty ze záznamu
    for (const variable of template.variables) {
      const value = record[variable] || '';
      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
      subject = subject.replace(regex, String(value));
      body = body.replace(regex, String(value));
    }

    // Nahrazení vlastními proměnnými
    for (const variable of this.variables.values()) {
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
      subject = subject.replace(regex, String(variable.value));
      body = body.replace(regex, String(variable.value));
    }

    return {
      success: true,
      message: 'E-mail byl úspěšně vygenerován',
      data: { subject, body, template: template.name, record: record }
    };
  }

  // Nápověda příkazů
  getCommands(): AdminCommand[] {
    return [
      {
        command: 'vytvor tabulku',
        description: 'Vytvoří novou datovou tabulku',
        syntax: 'vytvor tabulku <nazev> s poli: <pole1:typ>, <pole2:typ>',
        examples: [
          'vytvor tabulku zakaznici s poli: jmeno:text, email:email, telefon:phone',
          'vytvor tabulku produkty s poli: nazev:text, cena:number, aktivni:boolean'
        ]
      },
      {
        command: 'pridej zaznam',
        description: 'Přidá nový záznam do tabulky',
        syntax: 'pridej zaznam do <tabulka> s <pole>=<hodnota>',
        examples: [
          'pridej zaznam do zakaznici s jmeno=Jan Novák, email=jan@example.com',
          'pridej zaznam do produkty s nazev=Widget, cena=299'
        ]
      },
      {
        command: 'vytvor promennou',
        description: 'Vytvoří vlastní proměnnou',
        syntax: 'vytvor promennou <nazev>=<hodnota> typ:<typ>',
        examples: [
          'vytvor promennou nazev_firmy="Moje firma s.r.o." typ:text',
          'vytvor promennou vychozi_sleva=10 typ:number'
        ]
      },
      {
        command: 'vytvor sablonu',
        description: 'Vytvoří e-mailovou šablonu',
        syntax: 'vytvor sablonu <nazev> kategorie:<kategorie> predmet:<predmet> telo:<telo>',
        examples: [
          'vytvor sablonu vitani kategorie:uvitani predmet:"Vítejte {{jmeno}}" telo:"Dobrý den {{jmeno}}, vítejte v naší službě!"'
        ]
      },
      {
        command: 'vygeneruj email',
        description: 'Vygeneruje e-mail ze šablony a záznamu',
        syntax: 'vygeneruj email sablona:<id_sablony> zaznam:<id_zaznamu> tabulka:<id_tabulky>',
        examples: [
          'vygeneruj email sablona:sab_001 zaznam:nem_001 tabulka:nemovitosti'
        ]
      }
    ];
  }
}

export const adminService = new AdminService();