import { PriceUnit, Property, PropertyStatus } from "@/types/properties";
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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
type BasicInfoFormProps = {
  formData: Property;
  handleSelectChange: (field: keyof Property, value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  developers: { id: string; name: string }[];
  agents: { id: string; full_name: string }[];
};

export default function BasicInfoForm({
  formData,
  handleSelectChange,
  handleInputChange,
  handleTextAreaChange,
  developers,
  agents,
}: BasicInfoFormProps) {
  return (
    <TabsContent value="basic">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developer">Developer</Label>
              <Select
                value={formData.developerId}
                onValueChange={(value) =>
                  handleSelectChange("developerId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Developer" />
                </SelectTrigger>
                <SelectContent>
                  {developers.map((dev) => (
                    <SelectItem key={dev.id} value={dev.id}>
                      {dev.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent">Agent</Label>
              <Select
                value={formData.agentId}
                onValueChange={(value) => handleSelectChange("agentId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Property</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama property"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PropertyStatus.PRE_LAUNCH}>
                    Pre Launch
                  </SelectItem>
                  <SelectItem value={PropertyStatus.AVAILABLE}>
                    Available
                  </SelectItem>
                  <SelectItem value={PropertyStatus.SOLD_OUT}>
                    Sold Out
                  </SelectItem>
                  <SelectItem value={PropertyStatus.RESERVED}>
                    Reserved
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis Property</Label>
              <Input
                id="jenis"
                name="jenis"
                value={formData.jenis}
                onChange={handleInputChange}
                placeholder="e.g. Rumah, Apartemen, Ruko"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g. 500000000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_unit">Satuan Harga</Label>
              <Select
                value={formData.price_unit}
                onValueChange={(value) =>
                  handleSelectChange("price_unit", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PriceUnit.TOTAL}>Total</SelectItem>
                  <SelectItem value={PriceUnit.PER_MONTH}>Per Bulan</SelectItem>
                  <SelectItem value={PriceUnit.PER_SQM}>Per M²</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="luas">Luas (m²)</Label>
              <Input
                id="luas"
                name="luas"
                value={formData.luas}
                onChange={handleInputChange}
                placeholder="e.g. 120"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleTextAreaChange}
              placeholder="Deskripsi singkat property"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail_description">Deskripsi Detail</Label>
            <Textarea
              id="detail_description"
              value={formData.detail_description}
              onChange={handleTextAreaChange}
              placeholder="Deskripsi lengkap property"
              rows={5}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
