"use client";

import React, { useEffect, useState } from "react";
import TopicCard from "../components/topiccard/TopicCard";
import styles from "../styles/Home.module.scss";
import { Article } from "@/utils/types";
import SearchBox from "@/components/commons/inputs/SearchBox";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/articles")
      .then((res) => res.json())
      .then((response) => {
        if (Array.isArray(response)) {
          setArticles(response);
        } else {
          setArticles(response.data || []);
        }
      })
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.heading}>御困りごとはなんですか？</h1>
      <SearchBox />
      <div>
        <h2 className={styles.sectionTitle}>人気のトピック</h2>

        <div className={styles.grid}>
          {articles.slice(0, 4).map((article: Article) => (
            <TopicCard key={article.id} topic={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
