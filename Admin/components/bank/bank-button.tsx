"use client";
import CreateBank from "@/components/bank/create-bank";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import React, { useState } from "react";

const BankButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex justify-end mb-4">
      <Button size="sm" className="cursor-pointer" onClick={() => setOpen(true)}>
        <IconPlus />
        <span className="hidden lg:inline">Add Bank</span>
      </Button>
      <CreateBank open={open} setOpen={setOpen} />
    </div>
  );
};

export default BankButton;
