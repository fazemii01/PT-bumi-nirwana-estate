"use client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Bank } from "@/types/bank";
import ActionBankCell from "@/components/bank/action-cell";

export const columns: ColumnDef<Bank>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "interest_rate",
    header: "Bunga Tahunan",
  },
  {
    accessorKey: "max_tenure",
    header: "Maks Tenor",
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const file = row.original.logo;
      return file ? <Image src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/banks/${file}`} alt="logo" className="h-10 w-10 rounded-full object-cover border" width={30} height={30} /> : "Tidak ada logo";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionBankCell bank={row.original} />,
  },
];
