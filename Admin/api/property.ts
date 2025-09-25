"use server";
import { apiFetch } from "@/service/api";
import { ApiResponse } from "@/types/api-response";
import { Property } from "@/types/properties";

export async function getProperties(): Promise<ApiResponse<Property[]>> {
  return apiFetch<Property[]>("/properties", {
    method: "GET",
  });
}

export async function getPropertyById({
  id,
}: {
  id: string;
}): Promise<ApiResponse<Property | null>> {
  return apiFetch<Property | null>(`/properties/${id}`, {
    method: "GET",
  });
}

export async function getPropertyPaged(
  page = 1,
  limit = 10
): Promise<{ data: Property[]; total: number }> {
  const res = await getProperties();
  const all = res.data ?? [];
  const total = all.length;
  const start = (page - 1) * limit;
  return {
    data: all.slice(start, start + limit),
    total,
  };
}

export async function addProperty({
  property,
}: {
  property: Property;
}): Promise<ApiResponse<Property>> {
  const data = new FormData();
  data.append("developerId", property.developerId);
  data.append("agentId", property.agentId);
  data.append("name", property.name);
  data.append("type", property.type);
  data.append("description", property.description);
  data.append("detail_description", property.detail_description);
  if (property.location) {
    data.append("location", JSON.stringify(property.location));
  }
  if (property.address) {
    data.append("address", JSON.stringify(property.address));
  }

  if (property.property_images) {
    property.property_images.forEach((file) => {
      data.append(`property_images`, file);
    });
  }
  if (property.property_site_plans) {
    property.property_site_plans.forEach((file) => {
      data.append(`property_site_plans`, file);
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
  if (property.site_plans) {
    property.site_plans.forEach((plan, index) => {
      data.append(`site_plans[${index}][name]`, plan.name);
      if (plan.sort_order !== undefined) {
        data.append(
          `site_plans[${index}][sort_order]`,
          plan.sort_order.toString()
        );
      }
    });
  }

  return apiFetch<Property>("/properties", {
    method: "POST",
    body: data,
  });
}

export async function updateProperty({
  data,
  originalData,
}: {
  data: Property;
  originalData: Property;
}): Promise<ApiResponse<Property>> {
  const toGeoJson = (loc?: Property["location"]) => {
    if (!loc?.coordinates) return undefined;
    const [lng, lat] = loc.coordinates as [number, number];
    return { type: "Point", coordinates: [lng, lat] as [number, number] };
  };
  const formData = new FormData();

  if (data.developerId !== originalData.developerId && data.developerId)
    formData.append("developerId", data.developerId);
  if (data.agentId !== originalData.agentId && data.agentId)
    formData.append("agentId", data.agentId);
  if (data.name !== originalData.name) formData.append("name", data.name);
  if (data.type !== originalData.type) formData.append("type", data.type);

  if (data.description !== originalData.description)
    formData.append("description", data.description ?? "");
  if (data.detail_description !== originalData.detail_description)
    formData.append("detail_description", data.detail_description ?? "");

  {
    const geo = toGeoJson(data.location);
    const geoOriginal = toGeoJson(originalData.location);
    if (JSON.stringify(geo) !== JSON.stringify(geoOriginal) && geo) {
      formData.append("location", JSON.stringify(geo));
    }
  }
  if (
    data.address &&
    JSON.stringify(data.address) !== JSON.stringify(originalData.address)
  ) {
    formData.append("address", JSON.stringify(data.address));
  }

  if (data.property_images) {
    data.property_images.forEach((file) => {
      formData.append(`property_images`, file);
    });
  }
  if (data.property_site_plans) {
    data.property_site_plans.forEach((file) => {
      formData.append(`property_site_plans`, file);
    });
  }

  if (data.images) {
    data.images.forEach((image, index) => {
      formData.append(`images[${index}][caption]`, image.caption);
      if (image.sort_order !== undefined) {
        formData.append(
          `images[${index}][sort_order]`,
          image.sort_order.toString()
        );
      }
    });
  }
  if (data.site_plans) {
    data.site_plans.forEach((plan, index) => {
      formData.append(`site_plans[${index}][name]`, plan.name);
      if (plan.sort_order !== undefined) {
        formData.append(
          `site_plans[${index}][sort_order]`,
          plan.sort_order.toString()
        );
      }
    });
  }

  return apiFetch<Property>(`/properties/${data.id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deletePropertyById(
  id: string
): Promise<ApiResponse<Property | null>> {
  return await apiFetch<Property | null>(`/properties/${id}`, {
    method: "DELETE",
  });
}
