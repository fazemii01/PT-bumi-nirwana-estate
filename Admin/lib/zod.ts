import { object, string, number, array, nativeEnum, literal, tuple, z } from "zod";
import { PropertyType } from "../types/properties";
import { description } from "@/components/chart-area-interactive";

const emptyToUndef = z
  .string()
  .transform((v) => (v?.trim() === "" ? undefined : v))
  .optional();

export const AgentZod = object({
  full_name: string().min(1, "Name is required"),
  email: string().min(1, "Email is required").email("please enter a valid email"),
  phone_number: string().min(10, "Phone number invalid"),
});

export const DeveloperSchema = object({
  name: string().min(1, "Name is required"),
  website_url: string().min(1, "Website URL is required").url("Please enter a valid URL"),
});

// Lokasi [lng, lat]
const LocationZod = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]).refine(([lng, lat]) => typeof lng === "number" && typeof lat === "number" && !isNaN(lng) && !isNaN(lat), { message: "Koordinat lokasi wajib diisi" }),
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
  type: nativeEnum(PropertyType),
  description: string().optional(),
  detail_description: string().optional(),
  location: object({
    type: literal("Point"),
    coordinates: tuple([number(), number()]).refine(([lng, lat]) => typeof lng === "number" && typeof lat === "number" && !isNaN(lng) && !isNaN(lat), { message: "Koordinat lokasi wajib diisi" }),
  }),
  address: AddressZod.optional(),

  property_images: array(object({})).min(1, "Minimal 1 gambar property wajib diupload"),
  property_site_plans: array(object({})).min(1, "Minimal 1 gambar site plan wajib diupload"),

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
