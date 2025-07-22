
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X } from 'lucide-react';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  type?: 'text' | 'email' | 'phone' | 'textarea';
  placeholder?: string;
  className?: string;
  displayComponent?: React.ReactNode;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  type = 'text',
  placeholder,
  className = '',
  displayComponent
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = async () => {
    if (editValue.trim() !== value) {
      setIsSaving(true);
      try {
        await onSave(editValue.trim());
      } catch (error) {
        console.error('Error saving field:', error);
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    const InputComponent = type === 'textarea' ? Textarea : Input;
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <InputComponent
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          type={type === 'textarea' ? undefined : type}
          autoFocus
          disabled={isSaving}
          className="flex-1"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 w-8 p-0"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {displayComponent || <span className="flex-1">{value || placeholder}</span>}
      <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
