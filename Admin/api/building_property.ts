"use server";
import { apiFetch } from "@/service/api";
import { ApiResponse } from "@/types/api-response";
import { Building_Property } from "@/types/building-properties";

export async function getBuildingProperties(): Promise<
  ApiResponse<Building_Property[]>
> {
  return apiFetch<Building_Property[]>("/building_properties", {
    method: "GET",
  });
}

export async function getBuildingPropertyById({
  id,
}: {
  id: string;
}): Promise<ApiResponse<Building_Property | null>> {
  return apiFetch<Building_Property | null>(`/building_properties/${id}`, {
    method: "GET",
  });
}

export async function getBuildingPropertyPaged(
  page = 1,
  limit = 10
): Promise<{ data: Building_Property[]; total: number }> {
  const res = await getBuildingProperties();
  const all = res.data ?? [];
  const total = all.length;
  const start = (page - 1) * limit;
  return {
    data: all.slice(start, start + limit),
    total,
  };
}

export async function addBuildingProperty({
  buildingProperty,
}: {
  buildingProperty: Building_Property;
}): Promise<ApiResponse<Building_Property>> {
  const data = new FormData();
  data.append("propertyId", buildingProperty.propertyId);
  data.append("name", buildingProperty.name);
  data.append("type", buildingProperty.type);
  data.append("status", buildingProperty.status);
  data.append("price", buildingProperty.price.toString());
  data.append("price_unit", buildingProperty.price_unit);
  data.append("land_size", buildingProperty.land_size.toString());
  data.append("building_size", buildingProperty.building_size.toString());
  data.append("description", buildingProperty.detail_description);
  data.append("detail_description", buildingProperty.detail_description);
  if (buildingProperty.specifications) {
    data.append(
      "specifications",
      JSON.stringify(buildingProperty.specifications)
    );
  }
  if (buildingProperty.property_images) {
    buildingProperty.property_images.forEach((file) => {
      data.append(`property_images`, file);
    });
  }
  if (buildingProperty.property_floor_plans) {
    buildingProperty.property_floor_plans.forEach((file) => {
      data.append(`property_floor_plans`, file);
    });
  }
  if (buildingProperty.images) {
    buildingProperty.images.forEach((image, index) => {
      data.append(`images[${index}][caption]`, image.caption);
      if (image.sort_order !== undefined) {
        data.append(
          `images[${index}][sort_order]`,
          image.sort_order.toString()
        );
      }
    });
  }
  if (buildingProperty.floor_plans) {
    buildingProperty.floor_plans.forEach((plan, index) => {
      data.append(`floor_plans[${index}][name]`, plan.name);
      if (plan.sort_order !== undefined) {
        data.append(
          `floor_plans[${index}][sort_order]`,
          plan.sort_order.toString()
        );
      }
    });
  }

  return apiFetch<Building_Property>("/building-properties", {
    method: "POST",
    body: data,
  });
}
