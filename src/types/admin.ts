
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  department: 'operacao' | 'academy' | 'cultura' | 'comercial' | 'gestao';
  position?: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'manager' | 'team_lead' | 'user';
  avatar?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: any;
  encrypted: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface SystemMetrics {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  metadata?: any;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface SystemStatus {
  database: 'healthy' | 'warning' | 'error';
  api: 'online' | 'offline';
  users_count: number;
  permissions_count: number;
}
