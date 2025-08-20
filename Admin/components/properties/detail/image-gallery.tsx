import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getImageUrl } from "@/service/imageUrl";
import { Property } from "@/types/properties";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useState } from "react";

const ImageGallery = ({ property }: { property: Property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const imgUrl = (path: string) => getImageUrl(path);
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative">
          <img src={imgUrl(`property/property_images/${property.images[currentImageIndex]?.image_url!}`)} alt={property.images[currentImageIndex]?.caption} className="w-full h-64 md:h-96 object-cover rounded-t-lg" />

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <Button variant="outline" size="sm" className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm" onClick={prevImage}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm" onClick={nextImage}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {property.images.length}
          </div>

          {/* View All Images Button */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm">
                <Eye className="w-4 h-4 mr-2" />
                Lihat Semua ({property.images.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogTitle>Preview all image</DialogTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {property.images.map((image, index) => (
                  <div key={image.id} className="space-y-2">
                    <img src={imgUrl(`property/property_images/${image.image_url!}`)} alt={image.caption} className="w-full h-48 object-cover rounded-lg" />
                    <p className="text-sm text-gray-600">{image.caption}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Image Thumbnails */}
        <div className="p-4 grid grid-cols-4 md:grid-cols-6 gap-2">
          {property.images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative rounded overflow-hidden border-2 transition-colors ${currentImageIndex === index ? "border-blue-500" : "border-transparent hover:border-gray-300"}`}
            >
              <img src={imgUrl(`property/property_images/${image.image_url!}`)} alt={image.caption} className="w-full h-16 object-cover" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageGallery;
