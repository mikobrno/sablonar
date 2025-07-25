export interface Building {
  id: string;
  name: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaticVariable {
  id: string;
  name: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  usedVariables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  buildingName: string;
  templateName: string;
  generatedAt: Date;
}

export interface VariableGroup {
  name: string;
  variables: Variable[];
  color: string;
}

export interface Variable {
  name: string;
  value: string;
  type: 'static' | 'dynamic';
  description?: string;
}