import { submitCreateImages, submitCreateSitePlan } from "@/actions/property";
import { showToastError, showToastSuccess } from "@/components/toast";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { CreateImagesPropertyZod, CreateSitePlanPropertyZod } from "@/lib/zod";
import { CreateSitePlanProperty } from "@/types/properties";
import { Image, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { set } from "zod";

const CreateSitePlanModal = ({ open, setOpen, propertyId, name }: { open: boolean; setOpen: (value: boolean) => void; propertyId: string; name: string }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<CreateSitePlanProperty>({
    site_plans: [],
    property_site_plans: [],
  });

  const handleMultipleImageUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    const newSitePlan = fileArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: "",
    }));

    setFormData((prev) => ({
      ...prev,
      site_plans: [...prev.site_plans, ...newSitePlan],
      property_site_plans: [...prev.property_site_plans, ...fileArray],
    }));
  };

  const updateImageCaption = (index: number, name: string) => {
    setFormData((prev) => {
      const updated = [...prev.site_plans];
      updated[index].name = name;
      return { ...prev, site_plans: updated };
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updatedSitePlans = prev.site_plans.filter((_, i) => i !== index);
      const updatedFiles = (prev.property_site_plans || []).filter((_, i) => i !== index);
      return { ...prev, site_plans: updatedSitePlans, property_images: updatedFiles };
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = CreateSitePlanPropertyZod.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      setError({
        [firstError.path[0]]: firstError.message,
      });
      return;
    }
    setError({});

    startTransition(async () => {
      const res = await submitCreateSitePlan({ site: formData, propertyId: propertyId });

      if (!res.success) {
        showToastError(res.message || "Failed new data site plan");
        return;
      }
      setTimeout(() => {
        setOpen(false);
        showToastSuccess(res.message || "Site plan created successfully!");
        router.refresh();
      }, 1000);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <div className="p-2 rounded-full">
                <Image className="size-5" />
              </div>
              Properti {name}
            </AlertDialogTitle>
            <AlertDialogDescription>Isi informasi di bawah ini untuk menambahkan denah lokasi baru.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-5">
            {/* News Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Image className="size-4" />
                Gambar Denah Lokasi
              </Label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-[200px] flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Upload gambar</p>
                <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleImageUpload(e.target.files!)} className="hidden" id="image-upload" />
                <Button type="button" variant="outline" className="cursor-pointer" onClick={() => document.getElementById("image-upload")!.click()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Gambar
                </Button>
              </div>
              {error.property_site_plans && <span className="text-red-500 text-xs">{error.property_site_plans}</span>}
            </div>
          </div>
          {formData.site_plans.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Gambar yang diupload ({formData.site_plans.length})</h4>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {formData.site_plans.map((site, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                    {/* site Preview */}
                    <div className="flex-shrink-0 relative">
                      <img src={site.preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded border cursor-pointer" />
                      <div className="absolute -top-2 -right-2 ">
                        <Button type="button" variant="destructive" size="sm" className="h-6 w-6 p-0 rounded-full cursor-pointer" onClick={() => removeImage(index)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="flex-1 space-y-2">
                      <div className="text-sm text-gray-600">File: {site.file!.name}</div>
                      <div className="space-y-1">
                        <Label className="text-xs">
                          Nama <span className="text-red-600">*</span>
                        </Label>
                        <Input placeholder="Masukkan caption untuk gambar ini" value={site.name} onChange={(e) => updateImageCaption(index, e.target.value)} className="text-sm" />
                      </div>
                      {error.site_plans && <span className="text-red-500 text-xs">{error.site_plans}</span>}
                      <div className="text-xs text-gray-500">Urutan: {index + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <AlertDialogFooter className="pt-6 border-t border-gray-200 gap-3">
            <AlertDialogCancel disabled={pending} onClick={handleCancel} className="flex-1 cursor-pointer">
              Batal
            </AlertDialogCancel>
            <Button type="button" onClick={handleSubmit} disabled={pending} className="flex-1 cursor-pointer">
              {pending ? (
                <div className="flex items-center justify-center space-x-2">
                  <Spinner className="w-5 h-5 text-white" />
                </div>
              ) : (
                "Simpan"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateSitePlanModal;
