// app/signup/page.tsx
export const metadata = {
  title: "Sign Up – Acme Inc.",
  description: "Create your account to get started.",
}

import { SignUpForm } from "@/components/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}