"use server";

import { addProperty, deletePropertyById, getProperty, getPropertyById, updateProperty } from "@/api/property";
import { Property } from "@/types/properties";

export async function getAll() {
  try {
    const res = await getProperty();
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return { success: false, message: res.error || "Gagal mengambil data property." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function getById({ id }: { id: string }) {
  try {
    const res = await getPropertyById({ id });
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return { success: false, message: res.error || "Gagal mengambil data property." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitCreateProperty({ property }: { property: Property }) {
  try {
    const res = await addProperty({ property });
    if (res.success) {
      return { success: true, message: "Property berhasil ditambahkan!" };
    } else {
      return { success: false, message: res.error || "Gagal menambahkan property." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitUpdateProperty({ data, originalData }: { data: Property; originalData: Property }) {
  try {
    const res = await updateProperty({ data, originalData });

    if (res.success) {
      return { success: true, message: "Property berhasil diupdate!" };
    } else {
      return { success: false, message: res.error || "Gagal update property" };
    }
  } catch (err) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function deleteProperty({ id }: { id: string }) {
  try {
    const res = await deletePropertyById(id);
    if (res.success) {
      return { success: true, message: "Property berhasil dihapus!" };
    } else {
      return { success: false, message: res.error || "Gagal menghapus property." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
