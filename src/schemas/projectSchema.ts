
import { z } from 'zod';

export const projectFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  cliente_id: z.string().optional(),
  responsavel: z.string().optional(),
  status: z.enum(['planejamento', 'em_andamento', 'em_revisao', 'em_pausa', 'concluido']),
  prioridade: z.enum(['Alta', 'Média', 'Baixa']).optional(),
  data_inicio: z.string().optional(),
  data_entrega: z.string().optional(),
  progresso: z.number().min(0).max(100),
  equipe: z.string().optional(),
  tags: z.array(z.string()).optional(),
  briefing: z.string().optional(),
  escopo: z.string().optional(),
  observacoes: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export const mapProjectToForm = (project: any): ProjectFormData => ({
  titulo: project.titulo || '',
  cliente_id: project.cliente_id || '',
  responsavel: project.responsavel || '',
  status: project.status || 'planejamento',
  prioridade: project.prioridade || 'Média',
  data_inicio: project.data_inicio || '',
  data_entrega: project.data_entrega || '',
  progresso: project.progresso || 0,
  equipe: project.equipe || '',
  tags: project.tags || [],
  briefing: project.briefing || '',
  escopo: project.escopo || '',
  observacoes: project.observacoes || '',
});

export const mapFormToProject = (data: ProjectFormData) => ({
  titulo: data.titulo,
  cliente_id: data.cliente_id || null,
  responsavel: data.responsavel || null,
  status: data.status,
  prioridade: data.prioridade || null,
  data_inicio: data.data_inicio || null,
  data_entrega: data.data_entrega || null,
  progresso: data.progresso,
  equipe: data.equipe || null,
  tags: data.tags || null,
  briefing: data.briefing || null,
  escopo: data.escopo || null,
  observacoes: data.observacoes || null,
});
