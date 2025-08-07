import { getProperty } from "@/api/property";
import { columns } from "@/components/properties/colomns";
import { TableCustom } from "@/components/table-custom";

const Properties = async () => {
  const data = await getProperty();
  return (
    <div className="px-4 py-4">
      <TableCustom columns={columns} data={data} />
    </div>
  );
};

export default Properties;
