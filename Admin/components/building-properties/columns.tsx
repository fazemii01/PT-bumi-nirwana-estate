"use client";

import { Building_Property } from "@/types/building-properties";
import { ColumnDef } from "@tanstack/react-table";
import ActionPropertyCell from "@/components/building-properties/action-cell";
import { formatCurrency } from "@/lib/utils";

export const columns: ColumnDef<Building_Property>[] = [
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
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatCurrency(row.original.price),
  },
  {
    accessorKey: "price_unit",
    header: "Price Unit",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionPropertyCell buildingProperty={row.original} />,
  },
];
