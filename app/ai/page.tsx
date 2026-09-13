// app/ai/page.tsx
import React, { Suspense } from "react";
import { getSortedArticlesData } from "@/app/_parts/posts";
import styles from "../_css/mainPage.module.css";
import Sidebar from "../_parts/Sidebar";
import PaginatedArticleList from "../_parts/PaginatedArticleList";

export default async function ArticlesPage() {
  const allArticles = await getSortedArticlesData();
  const aiArticles = allArticles.filter((article) =>
    article.tags?.includes("AI")
  );

  return (
    <main className={styles.mainContainer}>
      <section className={styles.articlesSection}>

        <h1 className={styles.title}>AI 記事一覧</h1>

        <Suspense fallback={<p className={styles.noArticles}>読み込み中...</p>}>
          <PaginatedArticleList
            articles={aiArticles}
            basePath="/ai"
            emptyMessage="AIに関する記事が見つかりませんでした。"
          />
        </Suspense>
      </section>

      {/* サイドバー */}
      <Sidebar currentCategory="AI" />
    </main>
  );
}