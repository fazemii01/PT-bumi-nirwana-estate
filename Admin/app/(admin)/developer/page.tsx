import { getDeveloper } from "@/api/developer";
import { TableCustom } from "@/components/table-custom";
import { columns } from "@/components/developer/columns";
import DeveloperButton from "@/components/developer/developer-button";

const DeveloperPage = async () => {
  const data = await getDeveloper();

  return (
    <div className="px-4 py-4">
      <DeveloperButton />
      <TableCustom columns={columns} data={data} />
    </div>
  );
};

export default DeveloperPage;
