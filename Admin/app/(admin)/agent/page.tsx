import { TableCustom } from "@/components/table-custom";
import { columns } from "@/components/agent/columns";
import AgentButton from "@/components/agent/agent-button";
import { getAgent } from "@/api/agent";

const Agent = async () => {
  const data = await getAgent();

  return (
    <div className="px-4 py-4">
      <AgentButton />
      <TableCustom columns={columns} data={data.data || []} />
    </div>
  );
};

export default Agent;
