import LoginForm from "@/components/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const token = (await cookies()).get("access_token")?.value;

  if (token) {
    redirect("/dashboard");
  }
  return <LoginForm />;
};

export default Page;
