import { apiFetch } from "@/service/api";
import { NewsCategory } from "./../types/news";
import { ApiResponse } from "@/types/api-response";

export async function getNewsCategory(): Promise<ApiResponse<NewsCategory[]>> {
  return await apiFetch<NewsCategory[]>("/news-category", {
    method: "GET",
  });
}
export async function createNewsCategory({ category }: { category: NewsCategory }) {

  return await apiFetch<ApiResponse<NewsCategory>>("/news-category", {
    method: "POST",
    body: JSON.stringify({ name: category.name }),
  });
}

export async function updateNewsCategory(category: NewsCategory): Promise<ApiResponse<NewsCategory>> {
  return await apiFetch<NewsCategory>(`/news-category/${category.id}`, {
    method: "PATCH",
    body: JSON.stringify({ name: category.name }),
  });
}

export async function removeNewsCategory(id: string): Promise<ApiResponse<NewsCategory | null>> {
  return await apiFetch<NewsCategory>(`/news-category/${id}`, {
    method: "DELETE",
  });
}
