import { Property, EmailTemplate, EmailPreview } from '../types';

export function generateEmailPreview(
  property: Property | null,
  template: EmailTemplate | null
): EmailPreview | null {
  if (!property || !template) {
    return null;
  }

  const variables: Record<string, string> = {
    '{{full_name}}': property.full_name,
    '{{short_name}}': property.short_name,
    '{{salutation_general}}': property.salutation_general,
    '{{svj_name_full}}': property.svj_name_full,
    '{{salutation_members}}': property.salutation_members,
  };

  let subject = template.email_subject;
  let body = template.email_body;

  // Replace all variables in subject and body
  Object.entries(variables).forEach(([placeholder, value]) => {
    subject = subject.replaceAll(placeholder, value);
    body = body.replaceAll(placeholder, value);
  });

  return {
    subject,
    body
  };
}

export function exportToGoogleSheetsFormat() {
  // This would be used for integration with Google Sheets
  return {
    properties: "Ready for Google Sheets export",
    templates: "Ready for Google Sheets export"
  };
}