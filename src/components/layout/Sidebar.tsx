import React from "react";
import styles from "./Sidebar.module.css";
import { salesCategories, siteCategories } from "@/data/mockData";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.title}>現場管理</h3>
        <ul className={styles.list}>
          {siteCategories.map((item) => (
            <li key={item.id} className={styles.listItem}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className={styles.title}>販売管理</h3>
        <ul className={styles.list}>
          {salesCategories.map((item) => (
            <li key={item.id} className={styles.listItem}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
