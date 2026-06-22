import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CategoryDetail.module.scss";
import { DBCategoryNode, Article } from "../../utils/types";

const TreeItem: React.FC<{
  item: DBCategoryNode;
  level: number;
  allArticles: Article[];
}> = ({ item, level, allArticles }) => {
  const isSubCategory = level === 2;

  const currentArticles = allArticles.filter(
    (a: Article) => a.category_id === item.id
  );
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className={styles.listItem}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      </svg>

      <div className={styles.itemContent}>
        <div className={isSubCategory ? styles.boldText : ""}>
          <span>{item.category_name}</span>
        </div>

        {/* If there are sub-categories or articles, they will be displayed below. */}
        {(hasChildren || currentArticles.length > 0) && (
          <ul className={`${styles.treeList} ${styles.nestedList}`}>
            {/* Child Categories (Sub-categories) */}
            {item.children?.map((child) => (
              <TreeItem
                key={child.id}
                item={child}
                level={level + 1}
                allArticles={allArticles}
              />
            ))}

            {/* Real articles under this category */}
            {currentArticles.map((article) => (
              <li key={article.id} className={styles.listItem}>
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* For the article, I will paint the circle completely black */}
                  <circle cx="12" cy="12" r="8" fill="currentColor" />
                </svg>
                <div className={styles.itemContent}>
                  <Link
                    href={`/article/${article.id}`}
                    className={styles.articleLink}
                  >
                    {article.title}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

// Category Detail Component
export default function CategoryDetail({
  targetCategory,
  parentName,
  formattedDate,
}: {
  targetCategory: DBCategoryNode;
  parentName: string;
  formattedDate: string;
}) {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        const res = await fetch(`http://localhost:4000/articles`);
        if (res.ok) {
          const data = await res.json();
          setAllArticles(data.data || data);
        }
      } catch (err) {
        console.error("There was an error retrieving articles", err);
      }
    };
    fetchAllArticles();
  }, []);

  // Checking for articles and sub-categories directly under the Main Category
  const targetArticles = allArticles.filter(
    (a: Article) => a.category_id === targetCategory.id
  );
  const hasAnyContent =
    (targetCategory.children && targetCategory.children.length > 0) ||
    targetArticles.length > 0;

  return (
    <div className={styles.container}>
      {/* <div className={styles.breadcrumb}>
        Help Center &gt; {parentName && `${parentName} > `}{" "}
        <span>{targetCategory.category_name}</span>
      </div> */}
      <div className={styles.breadcrumb}>
        <Link href="/help-center" className={styles.link}>
          Help Center
        </Link>{" "}
        &gt;{" "}
        {parentName && (
          <>
            <Link
              href={`/category/${targetCategory.parent_category_id || ""}`}
              className={styles.link}
            >
              {parentName}
            </Link>{" "}
            &gt;{" "}
          </>
        )}
        <span>{targetCategory.category_name}</span>
      </div>

      <div className={styles.headerArea}>
        <h1 className={styles.title}>{targetCategory.category_name}</h1>
        <div className={styles.date}>更新 : {formattedDate}</div>
      </div>

      <div className={styles.contentBox}>
        <ul className={styles.treeList}>
          {hasAnyContent ? (
            <>
              {/* 1.show the sub-categories of the target category first. */}
              {targetCategory.children?.map((item) => (
                <TreeItem
                  key={item.id}
                  item={item}
                  level={2}
                  allArticles={allArticles}
                />
              ))}

              {/* 2. Show articles directly under the Target Category */}
              {targetArticles.map((article: Article) => (
                <li key={article.id} className={styles.listItem}>
                  <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="8" fill="currentColor" />
                  </svg>
                  <div className={styles.itemContent}>
                    <Link
                      href={`/article/${article.id}`}
                      className={styles.articleLink}
                    >
                      {article.title}
                    </Link>
                  </div>
                </li>
              ))}
            </>
          ) : (
            <p className={styles.emptyText}>
              このカテゴリーには記事がありません。
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
