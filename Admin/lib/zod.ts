import { object, string, number, array, nativeEnum, literal, tuple } from "zod";
import { PropertyStatus, PriceUnit } from "../types/properties";

export const AgentZod = object({
  full_name: string().min(1, "Name is required"),
  email: string().min(1, "Email is required").email("please enter a valid email"),
  phone_number: string().min(10, "Phone number invalid"),
});

export const AddressZod = object({
  street: string().optional(),
  village: string().optional(),
  district: string().optional(),
  city: string().optional(),
  province: string().optional(),
  postal_code: string().optional(),
});

export const SpecificationsZod = object({
  bedrooms: number().int().min(0).optional(),
  bathrooms: number().int().min(0).optional(),
  landSize: number().min(0).optional(),
  buildingSize: number().min(0).optional(),
  garage: number().int().min(0).optional(),
  floors: number().int().min(0).optional(),

  structure: string().optional(),
  floor: string().optional(),
  walls: string().optional(),
  roof: string().optional(),
  doors: string().optional(),
  windows: string().optional(),

  electricity: string().optional(),
  water_source: string().optional(),
  internet: string().optional(),
  security: string().optional(),

  facilities: string().optional(),
});

export const ImagePropertyZod = object({
  image_url: string().url().optional(),
  caption: string(),
  sort_order: number().int().optional(),
  file: object({}).optional(), 
  preview: string().optional(),
});

export const FloorPlanZod = object({
    name: string().min(1, "Nama denah wajib diisi"),
  file_url: string().url().optional(),
  sort_order: number().int().optional(),
  file: object({}).optional(),
  preview: string().optional(),
});

export const PropertyZod = object({
  id: string().optional(),
  developerId: string().min(1, "Developer wajib diisi"),
  agentId: string().min(1, "Agent wajib diisi"),
  name: string().min(1, "Nama properti wajib diisi"),
  status: nativeEnum(PropertyStatus),
  price: string().min(1, "Harga wajib diisi"),
  price_unit: nativeEnum(PriceUnit),
  luas: string().optional(),
  jenis: string().optional(),
  description: string().optional(),
  detail_description: string().optional(),
  location: object({
    type: literal("Point"),
    coordinates: tuple([number(), number()]).refine(
      ([lng, lat]) =>
        typeof lng === "number" &&
        typeof lat === "number" &&
        !isNaN(lng) &&
        !isNaN(lat),
      { message: "Koordinat lokasi wajib diisi" }
    ),
  }),
  address: AddressZod.optional(),
  specifications: SpecificationsZod.optional(),

  property_images: array(object({})).min(1, "Minimal 1 gambar property wajib diupload"),
  property_floor_plans: array(object({})).min(1, "Minimal 1 gambar denah wajib diupload"),

  images: array(ImagePropertyZod).optional(),
  floor_plans: array(FloorPlanZod),
});


