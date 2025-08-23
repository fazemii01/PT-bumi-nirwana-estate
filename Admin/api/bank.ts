import { ApiResponse } from "./../types/api-response";
import { apiFetch } from "@/service/api";
import { Bank } from "@/types/bank";

export async function getBanks(): Promise<ApiResponse<Bank[]>> {
  return await apiFetch<Bank[]>("/banks", {
    method: "GET",
  });
}

export async function addBank({ bank }: { bank: Bank }) {
  const formData = new FormData();
  formData.append("name", bank.name);
  formData.append("interest_rate", bank.interest_rate.toString());
  formData.append("max_tenure", bank.max_tenure.toString());
  if (bank.file) formData.append("logo", bank.file);

  return await apiFetch<ApiResponse<Bank>>("/banks", {
    method: "POST",
    body: formData,
  });
}
