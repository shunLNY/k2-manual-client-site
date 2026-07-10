import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./CategoryDetail.module.scss";
import { DBCategoryNode, Article } from "../../utils/types";

const getImageUrl = (path?: string) => {
  if (!path) return "/placeholder-image.jpg";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
};

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

// Keeps the chunk size small so you can see it lazy load your 7 items
const ITEMS_PER_PAGE = 3;

export default function CategoryDetail({
  targetCategory,
  formattedDate,
}: {
  targetCategory: DBCategoryNode;
  formattedDate: string;
}) {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [breadcrumbTrail, setBreadcrumbTrail] = useState<DBCategoryNode[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Lazy load states
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch(`http://localhost:4000/articles`),
          fetch(`http://localhost:4000/categories`),
        ]);

        if (articlesRes.ok) {
          const articleData = await articlesRes.json();
          setAllArticles(articleData.data || articleData);
        }

        if (categoriesRes.ok) {
          const categoryData = await categoriesRes.json();
          const rawCategories = categoryData.data || categoryData;
          const path = findCategoryPath(rawCategories, targetCategory.id);
          if (path) {
            setBreadcrumbTrail(path);
          } else {
            setBreadcrumbTrail([targetCategory]);
          }
        }
      } catch (err) {
        console.error("There was an error retrieving data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [targetCategory.id]);

  // Intersection Observer for lazy loading items on scroll
  useEffect(() => {
    // Clean up previous observer if it exists
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetchingMore) {
          setIsFetchingMore(true);

          // Artificial delay of 1.5 seconds to make loading visible
          setTimeout(() => {
            setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
            setIsFetchingMore(false);
          }, 1500);
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [allArticles, isFetchingMore]);

  // Use actual data only (No duplication)
  const targetArticles = allArticles.filter(
    (a: Article) => a.category_id === targetCategory.id
  );

  // Slice the articles array to only show the "visible" ones
  const visibleArticles = targetArticles.slice(0, visibleCount);

  const cardBreadcrumbText = breadcrumbTrail
    .map((crumb) => crumb.category_name)
    .join(" ＞ ");

  if (loading) {
    return (
      <div className={styles.container}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
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

      <div className={styles.headerArea}>
        <h1 className={styles.title}>{targetCategory.category_name} の記事</h1>
        {/* <div className={styles.date}>更新 : {formattedDate}</div> */}
      </div>

      <div className={styles.articleList}>
        {targetArticles.length > 0 ? (
          <>
            {visibleArticles.map((article: Article) => (
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
                      "建工管理をはじめてご利用になる方、建工管理利用になる方、建工管理に招待を受けた方向けのガイド利用になる方、建工管理に招待を受けた方向けのガに招待を受けた方向けのガイドをまとめて ..."}
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
            ))}

            {/* Loading trigger element */}
            {visibleCount < targetArticles.length && (
              <div
                ref={loadMoreRef}
                className={styles.loader}
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: "30px 0",
                  fontWeight: "bold",
                }}
              >
                {isFetchingMore
                  ? "さらに読み込み中..."
                  : "スクロールして読み込む"}
              </div>
            )}
          </>
        ) : (
          <p className={styles.emptyText}>
            このカテゴリーには記事がありません。
          </p>
        )}
      </div>
    </div>
  );
}
