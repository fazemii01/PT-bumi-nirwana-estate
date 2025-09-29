import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingProperty } from "@/types/building-properties";
import React from "react";

export default function BasicInfo({
  building,
}: {
  building: BuildingProperty;
}) {
  // Function to format price
  const formatPrice = (price: number | string, priceUnit: string) => {
    if (!price) return "-";

    // Convert to number if it's a string
    const numPrice = typeof price === "string" ? parseFloat(price) : price;

    // Format with Indonesian currency
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);

    return `${formattedPrice}/${priceUnit}`;
  };

  // Function to format area size
  const formatAreaSize = (size: number | string) => {
    if (!size) return "-";

    const numSize = typeof size === "string" ? parseFloat(size) : size;
    return `${numSize.toLocaleString("id-ID")} m²`;
  };

  // Function to get status badge variant and custom styles
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "default"; // Will be styled green with custom class
      case "SOLD_OUT":
        return "destructive"; // Red
      case "RESERVED":
        return "secondary"; // Will be styled yellow with custom class
      case "PRE_LAUNCH":
        return "outline"; // Will be styled blue with custom class
      default:
        return "outline";
    }
  };

  // Function to get custom badge classes for additional styling
  const getBadgeCustomClass = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-300";
      case "RESERVED":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300";
      case "PRE_LAUNCH":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300";
      default:
        return "";
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Informasi Dasar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Nama Bangunan/Blok */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Nama Bangunan/Blok
            </label>
            <p className="text-base font-medium text-gray-900">
              {building.name || "-"}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div>
              <Badge
                variant={getStatusVariant(building.status)}
                className={`font-medium ${getBadgeCustomClass(
                  building.status
                )}`}
              >
                {building.status?.replace("_", " ") || "Unknown"}
              </Badge>
            </div>
          </div>

          {/* Total Unit */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Total Unit
            </label>
            <p className="text-base font-medium text-gray-900">
              {building.total_units ? `${building.total_units} unit` : "-"}
            </p>
          </div>

          {/* Land Size */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Luas Tanah
            </label>
            <p className="text-base font-medium text-gray-900">
              {formatAreaSize(building.land_size)}
            </p>
          </div>

          {/* Building Size */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Luas Bangunan
            </label>
            <p className="text-base font-medium text-gray-900">
              {formatAreaSize(building.building_size)}
            </p>
          </div>

          {/* Price (Combined with Price Unit) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Harga</label>
            <p className="text-lg font-bold text-blue-600">
              {formatPrice(building.price, building.price_unit)}
            </p>
          </div>
        </div>

        {/* Description - Full width */}
        {building.description && (
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-600">
              Deskripsi
            </label>
            <p className="text-base text-gray-700 leading-relaxed">
              {building.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
