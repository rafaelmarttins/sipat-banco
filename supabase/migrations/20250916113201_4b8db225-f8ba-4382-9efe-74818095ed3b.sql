-- Verificar se existe política para permitir que admins excluam secretarias
-- Se não existir, criá-la

-- Revisar política de exclusão de secretarias (já existe mas vamos garantir que está correta)
DROP POLICY IF EXISTS "Admins podem deletar secretarias" ON public.secretarias;

CREATE POLICY "Admins podem deletar secretarias" 
ON public.secretarias 
FOR DELETE 
USING (is_admin());

-- Vamos também revisar a política de inserção que pode estar causando problema
DROP POLICY IF EXISTS "Admins podem inserir secretarias" ON public.secretarias;

CREATE POLICY "Admins podem inserir secretarias" 
ON public.secretarias 
FOR INSERT 
WITH CHECK (is_admin());