import { Property } from "@/types/properties";

export type BuildingProperty = {
  id: string;
  propertyId: string;
  name: string;
  land_size: number;
  building_size: number;
  total_units: string;
  price: number;
  price_unit: PriceUnit;
  specifications?: Specifications;
  building_images?: File[];
  building_floor_plans?: File[];
  building_kpr_file?: File[];
  images: BuildingImage[];
  floor_plans: BuildingFloorPlans[];
  building_kpr_rules: BuildingKprRules[];
  detail_description: string;
  status: BuildingStatus;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  property?: Property;
};

export type BuildingImage = {
  id?: string;
  image_url?: string;
  caption: string;
  sort_order?: number;
  file?: File;
  preview?: string;
};

export type BuildingFloorPlans = {
  id?: string;
  name: string;
  file_url?: string;
  sort_order?: number;
  file?: File;
  preview?: string;
};
export type BuildingKprRules = {
  id?: string;
  file_url?: string;
  file?: File;
  preview?: string;
};
export enum BuildingStatus {
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
