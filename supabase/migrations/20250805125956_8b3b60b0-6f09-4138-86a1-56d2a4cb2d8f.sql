-- Corrigir função sem search_path definido
CREATE OR REPLACE FUNCTION public.registrar_movimentacao_equipamento()
RETURNS TRIGGER AS $$
BEGIN
  -- Só registra movimentação se a localização mudou
  IF OLD.localizacao_id IS DISTINCT FROM NEW.localizacao_id THEN
    INSERT INTO public.movimentacoes (
      equipamento_id,
      localizacao_origem_id, 
      localizacao_destino_id,
      responsavel_id,
      motivo
    ) VALUES (
      NEW.id,
      OLD.localizacao_id,
      NEW.localizacao_id,
      auth.uid(),
      'Alteração de localização via sistema'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';