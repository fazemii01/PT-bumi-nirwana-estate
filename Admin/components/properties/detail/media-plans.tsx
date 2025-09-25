import { deletePropertyImages, deletePropertySitePlan } from "@/actions/property";
import ConfirmMessage from "@/components/confirm-message";
import PreviewImage from "@/components/preview-image";
import CreateImagesModal from "@/components/properties/create-in-detail/create-images-modal";
import CreateSitePlanModal from "@/components/properties/create-in-detail/create-site-plan-modal";
import { showToastError, showToastSuccess } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { getImageUrl } from "@/service/imageUrl";
import { Property } from "@/types/properties";
import { ChevronDown, ChevronUp, Edit, Eye, FileText, PictureInPicture, Image, Plus, Trash2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MediaPlans = ({ property }: { property: Property }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [site, setSite] = useState(false);
  const [imgId, setImgId] = useState("");
  const [deleteType, setDeleteType] = useState<"image" | "plan" | null>(null);
  const handleImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShow(true);
  };
  const imgUrl = (path: string) => getImageUrl(path);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    let res;

    if (deleteType === "image") {
      res = await deletePropertyImages({ id });
    } else if (deleteType === "plan") {
      res = await deletePropertySitePlan({ id });
    }

    if (!res?.success) {
      setIsLoading(false);
      showToastError(res?.message || "Failed delete data");
      setConfirm(false);
      return;
    }

    setIsLoading(false);
    setConfirm(false);
    showToastSuccess("Delete successfull");
    router.refresh();
  };

  return (
    <>
      <TabsContent value="media">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Property Images */}
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Property Images
                </CardTitle>
                <CardDescription>{property.images.length} images uploaded</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-2 pt-2 px-2 min-w-max">
                  {property.images.map((image) => (
                    <div key={image.id} className="relative group flex-shrink-0">
                      <img
                        src={imgUrl(`property/property_images/${image.image_url}`)}
                        alt={image.caption}
                        className="w-32 h-32 object-cover rounded-lg border cursor-pointer"
                        onClick={() => handleImagePreview(imgUrl(`property/property_images/${image.image_url!}`))}
                      />
                      <div className="absolute -top-2 -right-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full cursor-pointer shadow-lg border-2 border-white"
                          onClick={() => {
                            setConfirm(true);
                            setImgId(image.id!);
                            setDeleteType("image");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-xs text-gray-600 mt-1 truncate w-32">caption: {image.caption ? image.caption : "_"}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex invisible space-y-1.5 items-center justify-between p-3 border-t cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm font-medium text-gray-700">{showAllPlans ? "Sembunyikan" : "Lihat semua"}</span>
                {showAllPlans ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </div>
            </CardContent>
          </Card>

          {/* Site Plans */}
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Site Plans
                </CardTitle>
                <CardDescription>{property.site_plans.length} plans uploaded</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSite(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Site Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {property.site_plans.slice(0, showAllPlans ? property.site_plans.length : 2).map((plan) => (
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
                    </div>
                    <div className="flex gap-1">
                      {/* <Button size="sm" className="h-8 w-8 p-0 rounded-full cursor-pointer border-2 border-white">
                        <Edit className="w-3 h-3" />
                      </Button> */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full cursor-pointer border-2 border-white"
                        onClick={() => {
                          setConfirm(true);
                          setImgId(plan.id!);
                          setDeleteType("plan");
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {property.site_plans.length > 2 && (
                  <div className="flex items-center justify-between p-3 border-t cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowAllPlans(!showAllPlans)}>
                    <span className="text-sm font-medium text-gray-700">{showAllPlans ? "Sembunyikan" : "Lihat semua"}</span>
                    {showAllPlans ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <CreateImagesModal open={open} setOpen={setOpen} propertyId={property.id} name={property.name} />
      <CreateSitePlanModal open={site} setOpen={setSite} propertyId={property.id} name={property.name} />
      <PreviewImage open={show} setOpen={setShow} image={selectedImage} />
      <ConfirmMessage open={confirm} setOpen={setConfirm} data={imgId} onConfirm={handleDelete} isLoading={isLoading} />
    </>
  );
};

export default MediaPlans;
