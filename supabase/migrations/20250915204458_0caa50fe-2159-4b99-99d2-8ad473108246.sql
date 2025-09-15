-- Criar política para permitir que admins excluam tipos de equipamento
CREATE POLICY "Admins podem deletar tipos de equipamento" 
ON public.tipos_equipamento 
FOR DELETE 
USING (is_admin());