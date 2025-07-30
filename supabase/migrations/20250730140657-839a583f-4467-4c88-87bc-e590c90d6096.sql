
-- Create kanban_configs table
CREATE TABLE public.kanban_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create task_stages table  
CREATE TABLE public.task_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6', 
  order_position integer NOT NULL DEFAULT 0,
  kanban_config_id uuid REFERENCES public.kanban_configs(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create task_types table
CREATE TABLE public.task_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  icon text NOT NULL DEFAULT '📝',
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create tasks table
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  type_id uuid REFERENCES public.task_types(id),
  assignee_id uuid REFERENCES public.profiles(id),
  squad text,
  client_id text,
  project_id text,
  due_date timestamp with time zone,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  completed_at timestamp with time zone,
  created_by uuid REFERENCES public.profiles(id) NOT NULL
);

-- Create task_watchers table for many-to-many relationship
CREATE TABLE public.task_watchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(task_id, user_id)
);

-- Create task_comments table
CREATE TABLE public.task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_id uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create task_attachments table
CREATE TABLE public.task_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  file_type text,
  file_size integer,
  uploaded_by uuid REFERENCES public.profiles(id),
  uploaded_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.kanban_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for kanban_configs
CREATE POLICY "Users can view all kanban configs" ON public.kanban_configs FOR SELECT USING (true);
CREATE POLICY "Admins can manage kanban configs" ON public.kanban_configs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for task_stages  
CREATE POLICY "Users can view all task stages" ON public.task_stages FOR SELECT USING (true);
CREATE POLICY "Admins can manage task stages" ON public.task_stages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for task_types
CREATE POLICY "Users can view all task types" ON public.task_types FOR SELECT USING (true);
CREATE POLICY "Admins can manage task types" ON public.task_types FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for tasks
CREATE POLICY "Users can view all tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update tasks they created or are assigned to" ON public.tasks FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = assignee_id);
CREATE POLICY "Users can delete tasks they created" ON public.tasks FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for task_watchers
CREATE POLICY "Users can view all task watchers" ON public.task_watchers FOR SELECT USING (true);
CREATE POLICY "Users can manage their own watching status" ON public.task_watchers FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for task_comments
CREATE POLICY "Users can view all task comments" ON public.task_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.task_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON public.task_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own comments" ON public.task_comments FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for task_attachments
CREATE POLICY "Users can view all task attachments" ON public.task_attachments FOR SELECT USING (true);
CREATE POLICY "Users can upload attachments" ON public.task_attachments FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete their own attachments" ON public.task_attachments FOR DELETE USING (auth.uid() = uploaded_by);

-- Insert default kanban config
INSERT INTO public.kanban_configs (id, name, department, color) VALUES 
('geral', 'Geral', 'operacao', '#3B82F6');

-- Insert default task stages for the general kanban
INSERT INTO public.task_stages (name, color, order_position, kanban_config_id) VALUES
('Todo', '#6B7280', 0, 'geral'),
('Em Progresso', '#F59E0B', 1, 'geral'),  
('Concluído', '#10B981', 2, 'geral');

-- Insert default task types
INSERT INTO public.task_types (name, color, icon) VALUES
('Bug', '#EF4444', '🐛'),
('Feature', '#3B82F6', '✨'),
('Task', '#6B7280', '📝'),
('Documentation', '#8B5CF6', '📚');
