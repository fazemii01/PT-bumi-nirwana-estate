"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoDetail from "@/components/properties/detail/basic-info-detail";
import SidebarInformation from "@/components/properties/detail/sidebar-information";
import { Property } from "@/types/properties";
import MediaPlans from "@/components/properties/detail/media-plans";
import { BuildingProperty } from "@/types/building-properties";
import PropertyBuilding from "@/components/properties/detail/property-building";
import { useSearchParams } from "next/navigation";

const PropertyDetailView = ({
  property,
  building,
}: {
  property: Property;
  building: BuildingProperty[];
}) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "details";
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">{property.name}</h1>
          <p className=" mt-1">{property.type}</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue={activeTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="buildings">Buildings</TabsTrigger>
          <TabsTrigger value="media">Media & Plans</TabsTrigger>
        </TabsList>

        {/* Property Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <BasicInfoDetail property={property} />

            {/* Sidebar Information */}
            <SidebarInformation property={property} />
          </div>
        </TabsContent>

        {/* Buildings Tab */}
        <PropertyBuilding buildings={building} nameProperty={property.name} />

        {/* Media & Plans Tab */}
        <MediaPlans property={property} />
      </Tabs>
    </div>
  );
};

export default PropertyDetailView;
