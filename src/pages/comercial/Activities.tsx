import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, List } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ActivityList } from '@/components/crm/ActivityList';
import { ActivityForm } from '@/components/crm/ActivityForm';
import { ActivityFiltersComponent } from '@/components/crm/ActivityFilters';
import { Activity, ActivityFilters, ActivityFormData, Lead } from '@/types/crm';
import { mockLeads } from '@/data/crmMockData';
import { useNavigate } from 'react-router-dom';

// Mock data for activities
const initialActivities: Activity[] = [
  {
    id: 'activity-1',
    leadId: 'lead-1',
    type: 'call',
    title: 'Primeira ligação',
    description: 'Conversei com João sobre as necessidades da empresa. Ele demonstrou interesse e agendamos uma reunião.',
    createdAt: new Date('2024-01-15T10:30:00'),
    createdBy: 'Maria Santos',
    responsiblePerson: 'Maria Santos',
    outcome: 'positive'
  },
  {
    id: 'activity-2',
    leadId: 'lead-2',
    type: 'email',
    title: 'Proposta enviada',
    description: 'Enviei a proposta comercial detalhada conforme discutido na reunião.',
    createdAt: new Date('2024-01-20T14:15:00'),
    createdBy: 'Carlos Lima',
    responsiblePerson: 'Carlos Lima',
    outcome: 'positive'
  },
  {
    id: 'activity-3',
    leadId: 'lead-4',
    type: 'meeting',
    title: 'Reunião de fechamento',
    description: 'Reunião para apresentar a proposta final e discutir os próximos passos.',
    createdAt: new Date('2024-01-25T09:00:00'),
    createdBy: 'Ana Silva',
    responsiblePerson: 'Carlos Lima',
    dueDate: new Date('2024-01-30T10:00:00'),
    completed: false
  },
  {
    id: 'activity-4',
    leadId: 'lead-3',
    type: 'task',
    title: 'Preparar demonstração',
    description: 'Preparar uma demonstração do produto para o cliente.',
    createdAt: new Date('2024-01-18T16:45:00'),
    createdBy: 'Carlos Lima',
    responsiblePerson: 'Maria Santos',
    dueDate: new Date('2024-01-28T14:00:00'),
    completed: true,
    outcome: 'positive'
  },
  {
    id: 'activity-5',
    leadId: 'lead-5',
    type: 'note',
    title: 'Notas da conversa',
    description: 'Cliente demonstrou interesse nos módulos A e B, mas tem preocupações com o preço.',
    createdAt: new Date('2024-01-22T11:20:00'),
    createdBy: 'Ana Silva',
    responsiblePerson: 'Ana Silva',
    completed: true
  }
];

// Mock team members
const teamMembers = [
  'Maria Santos',
  'Carlos Lima',
  'Ana Silva',
  'Pedro Mendes',
  'Lucia Costa'
];

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activityFormOpen, setActivityFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string>('');
  const [filters, setFilters] = useState<ActivityFilters>({});
  
  const navigate = useNavigate();

  // Filter activities based on the filters
  const filteredActivities = activities.filter(activity => {
    // Search filter
    const matchesSearch = !filters.search || 
      activity.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      activity.description.toLowerCase().includes(filters.search.toLowerCase());
    
    // Lead filter
    const matchesLead = !filters.leadId || activity.leadId === filters.leadId;
    
    // Type filter
    const matchesType = !filters.type || activity.type === filters.type;
    
    // Responsible person filter
    const matchesResponsible = !filters.responsiblePerson || 
      activity.responsiblePerson === filters.responsiblePerson;
    
    // Date range filter
    const matchesDateRange = !filters.dateRange || 
      (activity.createdAt >= filters.dateRange.start && 
       activity.createdAt <= new Date(filters.dateRange.end.getTime() + 86400000)); // +1 day to include end date
    
    // Completed filter
    const matchesCompleted = filters.completed === undefined || 
      activity.completed === filters.completed;
    
    return matchesSearch && matchesLead && matchesType && 
           matchesResponsible && matchesDateRange && matchesCompleted;
  });

  const handleAddActivity = () => {
    setEditingActivity(undefined);
    setActivityFormOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setActivityFormOpen(true);
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivityToDelete(activityId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteActivity = () => {
    setActivities(activities.filter(activity => activity.id !== activityToDelete));
    setDeleteDialogOpen(false);
    setActivityToDelete('');
  };

  const handleActivitySubmit = (formData: ActivityFormData) => {
    if (editingActivity) {
      // Update existing activity
      setActivities(prevActivities =>
        prevActivities.map(activity =>
          activity.id === editingActivity.id
            ? {
                ...activity,
                ...formData,
              }
            : activity
        )
      );
    } else {
      // Create new activity
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
        createdBy: 'Usuário Atual', // In a real app, this would come from authentication
      };
      setActivities([...activities, newActivity]);
    }
  };

  const handleToggleComplete = (activity: Activity) => {
    setActivities(prevActivities =>
      prevActivities.map(a =>
        a.id === activity.id
          ? { ...a, completed: !a.completed }
          : a
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Atividades Comerciais</h1>
          <p className="text-gray-600">Gerencie todas as atividades relacionadas a leads e oportunidades</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/comercial/crm')}
          >
            Ver CRM
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleAddActivity}
          >
            <Plus className="w-4 h-4" />
            Nova Atividade
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <ActivityFiltersComponent
            filters={filters}
            onFilterChange={setFilters}
            leads={leads}
            teamMembers={teamMembers}
          />
        </CardContent>
      </Card>

      {/* Activity List */}
      <ActivityList
        activities={filteredActivities}
        leads={leads}
        onEditActivity={handleEditActivity}
        onDeleteActivity={handleDeleteActivity}
        onToggleComplete={handleToggleComplete}
      />

      {/* Activity Form Dialog */}
      <ActivityForm
        open={activityFormOpen}
        onClose={() => {
          setActivityFormOpen(false);
          setEditingActivity(undefined);
        }}
        onSubmit={handleActivitySubmit}
        activity={editingActivity as ActivityFormData}
        leads={leads}
        teamMembers={teamMembers}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteActivity} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Activities;
