// app/properties/edit/[id]/page.tsx
import { getPropertyById, updateProperty } from "@/api/property";
import PropertyEditForm from "@/components/properties/edit/edit-form";
import { Property } from "@/types/properties";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // 1) Fetch data awal
  const propertyData = await getPropertyById({ id });

  if (!propertyData) {
    notFound();
  }

  // 2) Server Action untuk submit
  const handleUpdateSubmit = async ({
    data,
    originalData,
  }: {
    data: Property;
    originalData: Property;
  }) => {
    "use server";
    const ok = await updateProperty({ data, originalData });
    if (ok) {
      revalidatePath("/properties");
      revalidatePath(`/properties/edit/${id}`);
      return true;
    }
    return false;
  };

  // 3) Render form + oper props
  return (
    <div className="p-6">
      <PropertyEditForm
        initialData={propertyData}
        onSubmit={handleUpdateSubmit}
      />
    </div>
  );
}
