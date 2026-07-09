/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./SearchBox.module.scss";
import { CategoryNode, Article } from "../../../utils/types";

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

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
        <span key={index} style={{ fontWeight: "bold", color: "#0056b3" }}>
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
    <div
      className={`${styles.searchSection} ${
        isHomePage ? styles.transparentBg : ""
      }`}
      ref={wrapperRef}
    >
      <div
        className={`${styles.searchInputWrapper} ${
          isHomePage ? styles.transparentBg : ""
        }`}
      >
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
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
              <div className={styles.columnSection}>
                <h3 className={styles.columnHeader}>Matching Categories</h3>
                <p className={styles.resultCount}>
                  Found <strong>{filteredResults.categories.length}</strong>{" "}
                  related results
                </p>
                <div className={styles.listContainer}>
                  {filteredResults.categories.length > 0 ? (
                    filteredResults.categories.map((cat) => (
                      <div
                        key={`cat-${cat.id}`}
                        className={styles.categoryItem}
                        onClick={() => handleResultClick("category", cat.id)}
                      >
                        {highlightText(getCategoryBreadcrumb(cat), searchQuery)}
                      </div>
                    ))
                  ) : (
                    <p
                      style={{ fontSize: "13px", color: "#8a8d9f", margin: 0 }}
                    >
                      No matching categories found
                    </p>
                  )}
                </div>
              </div>

              <div className={`${styles.columnSection} ${styles.rightColumn}`}>
                <div className={styles.articleHeaderRow}>
                  <div>
                    <h3 className={styles.columnHeader}>Matching Articles</h3>
                    <p className={styles.resultCount}>
                      Displaying{" "}
                      <strong>
                        {Math.min(filteredResults.articles.length, 3)}
                      </strong>{" "}
                      of {filteredResults.articles.length} related results
                    </p>
                  </div>
                  {filteredResults.articles.length > 3 && (
                    <button
                      className={styles.viewAllBtn}
                      onClick={handleViewAll}
                    >
                      View All
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
                        {/* 🟢 အသစ်: ဘယ်ဘက်တွင် ပုံရှိမည် */}
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
                    <p
                      style={{ fontSize: "13px", color: "#8a8d9f", margin: 0 }}
                    >
                      No matching articles found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
