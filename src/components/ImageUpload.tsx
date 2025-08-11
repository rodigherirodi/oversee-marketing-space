
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { useClientLogo } from '@/hooks/useClientLogo';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  fallbackText?: string;
  clientId?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  fallbackText = 'Logo',
  clientId 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadLogo, isUploading } = useClientLogo();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !clientId) return;

    const logoUrl = await uploadLogo(file, clientId);
    if (logoUrl) {
      onChange(logoUrl);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src={value} alt="Logo preview" />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !clientId}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Carregando...' : 'Selecionar Logo'}
        </Button>
        
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
          >
            <X className="w-4 h-4 mr-2" />
            Remover
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
