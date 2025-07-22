import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead, Pipeline, PipelineStage } from '@/types/crm';
import { LeadCard } from './LeadCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SortableLeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

const SortableLeadCard: React.FC<SortableLeadCardProps> = ({
  lead,
  onEdit,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <LeadCard
        lead={lead}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

interface KanbanColumnProps {
  stage: PipelineStage;
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onAddLead: (stage: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  leads,
  onEdit,
  onDelete,
  onAddLead
}) => {
  const stageLeads = leads.filter(lead => lead.stage === stage.id);
  const totalValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);
  };

  return (
    <div className="w-80 flex-shrink-0">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onAddLead(stage.id)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{stageLeads.length} leads</span>
            <span>{formatCurrency(totalValue)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {stage.probability}% prob.
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-0">
          <SortableContext
            items={stageLeads.map(lead => lead.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 min-h-96 max-h-96 overflow-y-auto pr-2">
              {stageLeads.map((lead) => (
                <SortableLeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              {stageLeads.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-500">
                  <p className="text-sm">Nenhum lead neste estágio</p>
                  <p className="text-xs text-gray-400 mt-1">Arraste leads aqui ou adicione um novo</p>
                </div>
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
};

interface CRMKanbanBoardProps {
  leads: Lead[];
  pipeline: Pipeline;
  onLeadMove: (leadId: string, newStage: string) => void;
  onLeadEdit: (lead: Lead) => void;
  onLeadDelete: (leadId: string) => void;
  onAddLead: (stage: string) => void;
}

export const CRMKanbanBoard: React.FC<CRMKanbanBoardProps> = ({
  leads,
  pipeline,
  onLeadMove,
  onLeadEdit,
  onLeadDelete,
  onAddLead
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLeadData, setActiveLeadData] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const lead = leads.find(l => l.id === active.id);
    setActiveLeadData(lead || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveLeadData(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dropping on a stage
    const targetStage = pipeline.stages.find(stage => 
      stage.id === overId || 
      leads.find(lead => lead.id === overId)?.stage === overId
    );

    if (targetStage) {
      onLeadMove(activeId, targetStage.id);
    } else {
      // Check if we're dropping on another lead
      const targetLead = leads.find(lead => lead.id === overId);
      if (targetLead) {
        onLeadMove(activeId, targetLead.stage);
      }
    }

    setActiveId(null);
    setActiveLeadData(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeLead = leads.find(lead => lead.id === activeId);
    const overLead = leads.find(lead => lead.id === overId);

    if (!activeLead) return;

    // Handle dragging over another lead (same stage)
    if (overLead && activeLead.stage !== overLead.stage) {
      onLeadMove(activeId, overLead.stage);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex gap-6 pb-2 h-full overflow-x-auto">
        {pipeline.stages
          .sort((a, b) => a.order - b.order)
          .map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={leads}
              onEdit={onLeadEdit}
              onDelete={onLeadDelete}
              onAddLead={onAddLead}
            />
          ))}
      </div>

      <DragOverlay>
        {activeId && activeLeadData ? (
          <LeadCard
            lead={activeLeadData}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
