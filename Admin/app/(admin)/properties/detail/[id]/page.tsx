import {
  getBuildingPropertyById,
  getBuildingPropertyByProperty,
} from "@/api/building_property";
import { getPropertyById } from "@/api/property";
import PropertyDetailView from "@/components/properties/detail/detail-page";
import { notFound } from "next/navigation";
import React from "react";

const DetailProperty = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [property, building] = await Promise.all([
    getPropertyById({ id: id }),
    getBuildingPropertyByProperty({ id: id }),
  ]);
  if (!property) return notFound();

  return (
    <div>
      <PropertyDetailView
        property={property.data!}
        building={building.data || []}
      />
    </div>
  );
};

export default DetailProperty;
