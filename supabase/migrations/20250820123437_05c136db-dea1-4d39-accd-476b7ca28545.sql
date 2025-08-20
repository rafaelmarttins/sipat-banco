-- Criar tabela de secretarias
CREATE TABLE public.secretarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.secretarias ENABLE ROW LEVEL SECURITY;

-- Políticas para secretarias
CREATE POLICY "Todos podem visualizar secretarias ativas" 
ON public.secretarias 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Admins podem inserir secretarias" 
ON public.secretarias 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins podem atualizar secretarias" 
ON public.secretarias 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins podem deletar secretarias" 
ON public.secretarias 
FOR DELETE 
USING (is_admin());

-- Adicionar trigger de updated_at
CREATE TRIGGER update_secretarias_updated_at
BEFORE UPDATE ON public.secretarias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar coluna secretaria_id nas tabelas existentes
ALTER TABLE public.equipamentos 
ADD COLUMN secretaria_id UUID REFERENCES public.secretarias(id);

ALTER TABLE public.profiles 
ADD COLUMN secretaria_id UUID REFERENCES public.secretarias(id);

-- Inserir algumas secretarias padrão
INSERT INTO public.secretarias (nome, descricao) VALUES 
('Secretaria de Saúde', 'Responsável pela gestão da saúde pública municipal'),
('Secretaria de Educação', 'Responsável pela gestão da educação municipal'),
('Secretaria de Administração', 'Responsável pela gestão administrativa geral'),
('Secretaria de Obras', 'Responsável pelas obras e infraestrutura municipal'),
('Secretaria de Assistência Social', 'Responsável pelos programas sociais municipais');