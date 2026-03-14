-- Create profiles table to expose user emails safely
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone (authenticated) to view profiles to resolve emails
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Profiles are viewable by authenticated users'
    ) THEN
        CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
    END IF;
END
$$;

-- Function to handle new user registration and copy email to profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users into profiles
INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Add last_updated_by audit column to opportunities
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS last_updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Backfill last_updated_by with creator id for existing records
UPDATE public.opportunities 
SET last_updated_by = user_id 
WHERE last_updated_by IS NULL;
