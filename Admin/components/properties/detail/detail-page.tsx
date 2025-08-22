"use client";

import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

import { Address, PriceUnit, Property, Specifications } from "@/types/properties";
import { getImageUrl } from "@/service/imageUrl";
import ImageGallery from "@/components/properties/detail/image-gallery";
import DetailTab from "@/components/properties/detail/detail-tab";
import PropertySummary from "@/components/properties/detail/property-summary";
import DeveloperInfo from "@/components/properties/detail/developer-info";
import AgentContent from "@/components/properties/detail/agent-content";

const PropertyDetailView = ({ property }: { property: Property }) => {
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
          <div className="text-2xl md:text-3xl font-bold text-green-600">{formatPrice(property.price.toString(), property.price_unit)}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Pro Gallery  */}
          <ImageGallery property={property} />

          {/* Property Details Tabs */}

          <DetailTab property={property} />
        </div>

        {/* Right Column - Property Info & Contact */}
        <div className="space-y-6">
          {/* Property Summary */}
          <PropertySummary property={property} />

          {/* Developer Info */}
          <DeveloperInfo property={property} />

          {/* Agent Contact */}
          <AgentContent property={property} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
