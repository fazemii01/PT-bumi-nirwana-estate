"use server";

import {
  addBuildingProperty,
  deleteBuildingPropertyById,
  getBuildingPropertyById,
} from "@/api/building_property";
import { BuildingProperty } from "@/types/building-properties";

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

export async function submitCreateBuildingProperty({
  buildingProperty,
}: {
  buildingProperty: BuildingProperty;
}) {
  try {
    const res = await addBuildingProperty({ buildingProperty });
    if (res.success) {
      return {
        success: true,
        message: "Building Property berhasil ditambahkan!",
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

export async function deleteBuildingProperty({ id }: { id: string }) {
  try {
    const res = await deleteBuildingPropertyById(id);
    if (res.success) {
      return { success: true, message: "Building Property berhasil dihapus!" };
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
