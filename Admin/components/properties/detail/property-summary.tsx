import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/properties";
import { Badge, Calendar, Home } from "lucide-react";

const PropertySummary = ({ property }: { property: Property }) => {
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

  return (
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
  );
};

export default PropertySummary;
