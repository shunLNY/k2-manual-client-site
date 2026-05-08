import React from "react";
import { Topic } from "../../types";
import card from "../../../public/images/card.png";
import Image from "next/image";
import styles from "./TopicCard.module.css";

interface TopicCardProps {
  topic: Topic;
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <div className={styles.card}>
      <div style={{ position: "relative", width: "100%", height: "150px" }}>
        <Image
          src={card}
          alt={topic.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className={styles.cardcontent}>
        <h4>{topic.title}</h4>
        <p>{topic.description}</p>
      </div>
    </div>
  );
}
