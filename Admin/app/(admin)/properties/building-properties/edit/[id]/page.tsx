import { getProperties } from "@/api/property";
import { getBuildingPropertyById } from "@/api/building_property";
import BuildingPropertyEditForm from "@/components/building-properties/edit/edit-form";

import { notFound } from "next/navigation";

export default async function EditBuildingPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const [buildingPropertyData, property] = await Promise.all([
    getBuildingPropertyById({ id }),
    getProperties(),
  ]);

  if (!buildingPropertyData.success) {
    return notFound();
  }

  return (
    <div className="p-6">
      <BuildingPropertyEditForm
        initialData={buildingPropertyData.data!}
        properties={property.data || []}
      />
    </div>
  );
}
