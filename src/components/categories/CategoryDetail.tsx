import React from "react";
import Link from "next/link";
import styles from "./CategoryDetail.module.scss";

interface ListItemData {
  id: string;
  label: string;
  isBold?: boolean;
  articleId?: string;
  children?: ListItemData[];
}

const listData: ListItemData[] = [
  {
    id: "1",
    label: "Sub Category 1",
    isBold: true,
    children: [
      { id: "1-1", label: "システム管理者ができること", articleId: "001" },
      { id: "1-2", label: "記事 2", articleId: "002" },
      {
        id: "1-3",
        label: "子カテゴリー001",
        isBold: true,
        children: [
          { id: "1-3-1", label: "記事 2", articleId: "003" },
          { id: "1-3-2", label: "記事 3", articleId: "004" },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "編集者ができること",
  },
  {
    id: "3",
    label: "Sub Category 2",
    isBold: true,
    children: [
      { id: "3-1", label: "システム管理者ができること" },
      { id: "3-2", label: "記事 2" },
      {
        id: "3-3",
        label: "子カテゴリー001",
        isBold: true,
        children: [
          { id: "3-3-1", label: "記事 2" },
          { id: "3-3-2", label: "記事 3" },
        ],
      },
    ],
  },
  {
    id: "4",
    label: "編集者ができること",
  },
];

const TreeItem: React.FC<{ item: ListItemData }> = ({ item }) => {
  return (
    <li className={styles.listItem}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="8" />
      </svg>

      <div className={styles.itemContent}>
        <div className={item.isBold ? styles.boldText : ""}>
          {!item.children || item.children.length === 0 ? (
            <Link href={`/article/${item.id}`} className={styles.articleLink}>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </div>

        {item.children && item.children.length > 0 && (
          <ul className={`${styles.treeList} ${styles.nestedList}`}>
            {item.children.map((child) => (
              <TreeItem key={child.id} item={child} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

const CategoryDetail: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        Help Center &gt; 販売管理 &gt; <span>カテゴリー 3</span>
      </div>

      <div className={styles.headerArea}>
        <h1 className={styles.title}>カテゴリー 3</h1>
        <div className={styles.date}>更新 : 2026年4月21日</div>
      </div>

      <div className={styles.contentBox}>
        <ul className={styles.treeList}>
          {listData.map((item) => (
            <TreeItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryDetail;
