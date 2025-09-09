import { getNewsCategory } from "@/api/news_category";
import { columns } from "@/components/news-category/columns";
import NewsCategoryButton from "@/components/news-category/news-category-button";
import { TableCustom } from "@/components/table-custom";
import React from "react";

const NewsCategory = async () => {
  const data = await getNewsCategory();
  return (
    <div className="px-4 py-4">
      <NewsCategoryButton />
      <TableCustom columns={columns} data={data.data || []} />
    </div>
  );
};

export default NewsCategory;
