"use client";

import { User } from "@/types/user";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Ambil data user dari localStorage saat komponen pertama kali dimuat
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, access_token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    Cookies.set("access_token", access_token, { expires: 7 });
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    Cookies.remove("access_token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

// Custom Hook untuk mengakses Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
