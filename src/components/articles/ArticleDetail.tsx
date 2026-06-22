import React from "react";
import Image from "next/image";
import styles from "./ArticleDetail.module.scss";
import defaultHeroImage from "../../../public/images/unsplash.png";
import { ArticleDetailProps } from "../../utils/types";
import Link from "next/link";

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
        <Link href="/help-center" className={styles.link}>
          Help Center
        </Link>{" "}
        &gt;{" "}
        <Link href="/help-center/reference" className={styles.link}>
          Reference
        </Link>{" "}
        &gt;
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
