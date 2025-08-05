-- Primeiro, criar uma função para inserir usuário admin caso ele não exista
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Verificar se já existe um usuário admin
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'rafaelgemelli1@hotmail.com';
  
  -- Se não existe, vamos criar um perfil com um ID fixo que pode ser usado
  -- O usuário terá que ser criado manualmente no Supabase Auth
  IF admin_user_id IS NULL THEN
    admin_user_id := 'db1a90ae-850c-423d-88cb-7e752bd3834e'::uuid;
  END IF;
  
  -- Inserir ou atualizar o perfil do admin
  INSERT INTO public.profiles (id, nome, email, role, setor)
  VALUES (
    admin_user_id,
    'Rafael',
    'rafaelgemelli1@hotmail.com',
    'admin',
    'TI'
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    setor = EXCLUDED.setor;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar a função
SELECT public.create_admin_user();

-- Remover a função após o uso
DROP FUNCTION public.create_admin_user();