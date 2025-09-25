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
import {
  BuildingStatus,
  PriceUnit as BuildingPriceUnit,
} from "@/types/building-properties";

export enum PropertyType {
  SUBSIDI = "SUBSIDI",
  KOMERSIL = "KOMERSIL",
}

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

export const SpecificationsZod = object({
  bedrooms: number().int().min(0).optional(),
  bathrooms: number().int().min(0).optional(),
  family_room: number().int().min(0).optional(),
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const BuildingKprRuleZod = z.object({
  file: z
    .instanceof(File, { message: "File KPR wajib diisi." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Ukuran file maksimal adalah 5MB.`,
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message:
        "Format file tidak didukung. Harap upload gambar, PDF, atau Word.",
    }),
  preview: z.string().optional(),
});

export const FloorPlanZod = object({
  id: string().optional(),
  name: string().min(1, "Nama wajib diisi"),
  file_url: string().url().optional(),
  sort_order: number().int().optional(),
  file: object({}).optional(),
  preview: string().optional(),
});

export const AddressZod = object({
  street: string().optional(),
  village: string().optional(),
  district: string().optional(),
  city: string().optional(),
  province: string().optional(),
  postal_code: string().optional(),
});

export const ImagePropertyZod = object({
  id: string().optional(),
  image_url: string().url().optional(),
  caption: string().optional(),
  sort_order: number().int().optional(),
  file: object({}).optional(),
  preview: string().optional(),
});

export const SitePlanZod = object({
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
  type: z
    .union([z.nativeEnum(PropertyType), z.literal("")])
    .refine((val) => val !== "", {
      message: "Tipe properti wajib dipilih",
    }),
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

  property_images: array(object({})).min(
    1,
    "Minimal 1 gambar property wajib diupload"
  ),
  property_site_plans: array(object({})).min(
    1,
    "Minimal 1 gambar site plan wajib diupload"
  ),

  images: array(ImagePropertyZod).optional(),
  site_plans: array(SitePlanZod),
});

export const UpdatePropertyZod = z.object({
  id: z.string().optional(),
  developerId: z.string().min(1, "Developer wajib diisi"),
  agentId: z.string().min(1, "Agent wajib diisi"),
  name: z.string().min(1, "Nama properti wajib diisi"),
  type: emptyToUndef,
  description: emptyToUndef,
  detail_description: emptyToUndef,
  location: LocationZod,
  address: AddressZod.optional(),
  property_images: z.array(z.object({})).optional(),
  property_site_plans: z.array(z.object({})).optional(),
  images: z.array(ImagePropertyZod).optional(),
  site_plans: z.array(SitePlanZod).optional(),
});

export const BuildingPropertyZod = object({
  id: string().optional(),
  propertyId: string().min(1, "Property wajib diisi"),
  name: string().min(1, "Nama Bangunan wajib diisi"),
  total_units: string().min(1, "Jumlah Units wajib diisi"),
  status: nativeEnum(BuildingStatus),
  price: z.coerce.number().min(0, "Harga wajib diisi"),
  price_unit: nativeEnum(BuildingPriceUnit),
  land_size: z.coerce.number().min(0, "Luas tanah wajib diisi"),
  building_size: z.coerce.number().min(0, "Luas bangunan wajib diisi"),
  description: string().optional(),
  specifications: SpecificationsZod.optional(),
  building_images: array(z.instanceof(File), {
    message: "Gambar bangunan harus berupa file",
  }).optional(),
  building_floor_plans: array(z.instanceof(File), {
    message: "Denah bangunan harus berupa file",
  }).optional(),
  building_kpr_files: z
    .array(BuildingKprRuleZod)
    .max(1, { message: "Hanya satu file peraturan KPR yang diperbolehkan." })
    .optional(),
  images: array(ImagePropertyZod).optional(),
  floor_plans: array(FloorPlanZod).optional(),
});

export const updateBuildingPropertyZod = object({
  id: string().optional(),
  propertyId: string().min(1, "Property wajib diisi"),
  name: string().min(1, "Nama Bangunan wajib diisi"),
  total_units: string().min(1, "Jumlah Units wajib diisi"),
  status: nativeEnum(BuildingStatus),
  price: z.coerce.number().min(0, "Harga wajib diisi"),
  price_unit: nativeEnum(BuildingPriceUnit),
  land_size: z.coerce.number().min(0, "Luas tanah wajib diisi"),
  building_size: z.coerce.number().min(0, "Luas bangunan wajib diisi"),
  description: string().optional(),
  specifications: SpecificationsZod.optional(),
  building_images: array(z.object({})).optional(),
  building_floor_plans: array(z.object({})).optional(),
  building_kpr_files: z
    .array(BuildingKprRuleZod)
    .max(1, { message: "Hanya satu file peraturan KPR yang diperbolehkan." })
    .optional(),
  images: array(ImagePropertyZod).optional(),
  floor_plans: array(FloorPlanZod).optional(),
});

export const BankZod = z.object({
  interest_rate: z.coerce
    .number({
      required_error: "Bunga tahunan wajib diisi",
      invalid_type_error: "Bunga tahunan harus berupa angka",
    })
    .refine((val) => val >= 0, { message: "Minimum nilai bunga adalah 0" }),

  max_tenure: z.coerce
    .number({
      required_error: "Maks tenor wajib diisi",
      invalid_type_error: "Maks tenor harus berupa angka",
    })
    .refine((val) => val >= 1, { message: "Minimum tenor adalah 1 tahun" }),

  file: z.instanceof(File, { message: "Logo wajib diisi" }),
});

export const BankZodEdit = z.object({
  interest_rate: z.coerce
    .number({
      required_error: "Bunga tahunan wajib diisi",
      invalid_type_error: "Bunga tahunan harus berupa angka",
    })
    .refine((val) => val >= 0, { message: "Minimum nilai bunga adalah 0" }),

  max_tenure: z.coerce
    .number({
      required_error: "Maks tenor wajib diisi",
      invalid_type_error: "Maks tenor harus berupa angka",
    })
    .refine((val) => val >= 1, { message: "Minimum tenor adalah 1 tahun" }),
});

export const NewsZod = z.object({
  title: z.coerce
    .string({
      required_error: "Judul wajib diisi.",
    })
    .min(1, "Judul wajib diisi."),

  description: z.coerce
    .string({
      required_error: "Deskripsi wajib diisi.",
    })
    .min(1, "Deskripsi wajib diisi."),

  categoryId: z.coerce
    .string({
      required_error: "Kategori berita wajib dipilih",
    })
    .min(1, "Kategori berita wajib dipilih"),

  newsImages: z.array(z.instanceof(File)).min(1, "Minimal upload 1 gambar"),
});

export const NewsZodUpdate = z.object({
  title: z.coerce
    .string({
      required_error: "Judul wajib diisi.",
    })
    .min(1, "Judul wajib diisi."),

  description: z.coerce
    .string({
      required_error: "Deskripsi wajib diisi.",
    })
    .min(1, "Deskripsi wajib diisi."),

  categoryId: z.coerce
    .string({
      required_error: "Kategori berita wajib dipilih",
    })
    .min(1, "Kategori berita wajib dipilih"),
});
