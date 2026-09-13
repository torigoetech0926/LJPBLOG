// app/economy/page.tsx
import React, { Suspense } from "react";
import { getSortedArticlesData } from "@/app/_parts/posts";
import styles from "../_css/mainPage.module.css";
import CategoryTabs from "../_parts/CategoryTabs";
import Sidebar from "../_parts/Sidebar";
import PaginatedArticleList from "../_parts/PaginatedArticleList";

export default async function ArticlesPage() {
  const allArticles = await getSortedArticlesData();
  const economyArticles = allArticles.filter((article) =>
    article.tags?.includes("経済")
  );

  return (
    <main className={styles.mainContainer}>
      <section className={styles.articlesSection}>
        {/* スマホ対応カテゴリー横スクロールタブ */}
        <CategoryTabs current="経済" />

        <h1 className={styles.title}>経済 記事一覧</h1>

        <Suspense fallback={<p className={styles.noArticles}>読み込み中...</p>}>
          <PaginatedArticleList
            articles={economyArticles}
            basePath="/economy"
            emptyMessage="経済に関する記事が見つかりませんでした。"
          />
        </Suspense>
      </section>

      {/* サイドバー */}
      <Sidebar currentCategory="経済" />
    </main>
  );
}