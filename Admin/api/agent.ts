"use server";

import api from "@/service/api";
import { Agent } from "@/types/agent";
import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

export async function getAgent(): Promise<Agent[]> {
  try {
    const res = await api.get<Agent[]>("/agents");
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Fetch data failed due to network error."
      );
    }
    throw new Error("An unexpected error occurred during agents.");
  }
}

export async function addAgent({ data }: { data: Agent }) {
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
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Create new data failed due to network error."
      );
    }
    throw new Error("An unexpected error occurred during agents.");
  }
}

export async function deleteAgent({ id }: { id: string }) {
  try {
    await api({
      url: `/agents/${id}`,
      method: "DELETE",
    });
    revalidatePath("/agents");
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Delete data failed due to network error."
      );
    }
    throw new Error("An unexpected error occurred during agents.");
  }
}

export async function updateAgent({data, originalData}:{data:Agent, originalData:Agent}) {

  const formData = new FormData();

  if(data.full_name !== originalData.full_name){
    formData.append("full_name", data.full_name);
  }

  if(data.email !== originalData.email){
    formData.append("email", data.email)
  }

  if(data.phone_number !== originalData.phone_number){
    formData.append("phone_number", data.phone_number)
  }

  if(data.file_avatar){
    formData.append("avatar_url",data.file_avatar)
  }

  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  
  }
  await api({
    url:`/agents/${data.id}`,
    method:"PATCH",
    data:formData,
  })

  revalidatePath('/agent')
}
