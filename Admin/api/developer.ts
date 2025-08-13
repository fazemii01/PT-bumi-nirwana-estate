"use server"

import api from "@/service/api";
import { Developer } from "@/types/developer";
import { AxiosError } from "axios";

export async function getDeveloper():Promise<Developer[]> {
    try {
    const res = await api.get<Developer[]>("/developers");
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Fetch data failed due to network error."
      );
    }
    throw new Error("An unexpected error occurred during developers.");
  }
}