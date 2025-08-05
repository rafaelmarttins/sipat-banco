-- Alterar a tabela profiles para adicionar campo localizacao como texto
ALTER TABLE public.profiles ADD COLUMN localizacao text;

-- Migrar dados existentes de localizacao_id para localizacao (se houver)
UPDATE public.profiles 
SET localizacao = (
  SELECT nome 
  FROM public.localizacoes 
  WHERE localizacoes.id = profiles.localizacao_id
)
WHERE localizacao_id IS NOT NULL;

-- Atualizar o trigger handle_new_user para usar o novo campo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, role, setor, localizacao)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', 'Usuário'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'setor', 'Geral'),
    NEW.raw_user_meta_data->>'localizacao'
  );
  RETURN NEW;
END;
$$;