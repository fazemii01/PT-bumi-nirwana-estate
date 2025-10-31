import { Property, Location } from './property-entity';

export enum PropertyStatus {
  PRE_LAUNCH = 'PRE_LAUNCH',
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  RESERVED = 'RESERVED',
}

export interface IImage {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
}
export interface IFloorPlan {
  id: string;
  name: string;
  file_url: string;
  sort_order: number;
}
export interface ISitePlan {
  id: string;
  name: string;
  file_url: string;
  sort_order: number;
}
export interface IBuildingProperty {
  id: string;
  property: Property;
  name: string;
  total_units: string;
  status: PropertyStatus;
  price: string;
  price_unit: string;
  land_size: string;
  building_size: string;
  description: string;
  specifications: string; 
  building_kpr_rules: any[];
  images: IImage[];
  floor_plans: IFloorPlan[];
  site_plans: ISitePlan[];
  status_delete: number;
  deleted_at: Date | null;
  created_at: string;
  updated_at: string;
  address: string; 
  location: Location; 
  name_property: string;
}
