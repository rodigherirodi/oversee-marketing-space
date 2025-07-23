import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClients } from '@/hooks/useClients';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { generateRandomData } from '@/data/mockData';
import { Sparkline } from "@/components/sparkline"
import { Progress } from "@/components/ui/progress"
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton"
import { MeetingHistorySection } from '@/components/MeetingHistorySection';
import { ClientNotesSection } from '@/components/ClientNotesSection';

export default function ClientProfile() {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients } = useClients();
  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  const randomData = React.useMemo(() => generateRandomData(7), []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">{client.company}</p>
        </div>
        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
          {client.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
                <CardDescription>Detalhes sobre o cliente.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {client.email}</p>
                  <p><strong>Telefone:</strong> {client.phone}</p>
                  <p><strong>Criado em:</strong> {format(new Date(client.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progresso do Projeto</CardTitle>
                <CardDescription>Visão geral do progresso do projeto atual.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Tarefas Concluídas</span>
                    <span className="text-sm text-muted-foreground">74%</span>
                  </div>
                  <Progress value={74} />
                  <div className="flex items-center justify-between">
                    <span>Prazo</span>
                    <span className="text-sm text-muted-foreground">30 dias restantes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Entrega: 20 de Março, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projetos Atuais</CardTitle>
              <CardDescription>Lista de projetos em andamento.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Website Reform</TableCell>
                    <TableCell className="font-medium">Em andamento</TableCell>
                    <TableCell>
                      <Progress value={66} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mobile App Redesign</TableCell>
                    <TableCell className="font-medium">Pendente</TableCell>
                    <TableCell>
                      <Progress value={34} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <MeetingHistorySection clientId={client.id} />
          <ClientNotesSection clientId={client.id} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualizações</CardTitle>
              <CardDescription>
                Você fez <span className="font-medium">+20%</span> de visualizações hoje. Boa!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart
                  data={randomData}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
