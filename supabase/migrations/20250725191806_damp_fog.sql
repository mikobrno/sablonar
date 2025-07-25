/*
  # Replace podpis_spravce with osloveni_vyboru

  1. Database Changes
    - Update static variable name from 'podpis_spravce' to 'osloveni_vyboru'
    - Update all email templates that use this variable in subject and body
    - Update used_variables arrays in all affected templates

  2. Security
    - Preserve all existing data
    - Only rename the variable, not change its value
*/

-- Update static variable name
UPDATE static_variables 
SET name = 'osloveni_vyboru' 
WHERE name = 'podpis_spravce';

-- Update all email templates - replace in subject
UPDATE email_templates 
SET subject = REPLACE(subject, '{{podpis_spravce}}', '{{osloveni_vyboru}}')
WHERE subject LIKE '%{{podpis_spravce}}%';

-- Update all email templates - replace in body
UPDATE email_templates 
SET body = REPLACE(body, '{{podpis_spravce}}', '{{osloveni_vyboru}}')
WHERE body LIKE '%{{podpis_spravce}}%';

-- Update used_variables arrays in all templates
UPDATE email_templates 
SET used_variables = array_replace(used_variables, 'podpis_spravce', 'osloveni_vyboru')
WHERE 'podpis_spravce' = ANY(used_variables);