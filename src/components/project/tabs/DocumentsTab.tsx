
import React, { useState } from 'react';
import { Project } from '@/types/entities';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentsTabProps {
  project: Project;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ project }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const documents = [
    {
      id: 1,
      name: 'Proposta Comercial.pdf',
      category: 'proposal',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      uploadedBy: 'Ana Silva',
      status: 'approved'
    },
    {
      id: 2,
      name: 'Contrato de Prestação de Serviços.pdf',
      category: 'contract',
      size: '1.8 MB',
      uploadDate: '2024-01-18',
      uploadedBy: 'Carlos Santos',
      status: 'approved'
    },
    {
      id: 3,
      name: 'Briefing do Cliente.docx',
      category: 'briefing',
      size: '856 KB',
      uploadDate: '2024-01-20',
      uploadedBy: 'Maria Costa',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Layout Aprovado v1.fig',
      category: 'approval',
      size: '12.3 MB',
      uploadDate: '2024-01-22',
      uploadedBy: 'João Designer',
      status: 'approved'
    },
    {
      id: 5,
      name: 'Cronograma do Projeto.xlsx',
      category: 'planning',
      size: '245 KB',
      uploadDate: '2024-01-16',
      uploadedBy: 'Ana Silva',
      status: 'draft'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: documents.length },
    { id: 'proposal', name: 'Propostas', count: documents.filter(d => d.category === 'proposal').length },
    { id: 'contract', name: 'Contratos', count: documents.filter(d => d.category === 'contract').length },
    { id: 'briefing', name: 'Briefings', count: documents.filter(d => d.category === 'briefing').length },
    { id: 'approval', name: 'Aprovações', count: documents.filter(d => d.category === 'approval').length },
    { id: 'planning', name: 'Planejamento', count: documents.filter(d => d.category === 'planning').length }
  ];

  const approvals = [
    {
      id: 1,
      item: 'Layout da Landing Page',
      status: 'approved',
      date: '2024-01-22',
      approver: 'Cliente - João Silva'
    },
    {
      id: 2,
      item: 'Copy dos Emails',
      status: 'pending',
      date: '2024-01-20',
      approver: 'Cliente - Maria Santos'
    },
    {
      id: 3,
      item: 'Cronograma de Entregas',
      status: 'rejected',
      date: '2024-01-18',
      approver: 'Cliente - João Silva'
    }
  ];

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      default: return 'Rascunho';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Faça upload dos seus documentos
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Arraste e solte arquivos aqui ou clique para selecionar
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Selecionar arquivos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Biblioteca de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Documents Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Por</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {getStatusText(doc.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{doc.size}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{doc.uploadedBy}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approvals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Aprovações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {approvals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(approval.status)}
                  <div>
                    <p className="font-medium text-gray-900">{approval.item}</p>
                    <p className="text-sm text-gray-600">{approval.approver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                    {getStatusText(approval.status)}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(approval.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;
