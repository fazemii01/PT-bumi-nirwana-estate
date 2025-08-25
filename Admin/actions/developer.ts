"use server";

import {
  addDeveloper,
  deleteDeveloperById,
  getDeveloper,
  updateDeveloper,
} from "@/api/developer";
import { Developer } from "@/types/developer";

export async function submitCreateDeveloper({ data }: { data: Developer }) {
  try {
    const res = await addDeveloper({ data });
    if (res.success) {
      return { success: true, message: "Developer berhasil ditambahkan!" };
    } else {
      return {
        success: false,
        message: res.error || "Gagal menambahkan developer.",
      };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitUpdateDeveloper({
  data,
  originalData,
}: {
  data: Developer;
  originalData: Developer;
}) {
  try {
    const res = await updateDeveloper({ data, originalData });

    if (res.success) {
      return { success: true, message: "Develo berhasil diupdate!" };
    } else {
      return { success: false, message: res.error || "Gagal update Develo." };
    }
  } catch (err) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function deleteDeveloper({ id }: { id: string }) {
  try {
    const res = await deleteDeveloperById({ id });
    if (res.success) {
      return { success: true, message: "Developer berhasil dihapus!" };
    } else {
      return {
        success: false,
        message: res.error || "Gagal menghapus developer.",
      };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
