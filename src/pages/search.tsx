import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./SearchPage.module.scss";
import { DBCategoryNode, Article } from "../utils/types";

const getImageUrl = (path?: string) => {
  if (!path) return "/placeholder-image.jpg";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
};

// Tree Structure ထဲတွင် Root မှစ၍ သက်ဆိုင်ရာ Category (Level 1, 2, 3...) ဆီသို့ သွားသော လမ်းကြောင်းကို ရှာပေးသည့် Function
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

  // 1. API သို့မဟုတ် Database မှ ဒေတာများ ဆွဲယူခြင်း
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

  // 2. Search Query နှင့် Category Filter ကို အသုံးပြု၍ Articles များကို စစ်ထုတ်ခြင်း
  // Note: Moved this ABOVE the breadcrumb logic so we can use the filtered results to guess the category if needed.
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

    setFilteredArticles(results);
  }, [searchQuery, targetCategoryId, allArticles]);

  // 3. URL ပါ Category ID ကို အခြေခံပြီး Level 1, 2, 3 အစရှိသဖြင့် Page Breadcrumb Trail ကို Dynamic တွက်ချက်ခြင်း
  useEffect(() => {
    let activeCategoryId = targetCategoryId;

    // 🟢 SMART FALLBACK FIX: If no category is in the URL, but ALL filtered articles
    // belong to the exact same category, infer that category to build the breadcrumbs.
    if (!activeCategoryId && filteredArticles.length > 0) {
      const firstCatId = filteredArticles[0].category_id;
      const allShareSameCategory = filteredArticles.every(
        (a) => a.category_id === firstCatId
      );

      if (allShareSameCategory && firstCatId) {
        activeCategoryId = firstCatId;
      }
    }

    if (activeCategoryId && categories.length > 0) {
      const path = findCategoryPath(categories, activeCategoryId);
      if (path) {
        setBreadcrumbTrail(path);
      } else {
        setBreadcrumbTrail([]);
      }
    } else {
      setBreadcrumbTrail([]);
    }
  }, [targetCategoryId, categories, filteredArticles]);

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
          filteredArticles.map((article: Article) => {
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
          })
        ) : (
          <p className={styles.emptyText}>
            該当する記事が見つかりませんでした。
          </p>
        )}
      </div>
    </div>
  );
}
