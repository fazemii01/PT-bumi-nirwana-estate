import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { BuildingProperty } from "@/types/building-properties";

type SpecificationsFormBuilds = {
  formData: BuildingProperty;
  handleSpecificationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaSpecificationChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  error?: { [key: string]: string };
};

export default function SpecificationsForm({
  formData,
  handleSpecificationChange,
  handleTextAreaSpecificationChange,
  error = {},
}: SpecificationsFormBuilds) {
  return (
    <TabsContent value="specs">
      <Card>
        <CardHeader>
          <CardTitle>Spesifikasi Bangunan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Dimensi */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Dimensi & Ukuran</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Kamar Tidur</Label>
                <Input
                  type="number"
                  placeholder="Jumlah kamar tidur"
                  name="bedrooms"
                  value={formData.specifications?.bedrooms || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.bedrooms"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.bedrooms"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Kamar Mandi</Label>
                <Input
                  type="number"
                  name="bathrooms"
                  placeholder="Jumlah kamar mandi"
                  value={formData.specifications?.bathrooms || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.bathrooms"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.bathrooms"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Ruang Keluarga</Label>
                <Input
                  type="number"
                  name="family_room"
                  placeholder="jumlah ruang keluarga"
                  value={formData.specifications?.family_room || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.family_room"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.family_room"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Dapur</Label>
                <Input
                  type="number"
                  name="kitchen"
                  placeholder="jumlah dapur"
                  value={formData.specifications?.kitchen || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.kitchen"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.kitchen"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Jumlah Lantai</Label>
                <Input
                  type="number"
                  name="floors"
                  placeholder="Jumlah lantai"
                  value={formData.specifications?.floors || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.floors"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.floors"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Garasi</Label>
                <Input
                  type="number"
                  name="garage"
                  placeholder="Kapasitas mobil"
                  value={formData.specifications?.garage || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.garage"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.garage"]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Material */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Material & Finishing
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Struktur Bangunan</Label>
                <Input
                  name="structure"
                  placeholder="ex: Beton bertulang"
                  value={formData.specifications?.structure || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.structure"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.structure"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Lantai</Label>
                <Input
                  name="floor"
                  placeholder="ex: Granit 60x60"
                  value={formData.specifications?.floor || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.floor"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.floor"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Dinding</Label>
                <Input
                  name="walls"
                  placeholder="ex: Bata ringan"
                  value={formData.specifications?.walls || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.walls"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.walls"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Atap</Label>
                <Input
                  name="roof"
                  placeholder="ex: Genteng beton"
                  value={formData.specifications?.roof || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.roof"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.roof"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Pintu</Label>
                <Input
                  name="doors"
                  placeholder="ex: Kayu solid"
                  value={formData.specifications?.doors || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.doors"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.doors"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Jendela</Label>
                <Input
                  name="windows"
                  placeholder="ex: Aluminium"
                  value={formData.specifications?.windows || ""}
                  onChange={handleSpecificationChange}
                />
                {error["specifications.windows"] && (
                  <span className="text-red-500 text-xs">
                    {error["specifications.windows"]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Utilitas */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Utilitas</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Listrik</Label>
                <Input
                  name="electricity"
                  placeholder="ex: 1300W"
                  value={formData.specifications?.electricity || ""}
                  onChange={handleSpecificationChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Sumber Air</Label>
                <Input
                  name="water_source"
                  placeholder="ex: PDAM"
                  value={formData.specifications?.water_source || ""}
                  onChange={handleSpecificationChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Internet</Label>
                <Input
                  name="internet"
                  placeholder="ex: Fiber Optik"
                  value={formData.specifications?.internet || ""}
                  onChange={handleSpecificationChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Keamanan</Label>
                <Input
                  name="security"
                  placeholder="ex: 24 jam security"
                  value={formData.specifications?.security || ""}
                  onChange={handleSpecificationChange}
                />
              </div>
            </div>
          </div>

          {/* Fasilitas */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Fasilitas Tambahan</Label>
            <Textarea
              name="facilities"
              placeholder="Swimming pool, gym, playground, dll."
              value={formData.specifications?.facilities || ""}
              onChange={handleTextAreaSpecificationChange}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
