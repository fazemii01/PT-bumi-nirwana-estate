import { getPropertyById } from "@/api/property";
import PropertyDetailView from "@/components/properties/detail/detail-page";
import { notFound } from "next/navigation";
import React from "react";

const DetailProperty = async ({ params }: { params: { id: string } }) => {
  const property = await getPropertyById({ id: params.id });
  if (!property) return notFound();

  return (
    <div>
      <PropertyDetailView property={property} />
    </div>
  );
};

export default DetailProperty;
