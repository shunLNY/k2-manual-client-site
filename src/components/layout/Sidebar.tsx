import React from "react";
import { useRouter } from "next/router";
import styles from "./Sidebar.module.scss";
import { salesCategories, siteCategories } from "@/data/mockData";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  isOpen?: boolean;
  onClose: () => void;
  onSearchFocus: () => void;
}

export default function Sidebar({
  isOpen = false,
  onClose,
  onSearchFocus,
}: SidebarProps) {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

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

      {!isHomePage && (
        <div className={styles.searchContainer}>
          {/* <FontAwesomeIcon icon={faMagnifyingGlass} /> */}
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="検索"
            className={styles.searchInput}
            onFocus={onSearchFocus}
          />
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.title}>現場管理</h3>
        <ul className={styles.list}>
          {siteCategories.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <Link
                href={`/category/${item.id}`}
                onClick={onClose}
                style={{ display: "block", width: "100%" }}
              >
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
              <Link
                href={`/category/${item.id}`}
                onClick={onClose}
                style={{ display: "block", width: "100%" }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
