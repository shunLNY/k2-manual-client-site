import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./TopicCard.module.css";
import { Article } from "../../utils/types";
import { getImageUrl } from "@/utils/api";

interface TopicCardProps {
  topic: Article;
}

export default function TopicCard({ topic }: TopicCardProps) {
  console.log("Updated Category:", topic.category);
  const rawPath = topic.thumbnail_path;
  const initialImageUrl = getImageUrl(rawPath, "/images/card.png");

  const [imgSrc, setImgSrc] = useState(initialImageUrl);
  const fallbackImage =
    "https://placehold.co/400x250/e2e8f0/64748b?text=No+Image";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCategoryPath = (category: any): string => {
    if (!category) return "";
    if (category.parentCategory) {
      const parentPath = getCategoryPath(category.parentCategory);
      return parentPath
        ? `${parentPath} ＞ ${category.category_name}`
        : category.category_name;
    }
    return category.category_name || "";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRootCategorySlug = (category: any): string => {
    if (!category) return "";
    if (category.parentCategory) {
      return getRootCategorySlug(category.parentCategory);
    }
    return category.category_slug || "";
  };

  const fullCategoryPath = topic.category
    ? getCategoryPath(topic.category)
    : topic.category_name || "";

  const rootCategorySlug = topic.category
    ? getRootCategorySlug(topic.category)
    : "";
  const tabQuery = rootCategorySlug ? `?tab=${rootCategorySlug}` : "";

  return (
    <Link href={`/articles/${topic.id}${tabQuery}`} className={styles.card}>
      <div className={styles.cardImageContainer}>
        <Image
          src={imgSrc}
          alt={topic.title || "Topic Image"}
          fill
          unoptimized={true}
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => {
            setImgSrc(fallbackImage);
          }}
        />
      </div>

      <div className={styles.cardcontent}>
        <p className={styles.category}>{fullCategoryPath}</p>

        <h4>
          <span className={styles.titleText}>{topic.title}</span>
        </h4>

        <p className={styles.excerpt}>{topic.excerpt}</p>

        <p className={styles.date}>
          {topic.createdAt
            ? new Date(topic.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "June 25, 2026"}
        </p>
      </div>
    </Link>
  );
}
