-- Add role and is_approved columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT false;

-- Bootstrap: Make existing users approved admins to prevent lockout
UPDATE public.profiles SET role = 'admin', is_approved = true;

-- Update profiles RLS: Allow admins to update roles and approvals
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can update profiles'
    ) THEN
        CREATE POLICY "Admins can update profiles" ON public.profiles
        FOR UPDATE TO authenticated
        USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' )
        WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );
    END IF;
END
$$;

-- Update opportunities RLS policies
DROP POLICY IF EXISTS "Users can manage their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Approved users can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Editors and admins can insert opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Editors and admins can update opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Editors and admins can delete opportunities" ON public.opportunities;

CREATE POLICY "Approved users can view opportunities" ON public.opportunities
FOR SELECT TO authenticated
USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true) );

CREATE POLICY "Editors and admins can insert opportunities" ON public.opportunities
FOR INSERT TO authenticated
WITH CHECK ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true AND role IN ('admin', 'editor')) );

CREATE POLICY "Editors and admins can update opportunities" ON public.opportunities
FOR UPDATE TO authenticated
USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true AND role IN ('admin', 'editor')) )
WITH CHECK ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true AND role IN ('admin', 'editor')) );

CREATE POLICY "Editors and admins can delete opportunities" ON public.opportunities
FOR DELETE TO authenticated
USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true AND role IN ('admin', 'editor')) );

-- Update products RLS policies
DROP POLICY IF EXISTS "Users can manage their own products" ON public.products;
DROP POLICY IF EXISTS "Approved users can view products" ON public.products;
DROP POLICY IF EXISTS "Editors and admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Editors and admins can update products" ON public.products;
DROP POLICY IF EXISTS "Editors and admins can delete products" ON public.products;

CREATE POLICY "Approved users can view products" ON public.products
FOR SELECT TO authenticated
USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true) );

CREATE POLICY "Editors and admins can insert products" ON public.products
FOR INSERT TO authenticated
WITH CHECK ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true AND role IN ('admin', 'editor')) );

CREATE POLICY "Editors and admins can update products" ON public.products
FOR UPDATE TO authenticated
USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true AND role IN ('admin', 'editor')) )
WITH CHECK ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true AND role IN ('admin', 'editor')) );

CREATE POLICY "Editors and admins can delete products" ON public.products
FOR DELETE TO authenticated
USING ( EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_approved = true AND role IN ('admin', 'editor')) );
