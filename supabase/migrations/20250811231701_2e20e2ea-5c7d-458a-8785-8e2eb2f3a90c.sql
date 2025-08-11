
-- Criar tabela para anotações de clientes
CREATE TABLE public.cliente_anotacoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid NOT NULL,
  conteudo text NOT NULL,
  autor_id uuid REFERENCES auth.users(id),
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de anotações
ALTER TABLE public.cliente_anotacoes ENABLE ROW LEVEL SECURITY;

-- Política para visualizar anotações (usuários autenticados podem ver todas)
CREATE POLICY "Users can view all client notes" 
  ON public.cliente_anotacoes 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Política para inserir anotações (usuários autenticados podem criar)
CREATE POLICY "Authenticated users can create client notes" 
  ON public.cliente_anotacoes 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = autor_id);

-- Política para atualizar anotações (apenas o autor pode atualizar)
CREATE POLICY "Users can update their own notes" 
  ON public.cliente_anotacoes 
  FOR UPDATE 
  USING (auth.uid() = autor_id);

-- Política para deletar anotações (apenas o autor pode deletar)
CREATE POLICY "Users can delete their own notes" 
  ON public.cliente_anotacoes 
  FOR DELETE 
  USING (auth.uid() = autor_id);

-- Trigger para atualizar o campo atualizado_em
CREATE TRIGGER update_cliente_anotacoes_updated_at
  BEFORE UPDATE ON public.cliente_anotacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();
