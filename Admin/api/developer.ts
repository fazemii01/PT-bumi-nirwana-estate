"use server";
import { apiFetch } from "@/service/api";
import { ApiResponse } from "@/types/api-response";
import { Developer } from "@/types/developer";

export async function getDeveloper(): Promise<ApiResponse<Developer[]>> {
  return apiFetch<Developer[]>("/developers", {
    method: "GET",
  });
}

export async function addDeveloper({
  data,
}: {
  data: Developer;
}): Promise<ApiResponse<Developer>> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("website_url", data.website_url);

  if (data.file_logo) {
    formData.append("logo_url", data.file_logo);
  }

  return apiFetch<Developer>("/developers", {
    method: "POST",
    body: formData,
  });
}

export async function deleteDeveloperById({
  id,
}: {
  id: string;
}): Promise<ApiResponse<Developer | null>> {
  return apiFetch<Developer | null>(`/developers/${id}`, {
    method: "DELETE",
  });
}

export async function updateDeveloper({
  data,
  originalData,
}: {
  data: Developer;
  originalData: Developer;
}): Promise<ApiResponse<Developer>> {
  const formData = new FormData();

  if (data.name !== originalData.name) {
    formData.append("name", data.name);
  }

  if (data.website_url !== originalData.website_url) {
    formData.append("website_url", data.website_url);
  }

  if (data.file_logo) {
    formData.append("logo_url", data.file_logo);
  }

  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  return apiFetch<Developer>(`/developers/${data.id}`, {
    method: "PATCH",
    body: formData,
  });
}
