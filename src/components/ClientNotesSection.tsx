
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, User, Calendar } from 'lucide-react';
import { useClientNotes } from '@/hooks/useClientNotes';

interface ClientNotesSectionProps {
  clientId: string;
}

export const ClientNotesSection = ({ clientId }: ClientNotesSectionProps) => {
  const { getNotesByClient, addNote } = useClientNotes();
  const notes = getNotesByClient(clientId);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteContent.trim()) {
      addNote({
        content: newNoteContent.trim(),
        date: new Date().toISOString().split('T')[0],
        author: 'Usuario Atual',
        clientId
      });
      setNewNoteContent('');
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Anotações</CardTitle>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? "outline" : "default"}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isAdding ? 'Cancelar' : 'Nova Anotação'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <Textarea
              placeholder="Digite sua anotação..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={3}
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Anotação
              </Button>
            </div>
          </form>
        )}

        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma anotação registrada
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(note.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {note.author}
                  </div>
                  <div className="text-xs">
                    {new Date(note.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
