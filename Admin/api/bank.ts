import { ApiResponse } from "./../types/api-response";
import { apiFetch } from "@/service/api";
import { Bank } from "@/types/bank";

export async function getBanks(): Promise<ApiResponse<Bank[]>> {
  return await apiFetch<Bank[]>("/banks", {
    method: "GET",
  });
}

export async function getBankPaged(page = 1, limit = 10): Promise<{ data: Bank[]; total: number }> {
  const res = await getBanks();
  const all = res.data ?? [];
  const total = all.length;
  const start = (page - 1) * limit;
  return {
    data: all.slice(start, start + limit),
    total,
  };
}

export async function addBank({ bank }: { bank: Bank }) {
  const formData = new FormData();
  formData.append("name", bank.name);
  formData.append("interest_rate", bank.interest_rate.toString());
  formData.append("min_tenure", bank.min_tenure.toString());
  formData.append("max_tenure", bank.max_tenure.toString());
  if (bank.file) formData.append("logo", bank.file);

  return await apiFetch<ApiResponse<Bank>>("/banks", {
    method: "POST",
    body: formData,
  });
}

export async function updateBank({ bank, originalData }: { bank: Bank; originalData: Bank }) {
  const formData = new FormData();

  if (originalData.name !== bank.name) formData.append("name", bank.name);
  if (originalData.min_tenure !== bank.min_tenure) formData.append("min_tenure", bank.min_tenure.toString());
  if (originalData.max_tenure !== bank.max_tenure) formData.append("max_tenure", bank.max_tenure.toString());
  if (originalData.interest_rate !== bank.interest_rate) formData.append("interest_rate", bank.interest_rate.toString());

  if (bank.file) formData.append("logo", bank.file);

  return await apiFetch<ApiResponse<Bank>>(`/banks/${bank.id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteBank({ id }: { id: string }) {
  return await apiFetch<ApiResponse<Bank>>(`/banks/${id}`, {
    method: "DELETE",
  });
}
