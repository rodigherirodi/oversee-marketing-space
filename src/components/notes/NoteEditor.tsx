
import { useState, useEffect, useCallback, useRef } from 'react';
import { Note } from '@/hooks/useNotes';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Save,
  Pin,
  PinOff,
  Trash2,
  Clock,
  Tag,
  X,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => Promise<Note | undefined>;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string, isPinned: boolean) => void;
}

export const NoteEditor = ({
  note,
  onUpdateNote,
  onDeleteNote,
  onTogglePin
}: NoteEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>({ type: 'doc', content: [] });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const hasChangesRef = useRef(false);

  // Load note data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content_json);
      setTags(note.tags);
      setLastSaved(new Date(note.updated_at));
      hasChangesRef.current = false;
    } else {
      setTitle('');
      setContent({ type: 'doc', content: [] });
      setTags([]);
      setLastSaved(null);
      hasChangesRef.current = false;
    }
  }, [note]);

  // Autosave function with debounce
  const autosave = useCallback(async () => {
    if (!note || !hasChangesRef.current) return;

    setIsSaving(true);
    
    try {
      const updatedNote = await onUpdateNote(note.id, {
        title: title.trim() || 'Nova Nota',
        content_json: content,
        tags
      });
      
      if (updatedNote) {
        setLastSaved(new Date(updatedNote.updated_at));
        hasChangesRef.current = false;
      }
    } catch (error) {
      console.error('Erro no autosave:', error);
    } finally {
      setIsSaving(false);
    }
  }, [note, title, content, tags, onUpdateNote]);

  // Debounced autosave
  const scheduleAutosave = useCallback(() => {
    if (!note) return;
    
    hasChangesRef.current = true;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(autosave, 1000);
  }, [autosave, note]);

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    scheduleAutosave();
  };

  // Handle content change
  const handleContentChange = (newContent: any) => {
    setContent(newContent);
    scheduleAutosave();
  };

  // Handle tag addition
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setNewTag('');
      scheduleAutosave();
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    scheduleAutosave();
  };

  // Handle manual save
  const handleManualSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    autosave();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">Selecione uma nota</h3>
          <p className="text-sm">Escolha uma nota da lista ou crie uma nova para começar a editar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {isSaving ? (
              <span className="text-blue-500">Salvando...</span>
            ) : lastSaved ? (
              <span>
                Salvo {formatDistanceToNow(lastSaved, { addSuffix: true, locale: ptBR })}
              </span>
            ) : (
              <span>Não salvo</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving || !hasChangesRef.current}
            >
              <Save className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePin(note.id, !note.is_pinned)}
            >
              {note.is_pinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir esta nota?')) {
                  onDeleteNote(note.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Title */}
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Título da nota..."
          className="text-lg font-semibold border-none px-0 shadow-none focus-visible:ring-0"
        />
        
        {/* Tags */}
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tags</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Adicionar tag..."
              className="text-sm h-8"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              className="h-8 px-2"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          placeholder="Comece a escrever sua nota..."
        />
      </div>
    </div>
  );
};
