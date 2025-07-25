/*
  # Změna proměnné podpis_spravce na osloveni_vyboru

  1. Změny v databázi
    - Aktualizace názvu statické proměnné z 'podpis_spravce' na 'osloveni_vyboru'
    - Aktualizace všech e-mailových šablon, které používají tuto proměnnou
    - Aktualizace pole used_variables ve všech dotčených šablonách

  2. Bezpečnost
    - Zachování všech existujících dat
    - Pouze přejmenování proměnné, ne změna hodnoty
*/

-- Aktualizace názvu statické proměnné
UPDATE static_variables 
SET name = 'osloveni_vyboru' 
WHERE name = 'podpis_spravce';

-- Aktualizace všech e-mailových šablon - nahrazení v subject
UPDATE email_templates 
SET subject = REPLACE(subject, '{{podpis_spravce}}', '{{osloveni_vyboru}}')
WHERE subject LIKE '%{{podpis_spravce}}%';

-- Aktualizace všech e-mailových šablon - nahrazení v body
UPDATE email_templates 
SET body = REPLACE(body, '{{podpis_spravce}}', '{{osloveni_vyboru}}')
WHERE body LIKE '%{{podpis_spravce}}%';

-- Aktualizace pole used_variables ve všech šablonách
UPDATE email_templates 
SET used_variables = array_replace(used_variables, 'podpis_spravce', 'osloveni_vyboru')
WHERE 'podpis_spravce' = ANY(used_variables);