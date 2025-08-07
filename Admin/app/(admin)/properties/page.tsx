import { DataTable } from "@/components/properties/data-table";
import { getProperty } from "@/api/property";
import { columns } from "@/components/properties/colomns";

const Properties = async () => {
  const data = await getProperty();

  return <DataTable columns={columns} data={data} />;
};

export default Properties;
