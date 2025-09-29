import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2, Upload } from "lucide-react";
import { BuildingImage, BuildingProperty } from "@/types/building-properties";
import { useState } from "react";
import PreviewImage from "@/components/preview-image";

type MediaFormBuilds = {
  formData: BuildingProperty;
  handleSingleImageUpload: (file: File) => void;
  updateImageCaption: (index: number, caption: string) => void;
  removeImage: (index: number) => void;

  handleSingleFloorPlanUpload: (file: File) => void;
  updateFloorPlanName: (index: number, name: string) => void;
  removeFloorPlan: (index: number) => void;

  handleSingleKPRUpload: (file: File) => void;
  removeKPRRules: (index: number) => void;

  error?: { [key: string]: string };
};

export default function MediaForm({
  formData,
  handleSingleImageUpload,
  updateImageCaption,
  removeImage,
  handleSingleFloorPlanUpload,
  updateFloorPlanName,
  removeFloorPlan,
  handleSingleKPRUpload,
  removeKPRRules,
  error = {},
}: MediaFormBuilds) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };
  return (
    <>
      <TabsContent value="media">
        <div className="space-y-6">
          {/* Layout Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Images Section */}
            <Card>
              <CardHeader>
                <CardTitle>Gambar Bangunan Properti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area - Fixed Height */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-[200px] flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Upload gambar bangunan satu per satu</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files![0]) {
                        handleSingleImageUpload(e.target.files![0]);
                        e.target.value = ""; // Reset input
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button type="button" variant="outline" className="cursor-pointer" onClick={() => document.getElementById("image-upload")!.click()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Gambar
                  </Button>
                </div>
                {error.building_images && <span className="text-red-500 text-xs">{error.building_images}</span>}

                {/* Images List - Scrollable Container */}
                {formData.images.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-700">Gambar yang diupload ({formData.images.length})</h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                          {/* Image Preview */}
                          <div className="flex-shrink-0 relative">
                            <img src={image.preview} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded border cursor-pointer" onClick={() => handleImagePreview(image.preview!)} />
                            <div className="absolute -top-2 -right-2 ">
                              <Button type="button" variant="destructive" size="sm" className="h-6 w-6 p-0 rounded-full cursor-pointer" onClick={() => removeImage(index)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Image Info */}
                          <div className="flex-1 space-y-2">
                            <div className="text-sm text-gray-600">File: {image.file!.name}</div>
                            <div className="space-y-1">
                              <Label className="text-xs">Caption (Opsional)</Label>
                              <Input placeholder="Masukkan caption untuk gambar ini" value={image.caption} onChange={(e) => updateImageCaption(index, e.target.value)} className="text-sm" />
                            </div>
                            <div className="text-xs text-gray-500">Urutan: {index + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Floor Plans Section */}
            <Card>
              <CardHeader>
                <CardTitle>Denah Lantai</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area - Fixed Height */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-[200px] flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Upload denah lantai satu per satu</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files![0]) {
                        handleSingleFloorPlanUpload(e.target.files![0]);
                        e.target.value = ""; // Reset input
                      }
                    }}
                    className="hidden"
                    id="floorplan-upload"
                  />
                  <Button type="button" variant="outline" className="cursor-pointer" onClick={() => document.getElementById("floorplan-upload")!.click()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Denah
                  </Button>
                </div>
                {error.building_floor_plans && <span className="text-red-500 text-xs">{error.building_floor_plans}</span>}

                {/* Floor Plans List - Scrollable Container */}
                {formData.floor_plans.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-700">Denah yang diupload ({formData.floor_plans.length})</h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {formData.floor_plans.map((floorPlan, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                          {/* File Preview */}
                          <div className="flex-shrink-0 relative">
                            <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center">
                              {floorPlan.file!.type.startsWith("image/") ? (
                                <img src={floorPlan.preview} alt="Floor plan" className="w-full h-full object-cover rounded cursor-pointer" onClick={() => handleImagePreview(floorPlan.preview!)} />
                              ) : (
                                <div className="text-xs text-gray-500 text-center">
                                  <div>PDF</div>
                                  <div className="font-medium">📄</div>
                                </div>
                              )}
                            </div>
                            <div className="absolute -top-2 -right-2">
                              <Button type="button" variant="destructive" size="sm" className="h-6 w-6 p-0 rounded-full cursor-pointer" onClick={() => removeFloorPlan(index)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Floor Plan Info */}
                          <div className="flex-1 space-y-2">
                            <div className="text-sm text-gray-600">File: {floorPlan.file!.name}</div>
                            <div className="space-y-1">
                              <Label className="text-xs">Nama Denah</Label>
                              <Input placeholder="Masukkan nama denah (contoh: Lantai 1, Tipe A)" value={floorPlan.name} onChange={(e) => updateFloorPlanName(index, e.target.value)} className="text-sm" />
                              {error[`floor_plans.${index}.name`] && <span className="text-red-500 text-xs">{error[`floor_plans.${index}.name`]}</span>}
                            </div>
                            <div className="text-xs text-gray-500">Urutan: {index + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rules Section */}
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Peraturan KPR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area - Fixed Height */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-[200px] flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Upload Peraturan</p>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    // disabled={formData.building_kpr_rules.length >= 1}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleSingleKPRUpload(e.target.files[0]);
                        e.target.value = "";
                      }
                    }}
                    className="hidden"
                    id="kprrules-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    // disabled={formData.building_kpr_rules.length >= 1}
                    onClick={() => document.getElementById("kprrules-upload")!.click()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah File
                  </Button>
                </div>
                {error.building_kpr_rules && <span className="text-red-500 text-xs">{error.building_kpr_rules}</span>}

                {/* Floor Plans List - Scrollable Container */}
                {formData.building_kpr_rules.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Peraturan yang diupload ({formData.building_kpr_rules.length})</h4>

                    {/* Grid Layout - Mobile: 1 kolom, Desktop: 2 kolom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                      {formData.building_kpr_rules.map((building_kpr_rules, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow duration-200">
                          {/* File Preview */}
                          <div className="flex-shrink-0 relative">
                            <div className="w-20 h-20 rounded border flex items-center justify-center overflow-hidden bg-white">
                              {building_kpr_rules.file!.type.startsWith("image/") ? (
                                <img
                                  src={building_kpr_rules.preview}
                                  alt="KPR rules"
                                  className="w-full h-full object-cover rounded cursor-pointer hover:scale-105 transition-transform duration-200"
                                  onClick={() => handleImagePreview(building_kpr_rules.preview!)}
                                />
                              ) : (
                                <div className="text-center">
                                  <div className="text-2xl">📄</div>
                                  <div className="text-xs font-medium text-gray-600 mt-1">PDF</div>
                                </div>
                              )}
                            </div>

                            {/* Delete Button */}
                            <div className="absolute -top-2 -right-2">
                              <Button type="button" variant="destructive" size="sm" className="h-6 w-6 p-0 rounded-full cursor-pointer" onClick={() => removeKPRRules(index)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* File Info di samping */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-sm font-medium  break-words" title={building_kpr_rules.file!.name}>
                              {building_kpr_rules.file!.name}
                            </p>
                            <p className="text-xs text-gray-500">{(building_kpr_rules.file!.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
      <PreviewImage open={open} setOpen={setOpen} image={selectedImage} />
    </>
  );
}
