"use client";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getImageUrl } from "@/service/imageUrl";
import { News } from "@/types/news";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface NewsImageModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  news: News;
}

export const ShowNewsImg = ({ open, setOpen, news }: NewsImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imgUrl = (path: string) => getImageUrl(path);
  const images = news.newsImages || [];

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setCurrentIndex(0);
    }
    setOpen(isOpen);
  };

  if (!images.length) {
    return null;
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] p-0">
        <AlertDialogCancel
          className="absolute top-3 right-3 flex-shrink-0 ml-2 p-1 text-red-500 
             hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors border-none"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </AlertDialogCancel>
        <AlertDialogHeader className="p-6 pb-2">
          <AlertDialogTitle className="text-lg font-semibold pr-8">{news.title}</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="relative">
          {/* Main Image Display */}
          <div className="relative bg-black/5 min-h-[400px] flex items-center justify-center">
            <img
              src={imgUrl(`news/news_images/${images[currentIndex].img_url}`)}
              alt={`${news.title} - Gambar ${currentIndex + 1}`}
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/api/placeholder/400/300";
              }}
            />

            {/* Navigation Arrows - Only show if more than 1 image */}
            {images.length > 1 && (
              <>
                <Button variant="secondary" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg" onClick={prevImage}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button variant="secondary" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg" onClick={nextImage}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation - Only show if more than 1 image */}
          {images.length > 1 && (
            <div className="p-4 border-t bg-gray-50/50">
              <div className="flex gap-2 justify-center max-w-full overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <img
                      src={imgUrl(`news/news_images/${image.img_url}`)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/64/64";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
