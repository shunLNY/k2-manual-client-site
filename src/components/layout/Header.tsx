"use client";
import styles from "./Header.module.scss";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import logoWhite from "../../../public/images/logo-white.png";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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

function HeaderContent({ onMenuClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [rootCategories, setRootCategories] = useState<CategoryNode[]>([]);
  const [activeRootId, setActiveRootId] = useState<string | null>(null);

  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const isHomePage = pathname === "/";
  const isArticlePage = pathname.includes("/articles/");
  const idMatch = pathname.match(/\/category\/([^\/]+)/);
  const currentCategoryId = idMatch ? idMatch[1] : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        setRootCategories(rawData);
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

  const checkIsActive = (rootCat: CategoryNode) => {
    if (isArticlePage && tabParam) {
      return tabParam === rootCat.category_slug;
    }
    const isPathMatch = pathname.includes(rootCat.id);
    const isSessionMatch = activeRootId === rootCat.id;

    return isPathMatch || isSessionMatch;
  };

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
    <header
      className={`${styles.headerWrapper} ${
        isScrolled ? styles.isScrolled : ""
      }`}
    >
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
          <Link href="/">
            <span className={styles.logoText}>建工管理</span>
          </Link>
        </div>

        <div className={styles.navContainer}>
          {rootCategories.map((rootCat) => {
            const isActive = checkIsActive(rootCat);
            return (
              <Link
                key={rootCat.id}
                href={`/category/${rootCat.id}`}
                className={`${styles.navButton} ${
                  isActive ? styles.active : ""
                }`}
              >
                {rootCat.category_name}
              </Link>
            );
          })}
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

export default function Header(props: HeaderProps) {
  return (
    <Suspense
      fallback={
        <header className={styles.headerWrapper}>
          <div className={styles.topBar}>Loading...</div>
        </header>
      }
    >
      <HeaderContent {...props} />
    </Suspense>
  );
}
