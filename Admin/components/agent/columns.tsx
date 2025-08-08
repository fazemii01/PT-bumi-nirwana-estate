"use client";

import { Agent } from "@/types/agent";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

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
    cell: ({ row }) => {
      const avatarFile = row.original.avatar_url;

      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/agent/${avatarFile}`;

      return <Image src={imageUrl} alt="avatar" className="h-10 w-10 rounded-full object-cover border" width={30} height={30} />;
    },
  },
];
