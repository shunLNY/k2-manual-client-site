"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { SubCategory } from "../../utils/types";
import { MainCategory } from "../../utils/types";

interface SidebarProps {
  isOpen?: boolean;
  onClose: () => void;
  onSearchFocus: () => void;
}

export default function Sidebar({ isOpen = false, onClose, onSearchFocus }: SidebarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [siteRootId, setSiteRootId] = useState<string | null>(null);
  const [salesRootId, setSalesRootId] = useState<string | null>(null);

  const [siteChildren, setSiteChildren] = useState<SubCategory[]>([]);
  const [salesChildren, setSalesChildren] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/categories")
      .then((res) => res.json())
      .then((response) => {
        const rawData: MainCategory[] = response && response.data ? response.data : (Array.isArray(response) ? response : []);

        const siteData = rawData.find(c => c.category_slug?.toLowerCase() === "genbakanri" || c.category_name === "現場管理");
        if (siteData) {
          setSiteRootId(siteData.id);
          if (siteData.children) {
            const sortedSite = [...siteData.children].sort((a, b) => a.sort_order - b.sort_order);
            setSiteChildren(sortedSite);
          }
        }

        // 販売管理 (Sales) Data
        const salesData = rawData.find(c => c.category_slug?.toLowerCase() === "hanbaikanri" || c.category_name === "販売管理");
        if (salesData) {
          setSalesRootId(salesData.id);
          if (salesData.children) {
            const sortedSales = [...salesData.children].sort((a, b) => a.sort_order - b.sort_order);
            setSalesChildren(sortedSales);
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <aside className={styles.sidebar}><p style={{ padding: "20px" }}>読み込み中...</p></aside>;
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.isOpen : ""}`}>
      {/* Close Button */}
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Search Bar */}
      {!isHomePage && (
        <div className={styles.searchContainer}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="検索" className={styles.searchInput} onFocus={onSearchFocus} />
        </div>
      )}

      {/* 現場管理 Section */}
      <div className={styles.section}>
        <h3 className={styles.title}>
          {siteRootId ? (
            <Link href={`/category/${siteRootId}`} onClick={onClose} style={{ textDecoration: "none", color: "inherit" }}>
              現場管理
            </Link>
          ) : (
            "現場管理"
          )}
        </h3>
        <ul className={styles.list}>
          {siteChildren.length > 0 ? (
            siteChildren.map((item) => {
              const isActive = pathname === `/category/${item.id}`;
              return (
                <li
                  key={item.id}
                  className={`${styles.listItem} ${isActive ? styles.activeListItem : ""}`}
                >
                  <Link href={`/category/${item.id}`} onClick={onClose} className={styles.linkItem}>
                    {item.category_name}
                  </Link>
                </li>
              );
            })
          ) : (
            <li className={styles.emptyItem}>※ 現場管理 not datas</li>
          )}
        </ul>
      </div>

      {/* 販売管理 Section */}
      <div className={styles.section}>
        <h3 className={styles.title}>
          {salesRootId ? (
            <Link href={`/category/${salesRootId}`} onClick={onClose} style={{ textDecoration: "none", color: "inherit" }}>
              販売管理
            </Link>
          ) : (
            "販売管理"
          )}
        </h3>
        <ul className={styles.list}>
          {salesChildren.length > 0 ? (
            salesChildren.map((item) => {
              const isActive = pathname.includes(`/category/${item.id}`);
              return (
                <li key={item.id} className={`${styles.listItem} ${isActive ? styles.activeListItem : ""}`}>
                  <Link href={`/category/${item.id}`} onClick={onClose} className={styles.linkItem}>
                    {item.category_name}
                  </Link>
                </li>
              );
            })
          ) : (
            <li className={styles.emptyItem}>※ 販売管理<br /></li>
          )}
        </ul>
      </div>
    </aside>
  );
}