import { DataTable } from "@/components/properties/data-table";
import { getProperty } from "@/api/property";
import { columns } from "@/components/properties/colomns";

const Properties = async () => {
  const data = await getProperty();
  return (
    <div className="px-4">
      <h1>DATA PROPERTIES</h1>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Properties;
