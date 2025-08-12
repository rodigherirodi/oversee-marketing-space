
import { useState, useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const NotesApp = () => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Initialize notes hook with error boundary
  let notesData;
  try {
    notesData = useNotes();
  } catch (error) {
    console.error('Error initializing notes:', error);
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center text-muted-foreground">
          <p>Erro ao carregar notas. Tente novamente.</p>
        </div>
      </div>
    );
  }

  const {
    notes = [],
    notebooks = [],
    loading = false,
    createNote,
    updateNote,
    deleteNote,
    searchNotes
  } = notesData || {};

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCreateNote = async () => {
    if (!createNote) return;
    
    try {
      const newNote = await createNote();
      if (newNote) {
        setSelectedNote(newNote);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleTogglePin = async (noteId, isPinned) => {
    if (!updateNote) return;
    
    try {
      await updateNote(noteId, { is_pinned: isPinned });
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDeleteNote = (noteId) => {
    if (!deleteNote) return;
    
    try {
      deleteNote(noteId);
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleUpdateNote = async (noteId, updates) => {
    if (!updateNote) return null;
    
    try {
      const updatedNote = await updateNote(noteId, updates);
      if (selectedNote?.id === noteId && updatedNote) {
        setSelectedNote(updatedNote);
      }
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center text-muted-foreground">
          <p>Faça login para acessar suas notas</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
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
            onUpdateNote={handleUpdateNote}
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
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onTogglePin={handleTogglePin}
        />
      </div>
    </div>
  );
};
