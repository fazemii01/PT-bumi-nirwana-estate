"use client";

import CreateAgent from "@/components/agent/create-agent";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

const AgentButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex justify-end mb-4">
      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpen(true)}>
        <IconPlus />
        <span className="hidden lg:inline">Add Agent</span>
      </Button>
      <CreateAgent open={open} setOpen={setOpen} />
    </div>
  );
};

export default AgentButton;
