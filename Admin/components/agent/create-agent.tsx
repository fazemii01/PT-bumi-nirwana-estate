import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUpload, IconUser, IconMail, IconPhone, IconImageInPicture } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { showToastError, showToastSuccess } from "../toast";
import { Agent } from "@/types/agent";
import { submitCreateAgent } from "@/actions/agent";
import { useRouter } from "next/navigation";

const CreateAgent = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<Agent>({
    id: "",
    full_name: "",
    email: "",
    phone_number: "",
    avatar_url: "",
    file_avatar: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    return newErrors;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
      setForm((prev) => ({
        ...prev,
        file_avatar: file,
        avatar_url: file.name,
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
    setForm({
      id: "",
      full_name: "",
      email: "",
      phone_number: "",
      avatar_url: "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setOpen(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setForm((prev) => ({
      ...prev,
      file_avatar: undefined,
      avatar_url: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    startTransition(async () => {
      const res = await submitCreateAgent({ data: form });
      if (!res.success) {
        showToastError(res.message || "Failed to create agent. Please try again.");
        return;
      }
      setForm({
        id: "",
        full_name: "",
        email: "",
        phone_number: "",
        avatar_url: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setOpen(false);
      showToastSuccess(res.message || "Agent created successfully!");
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
                <IconUser className="size-5" />
              </div>
              Create New Agent
            </AlertDialogTitle>
            <AlertDialogDescription>Fill in the information below to create a new agent profile.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <IconUser className="size-4" />
                Full Name
              </Label>
              <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Enter full name" />
              {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-2">
                <IconMail className="size-4" />
                Email
              </Label>
              <Input id="email" name="email" value={form.email} onChange={handleChange} placeholder="agent@example.com" />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone_number" className="flex items-center gap-2">
                <IconPhone className="size-4" />
                Phone Number
              </Label>
              <Input id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+62 812 3456 7890" />
              {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <IconImageInPicture className="size-4" />
                Profile Image
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
                      <div className="relative w-32 h-32  overflow-hidden mb-3">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill // ganti width & height jadi fill
                          sizes="128px" // optional, biar Next tahu perkiraan ukuran
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile();
                          }}
                          className="flex  items-center justify-center bg-red-500 size-6 rounded-full absolute right-0 top-0 text-white hover:bg-red-600 cursor-pointer"
                        >
                          x
                        </button>
                      </div>
                      <div className="text-center space-y-3">
                        <p className="text-sm font-medium text-green-700 truncate max-w-48">{selectedFile.name}</p>
                        <p className="text-xs text-green-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
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
                <input ref={fileInputRef} type="file" id="input-file" name="file_avatar" className="hidden" accept="image/*" onChange={handleFileSelect} />
              </div>
              {errors.avatar && <p className="text-sm text-red-500">{errors.avatar}</p>}
            </div>
          </div>

          <AlertDialogFooter className="pt-6 border-t border-gray-200 gap-3">
            <AlertDialogCancel disabled={pending} onClick={handleCancel} className="flex-1 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            {/* <AlertDialogAction onClick={handleSubmit} disabled={pending} className="flex-1 bg-yellow-600 hover:bg-yellow-700 cursor-pointer">
              {pending ? "Submitting..." : "Create Agent"}
            </AlertDialogAction> */}
            <Button type="button" onClick={handleSubmit} disabled={pending} className="flex-1 cursor-pointer">
              {pending ? "Submitting..." : "Create Agent"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateAgent;
