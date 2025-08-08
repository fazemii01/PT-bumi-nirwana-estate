import { object, string } from "zod";

export const Agent = object({
  name: string().min(1, "Name is required"),
  email: string().min(1, "Email is required").email("please enter a valid email"),
  phone_number: string().min(10, "Phone number invalid"),
});
