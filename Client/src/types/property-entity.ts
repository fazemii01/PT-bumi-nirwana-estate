export enum PropertyStatus {
  PRE_LAUNCH = 'PRE_LAUNCH',
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  RESERVED = 'RESERVED',
}

export interface Address {
  street?: string;
  city?: string;
}

export interface Location {
  coordinates: [number, number];
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  status: PropertyStatus;
  price: number;
  currency: string;
  description: string;
  location: Location;
  address: Address;
  specifications: object;
  images: { url: string }[];
  floor_plans: { url: string }[];
  developer: { name: string } | null;
  agent: { name: string } | null;
  created_at: string;
  updated_at: string;
}