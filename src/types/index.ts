export interface Property {
  property_id: string;
  full_name: string;
  short_name: string;
  salutation_general: string;
  svj_name_full: string;
  salutation_members: string;
  notes?: string;
}

export interface EmailTemplate {
  template_id: string;
  template_name: string;
  email_subject: string;
  email_body: string;
}

export interface EmailPreview {
  subject: string;
  body: string;
}