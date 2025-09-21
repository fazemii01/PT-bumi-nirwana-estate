"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

const BuildingPropertyButton = () => {
  const router = useRouter();

  return (
    <div className=" flex justify-end mb-4">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => router.push("/building-properties/create")}
      >
        <IconPlus />
        <span className="hidden lg:inline">Add Building Property</span>
      </Button>
    </div>
  );
};

export default BuildingPropertyButton;
