import { getImageUrl } from "@/service/imageUrl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import React, { useState } from "react";
import { BuildingProperty } from "@/types/building-properties";

const imgUrl = (path: string) => getImageUrl(path);

interface ImageData {
  url: string;
  title?: string;
}

export default function PropertyGallery({
  building,
}: {
  building: BuildingProperty;
}) {
  const [imageCurrentIndex, setImageCurrentIndex] = useState(0);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<ImageData | null>(
    null
  );

  const imageData: ImageData[] =
    building.images
      ?.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((img) => ({ url: img.image_url || "", title: img.caption }))
      .filter((img) => img.url) || [];

  const floorPlanData: ImageData[] =
    building.floor_plans
      ?.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((plan) => ({ url: plan.file_url || "", title: plan.name }))
      .filter((plan) => plan.url) || [];

  const handleImagePrev = () => {
    setImageCurrentIndex(
      (prev) => (prev - 1 + imageData.length) % imageData.length
    );
  };
  const handleImageNext = () => {
    setImageCurrentIndex((prev) => (prev + 1) % imageData.length);
  };

  const activeImage = imageData[imageCurrentIndex];

  return (
    <>
      <div className="space-y-8">
        {/* BAGIAN ATAS: CAROUSEL KHUSUS FOTO PROPERTI */}
        <Card>
          <CardHeader>
            <CardTitle>Foto Properti</CardTitle>
          </CardHeader>
          <CardContent>
            {imageData.length > 0 ? (
              // ===== PERUBAHAN LEBIH KECIL: UBAH max-h dan aspect ratio =====
              <div className="relative w-full max-h-[450px] aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border">
                <img
                  key={imageCurrentIndex}
                  src={imgUrl(
                    `building_property/building_images/${activeImage.url}`
                  )}
                  alt={
                    activeImage.title ||
                    `Foto Properti ${imageCurrentIndex + 1}`
                  }
                  className="w-full h-full object-contain animate-fade-in"
                />
                {imageData.length > 1 && (
                  <>
                    <button
                      onClick={handleImagePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={handleImageNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                    >
                      <ChevronRight />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {imageCurrentIndex + 1} / {imageData.length}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Tidak ada foto properti.</p>
            )}
          </CardContent>
        </Card>

        {/* BAGIAN BAWAH: GALERI KHUSUS DENAH LANTAI (THUMBNAIL) */}
        <Card>
          <CardHeader>
            <CardTitle>Denah Lantai</CardTitle>
          </CardHeader>
          <CardContent>
            {floorPlanData.length > 0 ? (
              // ===== PERUBAHAN LEBIH KECIL: TAMBAH JUMLAH KOLOM GRID =====
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {floorPlanData.map((plan, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFloorPlan(plan)}
                    className="relative group aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden border"
                  >
                    <img
                      src={imgUrl(
                        `building_property/building_floor_plans/${plan.url}`
                      )}
                      alt={plan.title || `Denah ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Tidak ada denah lantai.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedFloorPlan && (
        <div
          onClick={() => setSelectedFloorPlan(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
        >
          <div
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFloorPlan(null)}
              className="absolute -top-10 -right-2 z-10 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors"
            >
              <X />
            </button>
            <img
              src={imgUrl(
                `building_property/building_floor_plans/${selectedFloorPlan.url}`
              )}
              alt={selectedFloorPlan.title || "Denah Lantai"}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <p className="text-center text-white mt-2 text-lg">
              {selectedFloorPlan.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
