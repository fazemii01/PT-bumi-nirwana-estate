"use client";

import { BuildingProperty } from "@/types/building-properties";
import { ColumnDef } from "@tanstack/react-table";
import ActionPropertyCell from "@/components/building-properties/action-cell";
import { formatCurrency } from "@/lib/utils";

export const columns: ColumnDef<BuildingProperty>[] = [
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
    accessorKey: "property.name",
    header: "Property",
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
