/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { MainCategory } from "../../utils/types";
import { Folder, ChevronRight, Circle, ChevronLeft, X } from "lucide-react";
import { apiUrl } from "@/utils/api";

interface SidebarProps {
  isOpen?: boolean;
  onClose: () => void;
}

const isIdInTree = (nodeId: string, treeNodes: any[]): boolean => {
  for (const node of treeNodes) {
    if (node.id === nodeId) return true;
    if (node.children && isIdInTree(nodeId, node.children)) return true;
  }
  return false;
};

const TreeNode = ({
  item,
  pathname,
  onClose,
}: {
  item: any;
  pathname: string;
  onClose: () => void;
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === `/category/${item.id}`;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      hasChildren &&
      isIdInTree(pathname.split("/").pop() || "", item.children)
    ) {
      setIsOpen(true);
    }
  }, [pathname, item.children, hasChildren]);

  return (
    <li className={styles.treeNode}>
      <div
        className={`${styles.treeLabel} ${isActive ? styles.activeText : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <span className={styles.iconBox}>
          {hasChildren ? (
            <ChevronRight
              size={18}
              style={{
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          ) : (
            <Circle size={6} fill="currentColor" />
          )}
        </span>
        <Link
          href={`/category/${item.id}`}
          onClick={onClose}
          className={styles.linkText}
        >
          {item.category_name}
        </Link>
      </div>
      {hasChildren && isOpen && (
        <ul className={styles.treeChildren}>
          {item.children.map((child: any) => (
            <TreeNode
              key={child.id}
              item={child}
              pathname={pathname}
              onClose={onClose}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

function SidebarContent({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [rootCategories, setRootCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeRootId, setActiveRootId] = useState<string | null>(null);

  useEffect(() => {
    const handleCategoryUpdate = (e: any) => {
      if (window.location.pathname === "/") return;
      const rootId = e.detail?.rootId;
      if (rootId) {
        setActiveRootId(rootId);
        setOpenStates((prev) => ({ ...prev, [rootId]: true }));
      }
    };
    window.addEventListener("updateActiveCategory", handleCategoryUpdate);
    return () =>
      window.removeEventListener("updateActiveCategory", handleCategoryUpdate);
  }, []);

  useEffect(() => {
    fetch(apiUrl("/categories"))
      .then((res) => res.json())
      .then((response) => {
        const rawData: MainCategory[] =
          response && response.data
            ? response.data
            : Array.isArray(response)
            ? response
            : [];
        const sortedData = rawData.sort(
          (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
        );
        setRootCategories(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || rootCategories.length === 0) return;

    const isHomePage = pathname === "/";

    if (isHomePage) {
      setActiveRootId(null);
      setOpenStates({});
      return;
    }

    let newActiveRootId: string | null = null;
    const newOpenStates = { ...openStates };
    const savedSessionId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("lastActiveTab")
        : null;

    if (pathname.includes("/articles/") && tabParam) {
      const matchedRoot = rootCategories.find((c) =>
        c.category_slug
          ? c.category_slug.toLowerCase() === tabParam.toLowerCase()
          : false
      );
      if (matchedRoot) newActiveRootId = matchedRoot.id;
    }

    if (!newActiveRootId) {
      const currentId = pathname.split("/").pop() || "";
      for (const root of rootCategories) {
        if (
          pathname.includes(root.id) ||
          currentId === root.id ||
          (root.children && isIdInTree(currentId, root.children))
        ) {
          newActiveRootId = root.id;
          break;
        }
      }
    }

    if (!newActiveRootId && savedSessionId) {
      const matchedBySession = rootCategories.find(
        (c) => c.id === savedSessionId
      );
      if (matchedBySession) newActiveRootId = matchedBySession.id;
    }

    if (newActiveRootId) {
      newOpenStates[newActiveRootId] = true;
    }

    if (newActiveRootId) setActiveRootId(newActiveRootId);
    setOpenStates((prev) => ({ ...prev, ...newOpenStates }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tabParam, rootCategories, loading]);

  const toggleFolder = (id: string) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading)
    return (
      <aside className={styles.sidebar}>
        <p style={{ padding: "20px" }}>読み込み中...</p>
      </aside>
    );

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.isOpen : ""} ${
        isCollapsed && !isOpen ? styles.isCollapsed : ""
      }`}
    >
      <button
        className={styles.toggleBtn}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle Sidebar"
      >
        <ChevronLeft
          size={16}
          style={{
            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </button>
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close Menu"
      >
        <X size={24} />
      </button>

      <div className={styles.sidebarContent}>
        {rootCategories.map((rootCat) => {
          if (activeRootId !== null && activeRootId !== rootCat.id) return null;
          const isFolderOpen = !!openStates[rootCat.id];
          const children = rootCat.children
            ? [...rootCat.children].sort(
                (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
              )
            : [];

          return (
            <div key={rootCat.id} className={styles.section}>
              <div
                className={styles.rootHeader}
                onClick={() => toggleFolder(rootCat.id)}
              >
                <Folder size={18} fill="currentColor" stroke="none" />
                <span className={styles.rootTitle}>
                  <Link
                    href={`/category/${rootCat.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {rootCat.category_name}
                  </Link>
                </span>
                <div className={styles.rootChevron}>
                  <ChevronRight
                    size={18}
                    style={{
                      transform: isFolderOpen
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </div>
              </div>
              {isFolderOpen && (
                <ul className={styles.rootChildren}>
                  {children.length > 0 ? (
                    children.map((item) => (
                      <TreeNode
                        key={item.id}
                        item={item}
                        pathname={pathname}
                        onClose={onClose}
                      />
                    ))
                  ) : (
                    <li className={styles.emptyItem}>
                      ※ {rootCat.category_name} no data
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense
      fallback={
        <aside className={styles.sidebar}>
          <p style={{ padding: "20px" }}>Loading...</p>
        </aside>
      }
    >
      <SidebarContent {...props} />
    </Suspense>
  );
}
