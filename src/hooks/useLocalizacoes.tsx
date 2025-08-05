import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Localizacao {
  id: string;
  nome: string;
  created_at: string;
  updated_at: string;
}

export const useLocalizacoes = () => {
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLocalizacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('localizacoes')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setLocalizacoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as localizações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addLocalizacao = async (nome: string) => {
    try {
      const { data, error } = await supabase
        .from('localizacoes')
        .insert({ nome: nome.trim() })
        .select()
        .single();

      if (error) throw error;

      setLocalizacoes(prev => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      toast({
        title: "Sucesso",
        description: "Localização cadastrada com sucesso.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao cadastrar localização:', error);
      const message = error.code === '23505' 
        ? "Esta localização já existe." 
        : error.message || "Não foi possível cadastrar a localização.";
      
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  const updateLocalizacao = async (id: string, nome: string) => {
    try {
      const { data, error } = await supabase
        .from('localizacoes')
        .update({ nome: nome.trim() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setLocalizacoes(prev => prev.map(loc => 
        loc.id === id ? data : loc
      ).sort((a, b) => a.nome.localeCompare(b.nome)));
      
      toast({
        title: "Sucesso",
        description: "Localização atualizada com sucesso.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao atualizar localização:', error);
      const message = error.code === '23505' 
        ? "Esta localização já existe." 
        : error.message || "Não foi possível atualizar a localização.";
      
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  const deleteLocalizacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('localizacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLocalizacoes(prev => prev.filter(loc => loc.id !== id));
      toast({
        title: "Sucesso",
        description: "Localização removida com sucesso.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao deletar localização:', error);
      const message = error.code === '23503'
        ? "Não é possível remover esta localização pois existem equipamentos vinculados a ela."
        : error.message || "Não foi possível remover a localização.";
      
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    fetchLocalizacoes();
  }, []);

  return {
    localizacoes,
    loading,
    fetchLocalizacoes,
    addLocalizacao,
    updateLocalizacao,
    deleteLocalizacao
  };
};