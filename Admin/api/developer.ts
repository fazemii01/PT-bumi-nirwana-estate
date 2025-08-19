"use server";
import api from "@/service/api";
import { ApiResponse } from "@/types/api-response";
import { Developer } from "@/types/developer";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export async function getDeveloper(): Promise<ApiResponse<Developer[]>> {
  try {
    const res = await api.get<Developer[]>("/developers");
    return ApiResponse.success(res.data);
  } catch (error) {
    if (error instanceof AxiosError) return ApiResponse.failure<Developer[]>(error.response?.data?.message || "Fetch data failed due to network error.");
    return ApiResponse.failure<Developer[]>("An unexpected error occurred during developers.");
  }
}

export async function addDeveloper({ data }: { data: Developer }): Promise<ApiResponse<Developer>> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("website_url", data.website_url);

    if (data.file_logo) {
      formData.append("logo_url", data.file_logo);
    }

    const res = await api({
      url: "/developers",
      method: "POST",
      data: formData,
    });
    revalidatePath("/developer");
    return ApiResponse.success(res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return ApiResponse.failure<Developer>(error.response?.data?.message || "Create new data failed due to network error.");
    }

    return ApiResponse.failure<Developer>("An unexpected error occurred during developers.");
  }
}

export async function deleteDeveloperById({ id }: { id: string }): Promise<ApiResponse<Developer | null>> {
  try {
    const res = await api({
      url: `/developers/${id}`,
      method: "DELETE",
    });
    revalidatePath("/developers");
    return ApiResponse.success(res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return ApiResponse.failure<Developer | null>(error.response?.data?.message || "Delete data failed due to network error.");
    }
    return ApiResponse.failure<Developer | null>("An unexpected error occurred during developers.");
  }
}

export async function updateDeveloper({ data, originalData }: { data: Developer; originalData: Developer }): Promise<ApiResponse<Developer>> {
  try {
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
    const res = await api({
      url: `/developers/${data.id}`,
      method: "PATCH",
      data: formData,
    });

    revalidatePath("/developer");
    return ApiResponse.success<Developer>(res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return ApiResponse.failure<Developer>(error.response?.data?.message || "Update data failed due to network error.");
    }
    return ApiResponse.failure<Developer>("An unexpected error occurred during developers.");
  }
}
