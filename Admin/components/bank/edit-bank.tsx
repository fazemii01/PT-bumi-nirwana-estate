import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUpload, IconUser, IconMail, IconPhone, IconImageInPicture, IconCashBanknote, IconBuilding, IconPercentage, IconCalendarTime } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { showToastError, showToastSuccess } from "../toast";
import { useRouter } from "next/navigation";
import { Bank } from "@/types/bank";
import { submitUpdateBank } from "@/actions/bank";
import { BankZodEdit } from "@/lib/zod";
import { getImageUrl } from "@/service/imageUrl";

const EditBank = ({ open, setOpen, bank }: { open: boolean; setOpen: (value: boolean) => void; bank: Bank }) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const imgUrl = (path: string) => getImageUrl(path);
  const [form, setForm] = useState<Bank>({
    id: bank.id,
    name: bank.name,
    interest_rate: bank.interest_rate,
    max_tenure: bank.max_tenure,
    logo: bank.logo,
    file: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (bank.logo) {
      setPreviewUrl(imgUrl(`/banks/${bank.logo}`));
    } else {
      setPreviewUrl(null);
    }
  }, [bank]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
      setForm((prev) => ({
        ...prev,
        file: file,
        logo: file.name,
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setForm((prev) => ({
      ...prev,
      file: undefined,
      logo: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    const validation = BankZodEdit.safeParse(form);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const res = await submitUpdateBank({ bank: form, originalData: bank });
      if (!res.success) {
        showToastError(res.message || "Failed to update bank. Please try again.");
        return;
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setOpen(false);
      showToastSuccess(res.message || "Bank updated successfully!");
      router.refresh();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <div className="p-2 rounded-full">
                <IconBuilding className="size-5" />
              </div>
              Update Bank
            </AlertDialogTitle>
            <AlertDialogDescription>Fill in the information below to update the bank.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-2">
                <IconBuilding className="size-4" />
                Name
              </Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter name bank" />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5">
              <Label htmlFor="interest_rate" className="flex items-center gap-2">
                <IconPercentage className="size-4" />
                Bunga Tahunan
              </Label>
              <Input id="interest_rate" name="interest_rate" type="number" value={form.interest_rate ? Math.floor(Number(form.interest_rate)) : ""} onChange={handleChange} placeholder="Masukkan bunga tahunan" />
              {errors.interest_rate && <p className="text-sm text-red-500">{errors.interest_rate}</p>}
            </div>

            {/* Max Tenure */}
            <div className="space-y-1.5">
              <Label htmlFor="max_tenure" className="flex items-center gap-2">
                <IconCalendarTime className="size-4" />
                Max Tenure
              </Label>
              <Input id="max_tenure" name="max_tenure" type="number" value={form.max_tenure} onChange={handleChange} placeholder="Masukkan max tenure" />
              {errors.max_tenure && <p className="text-sm text-red-500">{errors.max_tenure}</p>}
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <IconImageInPicture className="size-4" />
                Logo
              </Label>

              <div
                className={`relative border-2 border-dashed rounded-lg transition-all duration-200 backdrop-blur-sm ${
                  dragActive
                    ? "border-blue-400/60 bg-blue-500/20 dark:border-blue-300/60 dark:bg-blue-400/20"
                    : selectedFile
                    ? "border-green-400/60 bg-green-500/20 dark:border-green-300/60 dark:bg-green-400/20"
                    : "border-border/40 bg-background/10 hover:border-border/60 hover:bg-background/20 dark:border-white/30 dark:bg-white/10 dark:hover:border-white/50 dark:hover:bg-white/20"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <label htmlFor="input-file" className="flex flex-col items-center justify-center py-8 cursor-pointer">
                  {selectedFile && previewUrl ? (
                    <>
                      <div className="relative w-32 h-32 verflow-hidden mb-3">
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                        >
                          ×
                        </button>
                      </div>

                      <div className="text-center space-y-3">
                        <p className="text-sm font-medium text-green-700 truncate max-w-48">{selectedFile.name}</p>
                        <p className="text-xs text-green-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>

                      <p className="text-xs text-gray-500">Click to change image</p>
                    </>
                  ) : previewUrl ? (
                    <>
                      <div className="relative w-32 h-32 overflow-hidden mb-3">
                        <Image fill src={previewUrl} alt="Preview" className=" object-cover " />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile();
                          }}
                          className="absolute -right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-700 truncate max-w-48">{bank.logo}</p>
                      </div>
                      <p className="text-xs text-gray-500">Click to change image</p>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className={`p-3 rounded-full w-fit mx-auto transition-colors ${dragActive ? "bg-blue-100" : "bg-gray-200"}`}>
                        <IconUpload className={`size-6 ${dragActive ? "text-blue-600" : "text-gray-500"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{dragActive ? "Drop your image here" : "Upload profile image"}</p>
                        <p className="text-xs text-gray-500 mt-1">Drag & drop or click to browse</p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 4MB</p>
                    </div>
                  )}
                </label>
                <input ref={fileInputRef} type="file" id="input-file" name="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
              </div>
              {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
            </div>
          </div>

          <AlertDialogFooter className="pt-6 border-t border-gray-200 gap-3">
            <AlertDialogCancel disabled={pending} onClick={handleCancel} className="flex-1 cursor-pointer">
              Cancel
            </AlertDialogCancel>

            <Button type="button" onClick={handleSubmit} disabled={pending} className="flex-1 cursor-pointer">
              {pending ? "Updating..." : "Update Bank"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditBank;
