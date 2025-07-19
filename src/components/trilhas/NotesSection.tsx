
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  NotebookPen, 
  Save,
  Edit3
} from 'lucide-react';
import { useTrilhas } from '../../contexts/TrilhasContext';

interface NotesSectionProps {
  trilhaId: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({ trilhaId }) => {
  const { getTrilhaProgress, updateTrilhaNotes } = useTrilhas();
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const progress = getTrilhaProgress(trilhaId);

  useEffect(() => {
    if (progress?.notes) {
      setNotes(progress.notes);
    }
  }, [progress?.notes]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasUnsavedChanges(value !== (progress?.notes || ''));
  };

  const handleSave = () => {
    updateTrilhaNotes(trilhaId, notes);
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(progress?.notes || '');
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />
            Minhas Anotações
          </div>
          
          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Editar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Adicione suas anotações sobre esta trilha, dúvidas, insights ou observações importantes..."
              className="min-h-32 resize-none"
            />
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
              >
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {notes ? (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {notes}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <NotebookPen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Nenhuma anotação ainda.
                </p>
                <p className="text-xs mt-1">
                  Clique em "Editar" para adicionar suas observações sobre esta trilha.
                </p>
              </div>
            )}
          </div>
        )}
        
        {hasUnsavedChanges && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Você tem alterações não salvas
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesSection;
