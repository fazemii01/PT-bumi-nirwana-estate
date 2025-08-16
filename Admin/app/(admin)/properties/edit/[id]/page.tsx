import { getPropertyById, updateProperty } from "@/api/property";
import PropertyEditForm from "@/components/properties/edit-form";
import { Property } from "@/types/properties";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

// Halaman ini menerima 'params' yang berisi 'id' dari URL
export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // 1. Ambil data properti yang akan diedit (nama fungsi diperbaiki)
  const propertyData = await getPropertyById(id);

  // Jika data tidak ditemukan, tampilkan halaman 404
  if (!propertyData) {
    notFound();
  }

  // 2. Definisikan fungsi untuk handle update (ini adalah Server Action)
  const handleUpdateSubmit = async ({
    id,
    data,
    originalData,
  }: {
    id: string;
    data: Property;
    originalData: Property;
  }) => {
    "use server";
    try {
      const res = await updateProperty({ id, data, originalData });
      if (res) {
        revalidatePath("/properties"); // Refresh data di halaman tabel
        revalidatePath(`/properties/edit/${id}`); // Refresh halaman ini juga
        return true;
      }
    } catch (error) {
      // Server action akan melempar error kembali ke client component
      // yang akan ditangkap oleh blok try-catch di sana.
      // Kita bisa melempar error spesifik jika perlu.
      throw new Error("Failed to update property on the server.");
    }
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
