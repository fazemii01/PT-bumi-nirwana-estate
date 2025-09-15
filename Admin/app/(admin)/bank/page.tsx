import { getBankPaged, getBanks } from "@/api/bank";
import { AppPagination } from "@/components/app-pagination";
import BankButton from "@/components/bank/bank-button";
import { columns } from "@/components/bank/columns";
import { TableCustom } from "@/components/table-custom";
import React from "react";

const PER_PAGE = 10;

export default async function BankPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const { data, total } = await getBankPaged(page, PER_PAGE);

  return (
    <div className="px-4 py-4 space-y-4">
      <BankButton />
      <TableCustom columns={columns} data={data || []} />
      <div className="flex justify-end">
        <AppPagination total={total} perPage={PER_PAGE} />
      </div>
    </div>
  );
}
