import { getAgent } from "@/api/agent";
import { getDeveloper } from "@/api/developer";
import { getPropertyById } from "@/api/property";

import PropertyEditForm from "@/components/properties/edit/edit-form";

import { notFound } from "next/navigation";

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const [propertyData, agents, developers] = await Promise.all([getPropertyById({ id }), getAgent(), getDeveloper()]);

  if (!propertyData) {
    notFound();
  }

  return (
    <div className="p-6">
      <PropertyEditForm initialData={propertyData.data!} agents={agents.data || []} developers={developers.data || []} />
    </div>
  );
}
