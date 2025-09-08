import { getNews } from "@/api/news";
import { getNewsCategory } from "@/api/news_category";
import { getProperties } from "@/api/property";
import ClientTableWrapper from "@/components/news/client-table";
import NewsButton from "@/components/news/news-button";
import React from "react";

const News = async () => {
  const [data, newsCategory, properties] = await Promise.all([getNews(), getNewsCategory(), getProperties()]);

  return (
    <div className="px-4 py-4">
      <NewsButton newsCategory={newsCategory.data || []} properties={properties.data || []} />
      <ClientTableWrapper data={data.data || []} newsCategory={newsCategory.data || []} properties={properties.data || []} />
    </div>
  );
};

export default News;
