import api from "@/service/api";
import { Agent } from "@/types/agent";
import { AxiosError } from "axios";

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
