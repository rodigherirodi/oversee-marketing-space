
import { useState } from 'react';
import { Note, Notebook } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Pin,
  PinOff,
  Plus,
  FileText,
  Star,
  Clock,
  Book
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotesListProps {
  notes: Note[];
  notebooks: Notebook[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onTogglePin: (noteId: string, isPinned: boolean) => void;
  onSearch: (query: string) => void;
}

export const NotesList = ({
  notes,
  notebooks,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onTogglePin,
  onSearch
}: NotesListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNotebook, setFilterNotebook] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags))
  ).filter(Boolean);

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (filterNotebook !== 'all' && note.notebook_id !== filterNotebook) {
      return false;
    }
    if (filterTag !== 'all' && !note.tags.includes(filterTag)) {
      return false;
    }
    return true;
  });

  // Group notes
  const pinnedNotes = filteredNotes.filter(note => note.is_pinned);
  const regularNotes = filteredNotes.filter(note => !note.is_pinned);

  const NoteItem = ({ note }: { note: Note }) => {
    const notebook = notebooks.find(nb => nb.id === note.notebook_id);
    const isSelected = selectedNote?.id === note.id;

    return (
      <div
        className={`group p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
          isSelected ? 'bg-muted border-primary' : 'border-border'
        }`}
        onClick={() => onSelectNote(note)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{note.title}</h3>
              {note.is_pinned && (
                <Pin className="h-3 w-3 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            
            {notebook && (
              <div className="flex items-center gap-1 mb-2">
                <Book className="h-3 w-3" style={{ color: notebook.color }} />
                <span className="text-xs text-muted-foreground">{notebook.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(note.updated_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
            
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id, !note.is_pinned);
            }}
          >
            {note.is_pinned ? (
              <PinOff className="h-3 w-3" />
            ) : (
              <Pin className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Bloco de Notas</h2>
          <Button onClick={onCreateNote} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nova
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notas..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <Select value={filterNotebook} onValueChange={setFilterNotebook}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Caderno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cadernos</SelectItem>
              <SelectItem value="">Sem caderno</SelectItem>
              {notebooks.map(notebook => (
                <SelectItem key={notebook.id} value={notebook.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: notebook.color }}
                    />
                    {notebook.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {allTags.length > 0 && (
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {pinnedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Fixadas ({pinnedNotes.length})
                </span>
              </div>
              <div className="space-y-2">
                {pinnedNotes.map(note => (
                  <NoteItem key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}
          
          {regularNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Outras ({regularNotes.length})
                  </span>
                </div>
              )}
              <div className="space-y-2">
                {regularNotes.map(note => (
                  <NoteItem key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}
          
          {filteredNotes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma nota encontrada</p>
              <p className="text-sm">Crie sua primeira nota!</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
