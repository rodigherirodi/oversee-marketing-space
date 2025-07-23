
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StickyNote, Plus, User, Calendar } from 'lucide-react';
import { useClientNotes } from '@/hooks/useClientNotes';
import { useToast } from '@/hooks/use-toast';

interface ClientNotesSectionProps {
  clientId: string;
}

export const ClientNotesSection: React.FC<ClientNotesSectionProps> = ({ clientId }) => {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { getNotesByClient, addNote } = useClientNotes();
  const { toast } = useToast();

  const notes = getNotesByClient(clientId);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setIsAdding(true);
    try {
      addNote(clientId, newNote.trim());
      setNewNote('');
      toast({
        title: "Anotação adicionada",
        description: "A anotação foi salva com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a anotação.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="w-5 h-5" />
          Anotações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new note form */}
        <div className="space-y-4">
          <Textarea
            placeholder="Adicione uma nova anotação..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddNote}
              disabled={!newNote.trim() || isAdding}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAdding ? 'Salvando...' : 'Adicionar Anotação'}
            </Button>
          </div>
        </div>

        {/* Notes list */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma anotação registrada ainda.</p>
              <p className="text-sm">Use o campo acima para adicionar a primeira anotação.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{note.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {formatDateTime(note.createdAt)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
