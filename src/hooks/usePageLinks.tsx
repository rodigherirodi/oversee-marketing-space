
import { useState } from 'react';
import { PageLink } from '@/types/client-profile';
import { toast } from '@/components/ui/use-toast';

// Mock initial data
const initialPageLinks: PageLink[] = [
  {
    id: '1',
    title: 'Site Institucional',
    type: 'website',
    status: 'active',
    dateRange: '2023-05-01 to 2023-12-31',
    link: 'https://example.com'
  },
  {
    id: '2',
    title: 'Campanha de Verão',
    type: 'campaign',
    status: 'active',
    dateRange: '2023-06-15 to 2023-09-15',
    link: 'https://drive.google.com/example-document'
  },
  {
    id: '3',
    title: 'Landing Page Produto X',
    type: 'landing',
    status: 'draft',
    dateRange: '2023-07-01 to 2023-08-30',
    link: 'https://example.com/product-x'
  }
];

export const usePageLinks = (clientId: string) => {
  const [pageLinks, setPageLinks] = useState<PageLink[]>(initialPageLinks);

  const addPageLink = (newPageLink: Omit<PageLink, 'id'>) => {
    const pageLink: PageLink = {
      ...newPageLink,
      id: `pagelink-${Date.now()}`
    };
    
    setPageLinks(prev => [...prev, pageLink]);
    toast({
      title: "Página/Campanha adicionada",
      description: `${pageLink.title} foi adicionada com sucesso.`
    });
    
    return pageLink;
  };

  const updatePageLink = (id: string, updatedPageLink: Partial<PageLink>) => {
    setPageLinks(prev => 
      prev.map(link => link.id === id ? { ...link, ...updatedPageLink } : link)
    );
    
    toast({
      title: "Página/Campanha atualizada",
      description: `A página/campanha foi atualizada com sucesso.`
    });
  };

  const deletePageLink = (id: string) => {
    setPageLinks(prev => prev.filter(link => link.id !== id));
    
    toast({
      title: "Página/Campanha removida",
      description: `A página/campanha foi removida com sucesso.`
    });
  };

  return {
    pageLinks,
    addPageLink,
    updatePageLink,
    deletePageLink
  };
};
