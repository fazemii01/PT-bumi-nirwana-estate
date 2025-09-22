import {
  getBuildingProperties,
  getBuildingPropertyPaged,
} from "@/api/building_property";
import { AppPagination } from "@/components/app-pagination";
import { columns } from "@/components/building-properties/columns";
import { TableCustom } from "@/components/table-custom";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

const PER_PAGE = 10;

export default async function BuildingPropertiesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const { data, total } = await getBuildingPropertyPaged(page, PER_PAGE); // Adjust this to fetch paginated data if needed

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex justify-end mb-4">
        <Link href="/building-properties/create">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <IconPlus />
            <span className="hidden lg:inline">Add Building Property</span>
          </Button>
        </Link>
      </div>
      <TableCustom columns={columns} data={data || []} />
      {/* Pagination can be added here if needed */}
      <div className="flex justify-end">
        <AppPagination total={total} perPage={PER_PAGE} />
      </div>
    </div>
  );
}
