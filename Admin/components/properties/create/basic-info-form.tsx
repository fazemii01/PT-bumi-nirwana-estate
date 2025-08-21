import { PriceUnit, Property, PropertyStatus, PropertyType } from "@/types/properties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, DollarSign, FileText, Tag, User } from "lucide-react";

type BasicInfoFormProps = {
  formData: Property;
  handleSelectChange: (field: keyof Property, value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  developers: { id: string; name: string }[];
  agents: { id: string; full_name: string }[];
  error?: { [key: string]: string };
};

export default function BasicInfoForm({ formData, handleSelectChange, handleInputChange, handleTextAreaChange, developers, agents, error = {} }: BasicInfoFormProps) {
  return (
    <TabsContent value="basic">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Informasi Dasar Property
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Developer & Agent Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Developer & Agent
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="developer" className="text-sm font-medium">
                  Developer
                </Label>
                <Select
                  value={formData.developerId ?? ""} // ⬅️ fallback
                  onValueChange={(value) => handleSelectChange("developerId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Developer" />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map((dev) => (
                      <SelectItem key={dev.id} value={String(dev.id)}>
                        {" "}
                        {/* ⬅️ String(...) */}
                        {dev.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error["developerId"] && <span className="text-red-500 text-xs">{error["developerId"]}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent" className="text-sm font-medium">
                  Agent
                </Label>
                <Select
                  value={formData.agentId ?? ""} // ⬅️ fallback
                  onValueChange={(value) => handleSelectChange("agentId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={String(agent.id)}>
                        {" "}
                        {/* ⬅️ String(...) */}
                        {agent.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error["agentId"] && <span className="text-red-500 text-xs">{error["agentId"]}</span>}
              </div>
            </div>
          </div>

          {/* Property Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Informasi Property
            </h4>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Property <span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama property" className="w-full" required autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
              {error["name"] && <span className="text-red-500 text-xs">{error["name"]}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PropertyStatus.PRE_LAUNCH}>Pre Launch</SelectItem>
                    <SelectItem value={PropertyStatus.AVAILABLE}>Available</SelectItem>
                    <SelectItem value={PropertyStatus.SOLD_OUT}>Sold Out</SelectItem>
                    <SelectItem value={PropertyStatus.RESERVED}>Reserved</SelectItem>
                  </SelectContent>
                </Select>
                {error["status"] && <span className="text-red-500 text-xs">{error["status"]}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Tipe Property
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PropertyType.HOUSE}>Rumah</SelectItem>
                    <SelectItem value={PropertyType.APARTMENT}>Apartemen</SelectItem>
                    <SelectItem value={PropertyType.KAVLING}>Kavling</SelectItem>
                    <SelectItem value={PropertyType.RUKO}>Ruko</SelectItem>
                  </SelectContent>
                </Select>
                {error["type"] && <span className="text-red-500 text-xs">{error["type"]}</span>}
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
                {error["price"] && <span className="text-red-500 text-xs">{error["price"]}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_unit" className="text-sm font-medium">
                  Satuan Harga
                </Label>
                <Select value={formData.price_unit} onValueChange={(value) => handleSelectChange("price_unit", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PriceUnit.TOTAL}>Total</SelectItem>
                    <SelectItem value={PriceUnit.PER_MONTH}>Per Bulan</SelectItem>
                    <SelectItem value={PriceUnit.PER_SQM}>Per M²</SelectItem>
                  </SelectContent>
                </Select>
                {error["price_unit"] && <span className="text-red-500 text-xs">{error["price_unit"]}</span>}
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
                {error["land_size"] && <span className="text-red-500 text-xs">{error["land_size"]}</span>}
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
                {error["building_size"] && <span className="text-red-500 text-xs">{error["building_size"]}</span>}
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
                <Label htmlFor="description" className="text-sm font-medium">
                  Deskripsi Singkat
                </Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleTextAreaChange} placeholder="Deskripsi singkat property untuk preview" rows={3} className="w-full resize-none" />
                {error["description"] && <span className="text-red-500 text-xs">{error["description"]}</span>}
                <p className="text-xs text-gray-500">Maksimal 200 karakter. Akan ditampilkan di preview property.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail_description" className="text-sm font-medium">
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
                {error["detail_description"] && <span className="text-red-500 text-xs">{error["detail_description"]}</span>}
                <p className="text-xs text-gray-500">Deskripsi lengkap untuk halaman detail property.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
