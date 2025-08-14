"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import CreateDeveloper from "@/components/developer/create-developer";

const DeveloperButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-end mb-4">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <IconPlus />
        <span className="hidden lg:inline">Add Developer</span>
      </Button>
      <CreateDeveloper open={open} setOpen={setOpen} />
    </div>
  );
};

export default DeveloperButton;
