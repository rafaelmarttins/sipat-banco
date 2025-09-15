import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Movimentacao {
  id: string;
  equipamento_id: string;
  equipamento?: {
    id: string;
    modelo: string;
    processado: string;
    patrimonio: number;
  };
  localizacao_origem?: {
    id: string;
    nome: string;
  };
  localizacao_destino?: {
    id: string;
    nome: string;
  };
  secretaria_origem?: {
    id: string;
    nome: string;
  };
  secretaria_destino?: {
    id: string;
    nome: string;
  };
  data_movimentacao: string;
  responsavel?: {
    id: string;
    nome: string;
  };
  motivo: string;
  observacoes?: string;
  created_at: string;
}

export const useMovimentacoes = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMovimentacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movimentacoes')
        .select(`
          *,
          equipamento:equipamento_id (
            id,
            modelo,
            processado,
            patrimonio
          ),
          localizacao_origem:localizacao_origem_id (
            id,
            nome
          ),
          localizacao_destino:localizacao_destino_id (
            id,
            nome
          ),
          secretaria_origem:secretaria_origem_id (
            id,
            nome
          ),
          secretaria_destino:secretaria_destino_id (
            id,
            nome
          ),
          responsavel:responsavel_id (
            id,
            nome
          )
        `)
        .order('data_movimentacao', { ascending: false });

      if (error) throw error;
      setMovimentacoes((data as unknown) as Movimentacao[] || []);
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as movimentações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMovimentacao = async (movimentacaoData: {
    equipamento_id: string;
    localizacao_origem_id: string;
    localizacao_destino_id: string;
    secretaria_origem_id?: string;
    secretaria_destino_id?: string;
    responsavel_id: string;
    motivo: string;
    observacoes?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('movimentacoes')
        .insert(movimentacaoData)
        .select(`
          *,
          equipamento:equipamento_id (
            id,
            modelo,
            processado,
            patrimonio
          ),
          localizacao_origem:localizacao_origem_id (
            id,
            nome
          ),
          localizacao_destino:localizacao_destino_id (
            id,
            nome
          ),
          secretaria_origem:secretaria_origem_id (
            id,
            nome
          ),
          secretaria_destino:secretaria_destino_id (
            id,
            nome
          ),
          responsavel:responsavel_id (
            id,
            nome
          )
        `)
        .single();

      if (error) throw error;

      setMovimentacoes(prev => [(data as unknown) as Movimentacao, ...prev]);
      toast({
        title: "Sucesso",
        description: "Movimentação registrada com sucesso.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao registrar movimentação:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível registrar a movimentação.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updateMovimentacao = async (id: string, updates: Partial<Movimentacao>) => {
    try {
      const { data, error } = await supabase
        .from('movimentacoes')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          equipamento:equipamento_id (
            id,
            modelo,
            processado,
            patrimonio
          ),
          localizacao_origem:localizacao_origem_id (
            id,
            nome
          ),
          localizacao_destino:localizacao_destino_id (
            id,
            nome
          ),
          secretaria_origem:secretaria_origem_id (
            id,
            nome
          ),
          secretaria_destino:secretaria_destino_id (
            id,
            nome
          ),
          responsavel:responsavel_id (
            id,
            nome
          )
        `)
        .single();

      if (error) throw error;

      // Atualização automática do estado - atualiza apenas o registro modificado
      setMovimentacoes(prev => prev.map(m => m.id === id ? (data as unknown) as Movimentacao : m));
      toast({
        title: "Sucesso",
        description: "Movimentação atualizada com sucesso.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao atualizar movimentação:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar a movimentação.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const deleteMovimentacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('movimentacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualização automática do estado - remove o registro da lista
      setMovimentacoes(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Sucesso",
        description: "Movimentação removida com sucesso.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao remover movimentação:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover a movimentação.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, []);

  return {
    movimentacoes,
    loading,
    fetchMovimentacoes,
    addMovimentacao,
    updateMovimentacao,
    deleteMovimentacao
  };
};