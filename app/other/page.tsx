// app/economy/page.tsx
import React, { Suspense } from "react";
import { getSortedArticlesData } from "@/app/_parts/posts";
import styles from "../_css/mainPage.module.css";
import Sidebar from "../_parts/Sidebar";
import PaginatedArticleList from "../_parts/PaginatedArticleList";

export default async function ArticlesPage() {
  const allArticles = await getSortedArticlesData();
  const economyArticles = allArticles.filter((article) =>
    article.tags?.includes("その他")
  );

  return (
    <main className={styles.mainContainer}>
      <section className={styles.articlesSection}>

        <h1 className={styles.title}>その他 記事一覧</h1>

        <Suspense fallback={<p className={styles.noArticles}>読み込み中...</p>}>
          <PaginatedArticleList
            articles={economyArticles}
            basePath="/other"
            emptyMessage="その他に関する記事が見つかりませんでした。"
          />
        </Suspense>
      </section>

      {/* サイドバー */}
      <Sidebar currentCategory="その他" />
    </main>
  );
}