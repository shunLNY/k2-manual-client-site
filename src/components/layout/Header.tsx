"use client";
import styles from "./Header.module.scss";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import logoWhite from "../../../public/images/logo-white.png";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoryNode } from "../../utils/types";
import SearchBox from "../commons/inputs/SearchBox";

interface HeaderProps {
  onMenuClick: () => void;
}

const findCategoryPath = (
  nodes: CategoryNode[],
  targetId: string,
  currentPath: CategoryNode[] = []
): CategoryNode[] | null => {
  for (const node of nodes) {
    const path = [...currentPath, node];
    if (node.id === targetId) return path;
    if (node.children && node.children.length > 0) {
      const foundPath = findCategoryPath(node.children, targetId, path);
      if (foundPath) return foundPath;
    }
  }
  return null;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [siteRootId, setSiteRootId] = useState<string | null>(null);
  const [salesRootId, setSalesRootId] = useState<string | null>(null);
  const [activeRootId, setActiveRootId] = useState<string | null>(null);

  const pathname = usePathname() || "";
  const isHomePage = pathname === "/";
  const idMatch = pathname.match(/\/category\/([^\/]+)/);
  const currentCategoryId = idMatch ? idMatch[1] : null;

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    fetch("http://localhost:4000/categories")
      .then((res) => res.json())
      .then((response) => {
        const rawData: CategoryNode[] =
          response && response.data
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

        setCategories(rawData);

        const siteData = rawData.find(
          (c) =>
            c.category_slug?.toLowerCase() === "genbakanri" ||
            c.category_name === "現場管理"
        );
        if (siteData) setSiteRootId(siteData.id);

        const salesData = rawData.find(
          (c) =>
            c.category_slug?.toLowerCase() === "hanbaikanri" ||
            c.category_name === "販売管理"
        );
        if (salesData) setSalesRootId(salesData.id);
      })
      .catch((err) => console.error("Error fetching header categories:", err));
  }, []);

  useEffect(() => {
    if (currentCategoryId && categories.length > 0) {
      const path = findCategoryPath(categories, currentCategoryId);
      if (path && path.length > 0) {
        setActiveRootId(path[0].id);
      }
    } else {
      setActiveRootId(null);
    }
  }, [currentCategoryId, categories]);

  const isSiteActive = siteRootId
    ? pathname.includes(siteRootId) || activeRootId === siteRootId
    : false;
  const isSalesActive = salesRootId
    ? pathname.includes(salesRootId) || activeRootId === salesRootId
    : false;

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.topBar}>
        <button className={styles.hamburgerBtn} onClick={onMenuClick}>
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
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className={styles.logoContainer}>
          <Link href="/">
            <Image
              src={isDarkMode ? logoWhite : logo}
              width={51}
              height={40}
              alt="header logo"
              style={{ cursor: "pointer" }}
            />
          </Link>
          <span className={styles.logoText}>建工管理</span>
        </div>

        <div className={styles.navContainer}>
          {siteRootId ? (
            <Link
              href={`/category/${siteRootId}`}
              className={`${styles.navButton} ${
                isSiteActive ? styles.active : ""
              }`}
            >
              現場管理
            </Link>
          ) : (
            <button className={styles.navButton}>現場管理</button>
          )}

          {salesRootId ? (
            <Link
              href={`/category/${salesRootId}`}
              className={`${styles.navButton} ${
                isSalesActive ? styles.active : ""
              }`}
            >
              販売管理
            </Link>
          ) : (
            <button className={styles.navButton}>販売管理</button>
          )}
        </div>

        <button
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </div>

      {!isHomePage && <SearchBox />}
    </header>
  );
}
