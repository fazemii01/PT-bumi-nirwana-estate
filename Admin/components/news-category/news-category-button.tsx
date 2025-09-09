"use client";

import CreateNewsCategory from "@/components/news-category/create-news-category";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

const NewsCategoryButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex justify-end mb-4">
      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpen(true)}>
        <IconPlus />
        <span className="hidden lg:inline">Add Category</span>
      </Button>
      <CreateNewsCategory open={open} setOpen={setOpen} />
    </div>
  );
};

export default NewsCategoryButton;
