-- Criar tabela de localizações
CREATE TABLE public.localizacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir localizações padrão
INSERT INTO public.localizacoes (nome) VALUES 
  ('Recepção'),
  ('Almoxarifado'),
  ('Farmácia'),
  ('Consultório 1'),
  ('Consultório 2'),
  ('Sala de Reunião'),
  ('Administração'),
  ('TI');

-- Criar tabela de equipamentos
CREATE TABLE public.equipamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  modelo TEXT NOT NULL,
  processado TEXT NOT NULL,
  patrimonio INTEGER NOT NULL UNIQUE,
  setor TEXT NOT NULL,
  localizacao_id UUID NOT NULL REFERENCES public.localizacoes(id),
  data_aquisicao DATE,
  estado_conservacao TEXT NOT NULL DEFAULT 'Conservado' CHECK (estado_conservacao IN ('Novo', 'Conservado', 'Meia-vida', 'Fim-da-vida')),
  vida_util TEXT,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Desativado')),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de movimentações
CREATE TABLE public.movimentacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL REFERENCES public.equipamentos(id) ON DELETE CASCADE,
  localizacao_origem_id UUID NOT NULL REFERENCES public.localizacoes(id),
  localizacao_destino_id UUID NOT NULL REFERENCES public.localizacoes(id),
  data_movimentacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responsavel_id UUID NOT NULL REFERENCES public.profiles(id),
  motivo TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.localizacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para localizações
CREATE POLICY "Todos podem visualizar localizações" 
ON public.localizacoes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins podem inserir localizações" 
ON public.localizacoes 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins podem atualizar localizações" 
ON public.localizacoes 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins podem deletar localizações" 
ON public.localizacoes 
FOR DELETE 
USING (is_admin());

-- Políticas RLS para equipamentos
CREATE POLICY "Todos podem visualizar equipamentos" 
ON public.equipamentos 
FOR SELECT 
USING (true);

CREATE POLICY "Admins podem inserir equipamentos" 
ON public.equipamentos 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins podem atualizar equipamentos" 
ON public.equipamentos 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins podem deletar equipamentos" 
ON public.equipamentos 
FOR DELETE 
USING (is_admin());

-- Políticas RLS para movimentações
CREATE POLICY "Todos podem visualizar movimentações" 
ON public.movimentacoes 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários autenticados podem inserir movimentações" 
ON public.movimentacoes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Função para registrar movimentação automaticamente
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para registrar movimentações automaticamente
CREATE TRIGGER trigger_movimentacao_equipamento
  AFTER UPDATE ON public.equipamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_movimentacao_equipamento();

-- Trigger para atualizar updated_at nas tabelas
CREATE TRIGGER update_localizacoes_updated_at
  BEFORE UPDATE ON public.localizacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipamentos_updated_at
  BEFORE UPDATE ON public.equipamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_equipamentos_patrimonio ON public.equipamentos(patrimonio);
CREATE INDEX idx_equipamentos_localizacao ON public.equipamentos(localizacao_id);
CREATE INDEX idx_equipamentos_user ON public.equipamentos(user_id);
CREATE INDEX idx_movimentacoes_equipamento ON public.movimentacoes(equipamento_id);
CREATE INDEX idx_movimentacoes_data ON public.movimentacoes(data_movimentacao);