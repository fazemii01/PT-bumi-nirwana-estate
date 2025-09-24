import PreviewImage from "@/components/preview-image";
import CreateImagedModal from "@/components/properties/create-in-detail/create-images-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TabsContent } from "@/components/ui/tabs";
import { getImageUrl } from "@/service/imageUrl";
import { Property } from "@/types/properties";
import { ChevronLeft, ChevronRight, Edit, Eye, FileText, PictureInPicture, Image, Plus } from "lucide-react";
import { useState } from "react";

const MediaPlans = ({ property }: { property: Property }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const handleImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShow(true);
  };
  const imgUrl = (path: string) => getImageUrl(path);

  const handleModalOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <TabsContent value="media">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Images */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Property Images
                </CardTitle>
                <CardDescription>{property.images.length} images uploaded</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleModalOpen()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-2 min-w-max">
                  {property.images.map((image) => (
                    <div key={image.id} className="relative group flex-shrink-0">
                      <img src={imgUrl(`property/property_images/${image.image_url}`)} alt={image.caption} className="w-32 h-32 object-cover rounded-lg border" />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                        onClick={() => handleImagePreview(imgUrl(`property/property_images/${image.image_url!}`))}
                      ></div>
                      <p className="text-xs text-gray-600 mt-1 truncate w-32">{image.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Site Plans */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Site Plans
                </CardTitle>
                <CardDescription>{property.site_plans.length} plans uploaded</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {property.site_plans.map((plan) => (
                  <div key={plan.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="w-16 h-12 bg-gray-100 relative group rounded border flex items-center justify-center">
                      <img src={imgUrl(`property/property_site_plans/${plan.file_url}`)} alt="" className="w-full h-full object-cover" />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                        onClick={() => handleImagePreview(imgUrl(`property/property_site_plans/${plan.file_url}`))}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{plan.name}</p>
                      <p className="text-xs text-gray-500">Order: {plan.sort_order}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <CreateImagedModal open={open} setOpen={setOpen} propertyId={property.id} name={property.name} />
      <PreviewImage open={show} setOpen={setShow} image={selectedImage} />
    </>
  );
};

export default MediaPlans;
