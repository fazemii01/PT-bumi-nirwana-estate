import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IconUpload, IconNews, IconMail, IconCategory, IconImageInPicture } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { showToastError, showToastSuccess } from "../toast";
import { submitCreateNews } from "@/actions/news";
import { useRouter } from "next/navigation";
import { News, NewsCategory } from "@/types/news";
import { z } from "zod";
import { NewsZod } from "@/lib/zod";
import PreviewImage from "@/components/preview-image";
import { Property } from "@/types/properties";

interface CreateNewsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  newsCategory?: NewsCategory[];
  properties?: Property[];
}

const CreateNews = ({ open, setOpen, newsCategory = [], properties = [] }: CreateNewsProps) => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [form, setForm] = useState<News>({
    id: "",
    title: "",
    description: "",
    categoryId: "",
    propertyId: "",
    news_images: [],
    newsImages: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenPreview(true);
  };

  const validate = (): Record<string, string> => {
    const validationErrors: Record<string, string> = {};
    try {
      NewsZod.parse({
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        newsImages: selectedFiles,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          validationErrors[field] = err.message;
        });
      }
    }

    return validationErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
      const urls = newFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [...prev, ...urls]);

      setForm((prev) => ({
        ...prev,
        news_images: [...(prev.news_images || []), ...newFiles],
      }));

      if (errors.news_images) {
        setErrors((prev) => ({ ...prev, news_images: "" }));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
      const urls = newFiles.map((file) => URL.createObjectURL(file));

      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [...prev, ...urls]);

      setForm((prev) => ({
        ...prev,
        news_images: [...(prev.news_images || []), ...newFiles],
      }));

      if (errors.news_images) {
        setErrors((prev) => ({ ...prev, news_images: "" }));
      }
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
      title: "",
      description: "",
      categoryId: "",
      propertyId: "",
      news_images: [],
      newsImages: undefined,
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setErrors({});
    setOpen(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    setForm((prev) => ({
      ...prev,
      news_images: prev.news_images?.filter((_, i) => i !== index) || [],
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
      try {
        const res = await submitCreateNews({ data: form });
        if (!res.success) {
          showToastError(res.message || "Gagal menambahkan berita. Silakan coba lagi.");
          return;
        }
        setForm({
          id: "",
          title: "",
          description: "",
          categoryId: "",
          propertyId: "",
          news_images: [],
          newsImages: undefined,
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        setErrors({});
        setOpen(false);
        showToastSuccess(res.message || "Berita berhasil ditambahkan!");
        router.refresh();
      } catch (error) {
        showToastError("Terjadi kesalahan pada server.");
      }
    });
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <AlertDialogHeader className="space-y-3">
              <AlertDialogTitle className="text-2xl font-semibold flex items-center gap-2">
                <div className="p-2 rounded-full">
                  <IconNews className="size-5" />
                </div>
                Buat Berita Baru
              </AlertDialogTitle>
              <AlertDialogDescription>Isi informasi di bawah ini untuk membuat berita baru.</AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <IconNews className="size-4" />
                  Judul Berita
                </Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Masukkan judul berita" />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="categoryId" className="flex items-center gap-2">
                  <IconCategory className="size-4" />
                  Kategori Berita
                </Label>
                <Select value={form.categoryId} onValueChange={(value) => handleSelectChange("categoryId", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kategori berita" />
                  </SelectTrigger>
                  <SelectContent>
                    {newsCategory.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propertyId" className="flex items-center gap-2">
                  <IconCategory className="size-4" />
                  Properti (Optional)
                </Label>
                <Select value={form.propertyId} onValueChange={(value) => handleSelectChange("propertyId", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih properti" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyId && <p className="text-sm text-red-500">{errors.propertyId}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <IconMail className="size-4" />
                  Deskripsi
                </Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Masukkan deskripsi berita" rows={4} />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* News Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <IconImageInPicture className="size-4" />
                  Gambar Berita
                </Label>

                <div
                  className={`relative border-2 border-dashed rounded-lg transition-all duration-200 backdrop-blur-sm ${
                    dragActive
                      ? "border-blue-400/60 bg-blue-500/20 dark:border-blue-300/60 dark:bg-blue-400/20"
                      : selectedFiles.length > 0
                      ? "border-green-400/60 bg-green-500/20 dark:border-green-300/60 dark:bg-green-400/20"
                      : "border-border/40 bg-background/10 hover:border-border/60 hover:bg-background/20 dark:border-white/30 dark:bg-white/10 dark:hover:border-white/50 dark:hover:bg-white/20"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <label htmlFor="input-file" className="flex flex-col items-center justify-center py-8 cursor-pointer">
                    <div className="text-center space-y-2">
                      <div className={`p-3 rounded-full w-fit mx-auto transition-colors ${dragActive ? "bg-blue-100" : "bg-gray-200"}`}>
                        <IconUpload className={`size-6 ${dragActive ? "text-blue-600" : "text-gray-500"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{dragActive ? "Lepas gambar di sini" : "Upload gambar berita"}</p>
                        <p className="text-xs text-gray-500 mt-1">Drag & drop atau klik untuk browse (Multiple files)</p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF hingga 4MB per file</p>
                      {selectedFiles.length > 0 && <p className="text-xs text-green-600 font-medium">{selectedFiles.length} file(s) dipilih</p>}
                    </div>
                  </label>
                  <input ref={fileInputRef} type="file" id="input-file" name="newsImages" className="hidden" accept="image/*" multiple onChange={handleFileSelect} />
                </div>

                {/* Preview Images */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Gambar yang diupload ({selectedFiles.length}):</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleImagePreview(previewUrls[index])}>
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                                <Image src={previewUrls[index]} alt={`Preview ${index + 1}`} width={32} height={32} className="object-cover w-full h-full" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFile(index);
                            }}
                            className="flex-shrink-0 ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            title="Hapus gambar"
                          >
                            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.newsImages && <p className="text-sm text-red-500">{errors.newsImages}</p>}
              </div>
            </div>

            <AlertDialogFooter className="pt-6 border-t border-gray-200 gap-3">
              <AlertDialogCancel disabled={pending} onClick={handleCancel} className="flex-1 cursor-pointer">
                Batal
              </AlertDialogCancel>
              <Button type="button" onClick={handleSubmit} disabled={pending} className="flex-1 cursor-pointer">
                {pending ? "Mengirim..." : "Buat Berita"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
      <PreviewImage open={openPreview} setOpen={setOpenPreview} image={selectedImage} />
    </>
  );
};

export default CreateNews;
