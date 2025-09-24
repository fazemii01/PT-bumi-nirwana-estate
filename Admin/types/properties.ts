import { Agent } from "@/types/agent";
import { Developer } from "@/types/developer";

export type Property = {
  id: string;
  developerId: string;
  agentId: string;
  name: string;
  slug?: string;
  type: string;
  description: string;
  detail_description: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  address?: Address;
  property_images?: File[];
  property_site_plans?: File[];

  images: ImageProperty[];
  site_plans: SitePlan[];
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

export type SitePlan = {
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

export type CreateImageProperty = {
  images: ImageProperty[];
  property_images: File[];
};
