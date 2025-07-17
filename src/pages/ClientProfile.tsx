import { useState } from "react";
import { MoreVertical, Edit } from "lucide-react";

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

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveClient = (updatedClient: Client) => {
    setClient(updatedClient);
    setIsEditModalOpen(false);
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

        <TabsContent value="overview" className="space-y-2">
          <p>Visão Geral content for {client.name}</p>
        </TabsContent>
        <TabsContent value="projects" className="space-y-2">
          <p>Projetos content for {client.name}</p>
        </TabsContent>
        <TabsContent value="pages" className="space-y-2">
          <p>Páginas & Links content for {client.name}</p>
        </TabsContent>
        <TabsContent value="campaigns" className="space-y-2">
          <p>Campanhas content for {client.name}</p>
        </TabsContent>
        <TabsContent value="access" className="space-y-2">
          <p>Senhas & Acessos content for {client.name}</p>
        </TabsContent>
        <TabsContent value="stakeholders" className="space-y-2">
          <p>Stakeholders content for {client.name}</p>
        </TabsContent>
        <TabsContent value="documents" className="space-y-2">
          <p>Documents content for {client.name}</p>
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
