// src/api/auth.ts
import api from "@/service/api";
import { AuthResponse } from "@/types/user";
import { AxiosError } from "axios";

export async function login(email: string, password_hash: string): Promise<AuthResponse> {
  try {
    console.log(email, password_hash);

    const res = await api.post<AuthResponse>(
      "/auths/signin",
      {
        email,
        password_hash,
      },
      { withCredentials: true }
    );

    if (res) {
      console.log(res.data);
    }
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Login failed due to network error.");
    }
    throw new Error("An unexpected error occurred during login.");
  }
}
