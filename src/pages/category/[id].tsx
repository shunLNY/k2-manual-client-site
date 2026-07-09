import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../components/categories/CategoryDetail.module.scss";
import CategoryDetail from "@/components/categories/CategoryDetail";

interface DBCategoryNode {
  id: string;
  category_name: string;
  category_slug: string;
  parent_category_id: string | null;
  sort_order: number;
  status: string;
  children?: DBCategoryNode[];
}

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;

  const [targetCategory, setTargetCategory] = useState<DBCategoryNode | null>(
    null
  );
  const [parentName, setParentName] = useState<string>("");
  // isRootLevel state is removed since we no longer need to hide root categories
  const [loading, setLoading] = useState(true);

  // Deep Tree Search Function
  const findCategoryById = (
    nodes: DBCategoryNode[],
    targetId: string
  ): DBCategoryNode | null => {
    for (const node of nodes) {
      if (node.id === targetId) return node;
      if (node.children && node.children.length > 0) {
        const found = findCategoryById(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!id) return;

    fetch("http://localhost:4000/categories")
      .then((res) => res.json())
      .then((response) => {
        const rawData: DBCategoryNode[] =
          response && response.data ? response.data : [];
        const foundData = findCategoryById(rawData, id as string);

        if (foundData) {
          setTargetCategory(foundData);

          // Find Parent Name if this is a subcategory
          if (foundData.parent_category_id !== null) {
            const rootNode = rawData.find(
              (root) =>
                root.id === foundData.parent_category_id ||
                root.children?.some((child) => child.id === foundData.id)
            );
            if (rootNode) setParentName(rootNode.category_name);
          } else {
            // If it is a root category (Main Tab), parentName remains empty
            setParentName("");
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className={styles.container}>
        <p>読み込み中...</p>
      </div>
    );

  if (!targetCategory)
    return (
      <div className={styles.container}>
        <p>データが見つかりませんでした。</p>
      </div>
    );

  const formattedDate = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Always return CategoryDetail, regardless of whether it is a Main Category or Sub Category
  return (
    <CategoryDetail
      targetCategory={targetCategory}
      parentName={parentName}
      formattedDate={formattedDate}
    />
  );
}

