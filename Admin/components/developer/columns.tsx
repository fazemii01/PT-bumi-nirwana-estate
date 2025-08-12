"use client";
import { Button } from "@/components/ui/button";
import { Developer } from "@/types/developer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

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
    cell: ({ row }) => {
      const developer = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(developer.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
