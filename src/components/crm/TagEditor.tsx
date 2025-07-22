
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Check } from 'lucide-react';

interface TagEditorProps {
  tags: string[];
  onSave: (tags: string[]) => void;
  className?: string;
}

export const TagEditor: React.FC<TagEditorProps> = ({
  tags,
  onSave,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTags, setEditTags] = useState<string[]>(tags);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave(editTags);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTags(tags);
    setNewTag('');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex flex-wrap gap-2">
          {editTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-red-100"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nova tag..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            className="flex-1"
          />
          <Button size="sm" onClick={handleAddTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer hover:bg-gray-50 p-2 rounded ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-gray-500">Clique para adicionar tags</span>
        )}
      </div>
    </div>
  );
};
