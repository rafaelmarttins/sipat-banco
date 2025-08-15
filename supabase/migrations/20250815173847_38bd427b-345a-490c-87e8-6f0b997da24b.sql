-- Fix security vulnerability: Restrict equipment data access to authenticated users only
DROP POLICY IF EXISTS "Todos podem visualizar equipamentos" ON public.equipamentos;

-- Create new policy that requires authentication
CREATE POLICY "Usuários autenticados podem visualizar equipamentos" 
ON public.equipamentos 
FOR SELECT 
TO authenticated
USING (true);