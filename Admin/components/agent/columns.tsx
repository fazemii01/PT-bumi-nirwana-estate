import { Agent } from "@/types/agent";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    accessorKey: "avatar_url",
    header: "Avatar",
  },
];
