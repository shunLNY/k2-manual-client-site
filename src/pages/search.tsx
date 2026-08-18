import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/SearchPage.module.scss";
import { DBCategoryNode, Article } from "../utils/types";
import { apiUrl, getImageUrl } from "@/utils/api";

const findCategoryPath = (
  nodes: DBCategoryNode[],
  targetId: string,
  currentPath: DBCategoryNode[] = []
): DBCategoryNode[] | null => {
  for (const node of nodes) {
    const path = [...currentPath, node];

    if (node.id === targetId) {
      return path;
    }

    if (node.children && node.children.length > 0) {
      const foundPath = findCategoryPath(node.children, targetId, path);
      if (foundPath) return foundPath;
    }
  }
  return null;
};

// Define how many items you want per page
const ITEMS_PER_PAGE = 3;

export default function SearchResultsPage() {
  const router = useRouter();
  const { q, category_id, cid } = router.query;
  const searchQuery = typeof q === "string" ? q : "";
  const targetCategoryId = (
    typeof category_id === "string"
      ? category_id
      : typeof cid === "string"
      ? cid
      : ""
  ).trim();

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<DBCategoryNode[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [breadcrumbTrail, setBreadcrumbTrail] = useState<DBCategoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch(apiUrl("/articles")),
          fetch(apiUrl("/categories")),
        ]);

        if (articlesRes.ok) {
          const articleData = await articlesRes.json();
          setAllArticles(articleData.data || articleData);
        }

        if (categoriesRes.ok) {
          const categoryData = await categoriesRes.json();
          setCategories(categoryData.data || categoryData);
        }
      } catch (err) {
        console.error("There was an error retrieving data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let results = allArticles;

    if (targetCategoryId) {
      results = results.filter((a) => a.category_id === targetCategoryId);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      results = results.filter((a) => {
        const titleMatch = a.title?.toLowerCase().includes(lowerQuery);
        const excerptMatch = a.excerpt?.toLowerCase().includes(lowerQuery);
        const categoryMatch =
          a.category?.category_name?.toLowerCase().includes(lowerQuery) ||
          a.category_name?.toLowerCase().includes(lowerQuery);

        return titleMatch || excerptMatch || categoryMatch;
      });
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredArticles(results);
    setCurrentPage(1);
  }, [searchQuery, targetCategoryId, allArticles]);

  useEffect(() => {
    let activeCategoryId = targetCategoryId;
    if (!activeCategoryId && filteredArticles.length > 0) {
      activeCategoryId = filteredArticles[0].category_id || "";
    }

    if (activeCategoryId && categories.length > 0) {
      const path = findCategoryPath(categories, activeCategoryId);
      if (path && path.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBreadcrumbTrail(path);

        const rootId = path[0].id;
        if (typeof window !== "undefined") {
          sessionStorage.setItem("lastActiveTab", rootId);
          window.dispatchEvent(
            new CustomEvent("updateActiveCategory", {
              detail: { rootId },
            })
          );
        }
      } else {
        setBreadcrumbTrail([]);
      }
    } else {
      setBreadcrumbTrail([]);
    }
  }, [targetCategoryId, categories, filteredArticles]);

  // --- Pagination Calculations ---
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleArticles = filteredArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb Section */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.link}>
          Help Center
        </Link>

        {breadcrumbTrail.map((crumb, index) => {
          const isLast = index === breadcrumbTrail.length - 1;

          return (
            <React.Fragment key={crumb.id}>
              <span className={styles.separator}> &gt; </span>
              {isLast ? (
                <span className={styles.activeStep}>{crumb.category_name}</span>
              ) : (
                <Link href={`/category/${crumb.id}`} className={styles.link}>
                  {crumb.category_name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Header Area */}
      <div className={styles.headerArea}>
        <h1 className={styles.title}>
          Results for “{searchQuery || "すべて"}” の記事
        </h1>
        <div className={styles.date}>
          found {filteredArticles.length} results
        </div>
      </div>

      {/* Articles List */}
      <div className={styles.articleList}>
        {filteredArticles.length > 0 ? (
          <>
            {/* Map over visibleArticles instead of filteredArticles */}
            {visibleArticles.map((article: Article) => {
              const cardTrail = findCategoryPath(
                categories,
                article.category_id || ""
              );
              const cardBreadcrumbText = cardTrail
                ? cardTrail.map((crumb) => crumb.category_name).join(" ＞ ")
                : article.category_name || "未分類";

              return (
                <Link
                  href={`/articles/${article.id}`}
                  key={article.id}
                  className={styles.articleCard}
                >
                  <div className={styles.imageContainer}>
                    <Image
                      src={getImageUrl(article.thumbnail_path)}
                      alt={article.title}
                      fill
                      className={styles.articleImage}
                      sizes="(max-width: 768px) 100vw, 280px"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                        e.currentTarget.srcset = "";
                      }}
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.cardBreadcrumb}>
                      {cardBreadcrumbText}
                    </div>

                    <h2 className={styles.cardTitle}>{article.title}</h2>

                    <p className={styles.cardDescription}>
                      {article.excerpt ||
                        article.summary ||
                        "記事の詳細プレビューテキストがここに表示されます。"}
                    </p>

                    <div className={styles.cardDate}>
                      {article.updatedAt
                        ? new Date(article.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "June 25, 2026"}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    if (index > 0 && page !== array[index - 1] + 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <span className={styles.ellipsis}>...</span>
                          <button
                            className={`${styles.pageButton} ${
                              currentPage === page
                                ? styles.pageButtonActive
                                : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    }

                    return (
                      <button
                        key={page}
                        className={`${styles.pageButton} ${
                          currentPage === page ? styles.pageButtonActive : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>
            )}
          </>
        ) : (
          <p className={styles.emptyText}>
            該当する記事が見つかりませんでした。
          </p>
        )}
      </div>
    </div>
  );
}
