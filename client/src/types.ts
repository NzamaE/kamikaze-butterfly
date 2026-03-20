export type UserRole = 'client' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  investment: string;
  location: string;
  description: string;
  features: string[];
  image: string;
  portfolio: string[];
  availability?: string[];
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  vendorId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'declined' | 'completed';
  total: number;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
}
