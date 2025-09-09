"use client";
import { ColumnDef } from "@tanstack/react-table";
import ActionNewsCategoryCell from "@/components/news-category/action-cell";
import { NewsCategory } from "@/types/news";

export const columns: ColumnDef<NewsCategory>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionNewsCategoryCell category={row.original} />,
  },
];
