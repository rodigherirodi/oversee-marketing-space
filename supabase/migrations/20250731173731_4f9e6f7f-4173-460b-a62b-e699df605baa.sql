
-- Create task_types table
CREATE TABLE public.task_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT '📋',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kanban_configs table  
CREATE TABLE public.kanban_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_stages table
CREATE TABLE public.task_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  order_position INTEGER NOT NULL DEFAULT 0,
  kanban_config_id UUID REFERENCES public.kanban_configs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  type_id UUID REFERENCES public.task_types(id) ON DELETE SET NULL,
  assignee_id UUID,
  squad TEXT NOT NULL DEFAULT 'Geral',
  client_id TEXT,
  project_id UUID,
  due_date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.task_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_types
CREATE POLICY "Users can view task types" 
  ON public.task_types 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage task types" 
  ON public.task_types 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for kanban_configs
CREATE POLICY "Users can view kanban configs" 
  ON public.kanban_configs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage kanban configs" 
  ON public.kanban_configs 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for task_stages
CREATE POLICY "Users can view task stages" 
  ON public.task_stages 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage task stages" 
  ON public.task_stages 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for tasks
CREATE POLICY "Users can view all tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update tasks they created" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete tasks they created" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all tasks" 
  ON public.tasks 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default data
INSERT INTO public.task_types (id, name, color, icon) VALUES
  ('task', 'Tarefa', '#3B82F6', '📋'),
  ('bug', 'Bug', '#EF4444', '🐛'),
  ('feature', 'Funcionalidade', '#10B981', '⭐'),
  ('improvement', 'Melhoria', '#F59E0B', '🔧');

INSERT INTO public.kanban_configs (id, name, department, color) VALUES
  ('geral', 'Geral', 'Geral', '#6366F1'),
  ('operacao', 'Operação', 'operacao', '#3B82F6'),
  ('comercial', 'Comercial', 'comercial', '#10B981'),
  ('cultura', 'Cultura', 'cultura', '#F59E0B');

INSERT INTO public.task_stages (name, color, order_position, kanban_config_id) VALUES
  -- Stages for Geral kanban
  ('A Fazer', '#64748B', 0, 'geral'),
  ('Em Andamento', '#3B82F6', 1, 'geral'),
  ('Em Revisão', '#F59E0B', 2, 'geral'),
  ('Concluído', '#10B981', 3, 'geral'),
  
  -- Stages for Operacao kanban
  ('Backlog', '#64748B', 0, 'operacao'),
  ('Em Desenvolvimento', '#3B82F6', 1, 'operacao'),
  ('Teste', '#F59E0B', 2, 'operacao'),
  ('Deploy', '#8B5CF6', 3, 'operacao'),
  ('Finalizado', '#10B981', 4, 'operacao'),
  
  -- Stages for Comercial kanban
  ('Lead', '#64748B', 0, 'comercial'),
  ('Qualificado', '#3B82F6', 1, 'comercial'),
  ('Proposta', '#F59E0B', 2, 'comercial'),
  ('Negociação', '#8B5CF6', 3, 'comercial'),
  ('Fechado', '#10B981', 4, 'comercial'),
  
  -- Stages for Cultura kanban
  ('Planejamento', '#64748B', 0, 'cultura'),
  ('Execução', '#3B82F6', 1, 'cultura'),
  ('Avaliação', '#F59E0B', 2, 'cultura'),
  ('Implementado', '#10B981', 3, 'cultura');

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON public.tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
