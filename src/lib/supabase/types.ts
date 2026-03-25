// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      'Frete 2025 Revisado': {
        Row: {
          ADVALOREM: string | null
          AGENDA: string | null
          Ano: number | null
          BAI_ENTREGA_DOC: string | null
          'C.CUSTO': string | null
          'Capital/ Interior': string | null
          'CENTRO DE CUSTO': string | null
          CEP_ENTREGA_DOC: string | null
          'CIDADE COLETA': string | null
          'CIDADE ENTREGA': string | null
          'CNPJ CLIENTE': string | null
          'CNPJ DESTINATARIO': string | null
          'CNPJ REMETENTE': string | null
          'CT-e EMITIDO': string | null
          'DESTINATARIO VIP': string | null
          'DT.EMISSAO': string | null
          'EMP.DESCR': string | null
          'EMP.TMS': string | null
          'EMP.TMS DESCRICAO': string | null
          END_ENTREGA_DOC: string | null
          'FRETE PESO': string | null
          'FRETE RECEBER': string | null
          'FRETE VALOR': string | null
          GRIS: string | null
          'GRUPO CCUS': string | null
          ICMS: string | null
          Mês: string | null
          'MESO-REGIAO AGV': string | null
          MODAL: string | null
          'NF (R$) REAL': string | null
          'NOME CLIENTE(CCUSTO)': string | null
          'NOME DESTINATARIO': string | null
          'NOME REMETENTE': string | null
          'NUMERO CTe': number | null
          OBSERVACAO: string | null
          OCORRENCIA: string | null
          'PESO TAXADO': string | null
          'PIS/COFINS': string | null
          'QTD.NF': number | null
          Range: number | null
          'REC.BRUTA RECEBER': string | null
          'RECEITA LIQUIDA': string | null
          REGIAO: string | null
          'RELACAO DE NF': string | null
          'SERIE CTe': string | null
          'TIPO CTe': string | null
          'TIPO DOC': string | null
          'TIPO PRODUTO': string | null
          'UF COLETA': string | null
          'UF ENTREGA': string | null
          UNIDADE: string | null
          VOLUMES: number | null
        }
        Insert: {
          ADVALOREM?: string | null
          AGENDA?: string | null
          Ano?: number | null
          BAI_ENTREGA_DOC?: string | null
          'C.CUSTO'?: string | null
          'Capital/ Interior'?: string | null
          'CENTRO DE CUSTO'?: string | null
          CEP_ENTREGA_DOC?: string | null
          'CIDADE COLETA'?: string | null
          'CIDADE ENTREGA'?: string | null
          'CNPJ CLIENTE'?: string | null
          'CNPJ DESTINATARIO'?: string | null
          'CNPJ REMETENTE'?: string | null
          'CT-e EMITIDO'?: string | null
          'DESTINATARIO VIP'?: string | null
          'DT.EMISSAO'?: string | null
          'EMP.DESCR'?: string | null
          'EMP.TMS'?: string | null
          'EMP.TMS DESCRICAO'?: string | null
          END_ENTREGA_DOC?: string | null
          'FRETE PESO'?: string | null
          'FRETE RECEBER'?: string | null
          'FRETE VALOR'?: string | null
          GRIS?: string | null
          'GRUPO CCUS'?: string | null
          ICMS?: string | null
          Mês?: string | null
          'MESO-REGIAO AGV'?: string | null
          MODAL?: string | null
          'NF (R$) REAL'?: string | null
          'NOME CLIENTE(CCUSTO)'?: string | null
          'NOME DESTINATARIO'?: string | null
          'NOME REMETENTE'?: string | null
          'NUMERO CTe'?: number | null
          OBSERVACAO?: string | null
          OCORRENCIA?: string | null
          'PESO TAXADO'?: string | null
          'PIS/COFINS'?: string | null
          'QTD.NF'?: number | null
          Range?: number | null
          'REC.BRUTA RECEBER'?: string | null
          'RECEITA LIQUIDA'?: string | null
          REGIAO?: string | null
          'RELACAO DE NF'?: string | null
          'SERIE CTe'?: string | null
          'TIPO CTe'?: string | null
          'TIPO DOC'?: string | null
          'TIPO PRODUTO'?: string | null
          'UF COLETA'?: string | null
          'UF ENTREGA'?: string | null
          UNIDADE?: string | null
          VOLUMES?: number | null
        }
        Update: {
          ADVALOREM?: string | null
          AGENDA?: string | null
          Ano?: number | null
          BAI_ENTREGA_DOC?: string | null
          'C.CUSTO'?: string | null
          'Capital/ Interior'?: string | null
          'CENTRO DE CUSTO'?: string | null
          CEP_ENTREGA_DOC?: string | null
          'CIDADE COLETA'?: string | null
          'CIDADE ENTREGA'?: string | null
          'CNPJ CLIENTE'?: string | null
          'CNPJ DESTINATARIO'?: string | null
          'CNPJ REMETENTE'?: string | null
          'CT-e EMITIDO'?: string | null
          'DESTINATARIO VIP'?: string | null
          'DT.EMISSAO'?: string | null
          'EMP.DESCR'?: string | null
          'EMP.TMS'?: string | null
          'EMP.TMS DESCRICAO'?: string | null
          END_ENTREGA_DOC?: string | null
          'FRETE PESO'?: string | null
          'FRETE RECEBER'?: string | null
          'FRETE VALOR'?: string | null
          GRIS?: string | null
          'GRUPO CCUS'?: string | null
          ICMS?: string | null
          Mês?: string | null
          'MESO-REGIAO AGV'?: string | null
          MODAL?: string | null
          'NF (R$) REAL'?: string | null
          'NOME CLIENTE(CCUSTO)'?: string | null
          'NOME DESTINATARIO'?: string | null
          'NOME REMETENTE'?: string | null
          'NUMERO CTe'?: number | null
          OBSERVACAO?: string | null
          OCORRENCIA?: string | null
          'PESO TAXADO'?: string | null
          'PIS/COFINS'?: string | null
          'QTD.NF'?: number | null
          Range?: number | null
          'REC.BRUTA RECEBER'?: string | null
          'RECEITA LIQUIDA'?: string | null
          REGIAO?: string | null
          'RELACAO DE NF'?: string | null
          'SERIE CTe'?: string | null
          'TIPO CTe'?: string | null
          'TIPO DOC'?: string | null
          'TIPO PRODUTO'?: string | null
          'UF COLETA'?: string | null
          'UF ENTREGA'?: string | null
          UNIDADE?: string | null
          VOLUMES?: number | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          completed_activities: Json
          created_at: string
          description: string | null
          estimated_date: string | null
          id: string
          last_updated_by: string | null
          potential_value: number
          product_id: string | null
          qualitative_win: number
          stage_id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_activities?: Json
          created_at?: string
          description?: string | null
          estimated_date?: string | null
          id?: string
          last_updated_by?: string | null
          potential_value?: number
          product_id?: string | null
          qualitative_win?: number
          stage_id: string
          status: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_activities?: Json
          created_at?: string
          description?: string | null
          estimated_date?: string | null
          id?: string
          last_updated_by?: string | null
          potential_value?: number
          product_id?: string | null
          qualitative_win?: number
          stage_id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'opportunities_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          therapeutic_line: string | null
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          therapeutic_line?: string | null
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          therapeutic_line?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: string
          is_approved: boolean
          role: string
        }
        Insert: {
          email: string
          id: string
          is_approved?: boolean
          role?: string
        }
        Update: {
          email?: string
          id?: string
          is_approved?: boolean
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_user_id_by_email: {
        Args: { user_email: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: Frete 2025 Revisado
//   UNIDADE: text (nullable)
//   EMP.TMS: text (nullable)
//   EMP.TMS DESCRICAO: text (nullable)
//   TIPO DOC: text (nullable)
//   NUMERO CTe: bigint (nullable)
//   SERIE CTe: text (nullable)
//   TIPO CTe: text (nullable)
//   DT.EMISSAO: text (nullable)
//   C.CUSTO: text (nullable)
//   GRUPO CCUS: text (nullable)
//   CENTRO DE CUSTO: text (nullable)
//   CNPJ CLIENTE: text (nullable)
//   NOME CLIENTE(CCUSTO): text (nullable)
//   CNPJ REMETENTE: text (nullable)
//   NOME REMETENTE: text (nullable)
//   CNPJ DESTINATARIO: text (nullable)
//   NOME DESTINATARIO: text (nullable)
//   DESTINATARIO VIP: text (nullable)
//   AGENDA: text (nullable)
//   CIDADE COLETA: text (nullable)
//   UF COLETA: text (nullable)
//   CIDADE ENTREGA: text (nullable)
//   UF ENTREGA: text (nullable)
//   MESO-REGIAO AGV: text (nullable)
//   REGIAO: text (nullable)
//   MODAL: text (nullable)
//   TIPO PRODUTO: text (nullable)
//   OCORRENCIA: text (nullable)
//   OBSERVACAO: text (nullable)
//   CT-e EMITIDO: text (nullable)
//   RELACAO DE NF: text (nullable)
//   QTD.NF: bigint (nullable)
//   NF (R$) REAL: text (nullable)
//   VOLUMES: bigint (nullable)
//   PESO TAXADO: text (nullable)
//   FRETE RECEBER: text (nullable)
//   ADVALOREM: text (nullable)
//   GRIS: text (nullable)
//   REC.BRUTA RECEBER: text (nullable)
//   ICMS: text (nullable)
//   PIS/COFINS: text (nullable)
//   RECEITA LIQUIDA: text (nullable)
//   FRETE PESO: text (nullable)
//   FRETE VALOR: text (nullable)
//   EMP.DESCR: text (nullable)
//   CEP_ENTREGA_DOC: text (nullable)
//   END_ENTREGA_DOC: text (nullable)
//   BAI_ENTREGA_DOC: text (nullable)
//   Ano: bigint (nullable)
//   Mês: text (nullable)
//   Range: bigint (nullable)
//   Capital/ Interior: text (nullable)
// Table: opportunities
//   id: uuid (not null, default: gen_random_uuid())
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   title: text (not null)
//   description: text (nullable)
//   status: text (not null)
//   user_id: uuid (not null)
//   product_id: uuid (nullable)
//   stage_id: text (not null)
//   potential_value: numeric (not null, default: 0)
//   estimated_date: text (nullable)
//   qualitative_win: integer (not null, default: 0)
//   completed_activities: jsonb (not null, default: '[]'::jsonb)
//   last_updated_by: uuid (nullable)
// Table: products
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   therapeutic_line: text (nullable)
//   user_id: uuid (not null)
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   role: text (not null, default: 'viewer'::text)
//   is_approved: boolean (not null, default: false)

// --- CONSTRAINTS ---
// Table: opportunities
//   FOREIGN KEY opportunities_last_updated_by_fkey: FOREIGN KEY (last_updated_by) REFERENCES auth.users(id) ON DELETE SET NULL
//   PRIMARY KEY opportunities_pkey: PRIMARY KEY (id)
//   FOREIGN KEY opportunities_product_id_fkey: FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
//   FOREIGN KEY opportunities_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: products
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
//   FOREIGN KEY products_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
//   CHECK profiles_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'editor'::text, 'viewer'::text])))

// --- ROW LEVEL SECURITY POLICIES ---
// Table: Frete 2025 Revisado
//   Policy "anon_select" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: opportunities
//   Policy "Approved users can view opportunities" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true))))
//   Policy "Editors and admins can delete opportunities" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true) AND (profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])))))
//   Policy "Editors and admins can insert opportunities" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true) AND (profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])))))
//   Policy "Editors and admins can update opportunities" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true) AND (profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true) AND (profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])))))
// Table: products
//   Policy "Approved users can view products" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true))))
//   Policy "Editors and admins can delete products" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true) AND (profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])))))
//   Policy "Editors and admins can insert products" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true) AND (profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])))))
//   Policy "Editors and admins can update products" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true) AND (profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.is_approved = true) AND (profiles.role = ANY (ARRAY['admin'::text, 'editor'::text])))))
// Table: profiles
//   Policy "Admins can delete profiles" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (( SELECT profiles_1.role    FROM profiles profiles_1   WHERE (profiles_1.id = auth.uid())) = 'admin'::text)
//   Policy "Admins can update profiles" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (( SELECT profiles_1.role    FROM profiles profiles_1   WHERE (profiles_1.id = auth.uid())) = 'admin'::text)
//     WITH CHECK: (( SELECT profiles_1.role    FROM profiles profiles_1   WHERE (profiles_1.id = auth.uid())) = 'admin'::text)
//   Policy "Profiles are viewable by authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true

// --- DATABASE FUNCTIONS ---
// FUNCTION get_auth_user_id_by_email(text)
//   CREATE OR REPLACE FUNCTION public.get_auth_user_id_by_email(user_email text)
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     found_id uuid;
//   BEGIN
//     SELECT id INTO found_id FROM auth.users WHERE email = user_email LIMIT 1;
//     RETURN found_id;
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email)
//     VALUES (NEW.id, NEW.email)
//     ON CONFLICT (id) DO NOTHING;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_updated_at_column()
//   CREATE OR REPLACE FUNCTION public.update_updated_at_column()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: opportunities
//   update_opportunities_updated_at: CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
