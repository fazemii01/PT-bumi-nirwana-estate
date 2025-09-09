"use client";

import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmMessage from "@/components/confirm-message";
import { showToastError, showToastSuccess } from "../toast";
import { useRouter } from "next/navigation";
import { NewsCategory } from "@/types/news";
import { deleteNewsCategory } from "@/actions/news_category";
import EditNewsCategory from "@/components/news-category/edit-news-category";

const ActionNewsCategoryCell = ({ category }: { category: NewsCategory }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const res = await deleteNewsCategory(id);
    if (!res.success) {
      showToastError(res.message || "Gagal menghapus kategori berita.");
      setOpen(false);
    }
    setIsLoading(false);
    setOpen(false);
    showToastSuccess("Delete news category successfull");
    router.refresh();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setEdit(true)}>
            <IconEdit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
            <IconTrash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmMessage open={open} setOpen={setOpen} data={category.id} onConfirm={handleDelete} isLoading={isLoading} />
      <EditNewsCategory edit={edit} setEdit={setEdit} category={category} />
    </>
  );
};

export default ActionNewsCategoryCell;
