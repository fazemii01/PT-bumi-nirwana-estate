"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auths/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password_hash: data.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Terjadi kesalahan");
      }

      localStorage.setItem("user", JSON.stringify(responseData.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section */}
      <div className="w-full lg:w-1/3 flex flex-col pt-16 px-8 lg:px-16">
        <div className="max-w-md mx-auto w-full text-center">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-16 bg-gradient-to-br rounded-full flex items-center justify-center">
              <img src="/logo_bar.svg" alt="PT BUMI NIRWANA ESTATE" className="w-12 h-12" />
            </div>
            <span className="mt-3 text-lg font-bold text-gray-800">PT BUMI NIRWANA ESTATE</span>
          </div>

          {/* Title */}
          <h4 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h4>
          <p className="text-gray-600 mb-8">Sign in to access your estate dashboard</p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-left">{error}</div>}

            {/* Email */}
            <div className="text-left">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`mt-2 h-10 w-full ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-orange-500 focus:ring-orange-500"}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="text-left">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                placeholder="Enter your password"
                className={`mt-2 h-10 w-full ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-orange-500 focus:ring-orange-500"}`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Button */}
            <Button type="submit" disabled={isLoading} className="w-full h-12 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Spinner className="w-5 h-5 text-white" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in to Dashboard"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-gray-500 text-sm mt-12">© 2025 PT Bumi Nirwana Estate. All rights reserved.</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block lg:w-2/3 relative overflow-hidden">
        {/* Background dengan gradient overlay */}
        <img src="/bg.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute left-0 top-0 bottom-0 w-full bg-gradient-to-l from-transparent to-white z-10"></div>

        {/* Container untuk gambar bertingkat */}
      </div>
    </div>
  );
}
