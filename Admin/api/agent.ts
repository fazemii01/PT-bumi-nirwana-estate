"use server";

import api from "@/service/api";
import { Agent } from "@/types/agent";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export async function getAgent(): Promise<Agent[]> {
  try {
    const res = await api.get<Agent[]>("/agents");
    return res.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Fetch data failed due to network error.");
    }
    throw new Error("An unexpected error occurred during agents.");
  }
}

export async function addAgent({ data }: { data: Agent }) {
  const formData = new FormData();
  formData.append("full_name", data.full_name);
  formData.append("email", data.email);
  formData.append("phone_number", data.phone_number);

  if (data.file_avatar) {
    formData.append("avatar_url", data.file_avatar);
  }

  console.log("data dikirim", data);

  const res = await api({
    url: "/agents",
    method: "POST",
    data: formData,
  });
  revalidatePath("/agent");
  return res.data;
}
