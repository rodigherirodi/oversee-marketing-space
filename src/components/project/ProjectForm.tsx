import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { projectFormSchema, ProjectFormData, mapProjectToForm, mapFormToProject } from '@/schemas/projectSchema';
import { SupabaseProject, ProfileOption, ClientOption } from '@/hooks/useSupabaseProjects';

interface ProjectFormProps {
  project: SupabaseProject;
  profiles: ProfileOption[];
  clients: ClientOption[];
  onUpdateSuccess: (updatedProject: SupabaseProject) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  profiles,
  clients,
  onUpdateSuccess
}) => {
  const { toast } = useToast();
  
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: mapProjectToForm(project)
  });

  // Reset form when project changes
  useEffect(() => {
    reset(mapProjectToForm(project));
  }, [project.id, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      console.log('Submitting form data:', data);
      
      const updateData = mapFormToProject(data);
      console.log('Mapped update data:', updateData);

      // Optimistic update
      const optimisticProject = { ...project, ...updateData };
      onUpdateSuccess(optimisticProject);

      // Actual database update
      const { data: updatedData, error } = await supabase
        .from('projetos')
        .update(updateData)
        .eq('id', project.id)
        .select(`
          id, 
          titulo, 
          cliente, 
          cliente_id,
          status, 
          prioridade, 
          data_inicio, 
          data_entrega, 
          progresso, 
          equipe, 
          tags, 
          responsavel, 
          briefing, 
          escopo, 
          observacoes, 
          materiais, 
          criado_em, 
          atualizado_em,
          clientes(nome)
        `)
        .single();

      if (error) throw error;

      console.log('Project updated successfully:', updatedData);

      const transformedProject: SupabaseProject = {
        ...updatedData,
        cliente_nome: updatedData.clientes?.nome || updatedData.cliente,
        status: updatedData.status as 'planejamento' | 'em_andamento' | 'em_revisao' | 'em_pausa' | 'concluido',
        prioridade: updatedData.prioridade as 'Alta' | 'Média' | 'Baixa' | null
      };

      // Update with real data from server
      onUpdateSuccess(transformedProject);

      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso!",
      });

    } catch (error) {
      console.error('Error updating project:', error);
      
      // Revert optimistic update on error
      reset(mapProjectToForm(project));
      
      toast({
        title: "Erro",
        description: "Erro ao atualizar projeto",
        variant: "destructive",
      });
    }
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    setValue('tags', tags);
  };

  return (
    <div key={project.id} className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="titulo">Título *</Label>
          <Input
            {...register('titulo')}
            id="titulo"
            placeholder="Nome do projeto"
          />
          {errors.titulo && (
            <p className="text-sm text-red-600">{errors.titulo.message}</p>
          )}
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Status *</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="em_revisao">Em revisão</SelectItem>
                    <SelectItem value="em_pausa">Em pausa</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Controller
              name="prioridade"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Client and Responsible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Controller
              name="cliente_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Responsável</Label>
            <Controller
              name="responsavel"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.name}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Dates and Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_inicio">Data de Início</Label>
            <Input
              {...register('data_inicio')}
              id="data_inicio"
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_entrega">Data de Entrega</Label>
            <Input
              {...register('data_entrega')}
              id="data_entrega"
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progresso">Progresso (%)</Label>
            <Input
              {...register('progresso', { valueAsNumber: true })}
              id="progresso"
              type="number"
              min="0"
              max="100"
            />
            {errors.progresso && (
              <p className="text-sm text-red-600">{errors.progresso.message}</p>
            )}
          </div>
        </div>

        {/* Team and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="equipe">Equipe</Label>
            <Input
              {...register('equipe')}
              id="equipe"
              placeholder="Nome1, Nome2, Nome3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              value={watch('tags')?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              id="tags"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        {/* Briefing */}
        <div className="space-y-2">
          <Label htmlFor="briefing">Briefing</Label>
          <Textarea
            {...register('briefing')}
            id="briefing"
            placeholder="Descreva os objetivos do projeto..."
            rows={3}
          />
        </div>

        {/* Scope */}
        <div className="space-y-2">
          <Label htmlFor="escopo">Escopo / Serviços Contratados</Label>
          <Textarea
            {...register('escopo')}
            id="escopo"
            placeholder="Liste todos os serviços e entregas..."
            rows={3}
          />
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações Adicionais</Label>
          <Textarea
            {...register('observacoes')}
            id="observacoes"
            placeholder="Adicione observações importantes..."
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
