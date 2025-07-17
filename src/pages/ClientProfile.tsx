
import { useState } from "react";
import { MoreVertical, Edit, Plus, Trash2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the structure for client data
type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  address: string;
  logoUrl?: string;
  status: "active" | "inactive" | "pending";
  notes?: string;
};

type Password = {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
};

type Stakeholder = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
};

type PageLink = {
  id: string;
  title: string;
  url: string;
  type: "landing" | "institutional" | "other";
  status: "active" | "inactive";
  description?: string;
};

type Campaign = {
  id: string;
  name: string;
  type: string;
  status: "active" | "paused" | "completed";
  startDate: string;
  endDate?: string;
  budget?: number;
  description?: string;
};

export default function ClientProfile() {
  // Mock client data
  const [client, setClient] = useState<Client>({
    id: "123",
    name: "Acme Corp",
    email: "info@acmecorp.com",
    phone: "555-123-4567",
    website: "www.acmecorp.com",
    industry: "Technology",
    address: "123 Main St, Anytown USA",
    logoUrl: "https://ui.shadcn.com/icons/logo.png",
    status: "active",
    notes: "Strategic client with high potential.",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data for new sections
  const [passwords, setPasswords] = useState<Password[]>([
    { id: "1", title: "Admin Panel", username: "admin", password: "****", url: "https://admin.acmecorp.com" },
    { id: "2", title: "FTP Access", username: "ftp_user", password: "****", url: "ftp://files.acmecorp.com" },
  ]);

  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    { id: "1", name: "John Doe", role: "CEO", email: "john@acmecorp.com", phone: "555-0101", department: "Executive" },
    { id: "2", name: "Jane Smith", role: "Marketing Manager", email: "jane@acmecorp.com", phone: "555-0102", department: "Marketing" },
  ]);

  const [pageLinks, setPageLinks] = useState<PageLink[]>([
    { id: "1", title: "Main Website", url: "https://acmecorp.com", type: "institutional", status: "active" },
    { id: "2", title: "Product Landing", url: "https://acmecorp.com/product", type: "landing", status: "active" },
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: "1", name: "Q4 Product Launch", type: "Digital", status: "active", startDate: "2024-01-15", budget: 50000 },
    { id: "2", name: "Brand Awareness", type: "Social Media", status: "paused", startDate: "2024-01-01", budget: 25000 },
  ]);

  // Modal states
  const [passwordModal, setPasswordModal] = useState({ open: false, mode: 'add' as 'add' | 'edit', data: null as Password | null });
  const [stakeholderModal, setStakeholderModal] = useState({ open: false, mode: 'add' as 'add' | 'edit', data: null as Stakeholder | null });
  const [pageLinkModal, setPageLinkModal] = useState({ open: false, mode: 'add' as 'add' | 'edit', data: null as PageLink | null });
  const [campaignModal, setCampaignModal] = useState({ open: false, mode: 'add' as 'add' | 'edit', data: null as Campaign | null });

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveClient = (updatedClient: Client) => {
    setClient(updatedClient);
    setIsEditModalOpen(false);
  };

  // CRUD functions for passwords
  const handleAddPassword = (password: Omit<Password, 'id'>) => {
    const newPassword = { ...password, id: Date.now().toString() };
    setPasswords([...passwords, newPassword]);
    setPasswordModal({ open: false, mode: 'add', data: null });
  };

  const handleEditPassword = (password: Password) => {
    setPasswords(passwords.map(p => p.id === password.id ? password : p));
    setPasswordModal({ open: false, mode: 'edit', data: null });
  };

  const handleDeletePassword = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id));
  };

  // CRUD functions for stakeholders
  const handleAddStakeholder = (stakeholder: Omit<Stakeholder, 'id'>) => {
    const newStakeholder = { ...stakeholder, id: Date.now().toString() };
    setStakeholders([...stakeholders, newStakeholder]);
    setStakeholderModal({ open: false, mode: 'add', data: null });
  };

  const handleEditStakeholder = (stakeholder: Stakeholder) => {
    setStakeholders(stakeholders.map(s => s.id === stakeholder.id ? stakeholder : s));
    setStakeholderModal({ open: false, mode: 'edit', data: null });
  };

  const handleDeleteStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  // CRUD functions for page links
  const handleAddPageLink = (pageLink: Omit<PageLink, 'id'>) => {
    const newPageLink = { ...pageLink, id: Date.now().toString() };
    setPageLinks([...pageLinks, newPageLink]);
    setPageLinkModal({ open: false, mode: 'add', data: null });
  };

  const handleEditPageLink = (pageLink: PageLink) => {
    setPageLinks(pageLinks.map(p => p.id === pageLink.id ? pageLink : p));
    setPageLinkModal({ open: false, mode: 'edit', data: null });
  };

  const handleDeletePageLink = (id: string) => {
    setPageLinks(pageLinks.filter(p => p.id !== id));
  };

  // CRUD functions for campaigns
  const handleAddCampaign = (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign = { ...campaign, id: Date.now().toString() };
    setCampaigns([...campaigns, newCampaign]);
    setCampaignModal({ open: false, mode: 'add', data: null });
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setCampaigns(campaigns.map(c => c.id === campaign.id ? campaign : c));
    setCampaignModal({ open: false, mode: 'edit', data: null });
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with client info and edit button */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={client.logoUrl} alt={client.name} />
            <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{client.name}</h2>
            <p className="text-sm text-muted-foreground">{client.industry}</p>
            <Badge variant="outline">{client.status}</Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleEditClick}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Client
        </Button>
      </div>

      {/* Client Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Client contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label>Email</Label>
              <p className="text-sm font-medium">{client.email}</p>
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <p className="text-sm font-medium">{client.phone}</p>
            </div>
            <div className="space-y-1">
              <Label>Website</Label>
              <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-500 hover:underline">
                {client.website}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Client location</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{client.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Additional client information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{client.notes || "No notes provided."}</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="pages">Páginas & Links</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="access">Senhas & Acessos</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
              <CardDescription>Resumo das informações do cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visão geral do cliente {client.name}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projetos</CardTitle>
              <CardDescription>Projetos em andamento e concluídos</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Projetos do cliente {client.name}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Páginas & Links</h3>
              <p className="text-sm text-muted-foreground">Gerencie landing pages, sites e páginas institucionais</p>
            </div>
            <Button onClick={() => setPageLinkModal({ open: true, mode: 'add', data: null })}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Página
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageLinks.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                          {page.url}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.type === 'landing' ? 'default' : 'secondary'}>
                          {page.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.status === 'active' ? 'default' : 'secondary'}>
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPageLinkModal({ open: true, mode: 'edit', data: page })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza de que deseja excluir esta página? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePageLink(page.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Campanhas</h3>
              <p className="text-sm text-muted-foreground">Gerencie campanhas de mídia e marketing</p>
            </div>
            <Button onClick={() => setCampaignModal({ open: true, mode: 'add', data: null })}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Campanha
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.type}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'paused' ? 'secondary' : 'outline'}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.startDate}</TableCell>
                      <TableCell>{campaign.budget ? `$${campaign.budget.toLocaleString()}` : '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCampaignModal({ open: true, mode: 'edit', data: campaign })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza de que deseja excluir esta campanha? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCampaign(campaign.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Senhas & Acessos</h3>
              <p className="text-sm text-muted-foreground">Gerencie credenciais e acessos do cliente</p>
            </div>
            <Button onClick={() => setPasswordModal({ open: true, mode: 'add', data: null })}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Senha
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passwords.map((password) => (
                    <TableRow key={password.id}>
                      <TableCell className="font-medium">{password.title}</TableCell>
                      <TableCell>{password.username}</TableCell>
                      <TableCell>
                        {password.url && (
                          <a href={password.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                            {password.url}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPasswordModal({ open: true, mode: 'edit', data: password })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza de que deseja excluir esta senha? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePassword(password.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Stakeholders</h3>
              <p className="text-sm text-muted-foreground">Gerencie contatos e stakeholders do cliente</p>
            </div>
            <Button onClick={() => setStakeholderModal({ open: true, mode: 'add', data: null })}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Stakeholder
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakeholders.map((stakeholder) => (
                    <TableRow key={stakeholder.id}>
                      <TableCell className="font-medium">{stakeholder.name}</TableCell>
                      <TableCell>{stakeholder.role}</TableCell>
                      <TableCell>{stakeholder.email}</TableCell>
                      <TableCell>{stakeholder.phone}</TableCell>
                      <TableCell>{stakeholder.department}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setStakeholderModal({ open: true, mode: 'edit', data: stakeholder })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza de que deseja excluir este stakeholder? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteStakeholder(stakeholder.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Documentos e arquivos relacionados ao cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Documentos do cliente {client.name}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Client Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Make changes to the client's profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <EditClientForm client={client} onSave={handleSaveClient} onCancel={() => setIsEditModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Password Modal */}
      <Dialog open={passwordModal.open} onOpenChange={(open) => setPasswordModal({ ...passwordModal, open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{passwordModal.mode === 'add' ? 'Adicionar' : 'Editar'} Senha</DialogTitle>
          </DialogHeader>
          <PasswordForm
            password={passwordModal.data}
            onSave={passwordModal.mode === 'add' ? handleAddPassword : handleEditPassword}
            onCancel={() => setPasswordModal({ open: false, mode: 'add', data: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Stakeholder Modal */}
      <Dialog open={stakeholderModal.open} onOpenChange={(open) => setStakeholderModal({ ...stakeholderModal, open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{stakeholderModal.mode === 'add' ? 'Adicionar' : 'Editar'} Stakeholder</DialogTitle>
          </DialogHeader>
          <StakeholderForm
            stakeholder={stakeholderModal.data}
            onSave={stakeholderModal.mode === 'add' ? handleAddStakeholder : handleEditStakeholder}
            onCancel={() => setStakeholderModal({ open: false, mode: 'add', data: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Page Link Modal */}
      <Dialog open={pageLinkModal.open} onOpenChange={(open) => setPageLinkModal({ ...pageLinkModal, open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{pageLinkModal.mode === 'add' ? 'Adicionar' : 'Editar'} Página</DialogTitle>
          </DialogHeader>
          <PageLinkForm
            pageLink={pageLinkModal.data}
            onSave={pageLinkModal.mode === 'add' ? handleAddPageLink : handleEditPageLink}
            onCancel={() => setPageLinkModal({ open: false, mode: 'add', data: null })}
          />
        </DialogContent>
      </Dialog>

      {/* Campaign Modal */}
      <Dialog open={campaignModal.open} onOpenChange={(open) => setCampaignModal({ ...campaignModal, open })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{campaignModal.mode === 'add' ? 'Adicionar' : 'Editar'} Campanha</DialogTitle>
          </DialogHeader>
          <CampaignForm
            campaign={campaignModal.data}
            onSave={campaignModal.mode === 'add' ? handleAddCampaign : handleEditCampaign}
            onCancel={() => setCampaignModal({ open: false, mode: 'add', data: null })}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

type EditClientFormProps = {
  client: Client;
  onSave: (updatedClient: Client) => void;
  onCancel: () => void;
};

function EditClientForm({ client, onSave, onCancel }: EditClientFormProps) {
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [phone, setPhone] = useState(client.phone);
  const [website, setWebsite] = useState(client.website);
  const [industry, setIndustry] = useState(client.industry);
  const [address, setAddress] = useState(client.address);
  const [notes, setNotes] = useState(client.notes || "");
  const [status, setStatus] = useState(client.status);

  const handleSave = () => {
    const updatedClient: Client = {
      ...client,
      name,
      email,
      phone,
      website,
      industry,
      address,
      notes,
      status,
    };
    onSave(updatedClient);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="website" className="text-right">
          Website
        </Label>
        <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="industry" className="text-right">
          Industry
        </Label>
        <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">
          Address
        </Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="notes" className="text-right mt-2">
          Notes
        </Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "inactive" | "pending")}
          className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

type PasswordFormProps = {
  password: Password | null;
  onSave: (password: Password | Omit<Password, 'id'>) => void;
  onCancel: () => void;
};

function PasswordForm({ password, onSave, onCancel }: PasswordFormProps) {
  const [title, setTitle] = useState(password?.title || '');
  const [username, setUsername] = useState(password?.username || '');
  const [passwordValue, setPasswordValue] = useState(password?.password || '');
  const [url, setUrl] = useState(password?.url || '');
  const [notes, setNotes] = useState(password?.notes || '');

  const handleSave = () => {
    const passwordData = {
      title,
      username,
      password: passwordValue,
      url,
      notes,
    };
    
    if (password) {
      onSave({ ...passwordData, id: password.id });
    } else {
      onSave(passwordData);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Título</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">Usuário</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">Senha</Label>
        <Input id="password" type="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right">URL</Label>
        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="notes" className="text-right mt-2">Notas</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="button" onClick={handleSave}>Salvar</Button>
      </div>
    </div>
  );
}

type StakeholderFormProps = {
  stakeholder: Stakeholder | null;
  onSave: (stakeholder: Stakeholder | Omit<Stakeholder, 'id'>) => void;
  onCancel: () => void;
};

function StakeholderForm({ stakeholder, onSave, onCancel }: StakeholderFormProps) {
  const [name, setName] = useState(stakeholder?.name || '');
  const [role, setRole] = useState(stakeholder?.role || '');
  const [email, setEmail] = useState(stakeholder?.email || '');
  const [phone, setPhone] = useState(stakeholder?.phone || '');
  const [department, setDepartment] = useState(stakeholder?.department || '');

  const handleSave = () => {
    const stakeholderData = {
      name,
      role,
      email,
      phone,
      department,
    };
    
    if (stakeholder) {
      onSave({ ...stakeholderData, id: stakeholder.id });
    } else {
      onSave(stakeholderData);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">Cargo</Label>
        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">Telefone</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="department" className="text-right">Departamento</Label>
        <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="col-span-3" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="button" onClick={handleSave}>Salvar</Button>
      </div>
    </div>
  );
}

type PageLinkFormProps = {
  pageLink: PageLink | null;
  onSave: (pageLink: PageLink | Omit<PageLink, 'id'>) => void;
  onCancel: () => void;
};

function PageLinkForm({ pageLink, onSave, onCancel }: PageLinkFormProps) {
  const [title, setTitle] = useState(pageLink?.title || '');
  const [url, setUrl] = useState(pageLink?.url || '');
  const [type, setType] = useState(pageLink?.type || 'institutional');
  const [status, setStatus] = useState(pageLink?.status || 'active');
  const [description, setDescription] = useState(pageLink?.description || '');

  const handleSave = () => {
    const pageLinkData = {
      title,
      url,
      type: type as 'landing' | 'institutional' | 'other',
      status: status as 'active' | 'inactive',
      description,
    };
    
    if (pageLink) {
      onSave({ ...pageLinkData, id: pageLink.id });
    } else {
      onSave(pageLinkData);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Título</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right">URL</Label>
        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">Tipo</Label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="landing">Landing Page</option>
          <option value="institutional">Institucional</option>
          <option value="other">Outro</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right mt-2">Descrição</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="button" onClick={handleSave}>Salvar</Button>
      </div>
    </div>
  );
}

type CampaignFormProps = {
  campaign: Campaign | null;
  onSave: (campaign: Campaign | Omit<Campaign, 'id'>) => void;
  onCancel: () => void;
};

function CampaignForm({ campaign, onSave, onCancel }: CampaignFormProps) {
  const [name, setName] = useState(campaign?.name || '');
  const [type, setType] = useState(campaign?.type || '');
  const [status, setStatus] = useState(campaign?.status || 'active');
  const [startDate, setStartDate] = useState(campaign?.startDate || '');
  const [endDate, setEndDate] = useState(campaign?.endDate || '');
  const [budget, setBudget] = useState(campaign?.budget?.toString() || '');
  const [description, setDescription] = useState(campaign?.description || '');

  const handleSave = () => {
    const campaignData = {
      name,
      type,
      status: status as 'active' | 'paused' | 'completed',
      startDate,
      endDate,
      budget: budget ? parseInt(budget) : undefined,
      description,
    };
    
    if (campaign) {
      onSave({ ...campaignData, id: campaign.id });
    } else {
      onSave(campaignData);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">Tipo</Label>
        <Input id="type" value={type} onChange={(e) => setType(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="active">Ativo</option>
          <option value="paused">Pausado</option>
          <option value="completed">Concluído</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="startDate" className="text-right">Data Início</Label>
        <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="endDate" className="text-right">Data Fim</Label>
        <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="budget" className="text-right">Orçamento</Label>
        <Input id="budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right mt-2">Descrição</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="button" onClick={handleSave}>Salvar</Button>
      </div>
    </div>
  );
}
