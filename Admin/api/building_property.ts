"use server";
import { apiFetch } from "@/service/api";
import { ApiResponse } from "@/types/api-response";
import { BuildingProperty } from "@/types/building-properties";

export async function getBuildingProperties(): Promise<ApiResponse<BuildingProperty[]>> {
  return apiFetch<BuildingProperty[]>("/building-property", {
    method: "GET",
  });
}

export async function getBuildingPropertyById({ id }: { id: string }): Promise<ApiResponse<BuildingProperty | null>> {
  return apiFetch<BuildingProperty | null>(`/building-property/${id}`, {
    method: "GET",
  });
}

export async function getBuildingPropertyByProperty({ id }: { id: string }): Promise<ApiResponse<BuildingProperty[]>> {
  return apiFetch<BuildingProperty[]>(`/building-property/property/${id}`, {
    method: "GET",
  });
}

export async function getBuildingPropertyPaged(page = 1, limit = 10): Promise<{ data: BuildingProperty[]; total: number }> {
  const res = await getBuildingProperties();
  const all = res.data ?? [];
  const total = all.length;
  const start = (page - 1) * limit;
  return {
    data: all.slice(start, start + limit),
    total,
  };
}

export async function addBuildingProperty({ buildingProperty }: { buildingProperty: BuildingProperty }): Promise<ApiResponse<BuildingProperty>> {
  const data = new FormData();
  data.append("propertyId", buildingProperty.propertyId);
  data.append("name", buildingProperty.name);
  data.append("status", buildingProperty.status);
  data.append("price", buildingProperty.price.toString());
  data.append("price_unit", buildingProperty.price_unit);
  data.append("land_size", buildingProperty.land_size.toString());
  data.append("building_size", buildingProperty.building_size.toString());
  data.append("detail_description", buildingProperty.detail_description);
  if (buildingProperty.specifications) {
    data.append("specifications", JSON.stringify(buildingProperty.specifications));
  }
  if (buildingProperty.building_images) {
    buildingProperty.building_images.forEach((file) => {
      data.append(`building_images`, file);
    });
  }
  if (buildingProperty.building_floor_plans) {
    buildingProperty.building_floor_plans.forEach((file) => {
      data.append(`building_floor_plans`, file);
    });
  }
  // if (buildingProperty.building_kpr_file) {
  //   buildingProperty.building_kpr_file.forEach((file) => {
  //     data.append(`building_kpr_file`, file);
  //   });
  // }

  if (buildingProperty.images) {
    buildingProperty.images.forEach((image, index) => {
      data.append(`images[${index}][caption]`, image.caption);
      if (image.sort_order !== undefined) {
        data.append(`images[${index}][sort_order]`, image.sort_order.toString());
      }
    });
  }
  if (buildingProperty.floor_plans) {
    buildingProperty.floor_plans.forEach((plan, index) => {
      data.append(`floor_plans[${index}][name]`, plan.name);
      if (plan.sort_order !== undefined) {
        data.append(`floor_plans[${index}][sort_order]`, plan.sort_order.toString());
      }
    });
  }
  // if (buildingProperty.building_kpr_rules) {
  //   buildingProperty.building_kpr_rules.forEach((plan, index) => {
  //     data.append(`building_kpr_rules[${index}][name]`, plan.name);
  //     if (plan.sort_order !== undefined) {
  //       data.append(
  //         `building_kpr_rules[${index}][sort_order]`,
  //         plan.sort_order.toString()
  //       );
  //     }
  //   });
  // }

  return apiFetch<BuildingProperty>("/building-property", {
    method: "POST",
    body: data,
  });
}

export async function deleteBuildingPropertyById(id: string): Promise<ApiResponse<BuildingProperty | null>> {
  return await apiFetch<BuildingProperty | null>(`/building-property/${id}`, {
    method: "DELETE",
  });
}
