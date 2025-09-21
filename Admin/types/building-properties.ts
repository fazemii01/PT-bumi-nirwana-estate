export type Building_Property = {
  id: string;
  propertyId: string;
  name: string;
  type: PropertyType;
  land_size: number;
  building_size: number;
  price: number;
  price_unit: PriceUnit;
  specifications?: Specifications;
  property_images?: File[];
  property_floor_plans?: File[];
  images: ImageProperty[];
  floor_plans: FloorPlan[];
  detail_description: string;
  status: PropertyStatus;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
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

export enum PropertyType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
  RUKO = "RUKO",
  KAVLING = "KAVLING",
}

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
