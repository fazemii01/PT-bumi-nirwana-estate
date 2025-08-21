import { getById } from "@/actions/property";
import PropertyDetailView from "@/components/properties/detail/detail-page";
import { showToastError } from "@/components/toast";
import React from "react";

const DetailProperty = async ({ params }: { params: { id: string } }) => {
  const property = await getById({ id: params.id });
  if (!property.success) showToastError(property.message || "Property not found");

  return (
    <div>
      <PropertyDetailView property={property.data!} />
    </div>
  );
};

export default DetailProperty;
