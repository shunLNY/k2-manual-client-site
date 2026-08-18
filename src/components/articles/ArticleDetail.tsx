import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ArticleDetail.module.scss";
import defaultHeroImage from "../../../public/images/unsplash.png";
import { ArticleDetailProps } from "../../utils/types";
import Link from "next/link";
import { apiUrl, getImageUrl } from "@/utils/api";

export default function ArticleDetail({ article }: ArticleDetailProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    const categoryId = article?.category?.id;

    if (categoryId) {
      const fetchRelatedArticles = async () => {
        try {
          const response = await fetch(
            apiUrl(`/articles?category_id=${categoryId}`)
          );

          if (response.ok) {
            const responseData = await response.json();
            const articlesArray = Array.isArray(responseData)
              ? responseData
              : responseData.data ||
                responseData.articles ||
                responseData.items ||
                [];

            const filteredArticles = articlesArray
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((item: any) => item.id !== article.id)
              .slice(0, 3);

            setRelatedArticles(filteredArticles);
          }
        } catch (error) {
          console.error("Error fetching related articles:", error);
        }
      };

      fetchRelatedArticles();
    }
  }, [article]);

  if (!article) {
    return <div className={styles.container}>Data information...</div>;
  }

  return (
    <div className={styles.container}>
      {/* 1. Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.link}>
          Help Center
        </Link>{" "}
        &gt;{" "}
        {article.category?.parentCategory?.category_name && (
          <>
            <Link
              href={`/category/${article.category.parentCategory.id}`}
              className={styles.link}
            >
              {article.category.parentCategory.category_name}
            </Link>{" "}
            &gt;{" "}
          </>
        )}
        {article.category?.category_name && (
          <>
            <Link
              href={`/category/${article.category.id}`}
              className={styles.link}
            >
              {article.category.category_name}
            </Link>{" "}
            &gt;{" "}
          </>
        )}
        <span className={styles.current}>{article.title}</span>
      </div>

      {/* 2. Main Title */}
      <h1 className={styles.mainTitle}>{article.title}</h1>

      {/* 4. Hero Image */}
      <div className={styles.heroImageWrapper}>
        <Image
          src={
            article.thumbnail_path
              ? getImageUrl(article.thumbnail_path)
              : defaultHeroImage
          }
          alt={article.title}
          fill
          style={{ objectFit: "cover" }}
          className={styles.image}
          priority
          unoptimized
        />
      </div>

      <div className={styles.bgcolor}>
        {/* 5. Summary Box */}
        <div className={styles.summarySection}>
          <div className={styles.summaryLeft}>
            <div className={styles.summaryLabel}>この記事では</div>
            <div className={styles.summaryText}>
              {article.summary || `${article.excerpt}`}
            </div>
          </div>
          <div className={styles.summaryRight}>
            <div className={styles.summaryLabel}>カテゴリー</div>
            <div className={styles.tag}>
              {article.category?.category_name || "リリース"}
            </div>
          </div>
        </div>

        {/* 6. SummerNote Rich Text Content */}
        <div
          className={styles.summernoteContent}
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />
      </div>

      {/* 3. Related Articles */}
      {relatedArticles.length > 0 && (
        <div className={styles.relatedArticlesSection}>
          <h3 className={styles.relatedTitle}>関連記事 (Related Articles)</h3>
          <ul className={styles.relatedList}>
            {relatedArticles.map((relArticle) => (
              <li key={relArticle.id} className={styles.relatedItem}>
                <Link
                  href={`/articles/${relArticle.id}`}
                  className={styles.relatedLink}
                >
                  {relArticle.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
