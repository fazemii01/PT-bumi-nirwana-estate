import api from "@/service/api";
import { Property } from "@/types/properties";

export async function getProperty(): Promise<Property[]> {
  const response = await api({
    url: "/properties",
    method: "GET",
  });
  return response.data;
}
