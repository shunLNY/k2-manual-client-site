/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
// ⚠️ useSearchParams ကို အသစ်ထည့်သွင်းထားပါသည်
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { SubCategory, MainCategory } from "../../utils/types";
import { Folder, ChevronRight, Circle, ChevronLeft, X } from "lucide-react";

// ... (SidebarProps, isIdInTree, TreeNode တို့သည် မူလအတိုင်းဖြစ်ပါသည်) ...
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

// SearchParams ကို ဖတ်ရန် သီးသန့် Component ခွဲထုတ်ခြင်း (Next.js Client Component တွင် Error မတက်စေရန်)
function SidebarContent({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab"); // 👈 URL က ?tab=... ကို ဖတ်ပါမည်

  const [siteRootId, setSiteRootId] = useState<string | null>(null);
  const [salesRootId, setSalesRootId] = useState<string | null>(null);
  const [siteChildren, setSiteChildren] = useState<SubCategory[]>([]);
  const [salesChildren, setSalesChildren] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [siteOpen, setSiteOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
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
          if (siteData.children)
            setSiteChildren(
              [...siteData.children].sort((a, b) => a.sort_order - b.sort_order)
            );
        }
        const salesData = rawData.find(
          (c) =>
            c.category_slug?.toLowerCase() === "hanbaikanri" ||
            c.category_name === "販売管理"
        );
        if (salesData) {
          setSalesRootId(salesData.id);
          if (salesData.children)
            setSalesChildren(
              [...salesData.children].sort(
                (a, b) => a.sort_order - b.sort_order
              )
            );
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

    // 🌟 Article Detail Page ရောက်နေရင် Query Parameter ကို စစ်ပါမယ်
    if (pathname.includes("/articles/") && tabParam) {
      if (tabParam === "site") {
        setActiveTab("site");
        setSiteOpen(true);
        setSalesOpen(false);
      } else if (tabParam === "sales") {
        setActiveTab("sales");
        setSalesOpen(true);
        setSiteOpen(false);
      }
      return;
    }

    // မူလအတိုင်း Category Page များကို စစ်ခြင်း
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
  }, [
    pathname,
    tabParam,
    siteRootId,
    salesRootId,
    siteChildren,
    salesChildren,
    loading,
  ]);

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
        {(activeTab === null || activeTab === "site") && (
          <div className={styles.section}>
            <div
              className={styles.rootHeader}
              onClick={() => setSiteOpen(!siteOpen)}
            >
              <Folder size={18} fill="currentColor" stroke="none" />
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
                <ChevronRight
                  size={18}
                  style={{
                    transform: siteOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
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
              <Folder size={18} fill="currentColor" stroke="none" />
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
                <ChevronRight
                  size={18}
                  style={{
                    transform: salesOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
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

// ⚠️ Next.js Client Component တွင် useSearchParams အသုံးပြုရန် Suspense ဖြင့် ဝန်းရံပေးရပါသည်
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
