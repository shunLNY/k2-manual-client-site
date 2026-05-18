import React from "react";
import { Article } from "../../types/article";
import Image from "next/image";
import styles from "./TopicCard.module.css";

interface TopicCardProps {
  topic: Article;
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <div className={styles.card}>
      <div style={{ position: "relative", width: "100%", height: "150px" }}>
        <Image
          src={topic.thumbnailPath || "/images/card.png"}
          alt={topic.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className={styles.cardcontent}>
        <h4 className="font-bold text-lg mb-2 flex items-center justify-between">
          {topic.title}
          <span>→</span>
        </h4>
        <p className="text-gray-500 text-sm line-clamp-2">
          {topic.excerpt}
        </p>
      </div>
    </div>
  );
}
