"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconUpload,
  IconImageInPicture,
  IconBuildingSkyscraper,
  IconBrandChrome,
} from "@tabler/icons-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Developer } from "@/types/developer";
import { showToastError, showToastSuccess } from "../toast";
import { submitCreateDeveloper } from "@/actions/developer";
import { useRouter } from "next/navigation";

const CreateDeveloper = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState<Developer>({
    id: "",
    name: "",
    website_url: "",
    logo_url: "",
    file_logo: undefined,
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
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

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    setForm({
      id: "",
      name: "",
      website_url: "",
      logo_url: "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setOpen(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    startTransition(async () => {
      const res = await submitCreateDeveloper({ data: form });
      if (!res.success) {
        showToastError(res.message || "failed create developer");
        setOpen(true);
      }
      setForm({
        id: "",
        name: "",
        website_url: "",
        logo_url: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setOpen(false);
      showToastSuccess(res.message || "Create developer successful");
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
                <IconBuildingSkyscraper className="size-5" />
              </div>
              Create New Developer
            </AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the information below to create a new agent profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-5">
            {/* name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-2">
                <IconBuildingSkyscraper />
                Developer Name
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter developer name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Web URL */}
            <div className="space-y-1.5">
              <Label htmlFor="website_url" className="flex items-center gap-2">
                <IconBrandChrome />
                Webesite URL
              </Label>
              <Input
                id="website_url"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                placeholder="https://example.my.id"
              />
              {errors.website_url && (
                <p className="text-sm text-red-500">{errors.website_url}</p>
              )}
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <IconImageInPicture />
                Developer Logo
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
                <label
                  htmlFor="input-file"
                  className="flex flex-col items-center justify-center p-8 cursor-pointer"
                >
                  {selectedFile && previewUrl ? (
                    <>
                      <div className="text-center space-y-3">
                        {/* Image Preview */}
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-lg border-2 border-border/30 dark:border-white/30 shadow-lg backdrop-blur-sm"
                          />
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

                        {/* File Info */}
                        <div>
                          <p className="text-sm font-medium text-foreground/90 dark:text-white/90 truncate max-w-48">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground/70 dark:text-white/70">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground/60 dark:text-white/60">
                          Click to change image
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <div
                        className={`p-3 rounded-full w-fit mx-auto transition-colors backdrop-blur-sm ${
                          dragActive
                            ? "bg-blue-500/30 dark:bg-blue-400/30"
                            : "bg-muted/20 dark:bg-white/20"
                        }`}
                      >
                        <IconUpload
                          className={`size-6 ${
                            dragActive
                              ? "text-blue-600 dark:text-blue-300"
                              : "text-muted-foreground/70 dark:text-white/70"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground/90 dark:text-white/90">
                          {dragActive
                            ? "Drop your image here"
                            : "Upload Logo Image"}
                        </p>
                        <p className="text-xs text-muted-foreground/70 dark:text-white/70 mt-1">
                          Drag & drop or click to browse
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground/50 dark:text-white/50">
                        PNG, JPG, GIF up to 4MB
                      </p>
                    </div>
                  )}
                </label>
                <Input
                  type="file"
                  id="input-file"
                  name="file_logo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
              {errors.logo && (
                <p className="text-sm text-red-500 dark:text-red-500 backdrop-blur-sm">
                  {errors.logo}
                </p>
              )}
            </div>
          </div>
          <AlertDialogFooter className="pt-6 border-t border-gray-200 gap-3">
            <AlertDialogCancel
              className="flex-1 cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={pending}
              className="flex-1 cursor-pointer"
            >
              {pending ? "Submitting..." : "Create Developer"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateDeveloper;
