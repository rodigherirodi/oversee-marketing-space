
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
      // Use RPC function to fetch comments with author info
      const { data, error } = await supabase
        .rpc('get_task_comments', { task_id_param: taskId });

      if (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } else {
        setComments(data || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
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

      // Use RPC function to insert comment
      const { data, error } = await supabase
        .rpc('insert_task_comment', {
          task_id_param: taskId,
          content_param: newComment.trim(),
          author_id_param: user.id
        });

      if (error) {
        console.error('Error adding comment:', error);
        // Fallback: add to local state
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

        const newCommentObj: Comment = {
          id: crypto.randomUUID(),
          content: newComment.trim(),
          author_id: user.id,
          created_at: new Date().toISOString(),
          author: {
            name: profile?.name || 'Usuário',
            avatar: undefined
          }
        };
        setComments(prev => [...prev, newCommentObj]);
      } else {
        // Refresh comments list
        fetchComments();
      }

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      addComment();
    }
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
              placeholder="Adicionar um comentário... (Ctrl+Enter para enviar)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
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
