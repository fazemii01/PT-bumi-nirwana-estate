// app/properties/edit/[id]/page.tsx
import { getById } from "@/actions/property";
import { getAgent } from "@/api/agent";
import { getDeveloper } from "@/api/developer";

import PropertyEditForm from "@/components/properties/edit/edit-form";
import { Property } from "@/types/properties";

import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const [propertyData, agents, developers] = await Promise.all([
    getById({ id }),
    getAgent(),
    getDeveloper(),
  ]);

  if (!propertyData.success) {
    notFound();
  }

  return (
    <div className="p-6">
      <PropertyEditForm
        initialData={propertyData.data!}
        agents={agents.data || []}
        developers={developers.data || []}
      />
    </div>
  );
}
