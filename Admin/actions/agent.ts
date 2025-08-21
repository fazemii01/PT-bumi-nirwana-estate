"use server";

import { addAgent, deleteAgentById, getAgent, updateAgent } from "@/api/agent";
import { Agent } from "@/types/agent";
import { revalidatePath } from "next/cache";

export async function submitCreateAgent({ data }: { data: Agent }) {
  try {
    const res = await addAgent({ data });
    if (res.success) {
      return { success: true, message: "Agent berhasil ditambahkan!" };
    } else {
      return { success: false, message: res.error || "Gagal menambahkan agent." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitUpdateAgent({ data, originalData }: { data: Agent; originalData: Agent }) {
  try {
    const res = await updateAgent({ data, originalData });

    if (res.success) {
      return { success: true, message: "Agent berhasil diupdate!" };
    } else {
      return { success: false, message: res.error || "Gagal update agent." };
    }
  } catch (err) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function deleteAgent({ id }: { id: string }) {
  try {
    const res = await deleteAgentById({ id });
    if (res.success) {
      return { success: true, message: "Agent berhasil dihapus!" };
    } else {
      return { success: false, message: res.error || "Gagal menghapus agent." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
