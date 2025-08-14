"use server";

import api from "@/service/api";
import { Property } from "@/types/properties";
import { AxiosError } from "axios";

export async function getProperty(): Promise<Property[]> {
  const response = await api({
    url: "/properties",
    method: "GET",
  });
  return response.data;
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
