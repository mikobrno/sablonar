# Systém správy e-mailových šablon

Komplexní administrační systém pro správu e-mailových šablon, budov a dynamických proměnných pro SVJ a bytová družstva.

## 🚀 Funkce

### Základní funkcionalita
- **Správa budov**: Přidávání, úpravy a mazání nemovitostí s dynamickými daty
- **E-mailové šablony**: Vytváření a správa šablon s podporou proměnných
- **Generování e-mailů**: Automatické nahrazování proměnných skutečnými daty
- **Historie**: Sledování všech vygenerovaných e-mailů

### Administrační rozhraní
- **Statické proměnné**: Správa globálních konstant (např. podpis správce)
- **Dynamické proměnné**: Pokročilá správa uživatelských proměnných
- **Validace**: Kontrola duplicitních názvů a správného formátu
- **Vyhledávání**: Rychlé nalezení proměnných a šablon
- **Bezpečnost**: Ověřování vstupů a zabezpečené operace

### Uživatelské rozhraní
- **Pokročilé rozhraní**: Plná funkcionalita pro administrátory
- **Jednoduché rozhraní**: Zjednodušené generování e-mailů
- **Responzivní design**: Optimalizováno pro všechna zařízení
- **Moderní UI**: Intuitivní ovládání s animacemi a přechody

## 🛠️ Technologie

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Row Level Security)
- **Ikony**: Lucide React
- **Build**: Vite
- **Deployment**: Netlify

## 📦 Instalace

1. **Klonování repozitáře**:
```bash
git clone <repository-url>
cd email-template-system
```

2. **Instalace závislostí**:
```bash
npm install
```

3. **Konfigurace prostředí**:
```bash
cp .env.example .env
# Upravte .env s vašimi Supabase údaji
```

4. **Spuštění vývojového serveru**:
```bash
npm run dev
```

## 🗄️ Nastavení databáze

Podrobné instrukce najdete v souboru `SUPABASE_SETUP.md`.

### Rychlé nastavení:
1. Vytvořte Supabase projekt
2. Zkopírujte Project URL a anon key do `.env`
3. Spusťte migrace v Supabase SQL editoru

## 📋 Struktura projektu

```
src/
├── components/
│   ├── admin/              # Administrační komponenty
│   │   ├── AdminDashboard.tsx
│   │   ├── BuildingManager.tsx
│   │   ├── VariableManager.tsx
│   │   ├── DynamicVariableManager.tsx  # NOVÉ
│   │   ├── TemplateManager.tsx
│   │   └── EmailHistory.tsx
│   ├── template/           # Komponenty pro šablony
│   └── simple/             # Jednoduché rozhraní
├── services/
│   ├── SupabaseService.ts  # Databázové operace
│   ├── TemplateService.ts  # Správa šablon
│   └── AdminService.ts     # Administrační funkce
├── types/                  # TypeScript definice
└── lib/
    └── supabase.ts         # Supabase konfigurace
```

## 🔧 Nové funkce v administraci

### Správa dynamických proměnných
- **Vytváření proměnných**: Formulář s validací názvu a hodnoty
- **Úpravy**: Možnost změny hodnoty a popisu existujících proměnných
- **Mazání**: Bezpečné mazání s potvrzením
- **Vyhledávání**: Filtrování podle názvu, hodnoty nebo popisu
- **Validace**: Kontrola formátu názvu a duplicit

### Vylepšená bezpečnost
- **Validace vstupů**: Kontrola formátu názvů proměnných
- **Prevence duplicit**: Automatická kontrola existujících názvů
- **Error handling**: Uživatelsky přívětivé chybové hlášky
- **Success feedback**: Potvrzení úspěšných operací

### Uživatelské rozhraní
- **Responzivní design**: Optimalizováno pro mobily i desktop
- **Moderní vzhled**: Gradient pozadí a animace
- **Intuitivní ovládání**: Jasné ikony a popisky
- **Accessibility**: Podpora klávesnice a screen readerů

## 🚀 Deployment

Aplikace je automaticky nasazena na Netlify při každém commitu do main větve.

**Live URL**: https://charming-wisp-65964f.netlify.app

### Manuální deployment:
```bash
npm run build
# Nahrajte obsah dist/ složky na váš hosting
```

## 📝 Použití

### Základní workflow:
1. **Přidejte budovy** v administraci
2. **Vytvořte proměnné** (statické i dynamické)
3. **Napište e-mailové šablony** s proměnnými
4. **Generujte e-maily** výběrem budovy a šablony

### Proměnné v šablonách:
```html
<p>{{osloveni_obecne}}</p>
<p>{{osloveni_clenu}},</p>
<p>Informujeme vás o situaci v budově {{plny_nazev}}.</p>
<p>{{osloveni_vyboru}}</p>
```

## 🤝 Přispívání

1. Forkněte repozitář
2. Vytvořte feature branch (`git checkout -b feature/nova-funkcionalita`)
3. Commitněte změny (`git commit -am 'Přidána nová funkcionalita'`)
4. Pushněte do branch (`git push origin feature/nova-funkcionalita`)
5. Vytvořte Pull Request

## 📄 Licence

Tento projekt je licencován pod MIT licencí.

## 🆘 Podpora

Pro podporu a dotazy:
- Vytvořte issue v GitHub repozitáři
- Kontaktujte vývojový tým

## 🔄 Changelog

### v3.1.0 (Nejnovější)
- ✨ **NOVÉ**: Kompletní správa dynamických proměnných
- ✨ **NOVÉ**: Pokročilá validace a kontrola duplicit
- ✨ **NOVÉ**: Vylepšené vyhledávání a filtrování
- 🔧 **VYLEPŠENO**: Administrační rozhraní s lepší navigací
- 🔧 **VYLEPŠENO**: Error handling a user feedback
- 🐛 **OPRAVENO**: Různé drobné chyby v UI

### v3.0.0
- ✨ Základní administrační systém
- ✨ Správa budov, šablon a statických proměnných
- ✨ Generování e-mailů s proměnnými
- ✨ Jednoduché a pokročilé rozhraní