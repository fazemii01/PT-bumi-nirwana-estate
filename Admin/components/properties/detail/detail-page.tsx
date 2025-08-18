"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Home, Car, Bed, Bath, Zap, Droplets, Building, User, Calendar, ChevronLeft, ChevronRight, Download, Eye, Phone, Mail, Globe } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Address, PriceUnit, Property, Specifications } from "@/types/properties";
import { getImageUrl } from "@/service/imageUrl";

const PropertyDetailView = ({ property }: { property: Property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const imgUrl = (path: string) => getImageUrl(path);

  const getStatusColor = (status: string) => {
    const colors = {
      PRE_LAUNCH: "bg-blue-500",
      AVAILABLE: "bg-green-500",
      SOLD_OUT: "bg-red-500",
      RESERVED: "bg-yellow-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusText = (status: string) => {
    const texts = {
      PRE_LAUNCH: "Pre Launch",
      AVAILABLE: "Tersedia",
      SOLD_OUT: "Terjual",
      RESERVED: "Reservasi",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatPrice = (price: string, unit: PriceUnit) => {
    const numPrice = parseInt(price);
    const formatted = new Intl.NumberFormat("id-ID").format(numPrice);

    const unitText = {
      TOTAL: "",
      PER_MONTH: "/bulan",
      PER_SQM: "/m²",
    };

    return `Rp ${formatted}${unitText[unit] || ""}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  let addressObj: Address | undefined;

  if (typeof property.address === "string") {
    try {
      addressObj = JSON.parse(property.address);
    } catch (e) {
      console.error("Gagal parse address:", e);
    }
  } else {
    addressObj = property.address;
  }

  const formatAddress = (address: Address) => {
    return `${addressObj!.street}, ${addressObj!.village}, ${addressObj!.district}, ${addressObj!.city}, ${addressObj!.province} ${addressObj!.postal_code}`;
  };

  let specObj: Specifications | undefined;

  if (typeof property.specifications === "string") {
    try {
      specObj = JSON.parse(property.specifications);
    } catch (e) {
      console.error("Gagal parse specifications:", e);
    }
  } else {
    specObj = property.specifications;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">{property.name}</h1>
            <Badge className={`${getStatusColor(property.status)} text-white`}>{getStatusText(property.status)}</Badge>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {addressObj?.city}, {addressObj?.province}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-green-600">{formatPrice(property.price, property.price_unit)}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Pro Gallery  */}
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

          {/* Property Details Tabs */}
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Detail</TabsTrigger>
                  <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
                  <TabsTrigger value="floorplan">Denah</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                    <p className="text-gray-700 leading-relaxed">{property.detail_description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Alamat Lengkap</h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{formatAddress(property?.address!)}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specs" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Bed className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">{specObj!.bedrooms ?? "0"}</div>
                        <div className="text-sm text-gray-600">Kamar Tidur</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Bath className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">{specObj!.bathrooms ?? "0"}</div>
                        <div className="text-sm text-gray-600">Kamar Mandi</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Bath className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">{specObj!.family_room ?? "0"}</div>
                        <div className="text-sm text-gray-600">Kamar Mandi</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Car className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">{specObj!.garage ?? "0"}</div>
                        <div className="text-sm text-gray-600">Garasi</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">{specObj!.floors ?? "0"}</div>
                        <div className="text-sm text-gray-600">Lantai</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <div>
                        <div className="font-semibold">{specObj!.electricity ?? "0"} VA</div>
                        <div className="text-sm text-gray-600">Daya Listrik</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">{specObj!.water_source ?? "0"}</div>
                        <div className="text-sm text-gray-600">Sumber Air</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Fasilitas</h3>
                    <p className="text-gray-700 leading-relaxed">{specObj!.facilities ?? "0"}</p>
                  </div>
                </TabsContent>

                <TabsContent value="floorplan" className="space-y-4">
                  {property.floor_plans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.floor_plans.map((floorPlan) => (
                        <div key={floorPlan.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{floorPlan.name}</h4>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                          <img src={imgUrl(`property/property_floor_plans/${floorPlan.file_url!}`)} alt={floorPlan.name} className="w-full h-48 object-cover rounded-lg border" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Denah lantai belum tersedia</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Property Info & Contact */}
        <div className="space-y-6">
          {/* Property Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Ringkasan Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Jenis:</span>
                  <p className="font-medium">{property.jenis}</p>
                </div>
                <div>
                  <span className="text-gray-600">Luas:</span>
                  <p className="font-medium">{property.luas} m²</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <Badge className={`${getStatusColor(property.status)} text-white mt-1`}>{getStatusText(property.status)}</Badge>
                </div>
                <div>
                  <span className="text-gray-600">Harga per m²:</span>
                  <p className="font-medium text-green-600">Rp {new Intl.NumberFormat("id-ID").format(Math.round(parseInt(property.price) / parseInt(property.luas)))}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Dipublikasi: {new Date(property?.created_at!).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Diperbarui: {new Date(property.updated_at!).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Developer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h4 className="font-semibold">{property.developer?.name}</h4>
              <div className="space-y-2 text-sm">
                {/* <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a href={`tel:${property.developer.}`} className="text-blue-600 hover:underline">
                    {property.developer.phone}
                  </a>
                </div> */}
                {/* <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a href={`mailto:${property.developer.}`} className="text-blue-600 hover:underline">
                    {property.developer.email}
                  </a>
                </div> */}
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <a href={`https://${property.developer?.website_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {property.developer?.website_url}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Agent Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{property.agent?.full_name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${property.agent?.phone_number}`} className="text-blue-600 hover:underline">
                      {property.agent?.phone_number}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${property.agent?.email}`} className="text-blue-600 hover:underline">
                      {property.agent?.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Hubungi Agent
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Kirim Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
