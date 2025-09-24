import {
  PriceUnit,
  BuildingProperty,
  BuildingStatus,
} from "@/types/building-properties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, DollarSign, FileText, Tag, User } from "lucide-react";

type BasicInfoFormBuilds = {
  formData: BuildingProperty;
  handleSelectChange: (field: keyof BuildingProperty, value: any) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  property: { id: string; name: string }[];
  error?: { [key: string]: string };
};

export default function BasicInfoForm({
  formData,
  handleSelectChange,
  handleInputChange,
  handleTextAreaChange,
  property,
  error = {},
}: BasicInfoFormBuilds) {
  return (
    <TabsContent value="basic">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Informasi Dasar Bangunan Properti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Developer & Agent Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Properti
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="developer" className="text-sm font-medium">
                  Properti
                </Label>
                <Select
                  value={formData.propertyId ?? ""} // ⬅️ fallback
                  onValueChange={(value) =>
                    handleSelectChange("propertyId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Property" />
                  </SelectTrigger>
                  <SelectContent>
                    {property.map((prop) => (
                      <SelectItem key={prop.id} value={String(prop.id)}>
                        {" "}
                        {/* ⬅️ String(...) */}
                        {prop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error["propertyId"] && (
                  <span className="text-red-500 text-xs">
                    {error["propertyId"]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Property Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Informasi Bangunan Properti
            </h4>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama bangunan"
                className="w-full"
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {error["name"] && (
                <span className="text-red-500 text-xs">{error["name"]}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BuildingStatus.PRE_LAUNCH}>
                      Pre Launch
                    </SelectItem>
                    <SelectItem value={BuildingStatus.AVAILABLE}>
                      Available
                    </SelectItem>
                    <SelectItem value={BuildingStatus.SOLD_OUT}>
                      Sold Out
                    </SelectItem>
                    <SelectItem value={BuildingStatus.RESERVED}>
                      Reserved
                    </SelectItem>
                  </SelectContent>
                </Select>
                {error["status"] && (
                  <span className="text-red-500 text-xs">
                    {error["status"]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Informasi Harga & Luas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2 sm:col-span-3 lg:col-span-1">
                <Label htmlFor="price" className="text-sm font-medium">
                  Harga <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="500000000"
                  className="w-full"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                {error["price"] && (
                  <span className="text-red-500 text-xs">{error["price"]}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_unit" className="text-sm font-medium">
                  Satuan Harga
                </Label>
                <Select
                  value={formData.price_unit}
                  onValueChange={(value) =>
                    handleSelectChange("price_unit", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PriceUnit.TOTAL}>Total</SelectItem>
                    <SelectItem value={PriceUnit.PER_MONTH}>
                      Per Bulan
                    </SelectItem>
                    <SelectItem value={PriceUnit.PER_SQM}>Per M²</SelectItem>
                  </SelectContent>
                </Select>
                {error["price_unit"] && (
                  <span className="text-red-500 text-xs">
                    {error["price_unit"]}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="land_size" className="text-sm font-medium">
                  Luas Tanah (m²) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="land_size"
                  name="land_size"
                  type="number"
                  value={formData.land_size}
                  onChange={handleInputChange}
                  placeholder="120"
                  className="w-full"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                {error["land_size"] && (
                  <span className="text-red-500 text-xs">
                    {error["land_size"]}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="building_size" className="text-sm font-medium">
                  Luas Bangunan (m²) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="building_size"
                  name="building_size"
                  type="number"
                  value={formData.building_size}
                  onChange={handleInputChange}
                  placeholder="120"
                  className="w-full"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                {error["building_size"] && (
                  <span className="text-red-500 text-xs">
                    {error["building_size"]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Deskripsi
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="detail_description"
                  className="text-sm font-medium"
                >
                  Deskripsi Detail
                </Label>
                <Textarea
                  id="detail_description"
                  name="detail_description"
                  value={formData.detail_description}
                  onChange={handleTextAreaChange}
                  placeholder="Deskripsi lengkap property termasuk fasilitas, akses, dan keunggulan lainnya"
                  rows={5}
                  className="w-full resize-none"
                />
                {error["detail_description"] && (
                  <span className="text-red-500 text-xs">
                    {error["detail_description"]}
                  </span>
                )}
                <p className="text-xs text-gray-500">
                  Deskripsi lengkap untuk halaman detail property.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
