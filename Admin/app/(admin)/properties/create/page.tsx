import { addProperty } from "@/api/property";
import CreatePropertyForm from "@/components/properties/create-form";
import { Property } from "@/types/properties";
import { revalidatePath } from "next/cache";

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
      <CreatePropertyForm onSubmit={handleSubmit} />
    </div>
  );
}
