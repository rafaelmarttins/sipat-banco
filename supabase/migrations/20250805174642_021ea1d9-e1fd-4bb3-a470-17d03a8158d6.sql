-- Criar tabela para tipos de equipamento
CREATE TABLE public.tipos_equipamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  icone TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.tipos_equipamento ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Todos podem visualizar tipos de equipamento" 
ON public.tipos_equipamento 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Admins podem inserir tipos de equipamento" 
ON public.tipos_equipamento 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins podem atualizar tipos de equipamento" 
ON public.tipos_equipamento 
FOR UPDATE 
USING (is_admin());

-- Inserir tipos padrão
INSERT INTO public.tipos_equipamento (nome, icone) VALUES
('PC', 'Computer'),
('Monitor', 'Monitor'),
('Impressora', 'Printer'),
('Nobreak', 'Zap'),
('Notebook', 'Laptop'),
('Tablet', 'Tablet');

-- Trigger para updated_at
CREATE TRIGGER update_tipos_equipamento_updated_at
BEFORE UPDATE ON public.tipos_equipamento
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();