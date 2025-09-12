import { TableCustom } from "@/components/table-custom";
import { columns } from "@/components/developer/columns";
import DeveloperButton from "@/components/developer/developer-button";
import { getDeveloperPaged } from "@/api/developer";
import { AppPagination } from "@/components/app-pagination";

const PER_PAGE = 10;

export default async function DeveloperPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const { data, total } = await getDeveloperPaged(page, PER_PAGE);

  return (
    <div className="px-4 py-4 space-y-4">
      <DeveloperButton />
      <TableCustom columns={columns} data={data || []} />
      <div className="flex justify-end">
        <AppPagination total={total} perPage={PER_PAGE} />
      </div>
    </div>
  );
}
