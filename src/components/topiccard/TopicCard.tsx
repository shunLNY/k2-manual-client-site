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
          // src={topic.imageUrl}
          alt={topic.title}
          fill // Container အပြည့် ဖြစ်စေရန်
          style={{ objectFit: "cover" }} // CSS Module ထဲမှာလည်း ရေးနိုင်သည်
          sizes="(max-width: 768px) 100vw, 33vw" // Responsive ဖြစ်စေရန်
        />
      </div>
      <div className={styles.cardcontent}>
        <h4>{topic.title}</h4>
        <p>{topic.description}</p>
      </div>
    </div>
  );
}
