import { getBuildingPropertyById, getBuildingPropertyByProperty } from "@/api/building_property";
import { getPropertyById } from "@/api/property";
import PropertyDetailView from "@/components/properties/detail/detail-page";
import { notFound } from "next/navigation";
import React from "react";

const DetailProperty = async ({ params }: { params: { id: string } }) => {
  const [property, building] = await Promise.all([getPropertyById({ id: params.id }), getBuildingPropertyByProperty({ id: params.id })]);
  if (!property) return notFound();

  return (
    <div>
      <PropertyDetailView property={property.data!} building={building.data || []} />
    </div>
  );
};

export default DetailProperty;
