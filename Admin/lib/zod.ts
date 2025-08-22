import {
  object,
  string,
  number,
  array,
  nativeEnum,
  literal,
  tuple,
  z,
} from "zod";
import { PropertyStatus, PriceUnit, PropertyType } from "../types/properties";

const emptyToUndef = z
  .string()
  .transform((v) => (v?.trim() === "" ? undefined : v))
  .optional();

export const AgentZod = object({
  full_name: string().min(1, "Name is required"),
  email: string()
    .min(1, "Email is required")
    .email("please enter a valid email"),
  phone_number: string().min(10, "Phone number invalid"),
});

export const DeveloperSchema = object({
  name: string().min(1, "Name is required"),
  website_url: string()
    .min(1, "Website URL is required")
    .url("Please enter a valid URL"),
});

// Lokasi [lng, lat]
const LocationZod = z.object({
  type: z.literal("Point"),
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(
      ([lng, lat]) =>
        typeof lng === "number" &&
        typeof lat === "number" &&
        !isNaN(lng) &&
        !isNaN(lat),
      { message: "Koordinat lokasi wajib diisi" }
    ),
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
  family_room: number().int().min(0).optional(), // disesuaikan dgn tipe & form
  kitchen: number().int().min(0).optional(),
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
  id: string().optional(),
  image_url: string().url().optional(),
  caption: string().optional(),
  sort_order: number().int().optional(),
  file: object({}).optional(),
  preview: string().optional(),
});

export const FloorPlanZod = object({
  id: string().optional(),
  name: string().min(1, "Nama wajib diisi"),
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
  type: nativeEnum(PropertyType),
  status: nativeEnum(PropertyStatus),
  price: z.coerce.number().min(0, "Harga wajib diisi"),
  price_unit: nativeEnum(PriceUnit),
  land_size: z.coerce.number().min(0, "Luas tanah wajib diisi"),
  building_size: z.coerce.number().min(0, "Luas bangunan wajib diisi"),
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

  property_images: array(object({})).min(
    1,
    "Minimal 1 gambar property wajib diupload"
  ),
  property_floor_plans: array(object({})).min(
    1,
    "Minimal 1 gambar denah wajib diupload"
  ),

  images: array(ImagePropertyZod).optional(),
  floor_plans: array(FloorPlanZod),
});

export const UpdatePropertyZod = z.object({
  id: z.string().optional(),
  developerId: z.string().min(1, "Developer wajib diisi"),
  agentId: z.string().min(1, "Agent wajib diisi"),
  name: z.string().min(1, "Nama properti wajib diisi"),
  status: z.nativeEnum(PropertyStatus),
  price: z.string().min(1, "Harga wajib diisi"),
  price_unit: z.nativeEnum(PriceUnit),

  // ini optional di edit
  luas: emptyToUndef,
  jenis: emptyToUndef,
  description: emptyToUndef,
  detail_description: emptyToUndef,

  // kalau kamu ingin lokasi TIDAK wajib di edit:
  // - opsi A: optional penuh
  // location: LocationZod.optional(),
  // - opsi B: tetap wajib (kalau BE mengharuskan selalu ada):
  location: LocationZod,

  address: AddressZod.optional(),
  specifications: SpecificationsZod.optional(),

  // EDIT TIDAK MENYENTUH MEDIA → jadikan optional TANPA min()
  property_images: z.array(z.object({})).optional(),
  property_floor_plans: z.array(z.object({})).optional(),

  // kamu edit media di halaman detail terpisah → optional
  images: z.array(ImagePropertyZod).optional(),
  floor_plans: z.array(FloorPlanZod).optional(),
});
