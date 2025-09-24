"use client";

import { Property } from "@/types/properties";
import { ColumnDef } from "@tanstack/react-table";
import ActionPropertyCell from "@/components/properties/action-cell";
import { formatAddress, formatCurrency } from "@/lib/utils";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Property>[] = [
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
    accessorKey: "type",
    header: "Tipe Properti",
  },
  {
    accessorKey: "address",
    header: "Alamat",
    cell: ({ row }) => formatAddress(row.original.address),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionPropertyCell property={row.original} />,
  },
];
