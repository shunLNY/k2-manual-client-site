import React from "react";
import Image from "next/image";
import styles from "./ArticleDetail.module.scss";
import defaultHeroImage from "../../../public/images/unsplash.png";
import { ArticleDetailProps } from "../../utils/types";

export default function ArticleDetail({ article }: ArticleDetailProps) {
  if (!article) {
    return (
      <div className={styles.container}>データကို 불러오는 중입니다...</div>
    );
  }

  console.log("Article Data:", article);

  return (
    <div className={styles.container}>
      {/* 1. Breadcrumb */}
      <div className={styles.breadcrumb}>
        Help Center &gt; Reference &gt;{" "}
        {/* 1. If there is a Main Category, it will be displayed first. */}
        {article.category?.parentCategory?.category_name && (
          <>{article.category.parentCategory.category_name} &gt; </>
        )}
        {/* 2. If the current Category (Sub Category) exists, it will continue to be displayed. */}
        {article.category?.category_name && (
          <>{article.category.category_name} &gt; </>
        )}
        {/* 3. Finally, the article title will be displayed. */}
        <span>{article.title}</span>
      </div>

      {/* 2. Main Title */}
      <h1 className={styles.mainTitle}>{article.title}</h1>

      <div className={styles.heroImageWrapper}>
        <Image
          src={
            article.thumbnail_path
              ? `http://localhost:4000${article.thumbnail_path}`
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
        {/* 4. Summary Box */}
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
              {/* use the category_name directly from article.category. */}
              {article.category?.category_name || "リリース"}
            </div>
          </div>
        </div>

        {/* 5. SummerNote Rich Text Content */}
        <div
          className={styles.summernoteContent}
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />
      </div>
    </div>
  );
}
