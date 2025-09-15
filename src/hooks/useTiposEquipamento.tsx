import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TipoEquipamento {
  id: string;
  nome: string;
  icone?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useTiposEquipamento = () => {
  const [tipos, setTipos] = useState<TipoEquipamento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTipos = async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_equipamento')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setTipos(data || []);
    } catch (error) {
      console.error('Erro ao buscar tipos de equipamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tipos de equipamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTipo = async (tipoData: { nome: string; icone?: string }) => {
    try {
      const { data, error } = await supabase
        .from('tipos_equipamento')
        .insert([tipoData])
        .select()
        .single();

      if (error) throw error;

      // Atualização automática do estado - adiciona o novo registro na lista ordenada
      setTipos(prev => [...prev, data as TipoEquipamento].sort((a, b) => a.nome.localeCompare(b.nome)));
      toast({
        title: "Sucesso",
        description: "Tipo de equipamento criado com sucesso!",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao criar tipo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar tipo de equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updateTipo = async (id: string, updates: Partial<TipoEquipamento>) => {
    try {
      const { data, error } = await supabase
        .from('tipos_equipamento')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualização automática do estado - atualiza apenas o registro modificado
      setTipos(prev => prev.map(t => t.id === id ? data as TipoEquipamento : t)
        .sort((a, b) => a.nome.localeCompare(b.nome)));
      toast({
        title: "Sucesso",
        description: "Tipo de equipamento atualizado com sucesso!",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao atualizar tipo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar tipo de equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const toggleTipo = async (id: string) => {
    try {
      const tipo = tipos.find(t => t.id === id);
      if (!tipo) return;

      const { data, error } = await supabase
        .from('tipos_equipamento')
        .update({ ativo: !tipo.ativo })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualização automática do estado - atualiza apenas o registro modificado
      setTipos(prev => prev.map(t => t.id === id ? data as TipoEquipamento : t));
      toast({
        title: "Sucesso",
        description: `Tipo ${tipo.ativo ? 'desativado' : 'ativado'} com sucesso!`,
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao alterar status do tipo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status do tipo.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const deleteTipo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tipos_equipamento')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualização automática do estado - remove o registro da lista
      setTipos(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Sucesso",
        description: "Tipo de equipamento excluído com sucesso!",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao excluir tipo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir tipo de equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  return {
    tipos,
    loading,
    addTipo,
    updateTipo,
    toggleTipo,
    deleteTipo,
    refetch: fetchTipos
  };
};