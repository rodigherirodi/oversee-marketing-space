
-- Add the missing prioridade column to the projetos table
ALTER TABLE public.projetos 
ADD COLUMN prioridade text;

-- Set a default value for existing records
UPDATE public.projetos 
SET prioridade = 'Média' 
WHERE prioridade IS NULL;
