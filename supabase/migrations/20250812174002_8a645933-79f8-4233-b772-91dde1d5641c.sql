
-- Create notes table with user scoping and soft delete
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notebook_id UUID NULL,
  title TEXT NOT NULL DEFAULT 'Nova Nota',
  content_json JSONB NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  version INTEGER DEFAULT 1
);

-- Create notebooks table for organization
CREATE TABLE public.notebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for notebook_id
ALTER TABLE public.notes 
ADD CONSTRAINT fk_notes_notebook 
FOREIGN KEY (notebook_id) REFERENCES public.notebooks(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes
CREATE POLICY "Users can view their own notes" 
  ON public.notes 
  FOR SELECT 
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create their own notes" 
  ON public.notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can soft delete their own notes" 
  ON public.notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for notebooks
CREATE POLICY "Users can view their own notebooks" 
  ON public.notebooks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notebooks" 
  ON public.notebooks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notebooks" 
  ON public.notebooks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notebooks" 
  ON public.notebooks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_notebook_id ON public.notes(notebook_id);
CREATE INDEX idx_notes_tags ON public.notes USING GIN(tags);
CREATE INDEX idx_notes_deleted_at ON public.notes(deleted_at);
CREATE INDEX idx_notes_is_pinned ON public.notes(is_pinned);
CREATE INDEX idx_notebooks_user_id ON public.notebooks(user_id);

-- Full-text search index
CREATE INDEX idx_notes_title_search ON public.notes USING GIN(to_tsvector('portuguese', title));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION update_notes_updated_at();

CREATE OR REPLACE FUNCTION update_notebooks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notebooks_updated_at
    BEFORE UPDATE ON public.notebooks
    FOR EACH ROW
    EXECUTE FUNCTION update_notebooks_updated_at();
