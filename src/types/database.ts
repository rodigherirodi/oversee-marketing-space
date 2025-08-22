
// DTOs tipados para o fluxo integrado
export interface TaskDTO {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  prioridade: 'low' | 'medium' | 'high';
  data_entrega?: string;
  criado_em: string;
  atualizado_em: string;
  concluido_em?: string;
  tags: string[];
  squad: string;
  tipo: string;
  campos_customizados: Record<string, any>;
  
  // FKs
  projeto_id?: string;
  cliente_id?: string;
  responsavel: string;
  
  // Dados relacionados (joins)
  projeto_nome?: string;
  projeto_status?: string;
  cliente_nome?: string;
  cliente_status?: string;
  responsavel_nome?: string;
  responsavel_avatar?: string;
  responsavel_department?: string;
}

export interface ProjectDTO {
  id: string;
  titulo: string;
  cliente?: string;
  cliente_id?: string;
  status: 'planejamento' | 'em_andamento' | 'em_revisao' | 'em_pausa' | 'concluido';
  prioridade?: 'Alta' | 'Média' | 'Baixa';
  data_inicio?: string;
  data_entrega?: string;
  progresso: number;
  equipe?: string;
  tags?: string[];
  responsavel?: string;
  briefing?: string;
  escopo?: string;
  observacoes?: string;
  materiais?: any;
  criado_em: string;
  atualizado_em: string;
  
  // Dados relacionados
  cliente_nome?: string;
  cliente_status?: string;
  cliente_segmento?: string;
  total_tarefas?: number;
  tarefas_concluidas?: number;
  tarefas_em_andamento?: number;
}

export interface ClientDTO {
  id: string;
  nome: string;
  segmento?: string;
  descricao?: string;
  porte?: 'micro' | 'pequeno' | 'medio' | 'grande';
  status?: 'ativo' | 'inativo' | 'prospect';
  temperatura?: 'frio' | 'morno' | 'quente';
  tipo_contrato?: 'recorrente' | 'projeto_unico' | 'pontual';
  gestor_id?: string;
  cliente_desde?: string;
  nps_atual?: number;
  endereco?: string;
  cidade?: string;
  uf?: string;
  site?: string;
  redes_sociais?: any;
  logo_url?: string;
  tags?: string[];
  criado_em: string;
}

// Form data types
export interface TaskFormData {
  titulo: string;
  descricao?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  prioridade: 'low' | 'medium' | 'high';
  data_entrega?: Date;
  projeto_id?: string;
  cliente_id?: string;
  responsavel: string;
  squad: string;
  tipo: string;
  tags: string[];
}

export interface ProjectFormData {
  titulo: string;
  cliente_id?: string;
  status: 'planejamento' | 'em_andamento' | 'em_revisao' | 'em_pausa' | 'concluido';
  prioridade?: 'Alta' | 'Média' | 'Baixa';
  data_inicio?: Date;
  data_entrega?: Date;
  progresso: number;
  equipe?: string;
  responsavel?: string;
  briefing?: string;
  escopo?: string;
  observacoes?: string;
}

export interface ClientFormData {
  nome: string;
  segmento?: string;
  descricao?: string;
  porte?: 'micro' | 'pequeno' | 'medio' | 'grande';
  status?: 'ativo' | 'inativo' | 'prospect';
  temperatura?: 'frio' | 'morno' | 'quente';
  tipo_contrato?: 'recorrente' | 'projeto_unico' | 'pontual';
  gestor_id?: string;
  cliente_desde?: string;
  nps_atual?: number;
  endereco?: string;
  cidade?: string;
  uf?: string;
  site?: string;
  logo_url?: string;
  tags?: string[];
}

// Query options
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface TaskFilters {
  status?: string;
  prioridade?: string;
  cliente_id?: string;
  projeto_id?: string;
  responsavel?: string;
  search?: string;
}

export interface ProjectFilters {
  status?: string;
  prioridade?: string;
  cliente_id?: string;
  search?: string;
}

export interface ClientFilters {
  status?: string;
  porte?: string;
  temperatura?: string;
  search?: string;
}
