import { getProperties } from "@/api/property";
import PropertyCreateForm from "@/components/properties/create/create-form";

export default async function CreatePropertyPage() {
  const [properties] = await Promise.all([getProperties()]);
  return (
    <div className="p-6">
      <PropertyCreateForm properties={properties.data || []} />
    </div>
  );
}
