import { getPropertyById, updateProperty } from "@/api/property";
import PropertyEditForm from "@/components/properties/edit-form";
import { Property } from "@/types/properties";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

// Halaman ini menerima 'params' yang berisi 'id' dari URL
export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Ambil data properti yang akan diedit (nama fungsi diperbaiki)
  const propertyData = await getPropertyById({ id });

  // Jika data tidak ditemukan, tampilkan halaman 404
  if (!propertyData) {
    notFound();
  }

  // 2. Definisikan fungsi untuk handle update (ini adalah Server Action)
  const handleUpdateSubmit = async ({
    data,
    originalData,
  }: {
    data: Property;
    originalData: Property;
  }) => {
    "use server";
    const ok = await updateProperty({
      data,
      originalData,
    });

    if (ok) {
      revalidatePath("/properties");
      revalidatePath(`/properties/edit/${id}`);
      return true;
    }
    return false;
  };

  return (
    <div className="p-6">
      {/* 3. Berikan data awal dan fungsi update ke komponen form */}
      <PropertyEditForm
        initialData={propertyData}
        onSubmit={handleUpdateSubmit}
      />
    </div>
  );
}
