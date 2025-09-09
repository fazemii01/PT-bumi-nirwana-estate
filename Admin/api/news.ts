import { News } from "@/types/news";
import { ApiResponse } from "../types/api-response";
import { apiFetch } from "@/service/api";

export async function getNews(): Promise<ApiResponse<News[]>> {
  return await apiFetch<News[]>("/news", {
    method: "GET",
  });
}

export async function addNews({ news }: { news: News }) {
  const formData = new FormData();
  formData.append("title", news.title);
  formData.append("description", news.description);
  formData.append("categoryId", news.categoryId);
  if (!news.propertyId || news.propertyId === "null") {
    formData.append("propertyId", "null");
  } else {
    formData.append("propertyId", news.propertyId);
  }
  if (news.news_images) {
    news.news_images.forEach((file) => {
      formData.append(`news_images`, file);
    });
  }

  return await apiFetch<ApiResponse<News>>("/news", {
    method: "POST",
    body: formData,
  });
}

export async function updateNews({ news, originalData }: { news: News; originalData: News }): Promise<ApiResponse<News>> {
  const formData = new FormData();

  console.log(originalData);
  console.log(news);

  if (originalData.title !== news.title) formData.append("title", news.title);
  if (originalData.description !== news.description) formData.append("description", news.description);
  if (originalData.categoryId !== news.categoryId) formData.append("categoryId", news.categoryId);
  if (news.propertyId !== originalData.propertyId) {
    if (!news.propertyId || news.propertyId === "null") {
      formData.append("propertyId", "null");
    } else {
      formData.append("propertyId", news.propertyId);
    }
  }

  if (news.news_images) {
    news.news_images.forEach((file) => {
      formData.append("news_images", file);
    });
  }

  return await apiFetch<News>(`/news/${originalData.id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteNews({ id }: { id: string }): Promise<ApiResponse<News | null>> {
  return await apiFetch<News>(`/news/${id}`, {
    method: "DELETE",
  });
}
