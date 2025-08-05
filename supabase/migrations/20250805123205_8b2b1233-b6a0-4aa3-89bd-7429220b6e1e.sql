-- Inserir usuário admin master diretamente
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@sipat.com.br',
  crypt('admin@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"nome": "Administrador", "setor": "TI"}',
  false,
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Inserir perfil do admin
INSERT INTO public.profiles (id, nome, email, role, setor)
SELECT 
  au.id,
  'Administrador',
  'admin@sipat.com.br',
  'admin',
  'TI'
FROM auth.users au
WHERE au.email = 'admin@sipat.com.br'
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  role = EXCLUDED.role,
  setor = EXCLUDED.setor;