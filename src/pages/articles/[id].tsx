import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArticleDetail from "../../components/articles/ArticleDetail";
import { Article } from "../../utils/types";
export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;

  const [articleData, setArticleData] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If you don't have an ID yet, do nothing and wait.
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:4000/articles/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("This article was not found. (404 Not Found)");
          }
          throw new Error("An error occurred while retrieving data.");
        }

        const data = await response.json();
        setArticleData(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>(Loading...)</div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (!articleData) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        No article data.
      </div>
    );
  }
  return <ArticleDetail article={articleData} />;
}
