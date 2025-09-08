"use server";

import { addNews, deleteNews, updateNews } from "@/api/news";
import { News } from "@/types/news";

export async function submitCreateNews({ data }: { data: News }) {
  try {
    const res = await addNews({ news: data });
    if (res.success) {
      return { success: true, message: "Berita berhasil ditambahkan!" };
    } else {
      return { success: false, message: res.error || "Gagal menambahkan berita." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
export async function submitUpdateNews({ data, originalData }: { data: News; originalData: News }) {
  try {
    const res = await updateNews({ news: data, originalData: originalData });
    if (res.success) {
      return { success: true, message: "Berita berhasil diperbarui!" };
    } else {
      return { success: false, message: res.error || "Gagal memperbarui berita." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
export async function submitDeleteNews({ id }: { id: string }) {
  try {
    const res = await deleteNews({ id: id });
    if (res.success) {
      return { success: true, message: "Berita berhasil dihapus!" };
    } else {
      return { success: false, message: res.error || "Gagal menghapus berita." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
