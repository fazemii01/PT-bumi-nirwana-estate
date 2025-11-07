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
  floor_plans: {
      id: string;
      name: string;
      file_url: string;
      // caption: string;
      sort_order: number;
    } [];
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
    site_plans: {
    id: string;
    name: string;
    file_url: string;
    sort_order: number;
  }[];
  developer: { 
    name: string;
    phone_number: string;
    email: string;
    id : string;
    website_url: string;
    logo_url: string;
   }[];
  agent: {  
    full_name: string;
    phone_number: string;
    email: string;
    id : string;
    website: string;
    avatar_url: string;
  }[];
  building_property: {
    id : string;
    name: string;
    total_units: number;
    status: PropertyStatus;
    price: number;
    land_size: string;
    building_size: string;
    description: string;
    price_unit: string;
    address: {
      street: string;
      province: string;
      city: string;
    };
    street: string;
    province: string;
    city: string;
    village: string;
    postal_code: string;
    images: {
      id: string;
      image_url: string;
      caption: string;
      sort_order: number;
    }[];
    specifications: {
      bedrooms: number;
      bathrooms: number;
      family_room: number;
      kitchen: number;
      garage: number;
      [key: string]: any;
    }
    floor_plans: {
      id: string;
      name: string;
      file_url: string;
      // caption: string;
      sort_order: number;
    }
  } [];
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
