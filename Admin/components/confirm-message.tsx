import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";

const ConfirmMessage = ({ open, setOpen, data, onConfirm, isLoading }: { open: boolean; setOpen: (value: boolean) => void; data: string; onConfirm: (id: string) => void; isLoading: boolean }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen} key={data}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:size-10">
                <IconAlertTriangle className="text-red-600" />
              </div>
              <span>Are you absolutely sure?</span>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700 cursor-pointer" onClick={() => onConfirm(data)} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Spinner className="w-5 h-5 text-white" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmMessage;
