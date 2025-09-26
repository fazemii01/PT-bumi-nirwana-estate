"use client";
import BasicInfo from "@/components/building-properties/detail/basic-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuildingProperty } from "@/types/building-properties";
import { useSearchParams } from "next/navigation";
import SideBarInfo from "./side-bar-info";

const BuildingDetailView = ({ building }: { building: BuildingProperty }) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "details";
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">{building.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue={activeTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Building Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        {/* Property Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <BasicInfo building={building} />

            {/* Sidebar Information */}
            <SideBarInfo building={building} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuildingDetailView;
