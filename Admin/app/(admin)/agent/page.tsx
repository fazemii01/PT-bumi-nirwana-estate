import { TableCustom } from "@/components/table-custom";
import { columns } from "@/components/agent/columns";
import AgentButton from "@/components/agent/agent-button";
import { getDataAgent } from "@/actions/agent";
import { showToastError } from "@/components/toast";

const Agent = async () => {
  const res = await getDataAgent();
  if (!res.success) {
    return showToastError(res.message || "Gagal mengambil data agent.");
  }
  const data = res.data || [];
  return (
    <div className="px-4 py-4">
      <AgentButton />
      <TableCustom columns={columns} data={data} />
    </div>
  );
};

export default Agent;
