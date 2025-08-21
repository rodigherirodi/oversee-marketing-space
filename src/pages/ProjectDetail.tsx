
import React, { useState, useEffect, useCallback } from 'react';
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
  const { getProjectById, updateProject, profiles, clients } = useSupabaseProjects();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<SupabaseProject | null>(null);
  const [originalProject, setOriginalProject] = useState<SupabaseProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Criação de wireframe da landing page", completed: true, date: "05/10/2024", isLinked: false },
    { id: 2, task: "Aprovação do layout pelo cliente", completed: true, date: "08/10/2024", isLinked: false },
    { id: 3, task: "Produção das peças gráficas", completed: false, date: "15/10/2024", isLinked: false },
    { id: 4, task: "Desenvolvimento da landing page", completed: false, date: "20/10/2024", isLinked: false },
    { id: 5, task: "Criação dos e-mails marketing", completed: false, date: "25/10/2024", isLinked: false },
    { id: 6, task: "Configuração das campanhas de tráfego", completed: false, date: "28/10/2024", isLinked: false },
    { id: 7, task: "Lançamento da campanha", completed: false, date: "01/11/2024", isLinked: false }
  ]);

  // Carrega o projeto apenas uma vez ou quando o ID muda
  useEffect(() => {
    if (id) {
      console.log('Loading project with ID:', id);
      const project = getProjectById(id);
      if (project) {
        console.log('Project found:', project);
        setEditedProject(project);
        setOriginalProject(project);
      } else {
        console.log('Project not found for ID:', id);
      }
    }
  }, [id, getProjectById]);

  // Debounce para evitar atualizações muito frequentes
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

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

  const handleProjectUpdate = useCallback((updates: Partial<SupabaseProject>) => {
    console.log('Updating project locally with:', updates);
    
    setEditedProject(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      console.log('Local project updated to:', updated);
      return updated;
    });
  }, []);

  const debouncedUpdate = useCallback(
    debounce(handleProjectUpdate, 300),
    [handleProjectUpdate, debounce]
  );

  const handleToggleEdit = () => {
    if (isEditing && originalProject) {
      console.log('Canceling edit, resetting to original project');
      // Reset to original state when canceling
      setEditedProject(originalProject);
    }
    console.log('Toggling edit mode from', isEditing, 'to', !isEditing);
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!id || !editedProject || isSaving) {
      console.log('Cannot save: missing id, project, or already saving');
      return;
    }

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

    setIsSaving(true);
    try {
      console.log('Saving project with data:', editedProject);
      const updatedProject = await updateProject(id, editedProject);
      if (updatedProject) {
        console.log('Project saved successfully:', updatedProject);
        setOriginalProject(updatedProject);
        setEditedProject(updatedProject);
        setIsEditing(false);
        toast({
          title: "Sucesso",
          description: "Projeto atualizado com sucesso!",
        });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto",
        variant: "destructive",
      });
      // Reset to original project on error
      if (originalProject) {
        console.log('Resetting to original project due to error');
        setEditedProject(originalProject);
      }
    } finally {
      setIsSaving(false);
    }
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
          onUpdate={handleProjectUpdate}
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
            <Button 
              onClick={handleSave} 
              className="shadow-lg" 
              disabled={isDateInvalid || isSaving}
            >
              <Check className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
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
