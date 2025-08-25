"use server";

import { apiFetch } from "@/service/api";
import { Agent } from "@/types/agent";
import { ApiResponse } from "@/types/api-response";

export async function getAgent(): Promise<ApiResponse<Agent[]>> {
  return apiFetch<Agent[]>("/agents", {
    method: "GET",
  });
}

export async function getAgentPaged(
  page = 1,
  limit = 10
): Promise<{ data: Agent[]; total: number }> {
  const res = await getAgent();
  const all = res.data ?? [];
  const total = all.length;
  const start = (page - 1) * limit;
  return {
    data: all.slice(start, start + limit),
    total,
  };
}

export async function addAgent({
  data,
}: {
  data: Agent;
}): Promise<ApiResponse<Agent>> {
  const formData = new FormData();
  formData.append("full_name", data.full_name);
  formData.append("email", data.email);
  formData.append("phone_number", data.phone_number);

  if (data.file_avatar) {
    formData.append("avatar_url", data.file_avatar);
  }

  return apiFetch<Agent>("/agents", {
    method: "POST",
    body: formData,
  });
}

export async function deleteAgentById({
  id,
}: {
  id: string;
}): Promise<ApiResponse<Agent>> {
  return apiFetch<Agent>(`/agents/${id}`, {
    method: "DELETE",
  });
}

export async function updateAgent({
  data,
  originalData,
}: {
  data: Agent;
  originalData: Agent;
}): Promise<ApiResponse<Agent>> {
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
  return apiFetch<Agent>(`/agents/${data.id}`, {
    method: "PATCH",
    body: formData,
  });
}
