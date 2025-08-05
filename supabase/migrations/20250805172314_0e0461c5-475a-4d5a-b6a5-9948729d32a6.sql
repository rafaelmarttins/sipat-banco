-- Adicionar campo para controlar reset de senha obrigatório
ALTER TABLE public.profiles 
ADD COLUMN password_reset_required BOOLEAN DEFAULT FALSE;

-- Comentário: Este campo indica se o usuário precisa trocar a senha no próximo login