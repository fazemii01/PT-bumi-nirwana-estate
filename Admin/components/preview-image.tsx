import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import { AlertDialogHeader } from "./ui/alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";

const PreviewImage = ({
  open,
  setOpen,
  image,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  image: string | null;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogCancel className="absolute top-2 right-2 rounded-full p-1 hover:bg-red-500 hover:text-white hover:cursor-pointer focus:outline-none">
          <X className="w-5 h-5" />
        </AlertDialogCancel>
        <AlertDialogHeader>
          <AlertDialogTitle>Image Preview</AlertDialogTitle>
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="object-cover w-full h-auto rounded"
            />
          ) : (
            <p>No image selected</p>
          )}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PreviewImage;
