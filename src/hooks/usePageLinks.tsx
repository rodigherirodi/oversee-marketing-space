
import { useState } from 'react';
import { PageLink } from '@/types/client-profile';

const mockPageLinks: PageLink[] = [
  {
    id: '1',
    name: 'Landing Page Principal',
    url: 'https://cliente.com/landing',
    type: 'landing',
    status: 'active',
    link: 'https://docs.google.com/document/d/landing-brief',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    clientId: '1'
  },
  {
    id: '2',
    name: 'Site Institucional',
    url: 'https://cliente.com',
    type: 'institutional',
    status: 'active',
    link: 'https://cliente.com',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    clientId: '1'
  }
];

export const usePageLinks = () => {
  const [pageLinks, setPageLinks] = useState<PageLink[]>(mockPageLinks);

  const getPagesByClient = (clientId: string): PageLink[] => {
    return pageLinks.filter(page => page.clientId === clientId);
  };

  const addPageLink = (data: PageLink): PageLink => {
    const newPage: PageLink = {
      ...data,
    };
    
    setPageLinks(prev => [...prev, newPage]);
    return newPage;
  };

  const updatePageLink = (id: string, data: Partial<PageLink>): void => {
    setPageLinks(prev => prev.map(page => 
      page.id === id ? { ...page, ...data } : page
    ));
  };

  const deletePageLink = (id: string): void => {
    setPageLinks(prev => prev.filter(page => page.id !== id));
  };

  return {
    getPagesByClient,
    addPageLink,
    updatePageLink,
    deletePageLink
  };
};
