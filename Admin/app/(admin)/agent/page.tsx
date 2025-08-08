import { getAgent } from "@/api/agent";
import { TableCustom } from "@/components/table-custom";
import { columns } from "@/components/agent/columns";

const Agent = async () => {
  const data = await getAgent();

  return (
    <div className="px-4 py-4">
      <TableCustom columns={columns} data={data} />
    </div>
  );
};

export default Agent;
