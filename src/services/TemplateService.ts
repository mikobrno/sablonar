import { Building, StaticVariable, Template, GeneratedEmail, Variable, VariableGroup } from '../types/template';

class TemplateService {
  private buildings: Map<string, Building> = new Map();
  private staticVariables: Map<string, StaticVariable> = new Map();
  private templates: Map<string, Template> = new Map();
  private generatedEmails: GeneratedEmail[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Inicializace budov s reálnými daty
    const sampleBuildings: Building[] = [
      {
        id: 'bud_001',
        name: 'Dřevařská 851/4, Brno',
        data: {
          plny_nazev: 'Dřevařská 851/4, Brno',
          zkraceny_nazev: 'Dřevařská',
          osloveni_obecne: 'Dobrý den,',
          nazev_svj: 'Společenství vlastníků jednotek Dřevařská 4, Brno',
          osloveni_clenu: 'Vážení členové Společenství vlastníků jednotek Dřevařská 4',
          poznamky: 'Kontakt: p. Novák',
          adresa: 'Dřevařská 851/4, 602 00 Brno',
          ico: '12345678',
          telefon: '+420 123 456 789'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'bud_002',
        name: 'Knihnická 318, Brno',
        data: {
          plny_nazev: 'Knihnická 318, Brno',
          zkraceny_nazev: 'Knihnická',
          osloveni_obecne: 'Dobrý den, paní Kučerová,',
          nazev_svj: 'Společenství vlastníků pro dům Neptun',
          osloveni_clenu: 'Vážení členové Společenství vlastníků pro dům Neptun',
          poznamky: 'Nová budova',
          adresa: 'Knihnická 318, 602 00 Brno',
          ico: '87654321',
          telefon: '+420 987 654 321'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'bud_003',
        name: 'Vídeňská 125, Brno',
        data: {
          plny_nazev: 'Vídeňská 125, Brno',
          zkraceny_nazev: 'Vídeňská',
          osloveni_obecne: 'Dobrý den,',
          nazev_svj: 'Bytové družstvo Vídeňská 125',
          osloveni_clenu: 'Vážení členové bytového družstva',
          poznamky: 'Historická budova',
          adresa: 'Vídeňská 125, 602 00 Brno',
          ico: '11223344',
          telefon: '+420 555 666 777'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleBuildings.forEach(building => {
      this.buildings.set(building.id, building);
    });

    // Inicializace statických proměnných
    const sampleStaticVariables: StaticVariable[] = [
      {
        id: 'var_001',
        name: 'osloveni_vyboru',
        value: 'S pozdravem,\nJan Novák\nSprávce nemovitostí\nTel: +420 123 456 789\nEmail: spravce@nemovitosti.cz',
        description: 'Standardní podpis správce',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'var_002',
        name: 'nazev_spolecnosti',
        value: 'Správa nemovitostí s.r.o.',
        description: 'Název správcovské společnosti',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'var_003',
        name: 'kontaktni_email',
        value: 'info@sprava-nemovitosti.cz',
        description: 'Hlavní kontaktní e-mail',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'var_004',
        name: 'aktualni_datum',
        value: new Date().toLocaleDateString('cs-CZ'),
        description: 'Aktuální datum',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleStaticVariables.forEach(variable => {
      this.staticVariables.set(variable.id, variable);
    });

    // Inicializace šablon
    const sampleTemplates: Template[] = [
      {
        id: 'tpl_001',
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

<p>V případě zjištění problému mě prosím kontaktujte na e-mailu {{kontaktni_email}} nebo telefonicky na {{telefon}}.</p>

<p>Děkuji za pozornost a spolupráci.</p>

<p>{{osloveni_vyboru}}</p>`,
        usedVariables: ['osloveni_obecne', 'osloveni_clenu', 'plny_nazev', 'zkraceny_nazev', 'kontaktni_email', 'telefon', 'osloveni_vyboru'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'tpl_002',
        name: 'Pozvánka na schůzi vlastníků',
        category: 'pozvanka',
        subject: '📅 {{zkraceny_nazev}} - Pozvánka na schůzi vlastníků',
        body: `<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>tímto Vás zvu na řádnou schůzi {{nazev_svj}}, která se bude konat:</p>

<p><strong>Datum:</strong> [DOPLNIT DATUM]<br>
<strong>Čas:</strong> 18:00<br>
<strong>Místo:</strong> {{adresa}}, společná místnost</p>

<p><strong>Program schůze:</strong></p>
<ol>
<li>Zahájení, prezence, volba předsednictva</li>
<li>Zpráva o hospodaření za rok 2024</li>
<li>Plán oprav a investic na rok 2025</li>
<li>Různé a diskuse</li>
<li>Závěr</li>
</ol>

<p>Prosím o potvrzení účasti odpovědí na tento e-mail.</p>

<p>Těším se na Vaši účast.</p>

<p>{{osloveni_vyboru}}</p>`,
        usedVariables: ['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'zkraceny_nazev', 'adresa', 'osloveni_vyboru'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'tpl_003',
        name: 'Vyúčtování nákladů na vytápění',
        category: 'vyuctovani',
        subject: '🧾 {{zkraceny_nazev}} - Vyúčtování nákladů na vytápění',
        body: `<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>zasíláme Vám vyúčtování nákladů na vytápění pro budovu {{plny_nazev}} za uplynulé období.</p>

<p><strong>Základní informace:</strong></p>
<ul>
<li>Budova: {{plny_nazev}}</li>
<li>IČO: {{ico}}</li>
<li>Datum vyúčtování: {{aktualni_datum}}</li>
</ul>

<p><strong>Souhrnné informace:</strong></p>
<ul>
<li>Celkové náklady na vytápění: bude doplněno</li>
<li>Průměrná cena za m²: bude doplněno</li>
<li>Způsob rozdělení: dle podlahové plochy</li>
</ul>

<p>Detailní vyúčtování podle jednotlivých bytů naleznete v příloze tohoto e-mailu.</p>

<p>Případné dotazy směřujte na {{kontaktni_email}} nebo telefonicky na {{telefon}}.</p>

<p>{{osloveni_vyboru}}</p>`,
        usedVariables: ['osloveni_obecne', 'osloveni_clenu', 'plny_nazev', 'zkraceny_nazev', 'ico', 'aktualni_datum', 'kontaktni_email', 'telefon', 'osloveni_vyboru'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Správa budov
  getBuildings(): Building[] {
    return Array.from(this.buildings.values());
  }

  getBuilding(id: string): Building | null {
    return this.buildings.get(id) || null;
  }

  createBuilding(name: string, data: Record<string, any>): Building {
    const building: Building = {
      id: `bud_${Date.now()}`,
      name,
      data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.buildings.set(building.id, building);
    return building;
  }

  updateBuilding(id: string, updates: Partial<Building>): Building | null {
    const building = this.buildings.get(id);
    if (!building) return null;

    const updatedBuilding = { ...building, ...updates, updatedAt: new Date() };
    this.buildings.set(id, updatedBuilding);
    return updatedBuilding;
  }

  deleteBuilding(id: string): boolean {
    return this.buildings.delete(id);
  }

  // Správa statických proměnných
  getStaticVariables(): StaticVariable[] {
    return Array.from(this.staticVariables.values());
  }

  createStaticVariable(name: string, value: string, description?: string): StaticVariable {
    const variable: StaticVariable = {
      id: `var_${Date.now()}`,
      name,
      value,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.staticVariables.set(variable.id, variable);
    return variable;
  }

  updateStaticVariable(id: string, updates: Partial<StaticVariable>): StaticVariable | null {
    const variable = this.staticVariables.get(id);
    if (!variable) return null;

    const updatedVariable = { ...variable, ...updates, updatedAt: new Date() };
    this.staticVariables.set(id, updatedVariable);
    return updatedVariable;
  }

  deleteStaticVariable(id: string): boolean {
    return this.staticVariables.delete(id);
  }

  // Správa šablon
  getTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  getTemplate(id: string): Template | null {
    return this.templates.get(id) || null;
  }

  createTemplate(name: string, category: string, subject: string, body: string): Template {
    const usedVariables = this.extractVariables(subject + ' ' + body);
    const template: Template = {
      id: `tpl_${Date.now()}`,
      name,
      category,
      subject,
      body,
      usedVariables,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.templates.set(template.id, template);
    return template;
  }

  updateTemplate(id: string, updates: Partial<Template>): Template | null {
    const template = this.templates.get(id);
    if (!template) return null;

    const updatedTemplate = { ...template, ...updates, updatedAt: new Date() };
    if (updates.subject || updates.body) {
      updatedTemplate.usedVariables = this.extractVariables(
        (updates.subject || template.subject) + ' ' + (updates.body || template.body)
      );
    }
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  // Získání dostupných proměnných pro konkrétní budovu
  getAvailableVariables(buildingId: string): VariableGroup[] {
    const building = this.buildings.get(buildingId);
    const groups: VariableGroup[] = [];

    // Statické proměnné
    const staticVars: Variable[] = Array.from(this.staticVariables.values()).map(v => ({
      name: v.name,
      value: v.value,
      type: 'static' as const,
      description: v.description
    }));

    if (staticVars.length > 0) {
      groups.push({
        name: 'Statické proměnné',
        variables: staticVars,
        color: 'bg-purple-100 text-purple-800'
      });
    }

    // Dynamické proměnné z budovy
    if (building) {
      const dynamicVars: Variable[] = Object.entries(building.data).map(([key, value]) => ({
        name: key,
        value: String(value),
        type: 'dynamic' as const,
        description: `Hodnota z budovy: ${building.name}`
      }));

      if (dynamicVars.length > 0) {
        groups.push({
          name: `Údaje budovy: ${building.name}`,
          variables: dynamicVars,
          color: 'bg-blue-100 text-blue-800'
        });
      }
    }

    return groups;
  }

  // Generování e-mailu
  generateEmail(templateId: string, buildingId: string): GeneratedEmail | null {
    const template = this.templates.get(templateId);
    const building = this.buildings.get(buildingId);

    if (!template || !building) return null;

    let subject = template.subject;
    let body = template.body;

    // Nahrazení dynamických proměnných z budovy
    Object.entries(building.data).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      subject = subject.replace(regex, String(value));
      body = body.replace(regex, String(value));
    });

    // Nahrazení statických proměnných
    this.staticVariables.forEach(variable => {
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
      subject = subject.replace(regex, variable.value);
      body = body.replace(regex, variable.value);
    });

    const generatedEmail: GeneratedEmail = {
      subject,
      body,
      buildingName: building.name,
      templateName: template.name,
      generatedAt: new Date()
    };

    this.generatedEmails.push(generatedEmail);
    return generatedEmail;
  }

  // Pomocné metody
  private extractVariables(text: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  getGeneratedEmails(): GeneratedEmail[] {
    return this.generatedEmails;
  }

  // Přidání/odebrání sloupce v budově (dynamické proměnné)
  addBuildingField(buildingId: string, fieldName: string, defaultValue: any = ''): boolean {
    const building = this.buildings.get(buildingId);
    if (!building) return false;

    building.data[fieldName] = defaultValue;
    building.updatedAt = new Date();
    this.buildings.set(buildingId, building);
    return true;
  }

  removeBuildingField(buildingId: string, fieldName: string): boolean {
    const building = this.buildings.get(buildingId);
    if (!building) return false;

    delete building.data[fieldName];
    building.updatedAt = new Date();
    this.buildings.set(buildingId, building);
    return true;
  }
}

export const templateService = new TemplateService();