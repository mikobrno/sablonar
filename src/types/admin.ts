export interface TableField {
  name: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'boolean' | 'select';
  required?: boolean;
  options?: string[]; // Pro typ select
}

export interface TableSchema {
  id: string;
  name: string;
  fields: TableField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TableRecord {
  id: string;
  [key: string]: any;
}

export interface CustomVariable {
  id: string;
  name: string;
  value: string | number | boolean | Date;
  type: 'text' | 'number' | 'boolean' | 'date';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  variables: string[]; // Seznam názvů proměnných použitých v šabloně
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminCommand {
  command: string;
  description: string;
  syntax: string;
  examples: string[];
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}