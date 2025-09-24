import { Property } from './property-entity';


export interface IImage {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface IBuildingProperty {
  id: string;
  name: string;
  status: string;
  price: string; 
  price_unit: string;
  land_size: string;
  building_size: string;
  description: string;
  

  specifications: string; 

  building_kpr_rules: any[]; 
  images: IImage[];
  floor_plans: any[];

 
  property: Property;

  status_delete: number;
  deleted_at: Date | null;
  created_at: string; 
  updated_at: string;
}