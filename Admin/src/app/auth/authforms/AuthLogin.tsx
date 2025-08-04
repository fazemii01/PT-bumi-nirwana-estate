"use client";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useState } from "react";

export default function AuthLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auths/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password_hash: password }),
        }
      );

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      console.log("Token:", data.access_token);

      localStorage.setItem("access_token", data.access_token);

      setError("");
      // redirect jika berhasil login
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div className="mb-4">
        <Label htmlFor="Username" value="Username" className="mb-2 block" />
        <TextInput
          id="Username"
          type="email"
          sizing="md"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="userpwd" value="Password" className="mb-2 block" />
        <TextInput
          id="userpwd"
          type="password"
          sizing="md"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex justify-between my-5">
        <div className="flex items-center gap-2">
          <Checkbox id="accept" />
          <Label
            htmlFor="accept"
            className="opacity-90 font-normal cursor-pointer"
          >
            Remember this Device
          </Label>
        </div>
        <Link href="/" className="text-primary text-sm font-medium">
          Forgot Password?
        </Link>
      </div>

      <Button color="primary" type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
}
