
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EditableSectionProps {
  title: string;
  content: string;
  isEditing: boolean;
  onUpdate: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const EditableSection = ({ 
  title, 
  content, 
  isEditing, 
  onUpdate, 
  placeholder,
  minHeight = "120px"
}: EditableSectionProps) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => onUpdate(e.target.value)}
          className={`text-gray-700 leading-relaxed border-0 shadow-none focus:ring-0 p-0 resize-none`}
          style={{ minHeight }}
          placeholder={placeholder}
        />
      ) : (
        <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
          {content}
        </div>
      )}
    </section>
  );
};

export default EditableSection;
