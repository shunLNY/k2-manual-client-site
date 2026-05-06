import React from "react";
import { popularTopics } from "../data/mockData";
import styles from "../styles/Home.module.scss";
import SearchSection from "@/components/commons/inputs/SearchSection";
import TopicCard from "../components/topiccard/TopicCard";

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <SearchSection />
      <div>
        <h2 className={styles.sectionTitle}>人気のトピック</h2>

        <div className={styles.grid}>
          {popularTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
