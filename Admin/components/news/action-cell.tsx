"use client";
import { Button } from "@/components/ui/button";
import { News, NewsCategory } from "@/types/news";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconEdit, IconImageInPicture, IconTrash } from "@tabler/icons-react";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { submitDeleteNews } from "@/actions/news";
import { showToastError, showToastSuccess } from "@/components/toast";
import { useRouter } from "next/navigation";
import ConfirmMessage from "@/components/confirm-message";
import EditNews from "@/components/news/form-edit-news";
import { Property } from "@/types/properties";
import { ShowNewsImg } from "@/components/news/show-image";

const ActionNewsCell = ({ news, newsCategory, properties }: { news: News; newsCategory: NewsCategory[]; properties: Property[] }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showImg, setShowImg] = useState(false);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const res = await submitDeleteNews({ id });
    if (!res.success) {
      showToastError(res.message || "Gagal menghapus berita.");
      setOpen(false);
    }
    setIsLoading(false);
    setOpen(false);
    showToastSuccess("Delete news successfull");
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
          <DropdownMenuItem className="cursor-pointer" onClick={() => setShowImg(true)}>
            <IconImageInPicture />
            Gambar
          </DropdownMenuItem>
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
      <ConfirmMessage open={open} setOpen={setOpen} data={news.id} onConfirm={handleDelete} isLoading={isLoading} />
      <EditNews open={edit} setOpen={setEdit} news={news} newsCategory={newsCategory} properties={properties} />
      <ShowNewsImg news={news} open={showImg} setOpen={setShowImg} />
    </>
  );
};

export default ActionNewsCell;
