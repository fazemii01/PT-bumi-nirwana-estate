"use client";
import { Agent } from "@/types/agent";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmMessage from "@/components/confirm-message";
import { showToastError, showToastSuccess } from "../toast";
import EditAgent from "./edit-agent";
import { deleteAgent } from "@/actions/agent";

const ActionAgentCell = ({ agent }: { agent: Agent }) => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const handleDelete = async (id: string) => {
    const res = await deleteAgent({ id });
    if (!res.success) {
      showToastError(res.message || "Gagal menghapus agent.");
      setOpen(false);
    }
    setOpen(false);
    showToastSuccess("Delete agent successfull");
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
      <ConfirmMessage open={open} setOpen={setOpen} data={agent.id} onConfirm={handleDelete} />
      <EditAgent edit={edit} setEdit={setEdit} agent={agent} />
    </>
  );
};

export default ActionAgentCell;
