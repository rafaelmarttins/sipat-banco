-- Corrigir a função is_admin com search_path seguro
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;