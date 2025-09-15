import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Secretaria {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useSecretarias = () => {
  const { profile } = useAuth();
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSecretarias = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('secretarias')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar secretarias:', error);
        toast.error('Erro ao carregar secretarias');
        return;
      }

      setSecretarias(data || []);
    } catch (error) {
      console.error('Erro ao buscar secretarias:', error);
      toast.error('Erro ao carregar secretarias');
    } finally {
      setLoading(false);
    }
  };

  const addSecretaria = async (secretariaData: Omit<Secretaria, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('secretarias')
        .insert([secretariaData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar secretaria:', error);
        toast.error('Erro ao adicionar secretaria');
        return null;
      }

      // Atualização automática do estado - adiciona o novo registro no início da lista
      setSecretarias(prev => [data as Secretaria, ...prev.filter(s => s.id !== data.id)]);
      toast.success('Secretaria adicionada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao adicionar secretaria:', error);
      toast.error('Erro ao adicionar secretaria');
      return null;
    }
  };

  const updateSecretaria = async (id: string, updates: Partial<Secretaria>) => {
    try {
      const { data, error } = await supabase
        .from('secretarias')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar secretaria:', error);
        toast.error('Erro ao atualizar secretaria');
        return;
      }

      // Atualização automática do estado - atualiza apenas o registro modificado
      setSecretarias(prev => prev.map(s => s.id === id ? data as Secretaria : s));
      toast.success('Secretaria atualizada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar secretaria:', error);
      toast.error('Erro ao atualizar secretaria');
    }
  };

  const deleteSecretaria = async (id: string) => {
    try {
      const { error } = await supabase
        .from('secretarias')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar secretaria:', error);
        toast.error('Erro ao deletar secretaria');
        return;
      }

      // Atualização automática do estado - remove o registro da lista
      setSecretarias(prev => prev.filter(s => s.id !== id));
      toast.success('Secretaria removida com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar secretaria:', error);
      toast.error('Erro ao deletar secretaria');
    }
  };

  useEffect(() => {
    if (profile) {
      fetchSecretarias();
    }
  }, [profile]);

  return {
    secretarias,
    loading,
    fetchSecretarias,
    addSecretaria,
    updateSecretaria,
    deleteSecretaria,
  };
};