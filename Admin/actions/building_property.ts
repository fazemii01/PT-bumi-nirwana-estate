"use server";

import { addBuildingProperty, deleteBuildingPropertyById, getBuildingPropertyById, updateBuildingProperty } from "@/api/building_property";
import { BuildingProperty } from "@/types/building-properties";
import { revalidatePath } from "next/cache";

export async function getById({ id }: { id: string }) {
  try {
    const res = await getBuildingPropertyById({ id });
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.error || "Gagal mengambil data property.",
      };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitCreateBuildingProperty({ buildingProperty }: { buildingProperty: BuildingProperty }) {
  try {
    const res = await addBuildingProperty({ buildingProperty });
    if (res.success) {
      console.log("RESPONSE", res.data);
      return {
        success: true,
        message: "Building Property berhasil ditambahkan!",
        propertyId: res.data?.property?.id || null,
      };
    } else {
      return {
        success: false,
        message: res.error || "Gagal menambahkan Building property.",
      };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitUpdateBuildingProperty({ data, originalData }: { data: BuildingProperty; originalData: BuildingProperty }) {
  try {
    const res = await updateBuildingProperty({ data, originalData });

    if (res.success) {
      return {
        success: true,
        message: "Bangunan berhasil diupdate!",
        propertyId: res.data?.property?.id || null,
      };
    } else {
      return { success: false, message: res.error || "Gagal update Bangunan" };
    }
  } catch (err) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function deleteBuildingProperty({ id }: { id: string }) {
  try {
    const res = await deleteBuildingPropertyById(id);
    if (res.success) {
      return {
        success: true,
        message: "Building Property berhasil dihapus!",
      };
    } else {
      return {
        success: false,
        message: res.error || "Gagal menghapus Building Property.",
      };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
