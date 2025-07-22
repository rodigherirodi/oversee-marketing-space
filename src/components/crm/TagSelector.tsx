
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  X, 
  Plus,
  Check
} from 'lucide-react';
import { availableTags } from '@/data/crmMockData';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      onTagsChange([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewTag();
    }
  };

  return (
    <div className="space-y-2">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            {!disabled && (
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {/* Add Tags */}
      {!disabled && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nova tag</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite uma nova tag..."
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleAddNewTag} disabled={!newTag.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tags disponíveis</label>
                <div className="max-h-32 overflow-y-auto mt-1 space-y-1">
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 ${
                        selectedTags.includes(tag) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      <span className="text-sm">{tag}</span>
                      {selectedTags.includes(tag) && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
