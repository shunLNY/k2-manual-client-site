import type { GetServerSideProps } from "next";
import Head from "next/head";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "https://k2-manual-backend-black.vercel.app";

type Category = {
  id: string;
  category_name: string;
  category_slug: string;
  children?: Category[];
};

type Article = {
  id: string;
  title: string;
  description?: string | null;
  excerpt?: string | null;
  thumbnail_path?: string | null;
  category?: {
    category_name?: string;
  } | null;
  published_start_at?: string | null;
};

type HomeProps = {
  articles: Article[];
  categories: Category[];
};

const buildImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("/storage/")) {
    return `${API_URL.replace(/\/$/, "")}/files/image${normalized}`;
  }
  return `${API_URL.replace(/\/$/, "")}${normalized}`;
};

const flattenCategories = (categories: Category[]): Category[] => {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children || []),
  ]);
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const [articlesRes, categoriesRes] = await Promise.all([
    fetch(`${API_URL}/articles`),
    fetch(`${API_URL}/categories`),
  ]);

  const [articlesJson, categoriesJson] = await Promise.all([
    articlesRes.ok ? articlesRes.json() : Promise.resolve({ data: [] }),
    categoriesRes.ok ? categoriesRes.json() : Promise.resolve({ data: [] }),
  ]);

  return {
    props: {
      articles: articlesJson.data || [],
      categories: categoriesJson.data || [],
    },
  };
};

export default function Home({ articles, categories }: HomeProps) {
  const categoryList = flattenCategories(categories);

  return (
    <>
      <Head>
        <title>K2 Manual</title>
      </Head>
      <main className="site-shell">
        <aside className="sidebar">
          <div className="brand">K2 Manual</div>
          <nav>
            {categoryList.map((category) => (
              <a key={category.id} href={`#${category.category_slug}`}>
                {category.category_name}
              </a>
            ))}
          </nav>
        </aside>

        <section className="content">
          <header className="page-header">
            <p>Knowledge base</p>
            <h1>Manual Articles</h1>
          </header>

          {articles.length === 0 ? (
            <div className="empty-state">No public articles yet.</div>
          ) : (
            <div className="article-grid">
              {articles.map((article) => {
                const imageUrl = buildImageUrl(article.thumbnail_path);

                return (
                  <article className="article-card" key={article.id}>
                    {imageUrl ? (
                      <img src={imageUrl} alt="" />
                    ) : (
                      <div className="image-fallback">K2</div>
                    )}
                    <div className="article-body">
                      <span>{article.category?.category_name || "Article"}</span>
                      <h2>{article.title}</h2>
                      <p>{article.description || article.excerpt || ""}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
