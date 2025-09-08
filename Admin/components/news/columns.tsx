import { ColumnDef } from "@tanstack/react-table";
import { News } from "@/types/news";
import ActionNewsCell from "@/components/news/action-cell";

export const createColumns = (newsCategory: any[], properties: any[]): ColumnDef<News>[] => [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    accessorKey: "newsCategory",
    header: "Kategori berita",
    cell: ({ row }) => {
      return row.original.newsCategory?.name;
    },
  },
  {
    accessorKey: "property",
    header: "Properti terkait",
    cell: ({ row }) => {
      return row.original.property?.name ?? "Tidak ada properti terkait";
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionNewsCell news={row.original} newsCategory={newsCategory} properties={properties} />,
  },
];
