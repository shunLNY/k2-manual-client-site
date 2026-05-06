import React from "react";
import styles from "./Sidebar.module.scss";
import { salesCategories, siteCategories } from "@/data/mockData";
import Link from "next/link";

interface SidebarProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.isOpen : ""}`}>
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close Menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className={styles.section}>
        <h3 className={styles.title}>現場管理</h3>
        <ul className={styles.list}>
          {siteCategories.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <Link href={`/category/${item.id}`} onClick={onClose} style={{ display: 'block', width: '100%' }}>
                {item.name}
              </Link>
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
