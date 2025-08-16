"use server";

import api from "@/service/api";
import { Property } from "@/types/properties";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export async function getProperty(): Promise<Property[]> {
  const response = await api({
    url: "/properties",
    method: "GET",
  });
  return response.data;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await api({
      url: `/properties/${id}`,
      method: "GET",
    });

    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch property with id ${id}:`, error);
    return null;
  }
}

export async function addProperty({ property }: { property: Property }) {
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
          data.append(
            `images[${index}][sort_order]`,
            image.sort_order.toString()
          );
        }
      });
    }
    if (property.floor_plans) {
      property.floor_plans.forEach((plan, index) => {
        data.append(`floor_plans[${index}][name]`, plan.name);
        if (plan.sort_order !== undefined) {
          data.append(
            `floor_plans[${index}][sort_order]`,
            plan.sort_order.toString()
          );
        }
      });
    }

    const response = await api({
      url: "/properties",
      method: "POST",
      data: data,
    });

    return response.status === 201 || response.status === 200;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Create new data failed due to network error."
      );
    }
    throw new Error("An unexpected error occurred during agents.");
  }
}

export async function updateProperty({
  id,
  data,
  originalData,
}: {
  id: string;
  data: Property;
  originalData: Property;
}) {
  try {
    const formData = new FormData();
    formData.append("_method", "PATCH");

    // --- Membandingkan dan menambahkan field yang berubah ---

    if (data.developerId !== originalData.developerId) {
      formData.append("developerId", data.developerId);
    }
    if (data.agentId !== originalData.agentId) {
      formData.append("agentId", data.agentId);
    }
    if (data.name !== originalData.name) {
      formData.append("name", data.name);
    }
    if (data.status !== originalData.status) {
      formData.append("status", data.status);
    }
    if (data.price !== originalData.price) {
      formData.append("price", data.price);
    }
    if (data.price_unit !== originalData.price_unit) {
      formData.append("price_unit", data.price_unit);
    }
    if (data.luas !== originalData.luas) {
      formData.append("luas", data.luas);
    }
    if (data.jenis !== originalData.jenis) {
      formData.append("jenis", data.jenis);
    }
    if (data.description !== originalData.description) {
      formData.append("description", data.description);
    }
    if (data.detail_description !== originalData.detail_description) {
      formData.append("detail_description", data.detail_description);
    }

    // Membandingkan objek kompleks dengan mengubahnya menjadi string JSON
    if (
      JSON.stringify(data.location) !== JSON.stringify(originalData.location)
    ) {
      formData.append("location", JSON.stringify(data.location));
    }
    if (JSON.stringify(data.address) !== JSON.stringify(originalData.address)) {
      formData.append("address", JSON.stringify(data.address));
    }
    if (
      JSON.stringify(data.specifications) !==
      JSON.stringify(originalData.specifications)
    ) {
      formData.append("specifications", JSON.stringify(data.specifications));
    }

    // Melakukan panggilan API
    const response = await api({
      url: `/properties/${id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    revalidatePath("/properties");
    return response.status === 200;
  } catch (error) {
    // Penanganan error yang robust
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Update data failed due to network error."
      );
    }
    throw new Error("An unexpected error occurred during property update.");
  }
}

export async function deleteProperty(id: string) {
  try {
    await api({
      url: `/properties/${id}`,
      method: "DELETE",
    });
    revalidatePath("/properties");
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Delete property failed due to network error."
      );
    }
    throw new Error("An unexpected error occurred during property deletion.");
  }
}
