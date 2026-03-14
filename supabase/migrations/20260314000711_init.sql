DO $$
DECLARE
  seed_user_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    seed_user_id, '00000000-0000-0000-0000-000000000000', 'test@example.com',
    crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}', '{"name": "Test User"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '', NULL, '', '', ''
  ) ON CONFLICT (id) DO NOTHING;
END $$;

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    therapeutic_line TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    stage_id TEXT NOT NULL,
    potential_value NUMERIC NOT NULL DEFAULT 0,
    estimated_date TEXT,
    qualitative_win INTEGER NOT NULL DEFAULT 0,
    completed_activities JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own products"
    ON products FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own opportunities"
    ON opportunities FOR ALL
    USING (auth.uid() = user_id);

DO $$
DECLARE
  seed_user_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
  prod_1 uuid := gen_random_uuid();
  prod_2 uuid := gen_random_uuid();
  prod_3 uuid := gen_random_uuid();
BEGIN
    INSERT INTO products (id, name, therapeutic_line, user_id) VALUES
    (prod_1, 'Zomacton', 'Gastroenterologia', seed_user_id),
    (prod_2, 'Firmagon', 'Endocrinologia', seed_user_id),
    (prod_3, 'Tractocile', 'Saúde Materna', seed_user_id);

    INSERT INTO opportunities (title, description, status, stage_id, potential_value, estimated_date, qualitative_win, completed_activities, product_id, user_id) VALUES
    ('Hospital Sírio-Libanês', 'Expansão de uso para novos setores', 'ACTIVE', 'QUALIFICAR', 150000, '2026-08', 40, '["Registrar lead no CRM com dados mínimos", "Identificar origem e validar necessidade potencial", "Enriquecer dados básicos da instituição (tipo, porte, comitês, histórico)"]'::jsonb, prod_1, seed_user_id),
    ('Albert Einstein', 'Implementação completa', 'WON', 'AVALIAR', 300000, '2026-05', 80, '[]'::jsonb, prod_3, seed_user_id),
    ('Rede D''Or', 'Teste inicial não avançou', 'LOST', 'LEAD', 50000, '2026-11', 20, '[]'::jsonb, prod_2, seed_user_id);
END $$;
