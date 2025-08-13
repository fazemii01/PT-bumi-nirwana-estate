import { getProperty } from "@/api/property";
import { columns } from "@/components/properties/colomns";
import { TableCustom } from "@/components/table-custom";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

const Properties = async () => {
  const data = await getProperty();
  return (
    <div className="px-4 py-4">
      <div className=" flex justify-end mb-4">
        <Link href="/properties/create">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <IconPlus />
            <span className="hidden lg:inline">Add Property</span>
          </Button>
        </Link>
      </div>
      <TableCustom columns={columns} data={data} />
    </div>
  );
};

export default Properties;
