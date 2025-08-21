import { Agent } from "@/types/agent";
import { Developer } from "@/types/developer";

export type PropertyImage = {
  id: string;
  caption?: string;
  sort_order?: number;
  url?: string;
  propertyId: string;
};

export type PropertyFloorPlan = {
  id: string;
  name: string;
  sort_order?: number;
  url?: string;
  propertyId: string;
};

export type Property = {
  id: string;
  developerId: string;
  agentId: string;
  name: string;
  slug?: string;
  status: PropertyStatus;
  price: string;
  price_unit: PriceUnit;
  luas: string;
  jenis: string;
  description: string;
  detail_description: string;
  // Note: FE pakai [lat, lng], API expects [lng, lat] (GeoJSON)
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  address?: Address;
  specifications?: Specifications;

  property_images?: File[];
  property_floor_plans?: File[];

  images: ImageProperty[];
  floor_plans: FloorPlan[];
  created_at?: Date;
  updated_at?: Date;
  developer?: Developer;
  agent?: Agent;
};

export type ImageProperty = {
  id?: string;
  image_url?: string;
  caption: string;
  sort_order?: number;
  file?: File;
  preview?: string;
};

export type FloorPlan = {
  id?: string;
  name: string;
  file_url?: string;
  sort_order?: number;
  file?: File;
  preview?: string;
};

export type Address = {
  street?: string;
  village?: string;
  district?: string;
  city?: string;
  province?: string;
  postal_code?: string;
};

export type Specifications = {
  // Dimensi
  bedrooms?: number;
  bathrooms?: number;
  family_room?: number;
  kitchen?: number;
  garage?: number;
  floors?: number;

  // Material
  structure?: string;
  floor?: string;
  walls?: string;
  roof?: string;
  doors?: string;
  windows?: string;

  // Utilitas
  electricity?: string;
  water_source?: string;
  internet?: string;
  security?: string;

  // Fasilitas
  facilities?: string;
};

export enum PropertyStatus {
  PRE_LAUNCH = "PRE_LAUNCH",
  AVAILABLE = "AVAILABLE",
  SOLD_OUT = "SOLD_OUT",
  RESERVED = "RESERVED",
}

export enum PriceUnit {
  TOTAL = "TOTAL",
  PER_MONTH = "PER_MONTH",
  PER_SQM = "PER_SQM",
}
