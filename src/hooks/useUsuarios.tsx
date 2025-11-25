import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'user';
  setor: string;
  localizacao?: string;
  password_reset_required?: boolean;
  created_at: string;
  updated_at: string;
}

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      
      // Apenas admins podem ver a lista de usuários
      if (profile?.role !== 'admin') {
        console.log('User is not admin, profile:', profile);
        setUsuarios([]);
        return;
      }

      console.log('Fetching usuarios for admin user:', profile);
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      
      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;
      
      // Map roles to profiles
      const rolesMap = new Map(rolesData?.map(r => [r.user_id, r.role]) || []);
      
      const usuarios = profilesData?.map(profile => ({
        ...profile,
        role: rolesMap.get(profile.id) || 'user'
      })) as Usuario[] || [];
      
      console.log('Usuarios fetched:', usuarios);
      setUsuarios(usuarios);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async (id: string, updates: Partial<Usuario>) => {
    try {
      if (profile?.role !== 'admin') {
        throw new Error('Acesso negado. Apenas administradores podem editar usuários.');
      }

      // Separate role from other updates
      const { role, ...profileUpdates } = updates;
      
      // Update profile data (excluding role)
      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', id);

        if (profileError) throw profileError;
      }
      
      // Update role in user_roles table if provided
      if (role !== undefined) {
        // First, delete existing role
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', id);
        
        // Then insert new role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: id, role: role });
        
        if (roleError) throw roleError;
      }
      
      // Fetch updated user data
      await fetchUsuarios();
      
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const deleteUsuario = async (id: string) => {
    try {
      if (profile?.role !== 'admin') {
        throw new Error('Acesso negado. Apenas administradores podem excluir usuários.');
      }

      if (id === profile.id) {
        throw new Error('Você não pode excluir sua própria conta.');
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsuarios(prev => prev.filter(user => user.id !== id));
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover o usuário.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const resetPasswordViaEmail = async (email: string) => {
    try {
      if (profile?.role !== 'admin') {
        throw new Error('Acesso negado. Apenas administradores podem resetar senhas.');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Email de reset de senha enviado com sucesso.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao enviar reset de senha:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o email de reset.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (profile) {
      fetchUsuarios();
    }
  }, [profile]);

  return {
    usuarios,
    loading,
    fetchUsuarios,
    updateUsuario,
    deleteUsuario,
    resetPasswordViaEmail
  };
};