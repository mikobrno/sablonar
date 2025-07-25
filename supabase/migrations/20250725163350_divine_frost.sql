/*
  # Počáteční databázové schéma pro systém správy šablon

  1. Nové tabulky
    - `buildings` (budovy/nemovitosti)
      - `id` (uuid, primary key)
      - `name` (text)
      - `data` (jsonb) - dynamická data pro proměnné
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `static_variables` (statické proměnné)
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `value` (text)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `email_templates` (e-mailové šablony)
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `subject` (text)
      - `body` (text)
      - `used_variables` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `generated_emails` (vygenerované e-maily)
      - `id` (uuid, primary key)
      - `subject` (text)
      - `body` (text)
      - `building_name` (text)
      - `template_name` (text)
      - `generated_at` (timestamp)

  2. Zabezpečení
    - Enable RLS na všech tabulkách
    - Přidat políčky pro veřejný přístup (pro demo účely)
*/

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