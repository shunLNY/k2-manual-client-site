/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { SubCategory, MainCategory } from "../../utils/types";

interface SidebarProps {
  isOpen?: boolean;
  onClose: () => void;
}

const FolderIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
      transition: "transform 0.2s ease",
    }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const DotIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <circle cx="12" cy="12" r="3.5"></circle>
  </svg>
);

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
          {hasChildren ? <ChevronIcon isOpen={isOpen} /> : <DotIcon />}
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

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [siteRootId, setSiteRootId] = useState<string | null>(null);
  const [salesRootId, setSalesRootId] = useState<string | null>(null);
  const [siteChildren, setSiteChildren] = useState<SubCategory[]>([]);
  const [salesChildren, setSalesChildren] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [siteOpen, setSiteOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);

  // Desktop sidebar toggle
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/categories")
      .then((res) => res.json())
      .then((response) => {
        const rawData: MainCategory[] =
          response && response.data
            ? response.data
            : Array.isArray(response)
            ? response
            : [];

        const siteData = rawData.find(
          (c) =>
            c.category_slug?.toLowerCase() === "genbakanri" ||
            c.category_name === "現場管理"
        );
        if (siteData) {
          setSiteRootId(siteData.id);
          if (siteData.children) {
            setSiteChildren(
              [...siteData.children].sort((a, b) => a.sort_order - b.sort_order)
            );
          }
        }

        const salesData = rawData.find(
          (c) =>
            c.category_slug?.toLowerCase() === "hanbaikanri" ||
            c.category_name === "販売管理"
        );
        if (salesData) {
          setSalesRootId(salesData.id);
          if (salesData.children) {
            setSalesChildren(
              [...salesData.children].sort(
                (a, b) => a.sort_order - b.sort_order
              )
            );
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || (!siteRootId && !salesRootId)) return;
    const segments = pathname.split("/");
    const currentId = segments[segments.length - 1];

    if (currentId) {
      if (currentId === siteRootId || isIdInTree(currentId, siteChildren)) {
        setActiveTab("site");
        setSiteOpen(true);
        setSalesOpen(false);
      } else if (
        currentId === salesRootId ||
        isIdInTree(currentId, salesChildren)
      ) {
        setActiveTab("sales");
        setSalesOpen(true);
        setSiteOpen(false);
      } else {
        setActiveTab(null);
        setSiteOpen(false);
        setSalesOpen(false);
      }
    } else {
      setActiveTab(null);
    }
  }, [pathname, siteRootId, salesRootId, siteChildren, salesChildren, loading]);

  if (loading) {
    return (
      <aside className={styles.sidebar}>
        <p style={{ padding: "20px" }}>読み込み中...</p>
      </aside>
    );
  }

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.isOpen : ""} ${
        isCollapsed ? styles.isCollapsed : ""
      }`}
    >
      {/* Desktop Show/Hide Toggle Button */}
      <button
        className={styles.toggleBtn}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle Sidebar"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {/* Mobile Close Button */}
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

      {/* 💡 Content wrapper အတွင်းမှာသာ Scroll လုပ်ရန် */}
      <div className={styles.sidebarContent}>
        {(activeTab === null || activeTab === "site") && (
          <div className={styles.section}>
            <div
              className={styles.rootHeader}
              onClick={() => setSiteOpen(!siteOpen)}
            >
              <FolderIcon />
              <span className={styles.rootTitle}>
                {siteRootId ? (
                  <Link
                    href={`/category/${siteRootId}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    現場管理
                  </Link>
                ) : (
                  "現場管理"
                )}
              </span>
              <div className={styles.rootChevron}>
                <ChevronIcon isOpen={siteOpen} />
              </div>
            </div>
            {siteOpen && (
              <ul className={styles.rootChildren}>
                {siteChildren.length > 0 ? (
                  siteChildren.map((item) => (
                    <TreeNode
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      onClose={onClose}
                    />
                  ))
                ) : (
                  <li className={styles.emptyItem}>※ 現場管理 no data</li>
                )}
              </ul>
            )}
          </div>
        )}

        {(activeTab === null || activeTab === "sales") && (
          <div className={styles.section}>
            <div
              className={styles.rootHeader}
              onClick={() => setSalesOpen(!salesOpen)}
            >
              <FolderIcon />
              <span className={styles.rootTitle}>
                {salesRootId ? (
                  <Link
                    href={`/category/${salesRootId}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    販売管理
                  </Link>
                ) : (
                  "販売管理"
                )}
              </span>
              <div className={styles.rootChevron}>
                <ChevronIcon isOpen={salesOpen} />
              </div>
            </div>
            {salesOpen && (
              <ul className={styles.rootChildren}>
                {salesChildren.length > 0 ? (
                  salesChildren.map((item) => (
                    <TreeNode
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      onClose={onClose}
                    />
                  ))
                ) : (
                  <li className={styles.emptyItem}>※ 販売管理 no data</li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
