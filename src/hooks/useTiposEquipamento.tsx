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
      const { error } = await supabase
        .from('tipos_equipamento')
        .insert([tipoData]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tipo de equipamento criado com sucesso!",
      });

      fetchTipos();
    } catch (error: any) {
      console.error('Erro ao criar tipo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar tipo de equipamento.",
        variant: "destructive",
      });
    }
  };

  const updateTipo = async (id: string, updates: Partial<TipoEquipamento>) => {
    try {
      const { error } = await supabase
        .from('tipos_equipamento')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tipo de equipamento atualizado com sucesso!",
      });

      fetchTipos();
    } catch (error: any) {
      console.error('Erro ao atualizar tipo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar tipo de equipamento.",
        variant: "destructive",
      });
    }
  };

  const toggleTipo = async (id: string) => {
    try {
      const tipo = tipos.find(t => t.id === id);
      if (!tipo) return;

      const { error } = await supabase
        .from('tipos_equipamento')
        .update({ ativo: !tipo.ativo })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Tipo ${tipo.ativo ? 'desativado' : 'ativado'} com sucesso!`,
      });

      fetchTipos();
    } catch (error: any) {
      console.error('Erro ao alterar status do tipo:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status do tipo.",
        variant: "destructive",
      });
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
    refetch: fetchTipos
  };
};