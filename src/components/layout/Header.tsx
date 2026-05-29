"use client";
import styles from "./Header.module.scss";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CategoryNode } from "../../utils/types";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [siteRootId, setSiteRootId] = useState<string | null>(null);
  const [salesRootId, setSalesRootId] = useState<string | null>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    fetch("http://localhost:4000/categories")
      .then((res) => res.json())
      .then((response) => {
        const rawData: CategoryNode[] = response && response.data ? response.data : (Array.isArray(response) ? response : []);

        const siteData = rawData.find(c => c.category_slug?.toLowerCase() === "genbakanri" || c.category_name === "現場管理");
        if (siteData) setSiteRootId(siteData.id);

        const salesData = rawData.find(c => c.category_slug?.toLowerCase() === "hanbaikanri" || c.category_name === "販売管理");
        if (salesData) setSalesRootId(salesData.id);
      })
      .catch((err) => console.error("Error fetching header categories:", err));
  }, []);

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
    <header className={styles.header}>
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
          <Image src={logo} width={51} height={40} alt="header logo" style={{ cursor: "pointer" }} />
        </Link>
        <span className={styles.logoText}>建工管理</span>
      </div>

      <div className={styles.navContainer}>
        {siteRootId ? (
          <Link href={`/category/${siteRootId}`} className={styles.navButton} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            現場管理
          </Link>
        ) : (
          <button className={styles.navButton}>現場管理</button>
        )}

        {salesRootId ? (
          <Link href={`/category/${salesRootId}`} className={styles.navButton} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
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
          /* Dark Mode (Moon Icon) */
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
          /* Light Mode (Sun Icon) */
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
    </header>
  );
}