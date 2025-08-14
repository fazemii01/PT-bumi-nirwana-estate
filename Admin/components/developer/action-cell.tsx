"use client";
import { Developer } from "@/types/developer";
import { useState } from "react";
import { showToastError, showToastSuccess } from "../toast";
import { deleteDeveloper } from "@/api/developer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmMessage from "@/components/confirm-message";
import EditDeveloper from "@/components/developer/edit-developer";

const ActionDeveloperCell = ({ developer }: { developer: Developer }) => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const handleDelete = async (id: string) => {
    try {
      await deleteDeveloper({ id });
      setOpen(false);
      showToastSuccess("Delete developer successful");
    } catch (error) {
      showToastError(`${error}`);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-8 cursor-pointer">
            <span className="sr-only">Action Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setEdit(true)}
          >
            <IconEdit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <IconTrash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmMessage
        open={open}
        setOpen={setOpen}
        data={developer.id}
        onConfirm={handleDelete}
      />
      <EditDeveloper edit={edit} setEdit={setEdit} developer={developer} />
    </>
  );
};

export default ActionDeveloperCell;
