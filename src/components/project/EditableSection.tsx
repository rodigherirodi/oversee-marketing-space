
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EditableSectionProps {
  title: string;
  content: string;
  isEditing: boolean;
  onUpdate: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const EditableSection = ({ 
  title, 
  content, 
  isEditing, 
  onUpdate, 
  placeholder = "Digite aqui...",
  minHeight = "120px" 
}: EditableSectionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(e.target.value);
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      {isEditing ? (
        <Textarea
          value={content || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full text-base resize-none"
          style={{ minHeight }}
          rows={Math.max(3, Math.ceil((content || '').length / 80))}
        />
      ) : (
        <div 
          className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border"
          style={{ minHeight: content ? 'auto' : minHeight }}
        >
          {content || <span className="text-gray-500 italic">{placeholder}</span>}
        </div>
      )}
    </section>
  );
};

export default EditableSection;
