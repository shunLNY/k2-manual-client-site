import React, { useEffect, useState } from "react";
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

// တစ်မျက်နှာမှာ ပြသမည့် အရေအတွက်
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
  const [loading, setLoading] = useState(true);

  // Pagination အတွက် State
  const [currentPage, setCurrentPage] = useState(1);

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

  // သက်ဆိုင်ရာ Category အတွက် ဆောင်းပါးများ ရွေးထုတ်ခြင်း
  const targetArticles = allArticles.filter(
    (a: Article) => a.category_id === targetCategory.id
  );

  // Pagination တွက်ချက်မှုများ
  const totalPages = Math.ceil(targetArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // လက်ရှိ စာမျက်နှာအတွက် ပြသမည့် ဆောင်းပါးများကိုသာ ဖြတ်ယူခြင်း
  const visibleArticles = targetArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // စာမျက်နှာပြောင်းသွားပါက အပေါ်ဆုံးသို့ ပြန်တက်ရန်
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1 2 3 ... 10 11 ပုံစံထုတ်ပေးမည့် Logic
  const generatePagination = (current: number, total: number) => {
    if (total <= 6) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, "...", total - 1, total];
    } else if (current >= total - 2) {
      return [1, 2, "...", total - 2, total - 1, total];
    } else {
      return [1, "...", current - 1, current, current + 1, "...", total];
    }
  };

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
                    // ... (ellipsis) အတွက် စစ်ဆေးခြင်း
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
            このカテゴリーには記事がありません。
          </p>
        )}
      </div>
    </div>
  );
}
