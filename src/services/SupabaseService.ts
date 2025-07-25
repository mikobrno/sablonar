import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Building = Database['public']['Tables']['buildings']['Row']
type StaticVariable = Database['public']['Tables']['static_variables']['Row']
type EmailTemplate = Database['public']['Tables']['email_templates']['Row']
type GeneratedEmail = Database['public']['Tables']['generated_emails']['Row']

export class SupabaseService {
  // Správa budov
  async getBuildings(): Promise<Building[]> {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  async getBuilding(id: string): Promise<Building | null> {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  async createBuilding(building: Database['public']['Tables']['buildings']['Insert']): Promise<Building> {
    const { data, error } = await supabase
      .from('buildings')
      .insert(building)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateBuilding(id: string, updates: Database['public']['Tables']['buildings']['Update']): Promise<Building> {
    const { data, error } = await supabase
      .from('buildings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteBuilding(id: string): Promise<void> {
    const { error } = await supabase
      .from('buildings')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Správa statických proměnných
  async getStaticVariables(): Promise<StaticVariable[]> {
    const { data, error } = await supabase
      .from('static_variables')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  async createStaticVariable(variable: Database['public']['Tables']['static_variables']['Insert']): Promise<StaticVariable> {
    const { data, error } = await supabase
      .from('static_variables')
      .insert(variable)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateStaticVariable(id: string, updates: Database['public']['Tables']['static_variables']['Update']): Promise<StaticVariable> {
    const { data, error } = await supabase
      .from('static_variables')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteStaticVariable(id: string): Promise<void> {
    const { error } = await supabase
      .from('static_variables')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Správa e-mailových šablon
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  async getEmailTemplate(id: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  async createEmailTemplate(template: Database['public']['Tables']['email_templates']['Insert']): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert(template)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateEmailTemplate(id: string, updates: Database['public']['Tables']['email_templates']['Update']): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteEmailTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Správa vygenerovaných e-mailů
  async getGeneratedEmails(): Promise<GeneratedEmail[]> {
    const { data, error } = await supabase
      .from('generated_emails')
      .select('*')
      .order('generated_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async createGeneratedEmail(email: Database['public']['Tables']['generated_emails']['Insert']): Promise<GeneratedEmail> {
    const { data, error } = await supabase
      .from('generated_emails')
      .insert(email)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Generování e-mailu s nahrazením proměnných
  async generateEmail(templateId: string, buildingId: string): Promise<{
    subject: string
    body: string
    buildingName: string
    templateName: string
  }> {
    // Načtení šablony
    const template = await this.getEmailTemplate(templateId)
    if (!template) throw new Error('Šablona nebyla nalezena')

    // Načtení budovy
    const building = await this.getBuilding(buildingId)
    if (!building) throw new Error('Budova nebyla nalezena')

    // Načtení statických proměnných
    const staticVariables = await this.getStaticVariables()

    let subject = template.subject
    let body = template.body

    // Nahrazení dynamických proměnných z budovy
    Object.entries(building.data).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      subject = subject.replace(regex, String(value))
      body = body.replace(regex, String(value))
    })

    // Nahrazení statických proměnných
    staticVariables.forEach(variable => {
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g')
      subject = subject.replace(regex, variable.value)
      body = body.replace(regex, variable.value)
    })

    // Uložení vygenerovaného e-mailu
    await this.createGeneratedEmail({
      subject,
      body,
      building_name: building.name,
      template_name: template.name
    })

    return {
      subject,
      body,
      buildingName: building.name,
      templateName: template.name
    }
  }

  // Extrakce proměnných ze šablony
  extractVariables(text: string): string[] {
    const regex = /\{\{(\w+)\}\}/g
    const variables: string[] = []
    let match

    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    return variables
  }

  // Získání dostupných proměnných pro budovu
  async getAvailableVariables(buildingId: string): Promise<{
    static: Array<{ name: string; value: string; description?: string }>
    dynamic: Array<{ name: string; value: string }>
  }> {
    const building = await this.getBuilding(buildingId)
    const staticVariables = await this.getStaticVariables()

    return {
      static: staticVariables.map(v => ({
        name: v.name,
        value: v.value,
        description: v.description || undefined
      })),
      dynamic: building ? Object.entries(building.data).map(([key, value]) => ({
        name: key,
        value: String(value)
      })) : []
    }
  }
}

export const supabaseService = new SupabaseService()