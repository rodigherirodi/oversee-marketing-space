import React, { useState } from 'react';
import { Lead, Pipeline, LeadActivity, RelatedContact } from '@/types/crm';
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
  Target,
  ShoppingCart
} from 'lucide-react';
import { PipelineProgress } from './PipelineProgress';
import { ContactList } from './ContactList';
import { TagSelector } from './TagSelector';
import { ActivityTimeline } from './ActivityTimeline';
import { availableSegments } from '@/data/crmMockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { LeadProduct } from '@/types/crm';

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
  const [newActivityDialogOpen, setNewActivityDialogOpen] = useState(false);
  const [newContactDialogOpen, setNewContactDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<LeadActivity>>({
    type: 'note',
    title: '',
    description: '',
    completed: false
  });
  const [newContact, setNewContact] = useState<Partial<RelatedContact>>({
    name: '',
    email: '',
    phone: '',
    position: '',
    isPrimary: false
  });
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<LeadProduct>>({
    name: '',
    value: 0,
    quantity: 1,
    isRecurring: false
  });

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

  const handleAddActivity = () => {
    if (!newActivity.title) {
      toast.error("O título da atividade é obrigatório");
      return;
    }

    const activity: LeadActivity = {
      id: `activity-${Date.now()}`,
      type: newActivity.type as LeadActivity['type'],
      title: newActivity.title || '',
      description: newActivity.description || '',
      createdAt: new Date(),
      createdBy: 'Você',
      dueDate: newActivity.dueDate,
      completed: false,
    };

    onLeadUpdate(lead.id, {
      activities: [...lead.activities, activity]
    });

    setNewActivityDialogOpen(false);
    setNewActivity({
      type: 'note',
      title: '',
      description: '',
      completed: false
    });
    
    toast.success("Atividade adicionada com sucesso");
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      toast.error("Nome e email são obrigatórios");
      return;
    }

    const contact: RelatedContact = {
      id: `contact-${Date.now()}`,
      name: newContact.name || '',
      email: newContact.email || '',
      phone: newContact.phone || '',
      position: newContact.position || '',
      isPrimary: newContact.isPrimary || false
    };

    // Se este é marcado como primário, atualiza todos os outros para não primário
    let updatedContacts = [...lead.relatedContacts];
    
    if (contact.isPrimary) {
      updatedContacts = updatedContacts.map(c => ({
        ...c,
        isPrimary: false
      }));
    }

    onLeadUpdate(lead.id, {
      relatedContacts: [...updatedContacts, contact]
    });

    setNewContactDialogOpen(false);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      position: '',
      isPrimary: false
    });
    
    toast.success("Contato adicionado com sucesso");
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.value) {
      toast.error("Nome e valor do produto são obrigatórios");
      return;
    }

    const product: LeadProduct = {
      id: `product-${Date.now()}`,
      name: newProduct.name || '',
      value: newProduct.value || 0,
      quantity: newProduct.quantity || 1,
      isRecurring: newProduct.isRecurring || false
    };

    const products = [...(lead.products || []), product];
    
    // Atualiza os valores com base nos produtos
    let oneTimeValue = 0;
    let recurringValue = 0;
    
    products.forEach(product => {
      const productTotal = product.value * product.quantity;
      if (product.isRecurring) {
        recurringValue += productTotal;
      } else {
        oneTimeValue += productTotal;
      }
    });

    onLeadUpdate(lead.id, {
      products,
      oneTimeValue,
      recurringValue
    });

    setProductDialogOpen(false);
    setNewProduct({
      name: '',
      value: 0,
      quantity: 1,
      isRecurring: false
    });
    
    toast.success("Produto adicionado com sucesso");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[calc(50vw+400px)] overflow-y-auto bg-background border-l border-border">
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

            {/* Products */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Produtos</Label>
                <Button variant="outline" size="sm" onClick={() => setProductDialogOpen(true)}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
              {lead.products && lead.products.length > 0 ? (
                <div className="space-y-3">
                  {lead.products.map((product) => (
                    <div key={product.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Qtd: {product.quantity}</span>
                            <span>{formatCurrency(product.value)}</span>
                            {product.isRecurring && (
                              <Badge variant="outline" className="text-xs">Recorrente</Badge>
                            )}
                          </div>
                        </div>
                        <div className="font-bold text-primary">
                          {formatCurrency(product.value * product.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-gray-100 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-primary text-lg">
                        {formatCurrency(lead.oneTimeValue + lead.recurringValue)}
                      </span>
                    </div>
                    {lead.recurringValue > 0 && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span>Valor recorrente:</span>
                        <span className="font-medium text-blue-600">
                          {formatCurrency(lead.recurringValue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhum produto adicionado</p>
                </div>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNewContactDialogOpen(true)}
                >
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNewActivityDialogOpen(true)}
                >
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

      {/* Nova Atividade Dialog */}
      <Dialog open={newActivityDialogOpen} onOpenChange={setNewActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Atividade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="activity-type">Tipo de Atividade</Label>
              <Select
                value={newActivity.type as string}
                onValueChange={(value) => setNewActivity({ ...newActivity, type: value as LeadActivity['type'] })}
              >
                <SelectTrigger id="activity-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Ligação</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="meeting">Reunião</SelectItem>
                  <SelectItem value="note">Nota</SelectItem>
                  <SelectItem value="task">Tarefa</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activity-title">Título*</Label>
              <Input
                id="activity-title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Título da atividade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activity-description">Descrição</Label>
              <Textarea
                id="activity-description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Detalhes da atividade"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activity-due-date">Data de Vencimento</Label>
              <Input
                id="activity-due-date"
                type="datetime-local"
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  setNewActivity({ ...newActivity, dueDate: date });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewActivityDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddActivity}>
              Adicionar Atividade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Novo Contato Dialog */}
      <Dialog open={newContactDialogOpen} onOpenChange={setNewContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Contato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Nome*</Label>
              <Input
                id="contact-name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Nome do contato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-position">Cargo</Label>
              <Input
                id="contact-position"
                value={newContact.position}
                onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                placeholder="Cargo do contato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email*</Label>
              <Input
                id="contact-email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                placeholder="Email do contato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Telefone</Label>
              <Input
                id="contact-phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="Telefone do contato"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="contact-primary"
                checked={newContact.isPrimary}
                onChange={(e) => setNewContact({ ...newContact, isPrimary: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="contact-primary" className="cursor-pointer">
                Contato Principal
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewContactDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddContact}>
              Adicionar Contato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Novo Produto Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Nome do Produto*</Label>
              <Input
                id="product-name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Nome do produto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-value">Valor*</Label>
              <Input
                id="product-value"
                type="number"
                value={newProduct.value}
                onChange={(e) => setNewProduct({ ...newProduct, value: Number(e.target.value) })}
                placeholder="Valor do produto"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-quantity">Quantidade</Label>
              <Input
                id="product-quantity"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                min="1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="product-recurring"
                checked={newProduct.isRecurring}
                onChange={(e) => setNewProduct({ ...newProduct, isRecurring: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="product-recurring" className="cursor-pointer">
                Produto Recorrente
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProduct}>
              Adicionar Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
