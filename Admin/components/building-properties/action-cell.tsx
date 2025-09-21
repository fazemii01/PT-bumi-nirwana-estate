"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { IconInfoCircle, IconPencil, IconTrash } from "@tabler/icons-react";
import ConfirmMessage from "@/components/confirm-message";
import { showToastError, showToastSuccess } from "../toast";
import { Building_Property } from "@/types/building-properties";
import Link from "next/link";
import { deleteProperty } from "@/actions/property";
import { useRouter } from "next/navigation";

const ActionPropertyCell = ({
  buildingProperty,
}: {
  buildingProperty: Building_Property;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const res = await deleteProperty({ id: id });
    if (!res.success) {
      setIsLoading(false);
      showToastError(res.message || "failed delete data");
      setOpen(false);
    }
    setIsLoading(false);
    setOpen(false);
    showToastSuccess("Delete property successfull");
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
          <Link href={`/building-properties/detail/`}>
            <DropdownMenuItem className="cursor-pointer">
              <IconInfoCircle />
              Detail
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <Link href={`/building-properties/edit`}>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => e.preventDefault()} // Mencegah menu tertutup sebelum navigasi
            >
              <IconPencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          </Link>
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
        data={buildingProperty.id}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </>
  );
};

export default ActionPropertyCell;
