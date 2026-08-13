/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import styles from "./SearchBox.module.scss";
import { CategoryNode, Article } from "../../../utils/types";

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // New state to manage active tab on mobile
  const [activeMobileTab, setActiveMobileTab] = useState<
    "categories" | "articles"
  >("categories");

  const [filteredResults, setFilteredResults] = useState<{
    categories: CategoryNode[];
    articles: Article[];
  }>({
    categories: [],
    articles: [],
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenCategories = (nodes: any[]): CategoryNode[] => {
    let flatList: CategoryNode[] = [];
    nodes.forEach((node) => {
      flatList.push({
        id: node.id,
        category_name: node.category_name,
        category_slug: node.category_slug,
        parent_category_id: node.parent_category_id,
      });
      if (
        node.children &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
        flatList = flatList.concat(flattenCategories(node.children));
      }
    });
    return flatList;
  };

  // data fetch
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const catRes = await fetch("http://localhost:4000/categories");
        const catResponse = await catRes.json();
        const rawCategories = catResponse?.data
          ? catResponse.data
          : Array.isArray(catResponse)
          ? catResponse
          : [];
        setCategories(flattenCategories(rawCategories));

        const artRes = await fetch("http://localhost:4000/articles");
        const artResponse = await artRes.json();
        const rawArticles: Article[] = artResponse?.data
          ? artResponse.data
          : Array.isArray(artResponse)
          ? artResponse
          : [];
        setArticles(rawArticles);
      } catch (err) {
        console.error("Error fetching data for search:", err);
      }
    };

    fetchExistingData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults({ categories: [], articles: [] });
      setIsDropdownOpen(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    const matchedCategories = categories.filter(
      (c) =>
        c.category_name?.toLowerCase().includes(lowerQuery) ||
        c.category_slug?.toLowerCase().includes(lowerQuery)
    );

    const matchedArticles = articles.filter((a) => {
      const titleMatch = a.title?.toLowerCase().includes(lowerQuery);
      const excerptMatch = a.excerpt?.toLowerCase().includes(lowerQuery);
      const summaryMatch = a.summary?.toLowerCase().includes(lowerQuery);

      const catNameMatch = a.category?.category_name
        ?.toLowerCase()
        .includes(lowerQuery);
      const parentCatNameMatch = a.category?.parentCategory?.category_name
        ?.toLowerCase()
        .includes(lowerQuery);
      const flatCatNameMatch = a.category_name
        ?.toLowerCase()
        .includes(lowerQuery);

      return (
        titleMatch ||
        excerptMatch ||
        summaryMatch ||
        catNameMatch ||
        parentCatNameMatch ||
        flatCatNameMatch
      );
    });

    matchedArticles.sort((a, b) => {
      const aTitleMatch = a.title?.toLowerCase().includes(lowerQuery) ? 1 : 0;
      const bTitleMatch = b.title?.toLowerCase().includes(lowerQuery) ? 1 : 0;
      return bTitleMatch - aTitleMatch;
    });

    setFilteredResults({
      categories: matchedCategories,
      articles: matchedArticles,
    });
    setIsDropdownOpen(true);
  }, [searchQuery, categories, articles]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getCategoryBreadcrumb = (cat: CategoryNode): string => {
    const parts: string[] = [cat.category_name];
    let current = cat;
    while (current.parent_category_id) {
      const parent = categories.find(
        (c) => c.id === current.parent_category_id
      );
      if (parent) {
        parts.unshift(parent.category_name);
        current = parent;
      } else {
        break;
      }
    }
    return parts.join(" ＞ ");
  };

  const getArticleBreadcrumb = (art: Article): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const catId = (art as any).category_id || art.category?.id;
    if (catId) {
      const matchedCat = categories.find((c) => c.id === catId);
      if (matchedCat) {
        return getCategoryBreadcrumb(matchedCat);
      }
    }

    const parts: string[] = [];
    if (art.category?.parentCategory?.category_name) {
      parts.push(art.category.parentCategory.category_name);
    }
    if (art.category?.category_name) {
      parts.push(art.category.category_name);
    } else if (art.category_name) {
      parts.push(art.category_name);
    }
    return parts.length > 0 ? parts.join(" ＞ ") : "未分類";
  };

  const handleResultClick = (type: "category" | "article", id: string) => {
    setIsDropdownOpen(false);
    setSearchQuery("");
    if (type === "category") {
      router.push(`/category/${id}`);
    } else {
      router.push(`/article/${id}`);
    }
  };

  const handleViewAll = () => {
    setIsDropdownOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      {isDropdownOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
      <div
        className={`${styles.searchSection} ${
          isHomePage ? styles.transparentBg : ""
        } ${isDropdownOpen ? styles.activeSearch : ""}`}
        ref={wrapperRef}
      >
        <div
          className={`${styles.searchInputWrapper} ${
            isHomePage ? styles.transparentBg : ""
          }`}
        >
          <Search size={18} className={styles.searchIcon} />

          <input
            type="text"
            className={styles.searchInput}
            placeholder="例）案件の登録、工程表の作成"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isDropdownOpen &&
          (filteredResults.categories.length > 0 ||
            filteredResults.articles.length > 0) && (
            <div className={styles.dropdownWrapper}>
              <div className={styles.dropdownContainer}>
                {/* Mobile Tabs */}
                <div className={styles.mobileTabs}>
                  <button
                    className={`${styles.tabButton} ${
                      activeMobileTab === "categories" ? styles.activeTab : ""
                    }`}
                    onClick={() => setActiveMobileTab("categories")}
                  >
                    Categories
                  </button>
                  <button
                    className={`${styles.tabButton} ${
                      activeMobileTab === "articles" ? styles.activeTab : ""
                    }`}
                    onClick={() => setActiveMobileTab("articles")}
                  >
                    Articles
                  </button>
                </div>

                <div
                  className={`${styles.columnSection} ${
                    activeMobileTab !== "categories" ? styles.hideOnMobile : ""
                  }`}
                >
                  <h3 className={styles.columnHeader}>該当するカテゴリー</h3>
                  <p className={styles.resultCount}>
                    該当結果{" "}
                    <strong>{filteredResults.categories.length}</strong> 件
                  </p>
                  <div className={styles.listContainer}>
                    {filteredResults.categories.length > 0 ? (
                      filteredResults.categories.map((cat) => (
                        <div
                          key={`cat-${cat.id}`}
                          className={styles.categoryItem}
                          onClick={() => handleResultClick("category", cat.id)}
                        >
                          {highlightText(
                            getCategoryBreadcrumb(cat),
                            searchQuery
                          )}
                        </div>
                      ))
                    ) : (
                      <p className={styles.noResultsText}>
                        No matching categories found
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`${styles.columnSection} ${styles.rightColumn} ${
                    activeMobileTab !== "articles" ? styles.hideOnMobile : ""
                  }`}
                >
                  <div className={styles.articleHeaderRow}>
                    <div>
                      <h3 className={styles.columnHeader}>該当する記事</h3>
                      <p className={styles.resultCount}>
                        関連結果：{" "}
                        <strong>
                          {Math.min(filteredResults.articles.length, 3)}
                        </strong>{" "}
                        件（全{filteredResults.articles.length}件）
                      </p>
                    </div>
                    {filteredResults.articles.length > 3 && (
                      <button
                        className={styles.viewAllBtn}
                        onClick={handleViewAll}
                      >
                        もっと見る
                      </button>
                    )}
                  </div>

                  <div className={styles.listContainer}>
                    {filteredResults.articles.length > 0 ? (
                      filteredResults.articles.slice(0, 3).map((art) => (
                        <div
                          key={`art-${art.id}`}
                          className={styles.articleCard}
                          onClick={() => handleResultClick("article", art.id)}
                        >
                          <div className={styles.thumbnailWrapper}>
                            <Image
                              src={
                                art.thumbnail_path || "/images/placeholder.jpg"
                              }
                              alt={art.title}
                              fill
                              sizes="140px"
                              className={styles.thumbnail}
                            />
                          </div>

                          <div className={styles.articleContent}>
                            <span className={styles.articleBreadcrumb}>
                              {highlightText(
                                getArticleBreadcrumb(art),
                                searchQuery
                              )}
                            </span>
                            <h4 className={styles.articleTitle}>
                              {highlightText(art.title, searchQuery)}
                            </h4>
                            <p className={styles.articleExcerpt}>
                              {art.excerpt || art.summary || ""}
                            </p>
                            <span className={styles.articleDate}>
                              {art.createdAt
                                ? new Date(art.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : ""}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.noResultsText}>該当する記事 found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
}
