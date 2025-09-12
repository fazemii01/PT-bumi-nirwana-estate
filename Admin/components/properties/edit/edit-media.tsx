"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Plus, Trash2, Camera } from "lucide-react";
import PreviewImage from "@/components/preview-image";
import { FloorPlan, ImageProperty } from "@/types/properties";
import { getImageUrl } from "@/service/imageUrl";

export default function EditMediaForm({
  // media lama
  originalImages,
  originalFloorPlans,
  // antrian file baru
  newImageFiles,
  setNewImageFiles,
  newFloorFiles,
  setNewFloorFiles,
  // meta untuk file baru (sejajar index file)
  imagesMeta,
  setImagesMeta,
  floorPlansMeta,
  setFloorPlansMeta,
  // optional error map dari zod/FE
  error = {},
  // optional delete per item lama (kalau mau support hapus item tunggal)
  onDeleteOldImage,
  onDeleteOldFloorPlan,
  // opsional untuk resolve path -> URL (misal prepend baseURL)
  resolveUrl,
}: {
  originalImages?: ImageProperty[];
  originalFloorPlans?: FloorPlan[];
  newImageFiles: File[];
  setNewImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  newFloorFiles: File[];
  setNewFloorFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imagesMeta: Array<{ caption?: string; sort_order?: number }>;
  setImagesMeta: React.Dispatch<
    React.SetStateAction<Array<{ caption?: string; sort_order?: number }>>
  >;
  floorPlansMeta: Array<{ name?: string; sort_order?: number }>;
  setFloorPlansMeta: React.Dispatch<
    React.SetStateAction<Array<{ name?: string; sort_order?: number }>>
  >;
  error?: Record<string, string>;
  onDeleteOldImage?: (id: string) => Promise<void>;
  onDeleteOldFloorPlan?: (id: string) => Promise<void>;
  resolveUrl?: (pathOrUrl?: string) => string;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const imgUrl = (path: string) => getImageUrl(path);
  const openPreview = (src?: string) => {
    if (!src) return;
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  return (
    <>
      <TabsContent value="media">
        <div className="space-y-6">
          {/* Info bar */}
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Mengupload media baru akan <b>mengganti semua media lama</b> untuk
              tipe tersebut. Jika tidak upload apa pun, media lama tetap
              dipakai.
            </p>
          </div>

          {/* Layout 2 kolom: Images & Floor Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ======================= IMAGES ======================= */}
            <Card>
              <CardHeader>
                <CardTitle>Gambar Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing images */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">
                    Gambar lama ({originalImages!.length})
                  </h4>
                  {originalImages!.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto pr-2">
                      {originalImages!.map((img, i) => {
                        return (
                          <div
                            key={img.id ?? i}
                            className="border rounded-lg p-2 bg-gray-50 space-y-2"
                          >
                            <div className="w-full aspect-square bg-white border rounded flex items-center justify-center overflow-hidden">
                              {img.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={imgUrl(
                                    `property/property_images/${img.image_url}`
                                  )}
                                  alt={`image-${i}`}
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() =>
                                    openPreview(
                                      imgUrl(
                                        `property/property_images/${img.image_url}`
                                      )
                                    )
                                  }
                                />
                              ) : (
                                <div className="text-xs text-gray-500">
                                  (No preview)
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {img.caption ?? "—"}
                            </div>
                            {onDeleteOldImage && img.id && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => onDeleteOldImage(img.id!)}
                              >
                                Hapus
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Tidak ada gambar lama.
                    </div>
                  )}
                </div>

                {/* Upload area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-[200px] flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload gambar property satu per satu atau multi-select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (!files.length) return;
                      setNewImageFiles((prev) => [...prev, ...files]);
                      setImagesMeta((prev) => [
                        ...prev,
                        ...files.map((_, k) => ({
                          caption: "",
                          sort_order: prev.length + k,
                        })),
                      ]);
                      e.currentTarget.value = "";
                    }}
                    className="hidden"
                    id="image-upload-edit"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() =>
                      document.getElementById("image-upload-edit")?.click()
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Gambar
                  </Button>
                </div>
                {error["property_images"] && (
                  <span className="text-red-500 text-xs">
                    {error["property_images"]}
                  </span>
                )}

                {/* New images queue */}
                {newImageFiles.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-700">
                      Gambar baru ({newImageFiles.length})
                    </h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {newImageFiles.map((file, index) => {
                        const blobUrl = URL.createObjectURL(file);
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50"
                          >
                            {/* Preview */}
                            <div className="flex-shrink-0 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={blobUrl}
                                alt={`Preview ${index + 1}`}
                                className="w-20 h-20 object-cover rounded border cursor-pointer"
                                onClick={() => openPreview(blobUrl)}
                              />
                              <div className="absolute -top-2 -right-2 ">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="h-6 w-6 p-0 rounded-full cursor-pointer"
                                  onClick={() => {
                                    setNewImageFiles((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                    setImagesMeta((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="flex-1 space-y-2">
                              <div className="text-sm text-gray-600">
                                File: {file.name}
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">
                                    Caption (Opsional)
                                  </Label>
                                  <Input
                                    placeholder="Masukkan caption"
                                    value={imagesMeta[index]?.caption ?? ""}
                                    onChange={(e) =>
                                      setImagesMeta((prev) => {
                                        const next = [...prev];
                                        next[index] = {
                                          ...(next[index] ?? {}),
                                          caption: e.target.value,
                                        };
                                        return next;
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">
                                    Urutan (Integer)
                                  </Label>
                                  <Input
                                    type="number"
                                    value={
                                      imagesMeta[index]?.sort_order ?? index
                                    }
                                    onChange={(e) =>
                                      setImagesMeta((prev) => {
                                        const next = [...prev];
                                        next[index] = {
                                          ...(next[index] ?? {}),
                                          sort_order: Number(e.target.value),
                                        };
                                        return next;
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ===================== FLOOR PLANS ===================== */}
            <Card>
              <CardHeader>
                <CardTitle>Denah Lantai</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing floor plans */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">
                    Denah lama ({originalFloorPlans!.length})
                  </h4>
                  {originalFloorPlans!.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto pr-2">
                      {originalFloorPlans!.map((fp, i) => {
                        // const src = rurl(fp.url || fp.file_url);
                        const isImage = fp.file_url
                          ? /\.(png|jpe?g|webp|gif|bmp)$/i.test(fp.file_url)
                          : false;
                        return (
                          <div
                            key={fp.id ?? i}
                            className="border rounded-lg p-2 bg-gray-50 space-y-2"
                          >
                            <div className="w-full aspect-square bg-white border rounded flex items-center justify-center overflow-hidden">
                              {fp.file_url ? (
                                isImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={imgUrl(
                                      `property/property_floor_plans/${fp.file_url}`
                                    )}
                                    alt={`fp-${i}`}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() =>
                                      openPreview(
                                        imgUrl(
                                          `property/property_floor_plans/${fp.file_url}`
                                        )
                                      )
                                    }
                                  />
                                ) : (
                                  <div className="text-xs text-gray-500 text-center">
                                    <div>PDF</div>
                                    <div className="font-medium">📄</div>
                                  </div>
                                )
                              ) : (
                                <div className="text-xs text-gray-500">
                                  (No preview)
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {fp.name ?? "—"}
                            </div>
                            {onDeleteOldFloorPlan && fp.id && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => onDeleteOldFloorPlan(fp.id!)}
                              >
                                Hapus
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Tidak ada denah lama.
                    </div>
                  )}
                </div>

                {/* Upload area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-[200px] flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload denah lantai satu per satu atau multi-select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (!files.length) return;
                      setNewFloorFiles((prev) => [...prev, ...files]);
                      setFloorPlansMeta((prev) => [
                        ...prev,
                        ...files.map((_, k) => ({
                          name: `Floor Plan ${prev.length + k + 1}`,
                          sort_order: prev.length + k,
                        })),
                      ]);
                      e.currentTarget.value = "";
                    }}
                    className="hidden"
                    id="floorplan-upload-edit"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() =>
                      document.getElementById("floorplan-upload-edit")?.click()
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Denah
                  </Button>
                </div>
                {error["property_floor_plans"] && (
                  <span className="text-red-500 text-xs">
                    {error["property_floor_plans"]}
                  </span>
                )}

                {/* New floor plans queue */}
                {newFloorFiles.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-700">
                      Denah baru ({newFloorFiles.length})
                    </h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {newFloorFiles.map((file, index) => {
                        const isImg = file.type.startsWith("image/");
                        const blobUrl = isImg
                          ? URL.createObjectURL(file)
                          : undefined;
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50"
                          >
                            {/* Preview */}
                            <div className="flex-shrink-0 relative">
                              <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                                {isImg ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={blobUrl}
                                    alt="Floor plan"
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => openPreview(blobUrl!)}
                                  />
                                ) : (
                                  <div className="text-xs text-gray-500 text-center">
                                    <div>PDF</div>
                                    <div className="font-medium">📄</div>
                                  </div>
                                )}
                              </div>
                              <div className="absolute -top-2 -right-2">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="h-6 w-6 p-0 rounded-full cursor-pointer"
                                  onClick={() => {
                                    setNewFloorFiles((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                    setFloorPlansMeta((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="flex-1 space-y-2">
                              <div className="text-sm text-gray-600">
                                File: {file.name}
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">Nama Denah</Label>
                                  <Input
                                    placeholder="Nama denah (Lantai 1, Tipe A)"
                                    value={
                                      floorPlansMeta[index]?.name ??
                                      `Floor Plan ${index + 1}`
                                    }
                                    onChange={(e) =>
                                      setFloorPlansMeta((prev) => {
                                        const next = [...prev];
                                        next[index] = {
                                          ...(next[index] ?? {}),
                                          name: e.target.value,
                                        };
                                        return next;
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">
                                    Urutan (Integer)
                                  </Label>
                                  <Input
                                    type="number"
                                    value={
                                      floorPlansMeta[index]?.sort_order ?? index
                                    }
                                    onChange={(e) =>
                                      setFloorPlansMeta((prev) => {
                                        const next = [...prev];
                                        next[index] = {
                                          ...(next[index] ?? {}),
                                          sort_order: Number(e.target.value),
                                        };
                                        return next;
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      {/* Modal preview */}
      <PreviewImage
        open={previewOpen}
        setOpen={setPreviewOpen}
        image={previewSrc}
      />
    </>
  );
}
