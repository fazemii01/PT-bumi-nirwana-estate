"use client";
import CreateBank from "@/components/bank/create-bank";
import CreateNews from "@/components/news/create-news";
import { Button } from "@/components/ui/button";
import { NewsCategory } from "@/types/news";
import { Property } from "@/types/properties";
import { IconPlus } from "@tabler/icons-react";
import React, { useState } from "react";

const NewsButton = ({ newsCategory, properties }: { newsCategory: NewsCategory[]; properties: Property[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex justify-end mb-4">
      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpen(true)}>
        <IconPlus />
        <span className="hidden lg:inline">Add News</span>
      </Button>
      <CreateNews open={open} setOpen={setOpen} newsCategory={newsCategory} properties={properties} />
    </div>
  );
};

export default NewsButton;
