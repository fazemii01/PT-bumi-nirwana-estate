"use server";
import api from "@/service/api";
import { Developer } from "@/types/developer";
import { AxiosError } from "axios";
import { log } from "console";
import { revalidatePath } from "next/cache";

export async function getDeveloper(): Promise<Developer[]> {
  try {
    const res = await api.get<Developer[]>("/developers");
    return res.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Fetch data failed due to network error."
      );
    }
    throw new Error("An unexpected error occurred during agents.");
  }
}

export async function addDeveloper({ data }: { data: Developer }) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("website_url", data.website_url);

  if (data.file_logo) {
    formData.append("logo_url", data.file_logo);
  }

  console.log("data okee", data);

  const res = await api({
    url: "/developers",
    method: "POST",
    data: formData,
  });
  revalidatePath("/developer");
  return res.data;
}
