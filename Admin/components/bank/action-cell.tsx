"use client";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmMessage from "@/components/confirm-message";
import { showToastError, showToastSuccess } from "../toast";
import { useRouter } from "next/navigation";
import { Bank } from "@/types/bank";
import EditBank from "@/components/bank/edit-bank";
import { submitDeleteBank } from "@/actions/bank";

const ActionBankCell = ({ bank }: { bank: Bank }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const res = await submitDeleteBank({ id });
    if (!res.success) {
      showToastError(res.message || "Gagal menghapus bank.");
      setOpen(false);
    }
    setIsLoading(false);
    setOpen(false);
    showToastSuccess("Delete bank successfull");
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
      <ConfirmMessage open={open} setOpen={setOpen} data={bank.id} onConfirm={handleDelete} isLoading={isLoading} />
      <EditBank open={edit} setOpen={setEdit} bank={bank} />
    </>
  );
};

export default ActionBankCell;
