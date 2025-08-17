import { addProperty } from "@/api/property";
import { Property } from "@/types/properties";
import { revalidatePath } from "next/cache";
import PropertyCreateForm from "@/components/properties/create/create-form";

export default function CreatePropertyPage() {
  const handleSubmit = async (data: Property) => {
    "use server";
    const res = await addProperty({ property: data });
    if (res) {
      revalidatePath("/properties");
      return true;
    }
  };

  return (
    <div className="p-6">
      <PropertyCreateForm onSubmit={handleSubmit} />
    </div>
  );
}
