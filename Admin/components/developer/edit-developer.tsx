import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconUpload, IconImageInPicture, IconBuildingSkyscraper, IconBrandChrome } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { showToastError, showToastSuccess } from "../toast";
import { DeveloperSchema } from "@/lib/zod";
import { set, ZodError } from "zod";
import { Developer } from "@/types/developer";
import { submitUpdateDeveloper } from "@/actions/developer";
import { useRouter } from "next/navigation";

const EditDeveloper = ({ edit, setEdit, developer }: { edit: boolean; setEdit: (value: boolean) => void; developer: Developer }) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<Developer>({
    id: developer.id ?? "",
    name: developer.name ?? "",
    website_url: developer.website_url ?? "",
    logo_url: developer.logo_url ?? "",
    file_logo: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (developer?.logo_url) {
      setPreviewUrl(`${process.env.NEXT_PUBLIC_API_URL}/uploads/developer/${developer.logo_url}`);
    } else {
      setPreviewUrl(null);
    }
  }, [developer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setForm((prev) => ({
        ...prev,
        file_logo: file,
        logo_url: file.name,
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
    setEdit(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setForm((prev) => ({
      ...prev,
      file_logo: undefined,
      logo_url: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    const result = DeveloperSchema.safeParse(form);

    if (!result.success) {
      const zodErrors: Record<string, string> = {};
      (result.error as ZodError).errors.forEach((err) => {
        if (err.path.length > 0) {
          zodErrors[err.path[0]] = err.message;
        }
      });
      setErrors(zodErrors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const res = await submitUpdateDeveloper({ data: form, originalData: developer });
      if (!res.success) {
        showToastError(res.message || "Update developer failed");
        setEdit(true);
      }
      setEdit(false);
      showToastSuccess(res.message || "Update developer successful");
      router.refresh();
    });
  };

  return (
    <AlertDialog open={edit} onOpenChange={setEdit} key={developer.id}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <div className="p-2 rounded-full">
                <IconBuildingSkyscraper className="size-5" />
              </div>
              Update Developer
            </AlertDialogTitle>
            <AlertDialogDescription>Fill in the information below to update agent profile.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-2">
                <IconBuildingSkyscraper />
                Developer Name
              </Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter developer name" />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="website_url" className="flex items-center gap-2">
                <IconBrandChrome />
                Website URL
              </Label>
              <Input id="website_url" name="website_url" value={form.website_url} onChange={handleChange} placeholder="agent@example.com" />
              {errors.website_url && <p className="text-sm text-red-500">{errors.website_url}</p>}
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <IconImageInPicture />
                Developer Logo
              </Label>

              <div
                className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
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
                          className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-600/90 dark:bg-red-400/80 dark:hover:bg-red-500/90 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors backdrop-blur-sm"
                        >
                          ×
                        </button>
                      </div>

                      <div className="text-center space-y-3">
                        <p className="text-sm font-medium text-foreground/90 dark:text-white/90 truncate max-w-48">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground/70 dark:text-white/70">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>

                      <p className="text-xs text-muted-foreground/60 dark:text-white/60">Click to change image</p>
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
                        <p className="text-sm font-medium text-green-700 truncate max-w-48">{developer.logo_url}</p>
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
              {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
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
              {pending ? "Submitting..." : "Update Agent"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditDeveloper;
