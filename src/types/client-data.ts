
export interface Stakeholder {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  importance: 'low' | 'medium' | 'high';
  clientId: string;
  createdAt: string;
}

export interface ClientAccess {
  id: string;
  platform: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  clientId: string;
  createdAt: string;
}
