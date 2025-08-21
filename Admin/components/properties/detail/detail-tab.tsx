import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Home, Car, Bed, Bath, Zap, Droplets, Building, Download } from "lucide-react";

import { Address, Property, Specifications } from "@/types/properties";
import { getImageUrl } from "@/service/imageUrl";
const DetailTab = ({ property }: { property: Property }) => {
  const imgUrl = (path: string) => getImageUrl(path);

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
  const formatAddress = () => {
    return [addressObj?.street, addressObj?.village, addressObj?.district, addressObj?.city, addressObj?.province, addressObj?.postal_code]
      .filter((part) => part && part.trim() !== "") // buang yang kosong/null/undefined
      .join(", "); // gabungkan dengan koma
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
                <p className="text-gray-700">{formatAddress()}</p>
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
  );
};

export default DetailTab;
