import api from "@/service/api";
import { Property } from "@/types/properties";

export async function getProperty(): Promise<Property[]> {
  const response = await api({
    url: "/properties",
    method: "GET",
  });
  return response.data;
}

export async function createProperty(
  data: Omit<Property, "id">
): Promise<Property> {
  try {
    const response = await api.post("/properties", data);
    return response.data;
  } catch (error: any) {
    console.error("Create property error:", error);
    throw new Error(
      error.response?.data?.message || "Gagal membuat properti baru."
    );
  }
}
