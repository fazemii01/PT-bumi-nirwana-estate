import { getBanks } from "@/api/bank";
import BankButton from "@/components/bank/bank-button";
import { columns } from "@/components/bank/columns";
import { TableCustom } from "@/components/table-custom";
import React from "react";

const BankPage = async () => {
  const data = await getBanks();
  return (
    <div className="px-4 py-4">
      <BankButton />
      <TableCustom columns={columns} data={data.data || []} />
    </div>
  );
};

export default BankPage;
