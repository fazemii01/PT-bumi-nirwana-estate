"use client";
import { Agent } from "@/types/agent";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import ActionAgentCell from "@/components/agent/action-cell";

export const columns: ColumnDef<Agent>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
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
      const file = row.original.avatar_url;
      return file ? <Image src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/agent/${file}`} alt="avatar" className="h-10 w-10 rounded-full object-cover border" width={30} height={30} /> : "Tidak ada avatar";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionAgentCell agent={row.original} />,
  },
];
