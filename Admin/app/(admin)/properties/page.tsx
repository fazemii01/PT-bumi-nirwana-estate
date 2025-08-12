import { getProperty } from "@/api/property";
import { columns } from "@/components/properties/colomns";
import PropertyButton from "@/components/properties/properties-button";
import { TableCustom } from "@/components/table-custom";

const Properties = async () => {
  const data = await getProperty();
  return (
    <div className="px-4 py-4">
      <PropertyButton />
      <TableCustom columns={columns} data={data} />
    </div>
  );
};

export default Properties;
