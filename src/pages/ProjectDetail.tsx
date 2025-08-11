
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TaskProvider } from '@/contexts/TaskContext';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectMetaInfo from '@/components/project/ProjectMetaInfo';
import ProjectChecklist from '@/components/project/ProjectChecklist';
import EditableSection from '@/components/project/EditableSection';
import { useSupabaseProjects, SupabaseProject } from '@/hooks/useSupabaseProjects';

const ProjectDetailContent = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { getProjectById, updateProject, profiles } = useSupabaseProjects();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<SupabaseProject | null>(null);
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Criação de wireframe da landing page", completed: true, date: "05/10/2024", isLinked: false },
    { id: 2, task: "Aprovação do layout pelo cliente", completed: true, date: "08/10/2024", isLinked: false },
    { id: 3, task: "Produção das peças gráficas", completed: false, date: "15/10/2024", isLinked: false },
    { id: 4, task: "Desenvolvimento da landing page", completed: false, date: "20/10/2024", isLinked: false },
    { id: 5, task: "Criação dos e-mails marketing", completed: false, date: "25/10/2024", isLinked: false },
    { id: 6, task: "Configuração das campanhas de tráfego", completed: false, date: "28/10/2024", isLinked: false },
    { id: 7, task: "Lançamento da campanha", completed: false, date: "01/11/2024", isLinked: false }
  ]);

  useEffect(() => {
    if (id) {
      const project = getProjectById(id);
      if (project) {
        setEditedProject(project);
      }
    }
  }, [id, getProjectById]);

  if (!editedProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Projeto não encontrado</h1>
          <p className="text-gray-600">O projeto solicitado não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  const handleProjectUpdate = (updates: Partial<SupabaseProject>) => {
    setEditedProject(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleToggleEdit = () => {
    if (isEditing && id) {
      // Reset to original state when canceling
      const originalProject = getProjectById(id);
      if (originalProject) {
        setEditedProject(originalProject);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!id || !editedProject) return;

    // Validação de datas
    if (editedProject.data_inicio && editedProject.data_entrega && 
        new Date(editedProject.data_inicio) > new Date(editedProject.data_entrega)) {
      toast({
        title: "Erro de validação",
        description: "A data de início não pode ser posterior à data de entrega",
        variant: "destructive",
      });
      return;
    }

    await updateProject(id, editedProject);
    setIsEditing(false);
  };

  const formatMaterials = (materials: any) => {
    if (!materials || !Array.isArray(materials)) return '';
    return materials.map((item: any) => `• ${item.nome}: ${item.url}`).join('\n');
  };

  const parseMaterials = (materialsText: string) => {
    if (!materialsText.trim()) return null;
    try {
      const lines = materialsText.split('\n').filter(line => line.trim());
      return lines.map(line => {
        const match = line.match(/^•?\s*([^:]+):\s*(.+)$/);
        if (match) {
          return { nome: match[1].trim(), url: match[2].trim() };
        }
        return { nome: line.trim(), url: '' };
      });
    } catch {
      return null;
    }
  };

  const handleMaterialsUpdate = (materialsText: string) => {
    const parsedMaterials = parseMaterials(materialsText);
    handleProjectUpdate({ materiais: parsedMaterials });
  };

  const isDateInvalid = editedProject.data_inicio && editedProject.data_entrega && 
    new Date(editedProject.data_inicio) > new Date(editedProject.data_entrega);

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
          profiles={profiles}
        />

        <EditableSection
          title="Briefing"
          content={editedProject.briefing || ''}
          isEditing={isEditing}
          onUpdate={(value) => handleProjectUpdate({ briefing: value })}
          placeholder="Descreva aqui os objetivos do projeto, entregas esperadas, público-alvo e demais expectativas..."
        />

        <EditableSection
          title="Escopo / Serviços Contratados"
          content={editedProject.escopo || ''}
          isEditing={isEditing}
          onUpdate={(value) => handleProjectUpdate({ escopo: value })}
          placeholder="Liste aqui todos os serviços e entregas incluídos no projeto..."
        />

        <ProjectChecklist
          checklist={checklist}
          isEditing={isEditing}
          onUpdate={setChecklist}
          projectId={editedProject.id}
        />

        <EditableSection
          title="Observações Adicionais"
          content={editedProject.observacoes || ''}
          isEditing={isEditing}
          onUpdate={(value) => handleProjectUpdate({ observacoes: value })}
          placeholder="Adicione observações, comentários da equipe ou notas importantes..."
          minHeight="100px"
        />

        <EditableSection
          title="Materiais e Referências"
          content={formatMaterials(editedProject.materiais)}
          isEditing={isEditing}
          onUpdate={handleMaterialsUpdate}
          placeholder="Links, documentos, referências e materiais de apoio...&#10;• Manual da marca: https://drive.google.com/...&#10;• Figma com layouts: https://figma.com/..."
          minHeight="100px"
        />

        {isDateInvalid && (
          <div className="mb-6 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>A data de início não pode ser posterior à data de entrega</span>
          </div>
        )}

        {/* Save button when editing */}
        {isEditing && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={handleSave} className="shadow-lg" disabled={isDateInvalid}>
              <Check className="w-4 h-4 mr-2" />
              Salvar alterações
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectDetail = () => {
  return (
    <TaskProvider>
      <ProjectDetailContent />
    </TaskProvider>
  );
};

export default ProjectDetail;
