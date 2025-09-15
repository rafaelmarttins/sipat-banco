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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Usuarios fetched:', data);
      setUsuarios(data as Usuario[] || []);
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

  const addUsuario = async (userData: { nome: string; email: string; role: 'admin' | 'user'; setor: string; localizacao?: string; password_reset_required?: boolean }) => {
    try {
      if (profile?.role !== 'admin') {
        throw new Error('Acesso negado. Apenas administradores podem criar usuários.');
      }

      // Gerar um ID único para o novo usuário
      const userRecord = {
        id: crypto.randomUUID(),
        ...userData
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([userRecord])
        .select()
        .single();

      if (error) throw error;

      // Atualização automática do estado - adiciona o novo registro no início da lista
      setUsuarios(prev => [data as Usuario, ...prev]);
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o usuário.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updateUsuario = async (id: string, updates: Partial<Usuario>) => {
    try {
      if (profile?.role !== 'admin') {
        throw new Error('Acesso negado. Apenas administradores podem editar usuários.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setUsuarios(prev => prev.map(user => user.id === id ? data as Usuario : user));
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso.",
      });
      
      return { success: true, data };
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
    addUsuario,
    updateUsuario,
    deleteUsuario,
    resetPasswordViaEmail
  };
};