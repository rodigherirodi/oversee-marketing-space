
import React, { useState } from 'react';
import { Project } from '@/types/entities';
import { 
  MessageCircle, 
  Calendar, 
  FileText, 
  Plus,
  User,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HistoryTabProps {
  project: Project;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ project }) => {
  const [newComment, setNewComment] = useState('');

  const timelineEvents = [
    {
      id: 1,
      type: 'comment',
      title: 'Comentário adicionado',
      description: 'Cliente aprovou a primeira versão do layout',
      author: 'Ana Silva',
      date: '2024-01-20T10:30:00',
      icon: MessageCircle
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Reunião realizada',
      description: 'Reunião de alinhamento com stakeholders',
      author: 'Carlos Santos',
      date: '2024-01-18T14:00:00',
      icon: Calendar
    },
    {
      id: 3,
      type: 'delivery',
      title: 'Entrega realizada',
      description: 'Primeira versão dos wireframes entregue',
      author: 'Maria Costa',
      date: '2024-01-15T16:45:00',
      icon: FileText
    }
  ];

  const comments = [
    {
      id: 1,
      author: 'João Silva',
      content: 'Projeto está evoluindo bem. Cliente muito satisfeito com os resultados até agora.',
      date: '2024-01-22T09:15:00',
      type: 'comment'
    },
    {
      id: 2,
      author: 'Ana Costa',
      content: 'Atenção: prazo da próxima entrega é apertado. Precisamos acelerar o desenvolvimento.',
      date: '2024-01-21T15:30:00',
      type: 'alert'
    }
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Aqui você adicionaria a lógica para salvar o comentário
      console.log('Novo comentário:', newComment);
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Linha do Tempo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineEvents.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <event.icon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{event.author}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comments and Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comentários e Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add new comment */}
              <div className="border-b pb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicionar comentário ou observação..."
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleAddComment} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Comments list */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      comment.type === 'alert' 
                        ? 'bg-yellow-50 border-yellow-400' 
                        : 'bg-gray-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meeting History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Histórico de Reuniões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">18/01/2024</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Alinhamento</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Cliente + Equipe</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Carlos Santos</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <Button variant="ghost" size="sm">Ver detalhes</Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">15/01/2024</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Apresentação</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Stakeholders</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Ana Silva</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <Button variant="ghost" size="sm">Ver detalhes</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryTab;
