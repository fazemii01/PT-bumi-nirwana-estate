"use client";

import { createColumns } from "@/components/news/columns";
import { TableCustom } from "@/components/table-custom";
import { News, NewsCategory } from "@/types/news";
import { Property } from "@/types/properties";

export default function ClientTableWrapper({ data, newsCategory, properties }: { data: News[]; newsCategory: NewsCategory[]; properties: Property[] }) {
  const columns = createColumns(newsCategory, properties);

  return <TableCustom columns={columns} data={data} />;
}
