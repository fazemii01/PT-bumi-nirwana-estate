import { getBuildingPropertyById } from "@/api/building_property";
import { notFound } from "next/navigation";
import BuildingDetailView from "@/components/building-properties/detail/detail-page";
import React from "react";

const DetailBuildingProperty = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [building] = await Promise.all([getBuildingPropertyById({ id: id })]);
  if (!building.success) return notFound();

  return (
    <div>
      <BuildingDetailView building={building.data!} />
    </div>
  );
};

export default DetailBuildingProperty;
