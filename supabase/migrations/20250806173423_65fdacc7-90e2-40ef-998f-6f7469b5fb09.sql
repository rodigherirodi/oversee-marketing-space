
-- Create kanban_configs table to store Kanban board configurations
CREATE TABLE public.kanban_configs (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'all',
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_stages table to store the stages/columns for each Kanban
CREATE TABLE public.task_stages (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  order_position INTEGER NOT NULL,
  kanban_config_id TEXT NOT NULL REFERENCES public.kanban_configs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.kanban_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_stages ENABLE ROW LEVEL SECURITY;

-- Create policies for kanban_configs
CREATE POLICY "Users can view kanban configs" 
  ON public.kanban_configs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage kanban configs" 
  ON public.kanban_configs 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for task_stages
CREATE POLICY "Users can view task stages" 
  ON public.task_stages 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage task stages" 
  ON public.task_stages 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default "Geral" Kanban configuration
INSERT INTO public.kanban_configs (id, name, department, color) VALUES 
('geral', 'Geral', 'all', '#3B82F6');

-- Insert default stages that match the existing task status enum values
INSERT INTO public.task_stages (id, name, color, order_position, kanban_config_id) VALUES 
('todo', 'A Fazer', '#6B7280', 1, 'geral'),
('in_progress', 'Em Progresso', '#F59E0B', 2, 'geral'),
('review', 'Em Revisão', '#8B5CF6', 3, 'geral'),
('completed', 'Concluído', '#10B981', 4, 'geral'),
('cancelled', 'Cancelado', '#EF4444', 5, 'geral');

-- Add triggers to update the updated_at column
CREATE TRIGGER update_kanban_configs_updated_at
  BEFORE UPDATE ON public.kanban_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();

CREATE TRIGGER update_task_stages_updated_at
  BEFORE UPDATE ON public.task_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();
