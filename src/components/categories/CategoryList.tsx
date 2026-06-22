import React from "react";
import Link from "next/link";
import styles from "./CategoryDetail.module.scss";
import { DBCategoryNode } from "../../utils/types";

export default function CategoryList({
  targetCategory,
}: {
  targetCategory: DBCategoryNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/help-center" className={styles.link}>
          Help Center
        </Link>{" "}
        &gt;
        <span>{targetCategory.category_name}</span>
      </div>

      <div className={styles.headerArea}>
        <h1 className={styles.title}>{targetCategory.category_name}</h1>
      </div>

      <div className={styles.contentBox}>
        <ul className={styles.treeList}>
          {targetCategory.children && targetCategory.children.length > 0 ? (
            targetCategory.children.map((child) => (
              <li
                key={child.id}
                className={`${styles.listItem} ${styles.borderBottom} `}
              >
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="8" />
                </svg>
                <Link
                  href={`/category/${child.id}`}
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                >
                  {child.category_name}
                </Link>
              </li>
            ))
          ) : (
            <p className={styles.emptyText}>カテゴリーがありません。</p>
          )}
        </ul>
      </div>
    </div>
  );
}
