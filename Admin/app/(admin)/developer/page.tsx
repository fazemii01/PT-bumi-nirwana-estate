import { TableCustom } from "@/components/table-custom";
import { columns } from "@/components/developer/columns";
import DeveloperButton from "@/components/developer/developer-button";
import { getDataDeveloper } from "@/actions/developer";
import { showToastError } from "@/components/toast";

const DeveloperPage = async () => {
  const res = await getDataDeveloper();
  if (!res.success) return showToastError(res.message || "failed fetch data");

  const data = res.data || [];
  return (
    <div className="px-4 py-4">
      <DeveloperButton />
      <TableCustom columns={columns} data={data} />
    </div>
  );
};

export default DeveloperPage;
