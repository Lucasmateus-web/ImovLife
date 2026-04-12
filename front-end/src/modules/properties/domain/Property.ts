export type UserRole = 'ADMIN' | 'CORRETOR' | 'CLIENTE';

export type PropertyType = 'Apartamento' | 'Casa' | 'Comercial' | 'Terreno';
export type PropertyStatus = 'Ativo' | 'Inativo' | 'Pendente';
export type PropertyMode = 'Venda' | 'Aluguel';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  mode: PropertyMode;
  price: number;
  condo: number;
  iptu: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size: number;
  city: string;
  neighborhood: string;
  address: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageUrls: string[];
  isExclusive: boolean;
  status: PropertyStatus;
  brokerId?: string;
  brokerName?: string;
  createdAt?: string;
}

export interface PropertyFormData {
  title: string;
  type: PropertyType;
  mode: PropertyMode;
  price: string;
  condo: string;
  iptu: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  size: string;
  city: string;
  neighborhood: string;
  address: string;
  description: string;
  features: string;
  photos: string;
  isExclusive: boolean;
  status: PropertyStatus;
  brokerId: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
