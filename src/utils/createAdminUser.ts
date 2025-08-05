import { supabase } from '@/integrations/supabase/client';

// Esta função deve ser executada uma única vez para criar o usuário admin
export const createAdminUser = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'rafaelgemelli1@hotmail.com',
      password: 'senha@123',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          nome: 'Rafael',
          setor: 'TI',
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('Erro ao criar usuário admin:', error);
      return { success: false, error: error.message };
    }

    console.log('Usuário admin criado com sucesso:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao criar usuário admin:', error);
    return { success: false, error: error.message };
  }
};

// Executar automaticamente na primeira vez
if (typeof window !== 'undefined') {
  // Verificar se já foi executado
  const adminCreated = localStorage.getItem('admin-user-created');
  if (!adminCreated) {
    createAdminUser().then((result) => {
      if (result.success) {
        localStorage.setItem('admin-user-created', 'true');
        console.log('Usuário admin criado automaticamente. Verifique o email para confirmar.');
      }
    });
  }
}