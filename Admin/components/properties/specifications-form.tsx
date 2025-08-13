import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types/properties";

type SpecificationsFormProps = {
  formData: Property;
  handleSpecificationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaSpecificationChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
};

export default function SpecificationsForm({
  formData,
  handleSpecificationChange,
  handleTextAreaSpecificationChange,
}: SpecificationsFormProps) {
  return (
    <TabsContent value="specs">
      <Card>
        <CardHeader>
          <CardTitle>Spesifikasi Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Kamar Tidur"
              name="bedrooms"
              value={formData.specifications!.bedrooms || ""}
              onChange={handleSpecificationChange}
            />
            <Input
              name="bathrooms"
              placeholder="Kamar Mandi"
              value={formData.specifications!.bathrooms || ""}
              onChange={handleSpecificationChange}
            />
            <Input
              name="garage"
              placeholder="Garasi"
              value={formData.specifications!.garage || ""}
              onChange={handleSpecificationChange}
            />
            <Input
              name="floors"
              placeholder="Lantai"
              value={formData.specifications!.floors || ""}
              onChange={handleSpecificationChange}
            />
            <Input
              name="electricity"
              placeholder="Listrik (VA)"
              value={formData.specifications!.electricity || ""}
              onChange={handleSpecificationChange}
            />
            <Input
              placeholder="Sumber Air"
              name="water_source"
              value={formData.specifications!.water_source || ""}
              onChange={handleSpecificationChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Fasilitas Tambahan</Label>
            <Textarea
              name="facilities"
              placeholder="Swimming pool, gym, playground, etc."
              value={formData.specifications!.facilities || ""}
              onChange={handleTextAreaSpecificationChange}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
