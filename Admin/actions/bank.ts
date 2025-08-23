"use server";
import { addBank } from "@/api/bank";
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
