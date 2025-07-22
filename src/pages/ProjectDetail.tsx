
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockProjects } from '@/data/mockData';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectMetaInfo from '@/components/project/ProjectMetaInfo';
import ProjectChecklist from '@/components/project/ProjectChecklist';
import EditableSection from '@/components/project/EditableSection';
import { Project } from '@/types/entities';

const ProjectDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const project = mockProjects.find(p => p.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(project || null);
  const [briefing, setBriefing] = useState("Desenvolver uma campanha completa para o período da Black Friday, focando em aumentar as vendas online através de uma estratégia integrada de marketing digital. A campanha deve incluir criação de landing page, e-mails marketing, conteúdo para redes sociais e materiais promocionais.");
  const [scope, setScope] = useState("• Criação de landing page responsiva\n• 4 e-mails marketing (teaser, lançamento, lembrete, last call)\n• 6 peças para Instagram e Facebook\n• 1 vídeo vertical com roteiro para Stories\n• Configuração de campanhas de tráfego pago\n• Relatório de performance pós-campanha");
  const [observations, setObservations] = useState("Cliente solicitou alteração no tom de voz para mais jovial. Aguardando aprovação final das peças gráficas. Necessário alinhar datas de disparo dos e-mails com equipe de TI do cliente.");
  const [materials, setMaterials] = useState("• Manual da marca: https://drive.google.com/...\n• Figma com layouts: https://figma.com/...\n• Briefing original: [arquivo anexado]\n• Referências visuais: https://pinterest.com/...");

  const [checklist, setChecklist] = useState([
    { id: 1, task: "Criação de wireframe da landing page", completed: true, date: "05/10/2024", isLinked: false },
    { id: 2, task: "Aprovação do layout pelo cliente", completed: true, date: "08/10/2024", isLinked: false },
    { id: 3, task: "Produção das peças gráficas", completed: false, date: "15/10/2024", isLinked: false },
    { id: 4, task: "Desenvolvimento da landing page", completed: false, date: "20/10/2024", isLinked: false },
    { id: 5, task: "Criação dos e-mails marketing", completed: false, date: "25/10/2024", isLinked: false },
    { id: 6, task: "Configuração das campanhas de tráfego", completed: false, date: "28/10/2024", isLinked: false },
    { id: 7, task: "Lançamento da campanha", completed: false, date: "01/11/2024", isLinked: false }
  ]);

  if (!project || !editedProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h1>
          <p className="text-gray-600">O projeto solicitado não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  const handleProjectUpdate = (updates: Partial<Project>) => {
    setEditedProject(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Reset to original state when canceling
      setEditedProject(project);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Here you would typically save to a backend
    // For now, we'll just show a success message
    toast({
      title: "Alterações salvas",
      description: "As informações do projeto foram atualizadas com sucesso.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <ProjectHeader 
          project={editedProject} 
          isEditing={isEditing} 
          onToggleEdit={handleToggleEdit} 
        />

        <ProjectMetaInfo 
          project={editedProject} 
          isEditing={isEditing} 
          onUpdate={handleProjectUpdate} 
        />

        <EditableSection
          title="Briefing"
          content={briefing}
          isEditing={isEditing}
          onUpdate={setBriefing}
          placeholder="Descreva aqui os objetivos do projeto, entregas esperadas, público-alvo e demais expectativas..."
        />

        <EditableSection
          title="Escopo / Serviços Contratados"
          content={scope}
          isEditing={isEditing}
          onUpdate={setScope}
          placeholder="Liste aqui todos os serviços e entregas incluídos no projeto..."
        />

        <ProjectChecklist
          checklist={checklist}
          isEditing={isEditing}
          onUpdate={setChecklist}
          projectId={id}
        />

        <EditableSection
          title="Observações Adicionais"
          content={observations}
          isEditing={isEditing}
          onUpdate={setObservations}
          placeholder="Adicione observações, comentários da equipe ou notas importantes..."
          minHeight="100px"
        />

        <EditableSection
          title="Materiais e Referências"
          content={materials}
          isEditing={isEditing}
          onUpdate={setMaterials}
          placeholder="Links, documentos, referências e materiais de apoio..."
          minHeight="100px"
        />

        {/* Save button when editing */}
        {isEditing && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={handleSave} className="shadow-lg">
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
