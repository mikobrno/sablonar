# Nastavení Supabase pro Administrační systém

Tento dokument obsahuje podrobné instrukce pro nastavení Supabase databáze pro váš administrační systém správy šablon.

## 🚀 Rychlý start

### 1. Vytvoření Supabase projektu

1. Přejděte na [supabase.com](https://supabase.com)
2. Klikněte na "Start your project"
3. Přihlaste se pomocí GitHub účtu
4. Klikněte na "New project"
5. Vyberte organizaci a zadejte:
   - **Name**: `email-template-system`
   - **Database Password**: Vygenerujte silné heslo
   - **Region**: Vyberte nejbližší region
6. Klikněte na "Create new project"

### 2. Získání přístupových údajů

Po vytvoření projektu:

1. Přejděte do **Settings** → **API**
2. Zkopírujte tyto hodnoty:
   - **Project URL** (např. `https://abcdefghijklmnop.supabase.co`)
   - **anon public** klíč (začíná `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Konfigurace prostředí

1. Vytvořte soubor `.env` v kořenovém adresáři projektu:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Nahraďte hodnoty vašimi skutečnými údaji z Supabase

## 🗄️ Nastavení databáze

### Automatické nastavení (Doporučeno)

Pokud máte Supabase CLI nainstalované:

```bash
# Spuštění migrací
supabase db push
```

### Manuální nastavení

1. Přejděte do **SQL Editor** v Supabase Dashboard
2. Spusťte následující SQL skripty v tomto pořadí:

#### Krok 1: Vytvoření tabulek a zabezpečení

```sql
-- Vytvoření tabulky buildings
CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vytvoření tabulky static_variables
CREATE TABLE IF NOT EXISTS static_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vytvoření tabulky email_templates
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  subject text NOT NULL,
  body text NOT NULL,
  used_variables text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vytvoření tabulky generated_emails
CREATE TABLE IF NOT EXISTS generated_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  body text NOT NULL,
  building_name text NOT NULL,
  template_name text NOT NULL,
  generated_at timestamptz DEFAULT now()
);

-- Povolení Row Level Security
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_emails ENABLE ROW LEVEL SECURITY;

-- Vytvoření politik pro veřejný přístup (pro demo účely)
CREATE POLICY "Veřejný přístup k buildings" ON buildings FOR ALL USING (true);
CREATE POLICY "Veřejný přístup k static_variables" ON static_variables FOR ALL USING (true);
CREATE POLICY "Veřejný přístup k email_templates" ON email_templates FOR ALL USING (true);
CREATE POLICY "Veřejný přístup k generated_emails" ON generated_emails FOR ALL USING (true);

-- Vytvoření funkcí pro automatické aktualizace updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Vytvoření triggerů pro automatické aktualizace
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_static_variables_updated_at BEFORE UPDATE ON static_variables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Krok 2: Vložení vzorových dat

```sql
-- Vložení vzorových budov
INSERT INTO buildings (name, data) VALUES
(
  'Dřevařská 851/4, Brno',
  '{
    "plny_nazev": "Dřevařská 851/4, Brno",
    "zkraceny_nazev": "Dřevařská",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků jednotek Dřevařská 4, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků jednotek Dřevařská 4",
    "poznamky": "Kontakt: p. Novák",
    "adresa": "Dřevařská 851/4, 602 00 Brno",
    "ico": "12345678",
    "telefon": "+420 123 456 789"
  }'
),
(
  'Knihnická 318, Brno',
  '{
    "plny_nazev": "Knihnická 318, Brno",
    "zkraceny_nazev": "Knihnická",
    "osloveni_obecne": "Dobrý den, paní Kučerová,",
    "nazev_svj": "Společenství vlastníků pro dům Neptun",
    "osloveni_clenu": "Vážení členové Společenství vlastníků pro dům Neptun",
    "poznamky": "Nová budova",
    "adresa": "Knihnická 318, 602 00 Brno",
    "ico": "87654321",
    "telefon": "+420 987 654 321"
  }'
),
(
  'Vídeňská 125, Brno',
  '{
    "plny_nazev": "Vídeňská 125, Brno",
    "zkraceny_nazev": "Vídeňská",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Bytové družstvo Vídeňská 125",
    "osloveni_clenu": "Vážení členové bytového družstva",
    "poznamky": "Historická budova",
    "adresa": "Vídeňská 125, 602 00 Brno",
    "ico": "11223344",
    "telefon": "+420 555 666 777"
  }'
);

-- Vložení statických proměnných
INSERT INTO static_variables (name, value, description) VALUES
('podpis_spravce', 'S pozdravem,\nJan Novák\nSprávce nemovitostí\nTel: +420 123 456 789\nEmail: spravce@nemovitosti.cz', 'Standardní podpis správce'),
('nazev_spolecnosti', 'Správa nemovitostí s.r.o.', 'Název správcovské společnosti'),
('kontaktni_email', 'info@sprava-nemovitosti.cz', 'Hlavní kontaktní e-mail'),
('aktualni_datum', '2024-01-15', 'Aktuální datum');

-- Vložení e-mailových šablon
INSERT INTO email_templates (name, category, subject, body, used_variables) VALUES
(
  'Upozornění na vysokou spotřebu vody',
  'upozorneni',
  '❗️ {{zkraceny_nazev}} - Upozornění na vysokou spotřebu vody',
  '<p>{{osloveni_obecne}}</p>

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

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'plny_nazev', 'zkraceny_nazev', 'kontaktni_email', 'telefon', 'podpis_spravce']
);
```

## 🔒 Zabezpečení

### Row Level Security (RLS)

Systém používá RLS pro zabezpečení dat. Pro demo účely jsou nastaveny veřejné politiky, ale pro produkční použití doporučujeme:

1. **Autentifikace uživatelů**:
```sql
-- Příklad politiky pro autentifikované uživatele
CREATE POLICY "Pouze autentifikovaní uživatelé" ON buildings 
FOR ALL TO authenticated USING (true);
```

2. **Role-based přístup**:
```sql
-- Příklad politiky pro administrátory
CREATE POLICY "Pouze administrátoři" ON buildings 
FOR ALL TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');
```

## 🧪 Testování připojení

Po nastavení spusťte aplikaci:

```bash
npm run dev
```

Aplikace by se měla připojit k Supabase a načíst vzorová data. Zkontrolujte:

1. **Konzoli prohlížeče** - neměly by být žádné chyby připojení
2. **Administrační panel** - měly by se zobrazit vzorové budovy, proměnné a šablony
3. **Funkčnost CRUD** - zkuste přidat, upravit nebo smazat záznam

## 🚀 Nasazení

### Produkční prostředí

1. **Aktualizujte RLS politiky** pro produkční zabezpečení
2. **Nastavte environment variables** na vašem hosting provideru
3. **Zálohujte databázi** před nasazením

### Monitoring

Supabase poskytuje:
- **Dashboard** pro monitoring výkonu
- **Logy** pro debugging
- **Metriky** pro sledování využití

## 🆘 Řešení problémů

### Časté problémy

1. **"Invalid API key"**
   - Zkontrolujte `.env` soubor
   - Ověřte, že používáte `anon` klíč, ne `service_role`

2. **"Row Level Security policy violation"**
   - Zkontrolujte RLS politiky
   - Pro vývoj můžete dočasně vypnout RLS: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`

3. **"Connection refused"**
   - Ověřte Project URL
   - Zkontrolujte internetové připojení

### Debug režim

Pro detailní logování přidejte do `.env`:

```bash
VITE_DEBUG=true
```

## 📞 Podpora

- **Supabase dokumentace**: [docs.supabase.com](https://docs.supabase.com)
- **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)