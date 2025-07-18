
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockProjects } from '@/data/mockData';
import { Calendar, User, Users, Tag, ArrowLeft, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [briefing, setBriefing] = useState("Desenvolver uma campanha completa para o período da Black Friday, focando em aumentar as vendas online através de uma estratégia integrada de marketing digital. A campanha deve incluir criação de landing page, e-mails marketing, conteúdo para redes sociais e materiais promocionais.");
  const [scope, setScope] = useState("• Criação de landing page responsiva\n• 4 e-mails marketing (teaser, lançamento, lembrete, last call)\n• 6 peças para Instagram e Facebook\n• 1 vídeo vertical com roteiro para Stories\n• Configuração de campanhas de tráfego pago\n• Relatório de performance pós-campanha");
  const [observations, setObservations] = useState("Cliente solicitou alteração no tom de voz para mais jovial. Aguardando aprovação final das peças gráficas. Necessário alinhar datas de disparo dos e-mails com equipe de TI do cliente.");
  const [materials, setMaterials] = useState("• Manual da marca: https://drive.google.com/...\n• Figma com layouts: https://figma.com/...\n• Briefing original: [arquivo anexado]\n• Referências visuais: https://pinterest.com/...");

  const [checklist, setChecklist] = useState([
    { id: 1, task: "Criação de wireframe da landing page", completed: true, date: "05/10/2024" },
    { id: 2, task: "Aprovação do layout pelo cliente", completed: true, date: "08/10/2024" },
    { id: 3, task: "Produção das peças gráficas", completed: false, date: "15/10/2024" },
    { id: 4, task: "Desenvolvimento da landing page", completed: false, date: "20/10/2024" },
    { id: 5, task: "Criação dos e-mails marketing", completed: false, date: "25/10/2024" },
    { id: 6, task: "Configuração das campanhas de tráfego", completed: false, date: "28/10/2024" },
    { id: 7, task: "Lançamento da campanha", completed: false, date: "01/11/2024" }
  ]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h1>
          <p className="text-gray-600">O projeto solicitado não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  const toggleChecklistItem = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-green-100 text-green-700';
      case 'planning': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'paused': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'Em andamento';
      case 'planning': return 'Planejamento';
      case 'review': return 'Em revisão';
      case 'paused': return 'Em pausa';
      default: return 'Concluído';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.history.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>

        {/* Project Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {project.name}
          </h1>
          <Badge className={`${getStatusColor(project.status)} border-0`}>
            {getStatusText(project.status)}
          </Badge>
        </div>

        {/* Project Meta Information */}
        <div className="mb-12 pb-6 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">Cliente:</span>
              <span>{project.client.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">Responsável:</span>
              <span>{project.responsibleManager}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Início:</span>
              <span>{new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Entrega:</span>
              <span>{new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">Equipe:</span>
              <span>Marina, Ana, João</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="w-4 h-4" />
              <span className="font-medium">Tags:</span>
              <div className="flex gap-1">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Briefing Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Briefing</h2>
          {isEditing ? (
            <Textarea
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              className="min-h-[120px] text-gray-700 leading-relaxed border-0 shadow-none focus:ring-0 p-0 resize-none"
              placeholder="Descreva aqui os objetivos do projeto, entregas esperadas, público-alvo e demais expectativas..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed text-base">
              {briefing}
            </p>
          )}
        </section>

        {/* Scope Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Escopo / Serviços Contratados</h2>
          {isEditing ? (
            <Textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="min-h-[120px] text-gray-700 leading-relaxed border-0 shadow-none focus:ring-0 p-0 resize-none"
              placeholder="Liste aqui todos os serviços e entregas incluídos no projeto..."
            />
          ) : (
            <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
              {scope}
            </div>
          )}
        </section>

        {/* Schedule/Checklist Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cronograma / Etapas</h2>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleChecklistItem(item.id)}
                  disabled={!isEditing}
                />
                <span className={`flex-1 text-base ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {item.task}
                </span>
                <span className="text-sm text-gray-500">até {item.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Observations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Observações Adicionais</h2>
          {isEditing ? (
            <Textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="min-h-[100px] text-gray-700 leading-relaxed border-0 shadow-none focus:ring-0 p-0 resize-none"
              placeholder="Adicione observações, comentários da equipe ou notas importantes..."
            />
          ) : (
            <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
              {observations}
            </div>
          )}
        </section>

        {/* Materials Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Materiais e Referências</h2>
          {isEditing ? (
            <Textarea
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="min-h-[100px] text-gray-700 leading-relaxed border-0 shadow-none focus:ring-0 p-0 resize-none"
              placeholder="Links, documentos, referências e materiais de apoio..."
            />
          ) : (
            <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
              {materials}
            </div>
          )}
        </section>

        {/* Save button when editing */}
        {isEditing && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={() => setIsEditing(false)} className="shadow-lg">
              <Check className="w-4 h-4 mr-2" />
              Salvar alterações
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
