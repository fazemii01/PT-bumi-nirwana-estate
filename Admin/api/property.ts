"use server";
import api from "@/service/api";
import { ApiResponse } from "@/types/api-response";
import { Property } from "@/types/properties";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export async function getProperty(): Promise<ApiResponse<Property[]>> {
  try {
    const response = await api({
      url: "/properties",
      method: "GET",
    });

    return ApiResponse.success(response.data);
  } catch (error) {
    if (error instanceof AxiosError) return ApiResponse.failure<Property[]>(error?.response?.data.message || "Failed fetch data property");
  }
  return ApiResponse.failure<Property[]>("An unexpected error occurred during property");
}

export async function getPropertyById({ id }: { id: string }): Promise<ApiResponse<Property | null>> {
  try {
    const res = await api({
      url: `properties/${id}`,
      method: "GET",
    });
    return ApiResponse.success<Property | null>(res.data);
  } catch (error) {
    if (error instanceof AxiosError) return ApiResponse.failure<Property | null>(error?.response?.data.message || "Faile fetch data property by id");
  }
  return ApiResponse.failure<Property | null>("An unexpected error occured during property");
}

export async function addProperty({ property }: { property: Property }): Promise<ApiResponse<Property>> {
  try {
    const data = new FormData();
    data.append("developerId", property.developerId);
    data.append("agentId", property.agentId);
    data.append("name", property.name);
    data.append("status", property.status);
    data.append("price", property.price);
    data.append("price_unit", property.price_unit);
    data.append("luas", property.luas);
    data.append("jenis", property.jenis);
    data.append("description", property.description);
    data.append("detail_description", property.detail_description);
    if (property.location) {
      data.append("location", JSON.stringify(property.location));
    }
    if (property.address) {
      data.append("address", JSON.stringify(property.address));
    }
    if (property.specifications) {
      data.append("specifications", JSON.stringify(property.specifications));
    }
    if (property.property_images) {
      property.property_images.forEach((file) => {
        data.append(`property_images`, file);
      });
    }
    if (property.property_floor_plans) {
      property.property_floor_plans.forEach((file) => {
        data.append(`property_floor_plans`, file);
      });
    }
    if (property.images) {
      property.images.forEach((image, index) => {
        data.append(`images[${index}][caption]`, image.caption);
        if (image.sort_order !== undefined) {
          data.append(`images[${index}][sort_order]`, image.sort_order.toString());
        }
      });
    }
    if (property.floor_plans) {
      property.floor_plans.forEach((plan, index) => {
        data.append(`floor_plans[${index}][name]`, plan.name);
        if (plan.sort_order !== undefined) {
          data.append(`floor_plans[${index}][sort_order]`, plan.sort_order.toString());
        }
      });
    }

    const response = await api({
      url: "/properties",
      method: "POST",
      data: data,
    });
    revalidatePath("/properties");
    return ApiResponse.success(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return ApiResponse.failure<Property>(error.response?.data?.message || "Create new data failed due to network error.");
    }
    return ApiResponse.failure<Property>("An unexpected error occurred during property");
  }
}

export async function updateProperty({ data, originalData }: { data: Property; originalData: Property }): Promise<ApiResponse<Property>> {
  try {
    const newImageFiles = (data.property_images as File[] | undefined)?.filter(Boolean) ?? [];
    const newFloorFiles = (data.property_floor_plans as File[] | undefined)?.filter(Boolean) ?? [];
    const hasNewImages = newImageFiles.length > 0;
    const hasNewFloor = newFloorFiles.length > 0;
    const hasNewFiles = hasNewImages || hasNewFloor;

    // // FE simpan [lat,lng] → BE minta GeoJSON [lng,lat]
    const toGeoJson = (loc?: Property["location"]) => {
      if (!loc?.coordinates) return undefined;
      const [lng, lat] = loc.coordinates as [number, number];
      return { type: "Point", coordinates: [lng, lat] as [number, number] };
    };
    const formData = new FormData();

    // hanya append field yang berubah (opsional, boleh kirim semua juga)
    if (data.developerId !== originalData.developerId && data.developerId) formData.append("developerId", data.developerId);
    if (data.agentId !== originalData.agentId && data.agentId) formData.append("agentId", data.agentId);
    if (data.name !== originalData.name) formData.append("name", data.name);
    if (data.status !== originalData.status) formData.append("status", String(data.status));
    if (data.price !== originalData.price) formData.append("price", String(data.price));
    if (data.price_unit !== originalData.price_unit) formData.append("price_unit", String(data.price_unit));
    if (data.luas !== originalData.luas) formData.append("luas", String(data.luas));
    if (data.jenis !== originalData.jenis) formData.append("jenis", String(data.jenis));
    if (data.description !== originalData.description) formData.append("description", data.description ?? "");
    if (data.detail_description !== originalData.detail_description) formData.append("detail_description", data.detail_description ?? "");

    // location/address/specifications
    {
      const geo = toGeoJson(data.location);
      const geoOriginal = toGeoJson(originalData.location);
      if (JSON.stringify(geo) !== JSON.stringify(geoOriginal) && geo) {
        formData.append("location", JSON.stringify(geo));
      }
    }
    if (data.address && JSON.stringify(data.address) !== JSON.stringify(originalData.address)) {
      formData.append("address", JSON.stringify(data.address));
    }
    if (data.specifications && JSON.stringify(data.specifications) !== JSON.stringify(originalData.specifications)) {
      formData.append("specifications", JSON.stringify(data.specifications));
    }

    // FILES (gunakan hanya new*Files)
    if (hasNewImages) {
      newImageFiles.forEach((file) => formData.append("property_images", file));
      // Meta sejajar index untuk images (hanya saat ada image files)
      (data.images ?? []).forEach((img, idx) => {
        if (img?.caption != null) formData.append(`images[${idx}][caption]`, String(img.caption ?? ""));
        if (img?.sort_order != null) formData.append(`images[${idx}][sort_order]`, String(img.sort_order));
      });
    }

    if (hasNewFloor) {
      newFloorFiles.forEach((file) => formData.append("property_floor_plans", file));
      // Meta sejajar index untuk floor plans (hanya saat ada floor files)
      (data.floor_plans ?? []).forEach((fp, idx) => {
        formData.append(`floor_plans[${idx}][name]`, fp?.name ?? `Floor Plan ${idx + 1}`);
        if (fp?.sort_order != null) formData.append(`floor_plans[${idx}][sort_order]`, String(fp.sort_order));
      });
    }
    const res = await api({
      url: `/properties/${data.id}`,
      method: "PATCH",
      data: formData,
    });
    revalidatePath("/properties");
    return ApiResponse.success<Property>(res.data);
  } catch (error) {
    if (error instanceof AxiosError) return ApiResponse.failure<Property>(error.response?.data.message || "Create new data failed due to network error");
  }
  return ApiResponse.failure<Property>("An unexpected error occurred during property deletion.");
}

export async function deletePropertyById(id: string): Promise<ApiResponse<Property | null>> {
  try {
    const res = await api({
      url: `/properties/${id}`,
      method: "DELETE",
    });
    revalidatePath("/properties");
    return ApiResponse.success<Property | null>(res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return ApiResponse.failure<Property | null>(error.response?.data?.message || "Delete property failed due to network error.");
    }
    return ApiResponse.failure<Property | null>("An unexpected error occurred during property deletion.");
  }
}
