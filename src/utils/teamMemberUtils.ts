
import { TeamMember } from '@/types/entities';

export const transformTeamMemberData = (member: any): TeamMember => {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    position: member.position || 'Sem cargo',
    department: member.department || 'operacao',
    avatar: member.avatar || '/placeholder.svg',
    phone: member.phone || '',
    birth_date: member.birth_date,
    hire_date: member.hire_date,
    address: member.address || '',
    status: member.status || 'active',
    level: member.level || 1,
    points: member.points || 0,
    task_completion_rate: member.task_completion_rate || 0,
    active_projects_count: member.active_projects_count || 0,
    completed_projects_count: member.completed_projects_count || 0,
    hours_worked_week: member.hours_worked_week || 40,
    border_pattern: member.border_pattern || 'solid',
    border_color: member.border_color || '#3B82F6',
    created_at: member.created_at,
    updated_at: member.updated_at,
    
    // Campos transformados para compatibilidade
    hireDate: member.hire_date,
    birthDate: member.birth_date,
    activeProjectsCount: member.active_projects_count || 0,
    completedProjectsCount: member.completed_projects_count || 0,
    taskCompletionRate: member.task_completion_rate || 0,
    hoursWorkedWeek: member.hours_worked_week || 40,
    borderPattern: (member.border_pattern || 'solid') as 'solid' | 'stripes' | 'dots' | 'gradient',
    borderColor: member.border_color || '#3B82F6',
    badges: ['🌟'], // Valor padrão
    skills: [], // Valor padrão
    goals: [], // Valor padrão
    createdAt: member.created_at,
  };
};
