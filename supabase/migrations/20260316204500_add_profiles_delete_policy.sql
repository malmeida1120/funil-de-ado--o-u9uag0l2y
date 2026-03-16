-- Add DELETE policy for admins on profiles table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can delete profiles'
    ) THEN
        CREATE POLICY "Admins can delete profiles" ON public.profiles
        FOR DELETE TO authenticated
        USING ( (SELECT profiles_1.role FROM public.profiles profiles_1 WHERE profiles_1.id = auth.uid()) = 'admin' );
    END IF;
END
$$;
