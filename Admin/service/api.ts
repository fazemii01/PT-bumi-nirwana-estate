"use server";

import { cookies } from "next/headers";
import { ApiResponse } from "@/types/api-response";

async function getToken() {
  return (await cookies()).get("access_token")?.value;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = await getToken();

    // Buat headers default
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null); // kalau responsenya bukan json, jangan errorin app

    if (!response.ok) {
      // ambil pesan error dari backend kalau ada
      const message = data?.message || data?.error || `Request failed with status ${response.status}`;
      return ApiResponse.failure<T>(message);
    }

    return ApiResponse.success<T>(data as T);
  } catch (err: any) {
    return ApiResponse.failure<T>(err.message || "Unknown error");
  }
}
