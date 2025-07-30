
-- Criar tabela de tipos de tarefa
CREATE TABLE IF NOT EXISTS public.task_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT NOT NULL DEFAULT '📋',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estágios de tarefa
CREATE TABLE IF NOT EXISTS public.task_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  order_position INTEGER NOT NULL DEFAULT 0,
  kanban_config_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de configurações de kanban
CREATE TABLE IF NOT EXISTS public.kanban_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela principal de tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  type_id UUID,
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
  created_by UUID NOT NULL,
  FOREIGN KEY (type_id) REFERENCES public.task_types(id) ON DELETE SET NULL,
  FOREIGN KEY (assignee_id) REFERENCES public.profiles(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Criar tabela de observadores de tarefas
CREATE TABLE IF NOT EXISTS public.task_watchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  UNIQUE(task_id, user_id)
);

-- Criar tabela de comentários de tarefas
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Criar tabela de anexos de tarefas
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Adicionar foreign key para task_stages
ALTER TABLE public.task_stages 
ADD CONSTRAINT fk_task_stages_kanban_config 
FOREIGN KEY (kanban_config_id) REFERENCES public.kanban_configs(id) ON DELETE CASCADE;

-- Inserir tipos de tarefa padrão
INSERT INTO public.task_types (name, color, icon) VALUES
('Tarefa', '#3B82F6', '📋'),
('Bug', '#EF4444', '🐛'),
('Feature', '#10B981', '✨'),
('Melhoria', '#F59E0B', '🔧'),
('Documentação', '#8B5CF6', '📚')
ON CONFLICT DO NOTHING;

-- Inserir configuração kanban padrão
INSERT INTO public.kanban_configs (id, name, department, color) VALUES
('geral', 'Geral', 'Geral', '#3B82F6')
ON CONFLICT (id) DO NOTHING;

-- Inserir estágios padrão para o kanban geral
INSERT INTO public.task_stages (name, color, order_position, kanban_config_id) VALUES
('A Fazer', '#6B7280', 0, 'geral'),
('Em Progresso', '#3B82F6', 1, 'geral'),
('Em Revisão', '#F59E0B', 2, 'geral'),
('Concluído', '#10B981', 3, 'geral')
ON CONFLICT DO NOTHING;

-- Habilitar RLS nas tabelas
ALTER TABLE public.task_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para task_types
CREATE POLICY "Users can view task types" ON public.task_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage task types" ON public.task_types FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para task_stages
CREATE POLICY "Users can view task stages" ON public.task_stages FOR SELECT USING (true);
CREATE POLICY "Admins can manage task stages" ON public.task_stages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para kanban_configs
CREATE POLICY "Users can view kanban configs" ON public.kanban_configs FOR SELECT USING (true);
CREATE POLICY "Admins can manage kanban configs" ON public.kanban_configs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para tasks
CREATE POLICY "Users can view tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = assignee_id);
CREATE POLICY "Admins can manage all tasks" ON public.tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para task_watchers
CREATE POLICY "Users can view task watchers" ON public.task_watchers FOR SELECT USING (true);
CREATE POLICY "Users can manage watchers on own tasks" ON public.task_watchers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND (created_by = auth.uid() OR assignee_id = auth.uid()))
);
CREATE POLICY "Admins can manage all watchers" ON public.task_watchers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para task_comments
CREATE POLICY "Users can view task comments" ON public.task_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.task_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON public.task_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.task_comments FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all comments" ON public.task_comments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas RLS para task_attachments
CREATE POLICY "Users can view task attachments" ON public.task_attachments FOR SELECT USING (true);
CREATE POLICY "Users can upload attachments" ON public.task_attachments FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete own attachments" ON public.task_attachments FOR DELETE USING (auth.uid() = uploaded_by);
CREATE POLICY "Admins can manage all attachments" ON public.task_attachments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
