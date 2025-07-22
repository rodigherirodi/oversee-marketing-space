
import React, { useState } from 'react';
import { Lead, Pipeline } from '@/types/crm';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DollarSign, 
  Building2, 
  Mail, 
  Phone, 
  User, 
  Calendar,
  Edit,
  CheckCircle,
  XCircle,
  Plus,
  Target
} from 'lucide-react';
import { PipelineProgress } from './PipelineProgress';
import { ContactList } from './ContactList';
import { TagSelector } from './TagSelector';
import { ActivityTimeline } from './ActivityTimeline';
import { availableSegments } from '@/data/crmMockData';

interface LeadViewSheetProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
  pipeline: Pipeline;
  onLeadUpdate: (leadId: string, updates: Partial<Lead>) => void;
  onStageChange: (leadId: string, newStage: string) => void;
}

export const LeadViewSheet: React.FC<LeadViewSheetProps> = ({
  open,
  onClose,
  lead,
  pipeline,
  onLeadUpdate,
  onStageChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});

  if (!lead) return null;

  const handleSave = () => {
    onLeadUpdate(lead.id, editedLead);
    setIsEditing(false);
    setEditedLead({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLead({});
  };

  const handleWin = () => {
    onLeadUpdate(lead.id, { 
      status: 'won', 
      stage: 'venda',
      wonDate: new Date(),
      updatedAt: new Date()
    });
  };

  const handleLoss = () => {
    onLeadUpdate(lead.id, { 
      status: 'lost', 
      stage: 'perdido',
      updatedAt: new Date()
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const currentStage = pipeline.stages.find(s => s.id === lead.stage);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-3/5 max-w-3xl overflow-y-auto bg-background border-l border-border">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <Input
                value={editedLead.name ?? lead.name}
                onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                className="text-xl font-bold"
              />
            ) : (
              <SheetTitle className="text-xl font-bold">{lead.name}</SheetTitle>
            )}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Salvar
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={currentStage?.color}>
              {currentStage?.name}
            </Badge>
            {isEditing ? (
              <Input
                value={editedLead.company ?? lead.company}
                onChange={(e) => setEditedLead({ ...editedLead, company: e.target.value })}
                className="text-sm ml-1"
                placeholder="Nome da empresa"
              />
            ) : (
              <span className="text-sm text-gray-500">• {lead.company}</span>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Pipeline Progress */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Pipeline Progress
            </h3>
            <PipelineProgress 
              pipeline={pipeline}
              currentStage={lead.stage}
              onStageChange={(newStage) => onStageChange(lead.id, newStage)}
            />
          </div>

          {/* Win/Loss Actions */}
          {lead.status === 'active' && (
            <div className="flex gap-2">
              <Button onClick={handleWin} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como Ganho
              </Button>
              <Button onClick={handleLoss} variant="destructive" className="flex-1">
                <XCircle className="w-4 h-4 mr-2" />
                Marcar como Perda
              </Button>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    value={editedLead.email ?? lead.email}
                    onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {lead.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                {isEditing ? (
                  <Input
                    value={editedLead.phone ?? lead.phone}
                    onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {lead.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cargo</Label>
                {isEditing ? (
                  <Input
                    value={editedLead.position ?? lead.position}
                    onChange={(e) => setEditedLead({ ...editedLead, position: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    {lead.position}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  {lead.assignedTo}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            {isEditing ? (
              <Textarea
                value={editedLead.description ?? lead.description ?? ''}
                onChange={(e) => setEditedLead({ ...editedLead, description: e.target.value })}
                placeholder="Adicione uma descrição do lead..."
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {lead.description || 'Nenhuma descrição adicionada.'}
              </p>
            )}
          </div>

          {/* Segment */}
          <div className="space-y-2">
            <Label>Segmento</Label>
            {isEditing ? (
              <Select
                value={editedLead.segment ?? lead.segment ?? ''}
                onValueChange={(value) => setEditedLead({ ...editedLead, segment: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um segmento" />
                </SelectTrigger>
                <SelectContent>
                  {availableSegments.map((segment) => (
                    <SelectItem key={segment} value={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary">{lead.segment || 'Não definido'}</Badge>
            )}
          </div>

          {/* Values */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Valores</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Pontual</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedLead.oneTimeValue ?? lead.oneTimeValue}
                    onChange={(e) => setEditedLead({ ...editedLead, oneTimeValue: Number(e.target.value) })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(lead.oneTimeValue)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Valor Recorrente</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedLead.recurringValue ?? lead.recurringValue}
                    onChange={(e) => setEditedLead({ ...editedLead, recurringValue: Number(e.target.value) })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(lead.recurringValue)}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency((editedLead.oneTimeValue ?? lead.oneTimeValue) + (editedLead.recurringValue ?? lead.recurringValue))}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagSelector
              selectedTags={lead.tags}
              onTagsChange={(tags) => onLeadUpdate(lead.id, { tags })}
              disabled={!isEditing}
            />
          </div>

          {/* Related Contacts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Pessoas Relacionadas</Label>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Contato
              </Button>
            </div>
            <ContactList 
              contacts={lead.relatedContacts}
              onContactsChange={(contacts) => onLeadUpdate(lead.id, { relatedContacts: contacts })}
            />
          </div>

          {/* Activity Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Atividades</Label>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Atividade
              </Button>
            </div>
            <ActivityTimeline
              activities={lead.activities}
              onActivityAdd={(activity) => {
                const updatedActivities = [...lead.activities, activity];
                onLeadUpdate(lead.id, { activities: updatedActivities });
              }}
            />
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 flex items-center gap-1 pt-4 border-t">
            <Calendar className="w-3 h-3" />
            <span>Última atualização: {new Date(lead.updatedAt).toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
