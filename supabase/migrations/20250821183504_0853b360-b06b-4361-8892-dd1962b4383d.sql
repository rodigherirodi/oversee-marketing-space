
-- Habilitar Row Level Security na tabela projetos
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados visualizem todos os projetos
CREATE POLICY "Users can view all projects" 
  ON public.projetos 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados criem projetos
CREATE POLICY "Authenticated users can create projects" 
  ON public.projetos 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados atualizem projetos
CREATE POLICY "Authenticated users can update projects" 
  ON public.projetos 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Política para permitir que apenas admins excluam projetos
CREATE POLICY "Admins can delete projects" 
  ON public.projetos 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Garantir que o trigger de atualização automática está funcionando
CREATE OR REPLACE TRIGGER update_projetos_atualizado_em
    BEFORE UPDATE ON public.projetos
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
