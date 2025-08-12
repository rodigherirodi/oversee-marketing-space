
import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const NotesApp = () => {
  const { user } = useAuth();
  const {
    notes,
    notebooks,
    loading,
    selectedNote,
    setSelectedNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes
  } = useNotes();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      setSelectedNote(newNote);
    }
  };

  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    await updateNote(noteId, { is_pinned: isPinned });
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p>Faça login para acessar suas notas</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Mobile layout - show only one panel at a time
  if (isMobile) {
    if (selectedNote) {
      return (
        <div className="h-full">
          <NoteEditor
            note={selectedNote}
            onUpdateNote={updateNote}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
          />
        </div>
      );
    }
    
    return (
      <div className="h-full">
        <NotesList
          notes={notes}
          notebooks={notebooks}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onCreateNote={handleCreateNote}
          onTogglePin={handleTogglePin}
          onSearch={searchNotes}
        />
      </div>
    );
  }

  // Desktop layout - master-detail
  return (
    <div className="h-full flex">
      <div className="w-80 border-r border-border flex-shrink-0">
        <NotesList
          notes={notes}
          notebooks={notebooks}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onCreateNote={handleCreateNote}
          onTogglePin={handleTogglePin}
          onSearch={searchNotes}
        />
      </div>
      
      <div className="flex-1">
        <NoteEditor
          note={selectedNote}
          onUpdateNote={updateNote}
          onDeleteNote={handleDeleteNote}
          onTogglePin={handleTogglePin}
        />
      </div>
    </div>
  );
};
