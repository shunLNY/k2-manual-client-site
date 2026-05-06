import React from "react";
import { useRouter } from "next/router";
import ArticleDetail from "@/components/articles/ArticleDetail";

export default function CategoryPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = router.query;

  return <ArticleDetail />;
}
