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
  console.log(buildingProperty.building_kpr_file);

  data.append("propertyId", buildingProperty.propertyId);
  data.append("name", buildingProperty.name);
  data.append("status", buildingProperty.status);
  data.append("total_units", buildingProperty.total_units);
  data.append("price", buildingProperty.price.toString());
  data.append("price_unit", buildingProperty.price_unit);
  data.append("land_size", buildingProperty.land_size.toString());
  data.append("building_size", buildingProperty.building_size.toString());
  data.append("description", buildingProperty.description);
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

  if (buildingProperty.building_kpr_file) {
    buildingProperty.building_kpr_file.forEach((file) => {
      data.append(`building_kpr_rules`, file);
    });
  }

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

  return apiFetch<BuildingProperty>("/building-property", {
    method: "POST",
    body: data,
  });
}

export async function updateBuildingProperty({ data, originalData }: { data: BuildingProperty; originalData: BuildingProperty }): Promise<ApiResponse<BuildingProperty>> {
  const formData = new FormData();

  if (data.propertyId !== originalData.propertyId && data.propertyId) formData.append("propertyId", data.propertyId);
  if (data.name !== originalData.name) formData.append("name", data.name);
  if (data.status !== originalData.status) formData.append("status", data.status);
  if (data.total_units !== originalData.total_units) formData.append("total_units", data.total_units);
  if (data.price !== originalData.price) formData.append("price", data.price.toString());
  if (data.price_unit !== originalData.price_unit) formData.append("price_unit", data.price_unit);
  if (data.land_size !== originalData.land_size) formData.append("land_size", data.land_size.toString());
  if (data.building_size !== originalData.building_size) formData.append("building_size", data.building_size.toString());
  if (data.description !== originalData.description) formData.append("description", data.description ?? "");
  if (JSON.stringify(data.specifications) !== JSON.stringify(originalData.specifications) && data.specifications) {
    formData.append("specifications", JSON.stringify(data.specifications));
  }
  if (data.building_images) {
    data.building_images.forEach((file) => {
      formData.append(`building_images`, file);
    });
  }
  if (data.building_floor_plans) {
    data.building_floor_plans.forEach((file) => {
      formData.append(`building_floor_plans`, file);
    });
  }
  if (data.building_kpr_file) {
    data.building_kpr_file.forEach((file) => {
      formData.append(`building_kpr_rules`, file);
    });
  }
  if (data.images) {
    data.images.forEach((image, index) => {
      formData.append(`images[${index}][caption]`, image.caption);
      if (image.sort_order !== undefined) {
        formData.append(`images[${index}][sort_order]`, image.sort_order.toString());
      }
    });
  }
  if (data.floor_plans) {
    data.floor_plans.forEach((plan, index) => {
      formData.append(`floor_plans[${index}][name]`, plan.name);
      if (plan.sort_order !== undefined) {
        formData.append(`floor_plans[${index}][sort_order]`, plan.sort_order.toString());
      }
    });
  }

  return apiFetch<BuildingProperty>(`/building-property/${data.id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteBuildingPropertyById(id: string): Promise<ApiResponse<BuildingProperty | null>> {
  return await apiFetch<BuildingProperty | null>(`/building-property/${id}`, {
    method: "DELETE",
  });
}
