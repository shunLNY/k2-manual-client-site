import React from "react";
import Image from "next/image";
import styles from "./TopicCard.module.css";
import { Article } from "../../utils/types";

interface TopicCardProps {
  topic: Article;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const thumbnailPath = topic.thumbnail_path || topic.thumbnail_path;

  const imageUrl = thumbnailPath
    ? thumbnailPath.startsWith("http")
      ? thumbnailPath
      : `${API_BASE_URL}${thumbnailPath}`
    : "/images/card.png";

  return (
    <div className={styles.card}>
      <div style={{ position: "relative", width: "100%", height: "150px" }}>
        <Image
          src={imageUrl}
          alt={topic.title || "Topic Image"}
          fill
          unoptimized={true}
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={styles.cardcontent}>
        <h4 className="font-bold text-lg mb-2 flex items-center justify-between">
          {topic.title}
          <span>→</span>
        </h4>
        <p className="text-gray-500 text-sm line-clamp-2">{topic.excerpt}</p>
      </div>
    </div>
  );
}
