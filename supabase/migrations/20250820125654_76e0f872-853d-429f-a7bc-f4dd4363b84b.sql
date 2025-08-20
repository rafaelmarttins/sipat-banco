-- Adicionar colunas de secretaria na tabela de movimentações
ALTER TABLE public.movimentacoes 
ADD COLUMN secretaria_origem_id UUID REFERENCES public.secretarias(id),
ADD COLUMN secretaria_destino_id UUID REFERENCES public.secretarias(id);

-- Atualizar a função de trigger para registrar mudanças de secretaria também
CREATE OR REPLACE FUNCTION public.registrar_movimentacao_equipamento()
RETURNS TRIGGER AS $$
BEGIN
  -- Registra movimentação se a localização ou secretaria mudou
  IF OLD.localizacao_id IS DISTINCT FROM NEW.localizacao_id OR 
     OLD.secretaria_id IS DISTINCT FROM NEW.secretaria_id THEN
    
    -- Determinar o motivo baseado no que mudou
    DECLARE
      motivo_texto TEXT;
    BEGIN
      IF OLD.localizacao_id IS DISTINCT FROM NEW.localizacao_id AND 
         OLD.secretaria_id IS DISTINCT FROM NEW.secretaria_id THEN
        motivo_texto := 'Alteração de localização e secretaria via sistema';
      ELSIF OLD.localizacao_id IS DISTINCT FROM NEW.localizacao_id THEN
        motivo_texto := 'Alteração de localização via sistema';
      ELSE
        motivo_texto := 'Alteração de secretaria via sistema';
      END IF;
      
      INSERT INTO public.movimentacoes (
        equipamento_id,
        localizacao_origem_id, 
        localizacao_destino_id,
        secretaria_origem_id,
        secretaria_destino_id,
        responsavel_id,
        motivo
      ) VALUES (
        NEW.id,
        OLD.localizacao_id,
        NEW.localizacao_id,
        OLD.secretaria_id,
        NEW.secretaria_id,
        auth.uid(),
        motivo_texto
      );
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';