import React from "react";
import { useRouter } from "next/router";
import CategoryDetail from "@/components/categories/CategoryDetail";

export default function CategoryPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = router.query;

  return <CategoryDetail />;
}
