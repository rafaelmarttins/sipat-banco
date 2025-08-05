-- Atualizar a senha do usuário admin para "senha@123"
UPDATE auth.users 
SET encrypted_password = crypt('senha@123', gen_salt('bf'))
WHERE email = 'rafaelgemelli1@hotmail.com';