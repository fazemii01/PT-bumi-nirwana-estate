"use server";

import api from "@/service/api";
import { Agent } from "@/types/agent";
import { ApiResponse } from "@/types/api-response";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export async function getAgent(): Promise<ApiResponse<Agent[]>> {
  try {
    const res = await api.get<Agent[]>("/agents");
    return ApiResponse.success(res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return ApiResponse.failure<Agent[]>(error.response?.data?.message || "Fetch data failed due to network error.");
    }

    return ApiResponse.failure<Agent[]>("An unexpected error occurred during agents.");
  }
}

export async function addAgent({ data }: { data: Agent }): Promise<ApiResponse<Agent>> {
  try {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);

    if (data.file_avatar) {
      formData.append("avatar_url", data.file_avatar);
    }

    const res = await api({
      url: "/agents",
      method: "POST",
      data: formData,
    });
    revalidatePath("/agent");
    return ApiResponse.success<Agent>(res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return ApiResponse.failure<Agent>(error.response?.data?.message || "Create new data failed due to network error.");
    }

    return ApiResponse.failure<Agent>("An unexpected error occurred during agents.");
  }
}

export async function deleteAgentById({ id }: { id: string }): Promise<ApiResponse<Agent>> {
  try {
    const res = await api({
      url: `/agents/${id}`,
      method: "DELETE",
    });
    revalidatePath("/agents");
    return ApiResponse.success<Agent>(res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return ApiResponse.failure<Agent>(error.response?.data?.message || "Delete data failed due to network error.");
    }
    return ApiResponse.failure<Agent>("An unexpected error occurred during agents.");
  }
}

export async function updateAgent({ data, originalData }: { data: Agent; originalData: Agent }): Promise<ApiResponse<Agent>> {
  try {
    const formData = new FormData();

    if (data.full_name !== originalData.full_name) {
      formData.append("full_name", data.full_name);
    }

    if (data.email !== originalData.email) {
      formData.append("email", data.email);
    }

    if (data.phone_number !== originalData.phone_number) {
      formData.append("phone_number", data.phone_number);
    }

    if (data.file_avatar) {
      formData.append("avatar_url", data.file_avatar);
    }

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const res = await api({
      url: `/agents/${data.id}`,
      method: "PATCH",
      data: formData,
    });

    revalidatePath("/agent");
    return ApiResponse.success<Agent>(res.data);
  } catch (error) {
    if (error instanceof AxiosError) return ApiResponse.failure<Agent>(error.response?.data?.message || "Update data failed due to network error.");
    return ApiResponse.failure<Agent>("An unexpected error occurred during agents.");
  }
}
