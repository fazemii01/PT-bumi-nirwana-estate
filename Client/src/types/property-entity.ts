export enum PropertyStatus {
  PRE_LAUNCH = 'PRE_LAUNCH',
  AVAILABLE = 'AVAILABLE',
  SOLD_OUT = 'SOLD_OUT',
  RESERVED = 'RESERVED',
}

export interface Location {
  type: string;
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
  jenis: string;
  detail_description: string;
  luas: string;
  land_size: string;
  location: Location;
  address: string;
  specifications: {
    kamar: number;
    kamar_mandi: number;
    offices: number;
    contractType: string;
    propertyType: string;
    realEstateType: string;
    totalArea: number;
    [key: string]: any;
  };
  images: {
    id: string;
    image_url: string;
    caption: string;
    sort_order: number;
  }[];
  floor_plans: {
    id: string;
    name: string;
    file_url: string;
    sort_order: number;
  }[];
  developer: { name: string } | null;
  agent: { name: string } | null;
  status_delete: number;
  deleted_at: Date | null;
  created_at: string;
  updated_at: string;
  type: string;
}
// export interface BuildingProperty {
//   id: string;
//   name: string;
//   price: string;
 
//   property: {
//     id: string; 
 
//   };
// }
