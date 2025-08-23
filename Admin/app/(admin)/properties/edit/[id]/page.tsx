// app/properties/edit/[id]/page.tsx
import { getById } from "@/actions/property";

import PropertyEditForm from "@/components/properties/edit/edit-form";
import { Property } from "@/types/properties";

import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const propertyData = await getById({ id });

  if (!propertyData.success) {
    notFound();
  }

  return (
    <div className="p-6">
      <PropertyEditForm initialData={propertyData.data!} />
    </div>
  );
}
