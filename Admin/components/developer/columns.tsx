"use client";

import { Developer } from "@/types/developer";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import ActionDeveloperCell from "@/components/developer/action-cell";

export const columns: ColumnDef<Developer>[] = [
  {
    accessorKey: "name",
    header: "Developer Name",
  },
  {
    accessorKey: "website_url",
    header: "WEB URL",
  },

  {
    accessorKey: "logo_url",
    header: "Logo",
    cell: ({ row }) => {
      const file = row.original.logo_url;
      return file ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/developer/${file}`}
          alt="logo"
          className="h-10 w-10 rounded-full object-cover border"
          width={30}
          height={30}
        />
      ) : (
        "Tidak ada logo"
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionDeveloperCell developer={row.original} />,
  },
];
