
-- Create task_comments table
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tarefas(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_attachments table
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tarefas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to task_types table
ALTER TABLE public.task_types 
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6',
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '📋';

-- Create storage bucket for task attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_comments
CREATE POLICY "Users can view comments for tasks they have access to" 
  ON public.task_comments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.tarefas 
    WHERE tarefas.id = task_comments.task_id
  ));

CREATE POLICY "Users can create comments" 
  ON public.task_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" 
  ON public.task_comments 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.task_comments 
  FOR DELETE 
  USING (auth.uid() = author_id);

-- Create RLS policies for task_attachments
CREATE POLICY "Users can view attachments for tasks they have access to" 
  ON public.task_attachments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.tarefas 
    WHERE tarefas.id = task_attachments.task_id
  ));

CREATE POLICY "Users can upload attachments" 
  ON public.task_attachments 
  FOR INSERT 
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own attachments" 
  ON public.task_attachments 
  FOR UPDATE 
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own attachments" 
  ON public.task_attachments 
  FOR DELETE 
  USING (auth.uid() = uploaded_by);

-- Create storage policies for task-attachments bucket
CREATE POLICY "Users can upload task attachments" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'task-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view task attachments" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'task-attachments');

CREATE POLICY "Users can delete their own task attachments" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'task-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add triggers for updated_at
CREATE OR REPLACE TRIGGER update_task_comments_updated_at
  BEFORE UPDATE ON public.task_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();

CREATE OR REPLACE TRIGGER update_task_attachments_updated_at
  BEFORE UPDATE ON public.task_attachments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();
