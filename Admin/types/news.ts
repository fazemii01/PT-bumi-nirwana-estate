import { Property } from "@/types/properties";

export type News = {
  id: string;
  categoryId: string;
  propertyId?: string;
  title: string;
  slug?: string;
  description: string;
  property?: Property;
  newsCategory?: NewsCategory;
  created_at?: Date;
  news_images?: File[];
  newsImages?: NewsImages[];
};

export type NewsCategory = {
  id: string;
  name: string;
};

export type NewsImages = {
  id?: string;
  img_url: string;
};
