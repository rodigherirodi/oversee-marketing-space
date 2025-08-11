
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClientLogo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadLogo = async (file: File, clientId: string): Promise<string | null> => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione um arquivo de imagem válido (JPG, PNG, GIF)",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `client-logos/${clientId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const logoUrl = data.publicUrl;
      
      // Update logo in database
      const { error: updateError } = await supabase
        .from('clientes')
        .update({ logo_url: logoUrl })
        .eq('id', clientId);

      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Logo atualizado",
        description: "O logo do cliente foi atualizado com sucesso.",
      });

      return logoUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload do logo.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadLogo,
    isUploading,
  };
};
