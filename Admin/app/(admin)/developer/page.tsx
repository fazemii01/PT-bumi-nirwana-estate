import { TableCustom } from "@/components/table-custom";
import { columns } from "@/components/developer/columns";
import DeveloperButton from "@/components/developer/developer-button";
import { showToastError } from "@/components/toast";
import { getDeveloper } from "@/api/developer";

const DeveloperPage = async () => {
  const data = await getDeveloper();

  return (
    <div className="px-4 py-4">
      <DeveloperButton />
      <TableCustom columns={columns} data={data.data || []} />
    </div>
  );
};

export default DeveloperPage;
