
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  author: {
    name: string;
    avatar?: string;
  };
}

interface TaskCommentsSectionProps {
  taskId: string;
}

export const TaskCommentsSection: React.FC<TaskCommentsSectionProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      // Usando query raw até types.ts ser atualizado
      const { data, error } = await (supabase as any)
        .from('task_comments')
        .select(`
          id, content, author_id, created_at,
          author:profiles(name, avatar)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await (supabase as any)
        .from('task_comments')
        .insert([{
          task_id: taskId,
          content: newComment.trim(),
          author_id: user.id
        }])
        .select(`
          id, content, author_id, created_at,
          author:profiles(name, avatar)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setNewComment('');
      toast.success('Comentário adicionado');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Erro ao adicionar comentário');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <h3 className="font-medium">Comentários ({comments.length})</h3>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Carregando comentários...</div>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add new comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Adicionar um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={addComment} 
                disabled={!newComment.trim() || submitting}
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'Enviando...' : 'Comentar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
