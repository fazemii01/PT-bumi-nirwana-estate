"use client";
import BasicInfo from "@/components/building-properties/detail/basic-info";

import { BuildingProperty } from "@/types/building-properties";

import SideBarInfo from "./side-bar-info";
import PropertyGallery from "./media-gallery";
import SpecificationsInfo from "./spesification-info";

const BuildingDetailView = ({ building }: { building: BuildingProperty }) => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold ">{building.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: berisi semua informasi detail properti */}
        <div className="lg:col-span-8 space-y-6">
          <PropertyGallery building={building} />
          <BasicInfo building={building} />
          {/* Komponen Spesifikasi dipindahkan ke sini */}
          <SpecificationsInfo building={building} />
        </div>

        {/* Kolom Kanan: berisi sidebar */}
        <div className="lg:col-span-4">
          <SideBarInfo building={building} />
        </div>
      </div>
      {/* ====================================================================== */}
    </div>
  );
};

export default BuildingDetailView;
