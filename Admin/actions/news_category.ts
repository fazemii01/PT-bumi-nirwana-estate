"use server";
import { createNewsCategory, removeNewsCategory, updateNewsCategory } from "@/api/news_category";
import { NewsCategory } from "@/types/news";

export async function submitCreateNewsCategory({ data }: { data: NewsCategory }) {
  try {
    console.log("data ", data);

    const res = await createNewsCategory({ category: data });
    if (res.success) {
      return { success: true, message: "Kategori berita berhasil ditambahkan!" };
    } else {
      return { success: false, message: res.error || "Gagal menambahkan kategori berita." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitUpdateNewsCategory(data: NewsCategory) {
  try {
    const res = await updateNewsCategory(data);

    if (res.success) {
      return { success: true, message: "Kategori berita berhasil diupdate!" };
    } else {
      return { success: false, message: res.error || "Gagal update Kategori berita." };
    }
  } catch (err) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function deleteNewsCategory(id: string) {
  try {
    const res = await removeNewsCategory(id);
    if (res.success) {
      return { success: true, message: "Kategori berita berhasil dihapus!" };
    } else {
      return { success: false, message: res.error || "Gagal menghapus Kategori berita." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
