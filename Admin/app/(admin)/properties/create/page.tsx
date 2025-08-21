import { getAgent } from "@/api/agent";
import { getDeveloper } from "@/api/developer";
import PropertyCreateForm from "@/components/properties/create/create-form";

export default async function CreatePropertyPage() {
  const [agents, developers] = await Promise.all([getAgent(), getDeveloper()]);

  return (
    <div className="p-6">
      <PropertyCreateForm agents={agents.data || []} developers={developers.data || []} />
    </div>
  );
}
