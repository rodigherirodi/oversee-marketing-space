
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Upload, Download, Trash2, File, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Attachment {
  id: string;
  name: string;
  url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

interface TaskAttachmentsSectionProps {
  taskId: string;
}

export const TaskAttachmentsSection: React.FC<TaskAttachmentsSectionProps> = ({ taskId }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAttachments();
  }, [taskId]);

  const fetchAttachments = async () => {
    try {
      // Direct query to task_attachments table (fallback if RPC doesn't exist)
      const { data, error } = await supabase
        .from('task_attachments' as any)
        .select('*')
        .eq('task_id', taskId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching attachments:', error);
        setAttachments([]);
      } else {
        setAttachments(data || []);
      }
    } catch (err) {
      console.error('Error fetching attachments:', err);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('task-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('task-attachments')
        .getPublicUrl(fileName);

      // Save to database using direct insert
      const { data, error } = await supabase
        .from('task_attachments' as any)
        .insert({
          task_id: taskId,
          name: file.name,
          url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving attachment:', error);
        // Fallback: add to local state
        const newAttachment: Attachment = {
          id: crypto.randomUUID(),
          name: file.name,
          url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user.id,
          uploaded_at: new Date().toISOString()
        };
        setAttachments(prev => [newAttachment, ...prev]);
      } else {
        // Refresh attachments list
        fetchAttachments();
      }

      toast.success('Arquivo enviado com sucesso');
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const deleteAttachment = async (attachmentId: string, fileName: string) => {
    try {
      // Extract file path from URL
      const url = new URL(fileName);
      const pathParts = url.pathname.split('/');
      const path = pathParts.slice(-2).join('/'); // Get last two parts (user_id/filename)

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('task-attachments')
        .remove([path]);

      if (storageError) {
        console.warn('Storage deletion failed:', storageError);
      }

      // Delete from database using direct delete
      const { error: dbError } = await supabase
        .from('task_attachments' as any)
        .delete()
        .eq('id', attachmentId);

      if (dbError) {
        console.error('Error deleting from database:', dbError);
      }

      // Remove from local state
      setAttachments(prev => prev.filter(att => att.id !== attachmentId));
      toast.success('Arquivo removido');
    } catch (err) {
      console.error('Error deleting attachment:', err);
      toast.error('Erro ao remover arquivo');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(uploadFile);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4" />
          <h3 className="font-medium">Anexos ({attachments.length})</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Enviando...' : 'Anexar'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Carregando anexos...</div>
      ) : attachments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Nenhum arquivo anexado
        </div>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon(attachment.file_type)}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.file_size)} • {new Date(attachment.uploaded_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(attachment.url, '_blank')}
                  title="Baixar arquivo"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAttachment(attachment.id, attachment.url)}
                  className="text-red-600 hover:text-red-700"
                  title="Remover arquivo"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
