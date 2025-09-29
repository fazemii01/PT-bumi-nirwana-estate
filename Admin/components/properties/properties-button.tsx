"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

const PropertyButton = () => {
  const router = useRouter();
  return (
    <div className=" flex justify-end mb-4">
      <Button size="sm" className="cursor-pointer" onClick={() => router.push("/properties/create")}>
        <IconPlus />
        <span className="hidden lg:inline">Add Property</span>
      </Button>
    </div>
  );
};

export default PropertyButton;
