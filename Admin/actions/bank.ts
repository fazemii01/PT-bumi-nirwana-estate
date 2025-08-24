"use server";
import { addBank, deleteBank, updateBank } from "@/api/bank";
import { Bank } from "@/types/bank";

export async function submitCreateBank({ bank }: { bank: Bank }) {
  try {
    const res = await addBank({ bank });
    if (res.success) {
      return { success: true, message: "Bank berhasil ditambahkan!" };
    } else {
      return { success: false, message: res.error || "Gagal menambahkan bank." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitUpdateBank({ bank, originalData }: { bank: Bank; originalData: Bank }) {
  try {
    const res = await updateBank({ bank, originalData });
    if (res.success) {
      return { success: true, message: "Bank berhasil diupdate!" };
    } else {
      return { success: false, message: res.error || "Gagal mengupdate bank." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitDeleteBank({ id }: { id: string }) {
  try {
    const res = await deleteBank({ id });
    if (res.success) {
      return { success: true, message: "Bank berhasil dihapus!" };
    } else {
      return { success: false, message: res.error || "Gagal menghapus bank." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
