import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Equipamento {
  id: string;
  modelo: string;
  processado: string;
  patrimonio: number;
  setor: string;
  localizacao_id: string;
  secretaria_id?: string;
  localizacao?: {
    id: string;
    nome: string;
  };
  secretaria?: {
    id: string;
    nome: string;
  };
  data_aquisicao?: string;
  estado_conservacao: 'Novo' | 'Conservado' | 'Meia-vida' | 'Fim-da-vida';
  vida_util?: string;
  observacoes?: string;
  status: 'Ativo' | 'Desativado';
  created_at: string;
  updated_at: string;
}

export const useEquipamentos = () => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchEquipamentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipamentos')
        .select(`
          *,
          localizacao:localizacao_id (
            id,
            nome
          ),
          secretaria:secretaria_id (
            id,
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipamentos(data as Equipamento[] || []);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os equipamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEquipamento = async (equipamentoData: Omit<Equipamento, 'id' | 'created_at' | 'updated_at' | 'localizacao' | 'secretaria'>) => {
    try {
      if (!profile?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('equipamentos')
        .insert({
          ...equipamentoData,
          user_id: profile.id
        })
        .select(`
          *,
          localizacao:localizacao_id (
            id,
            nome
          ),
          secretaria:secretaria_id (
            id,
            nome
          )
        `)
        .single();

      if (error) throw error;

      setEquipamentos(prev => [data as Equipamento, ...prev]);
      toast({
        title: "Sucesso",
        description: "Equipamento cadastrado com sucesso.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao cadastrar equipamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cadastrar o equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updateEquipamento = async (id: string, updates: Partial<Equipamento>) => {
    try {
      const { data, error } = await supabase
        .from('equipamentos')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          localizacao:localizacao_id (
            id,
            nome
          ),
          secretaria:secretaria_id (
            id,
            nome
          )
        `)
        .single();

      if (error) throw error;

      setEquipamentos(prev => prev.map(eq => eq.id === id ? data as Equipamento : eq));
      toast({
        title: "Sucesso",
        description: "Equipamento atualizado com sucesso.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao atualizar equipamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const toggleStatusEquipamento = async (id: string) => {
    try {
      const equipamento = equipamentos.find(eq => eq.id === id);
      if (!equipamento) throw new Error('Equipamento não encontrado');

      const newStatus = equipamento.status === 'Ativo' ? 'Desativado' : 'Ativo';
      
      const { data, error } = await supabase
        .from('equipamentos')
        .update({ status: newStatus })
        .eq('id', id)
        .select(`
          *,
          localizacao:localizacao_id (
            id,
            nome
          ),
          secretaria:secretaria_id (
            id,
            nome
          )
        `)
        .single();

      if (error) throw error;

      setEquipamentos(prev => prev.map(eq => eq.id === id ? data as Equipamento : eq));
      toast({
        title: "Sucesso",
        description: `Equipamento ${newStatus.toLowerCase()} com sucesso.`,
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao alterar status do equipamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar o status do equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  return {
    equipamentos,
    loading,
    fetchEquipamentos,
    addEquipamento,
    updateEquipamento,
    toggleStatusEquipamento
  };
};