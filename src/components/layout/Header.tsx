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
import { Menu, Moon, Sun } from "lucide-react";

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [siteRootId, setSiteRootId] = useState<string | null>(null);
  const [salesRootId, setSalesRootId] = useState<string | null>(null);
  const [activeRootId, setActiveRootId] = useState<string | null>(null);

  const pathname = usePathname() || "";
  const isHomePage = pathname === "/";
  const idMatch = pathname.match(/\/category\/([^\/]+)/);
  const currentCategoryId = idMatch ? idMatch[1] : null;

  useEffect(() => {
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
        const rootId = path[0].id;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveRootId(rootId);
        sessionStorage.setItem("lastActiveTab", rootId);
      }
    } else {
      const savedRootId = sessionStorage.getItem("lastActiveTab");
      if (savedRootId && !isHomePage) {
        setActiveRootId(savedRootId);
      } else {
        setActiveRootId(null);
      }
    }
  }, [currentCategoryId, categories, isHomePage]);

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
          <Menu size={24} />
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
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {!isHomePage && <SearchBox />}
    </header>
  );
}
