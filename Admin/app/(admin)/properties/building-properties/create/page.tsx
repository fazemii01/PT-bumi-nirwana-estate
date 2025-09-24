import { getProperties } from "@/api/property";
import BuildingCreateForm from "@/components/building-properties/create/create-form";

export default async function CreateBuildingPropertyPage() {
  const [properties] = await Promise.all([getProperties()]);
  return (
    <div className="p-6">
      <BuildingCreateForm property={properties.data || []} />
    </div>
  );
}
