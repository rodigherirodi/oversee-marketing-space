
-- Create storage bucket for task attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', false);

-- Create task_comments table
CREATE TABLE public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_attachments table
CREATE TABLE public.task_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.task_comments 
ADD CONSTRAINT task_comments_task_id_fkey 
FOREIGN KEY (task_id) REFERENCES public.tarefas(id) ON DELETE CASCADE;

ALTER TABLE public.task_comments 
ADD CONSTRAINT task_comments_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.task_attachments 
ADD CONSTRAINT task_attachments_task_id_fkey 
FOREIGN KEY (task_id) REFERENCES public.tarefas(id) ON DELETE CASCADE;

ALTER TABLE public.task_attachments 
ADD CONSTRAINT task_attachments_uploaded_by_fkey 
FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable RLS for task_comments
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for task_comments
CREATE POLICY "Users can view task comments" 
ON public.task_comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.task_comments FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own comments" 
ON public.task_comments FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" 
ON public.task_comments FOR DELETE 
USING (auth.uid() = author_id);

-- Enable RLS for task_attachments
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- RLS policies for task_attachments
CREATE POLICY "Users can view task attachments" 
ON public.task_attachments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create attachments" 
ON public.task_attachments FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own attachments" 
ON public.task_attachments FOR DELETE 
USING (auth.uid() = uploaded_by);

-- Storage policies for task-attachments bucket
CREATE POLICY "Users can upload attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'task-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'task-attachments');

CREATE POLICY "Users can delete own attachments" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'task-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add some default task types if table is empty
INSERT INTO public.task_types (name, slug, description, icon, color) 
VALUES 
  ('Tarefa', 'task', 'Tarefa padrão', '📋', '#3B82F6'),
  ('Bug', 'bug', 'Correção de erro', '🐛', '#EF4444'),
  ('Feature', 'feature', 'Nova funcionalidade', '✨', '#10B981'),
  ('Melhoria', 'improvement', 'Melhoria existente', '🔧', '#F59E0B'),
  ('Documentação', 'docs', 'Documentação', '📚', '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;
