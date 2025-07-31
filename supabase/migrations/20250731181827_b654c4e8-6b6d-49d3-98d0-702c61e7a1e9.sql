
-- Create enum types for better data integrity
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'completed', 'cancelled');

-- Create the tarefas table
CREATE TABLE public.tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  prioridade task_priority NOT NULL DEFAULT 'medium',
  responsavel TEXT NOT NULL,
  cliente TEXT,
  projeto TEXT,
  data_entrega DATE,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  concluido_em TIMESTAMP WITH TIME ZONE,
  criado_por UUID REFERENCES auth.users(id),
  squad TEXT DEFAULT 'operacao',
  tipo TEXT DEFAULT 'task',
  tags TEXT[] DEFAULT '{}',
  campos_customizados JSONB DEFAULT '{}',
  observadores TEXT[] DEFAULT '{}',
  anexos JSONB DEFAULT '[]'
);

-- Enable Row Level Security
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all tasks" ON public.tarefas
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tasks" ON public.tarefas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update tasks" ON public.tarefas
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete tasks" ON public.tarefas
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_tarefas_status ON public.tarefas(status);
CREATE INDEX idx_tarefas_prioridade ON public.tarefas(prioridade);
CREATE INDEX idx_tarefas_responsavel ON public.tarefas(responsavel);
CREATE INDEX idx_tarefas_cliente ON public.tarefas(cliente);
CREATE INDEX idx_tarefas_data_entrega ON public.tarefas(data_entrega);
CREATE INDEX idx_tarefas_squad ON public.tarefas(squad);
CREATE INDEX idx_tarefas_criado_em ON public.tarefas(criado_em);

-- Create function to automatically update atualizado_em timestamp
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER trigger_update_atualizado_em
    BEFORE UPDATE ON public.tarefas
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em();
