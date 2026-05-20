import React from "react";
import Link from "next/link";
import styles from "./CategoryDetail.module.scss";

interface DBCategoryNode {
  id: string;
  category_name: string;
  category_slug: string;
  parent_category_id: string | null;
  sort_order: number;
  status: string;
  children?: DBCategoryNode[];
}

const TreeItem: React.FC<{ item: DBCategoryNode; level: number }> = ({ item, level }) => {
  const isSubCategory = level === 2;
  const isArticle = level >= 3 || (!item.children || item.children.length === 0 && level > 2);

  return (
    <li className={styles.listItem}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" />
      </svg>

      <div className={styles.itemContent}>
        <div className={isSubCategory ? styles.boldText : ""}>
          {isArticle ? (
            <Link href={`/article/${item.id}`} className={styles.articleLink}>
              {item.category_name}
            </Link>
          ) : (
            <span>{item.category_name}</span>
          )}
        </div>

        {item.children && item.children.length > 0 && (
          <ul className={`${styles.treeList} ${styles.nestedList}`}>
            {item.children.map((child) => (
              <TreeItem key={child.id} item={child} level={level + 1} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default function CategoryDetail({
  targetCategory,
  parentName,
  formattedDate,
}: {
  targetCategory: DBCategoryNode;
  parentName: string;
  formattedDate: string;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        Help Center &gt; {parentName && `${parentName} > `} <span>{targetCategory.category_name}</span>
      </div>

      <div className={styles.headerArea}>
        <h1 className={styles.title}>{targetCategory.category_name}</h1>
        <div className={styles.date}>更新 : {formattedDate}</div>
      </div>

      <div className={styles.contentBox}>
        <ul className={styles.treeList}>
          {targetCategory.children && targetCategory.children.length > 0 ? (
            targetCategory.children.map((item) => (
              <TreeItem key={item.id} item={item} level={2} />
            ))
          ) : (
            <p className={styles.emptyText}>このカテゴリーには記事がありません。</p>
          )}
        </ul>
      </div>
    </div>
  );
}