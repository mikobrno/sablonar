import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Chybí Supabase konfigurace. Zkontrolujte .env soubor.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Typy pro databázi
export interface Database {
  public: {
    Tables: {
      buildings: {
        Row: {
          id: string
          name: string
          data: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          data: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          data?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      static_variables: {
        Row: {
          id: string
          name: string
          value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      email_templates: {
        Row: {
          id: string
          name: string
          category: string
          subject: string
          body: string
          used_variables: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string
          subject: string
          body: string
          used_variables?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          subject?: string
          body?: string
          used_variables?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      generated_emails: {
        Row: {
          id: string
          subject: string
          body: string
          building_name: string
          template_name: string
          generated_at: string
        }
        Insert: {
          id?: string
          subject: string
          body: string
          building_name: string
          template_name: string
          generated_at?: string
        }
        Update: {
          id?: string
          subject?: string
          body?: string
          building_name?: string
          template_name?: string
          generated_at?: string
        }
      }
    }
  }
}