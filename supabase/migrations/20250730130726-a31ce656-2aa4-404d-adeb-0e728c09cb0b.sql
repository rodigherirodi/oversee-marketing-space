
-- Create task types table
CREATE TABLE public.task_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT '📋',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kanban configurations table
CREATE TABLE public.kanban_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task stages table
CREATE TABLE public.task_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kanban_config_id UUID NOT NULL REFERENCES public.kanban_configs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  order_position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  type_id UUID REFERENCES public.task_types(id),
  assignee_id UUID REFERENCES public.profiles(id),
  squad TEXT NOT NULL DEFAULT 'operacao',
  client_id UUID,
  project_id UUID,
  due_date DATE,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id)
);

-- Create task watchers table
CREATE TABLE public.task_watchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Create task comments table
CREATE TABLE public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task attachments table
CREATE TABLE public.task_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.task_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_types
CREATE POLICY "Users can view task types" ON public.task_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage task types" ON public.task_types FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for kanban_configs
CREATE POLICY "Users can view kanban configs" ON public.kanban_configs FOR SELECT USING (true);
CREATE POLICY "Admins can manage kanban configs" ON public.kanban_configs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for task_stages
CREATE POLICY "Users can view task stages" ON public.task_stages FOR SELECT USING (true);
CREATE POLICY "Admins can manage task stages" ON public.task_stages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update assigned tasks" ON public.tasks FOR UPDATE USING (
  auth.uid() = assignee_id OR 
  auth.uid() = created_by OR 
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'manager'::app_role)
);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (
  auth.uid() = created_by OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create RLS policies for task_watchers
CREATE POLICY "Users can view task watchers" ON public.task_watchers FOR SELECT USING (true);
CREATE POLICY "Users can add themselves as watchers" ON public.task_watchers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove themselves as watchers" ON public.task_watchers FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Task assignees can manage watchers" ON public.task_watchers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND (assignee_id = auth.uid() OR created_by = auth.uid()))
);

-- Create RLS policies for task_comments
CREATE POLICY "Users can view task comments" ON public.task_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.task_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON public.task_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.task_comments FOR DELETE USING (
  auth.uid() = author_id OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create RLS policies for task_attachments
CREATE POLICY "Users can view task attachments" ON public.task_attachments FOR SELECT USING (true);
CREATE POLICY "Users can upload attachments" ON public.task_attachments FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete own attachments" ON public.task_attachments FOR DELETE USING (
  auth.uid() = uploaded_by OR has_role(auth.uid(), 'admin'::app_role)
);

-- Insert default task types
INSERT INTO public.task_types (id, name, color, icon) VALUES
  ('task-bug', 'Bug', '#EF4444', '🐛'),
  ('task-feature', 'Feature', '#3B82F6', '✨'),
  ('task-improvement', 'Melhoria', '#10B981', '🔧'),
  ('task-documentation', 'Documentação', '#8B5CF6', '📚'),
  ('task-meeting', 'Reunião', '#F59E0B', '🤝'),
  ('task-research', 'Pesquisa', '#06B6D4', '🔍');

-- Insert default kanban config
INSERT INTO public.kanban_configs (id, name, department, color) VALUES
  ('kanban-geral', 'Geral', 'geral', '#6B7280'),
  ('kanban-operacao', 'Operação', 'operacao', '#3B82F6'),
  ('kanban-comercial', 'Comercial', 'comercial', '#10B981'),
  ('kanban-academy', 'Academy', 'academy', '#8B5CF6'),
  ('kanban-cultura', 'Cultura', 'cultura', '#F59E0B'),
  ('kanban-gestao', 'Gestão', 'gestao', '#EF4444');

-- Insert default stages for general kanban
INSERT INTO public.task_stages (kanban_config_id, name, color, order_position) VALUES
  ((SELECT id FROM public.kanban_configs WHERE name = 'Geral'), 'A Fazer', '#6B7280', 1),
  ((SELECT id FROM public.kanban_configs WHERE name = 'Geral'), 'Em Progresso', '#3B82F6', 2),
  ((SELECT id FROM public.kanban_configs WHERE name = 'Geral'), 'Em Revisão', '#F59E0B', 3),
  ((SELECT id FROM public.kanban_configs WHERE name = 'Geral'), 'Concluído', '#10B981', 4);

-- Insert stages for all other kanbans
INSERT INTO public.task_stages (kanban_config_id, name, color, order_position)
SELECT 
  kc.id,
  stage.name,
  stage.color,
  stage.order_position
FROM public.kanban_configs kc
CROSS JOIN (
  VALUES 
    ('A Fazer', '#6B7280', 1),
    ('Em Progresso', '#3B82F6', 2),
    ('Em Revisão', '#F59E0B', 3),
    ('Concluído', '#10B981', 4)
) AS stage(name, color, order_position)
WHERE kc.name != 'Geral';

-- Create storage bucket for task attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('task-attachments', 'task-attachments', false);

-- Create storage policy for task attachments
CREATE POLICY "Users can upload task attachments" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'task-attachments' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view task attachments" ON storage.objects FOR SELECT USING (
  bucket_id = 'task-attachments' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own task attachments" ON storage.objects FOR DELETE USING (
  bucket_id = 'task-attachments' AND auth.uid()::text = (storage.foldername(name))[1]
);
