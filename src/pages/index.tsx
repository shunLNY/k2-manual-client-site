"use client";

import React, { useEffect, useState } from "react";
import TopicCard from "../components/topiccard/TopicCard";
import SearchSection from "@/components/commons/inputs/SearchSection";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/articles")
      .then((res) => res.json())
      .then((response) => setArticles(response.data || []));
  }, []);

  return (
    <div className={styles.mainContainer}>
      <SearchSection />
      <div>
        <h2 className={styles.sectionTitle}>人気のトピック</h2>

        <div className={styles.grid}>
          {articles.map((article: any) => (
            <TopicCard key={article.id} topic={article} />
          ))}
        </div>
      </div>
    </div>

  );
}



