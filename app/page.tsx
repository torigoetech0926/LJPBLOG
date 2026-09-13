// app/page.tsx
import React, { Suspense } from "react";
import { getSortedArticlesData } from "./posts";
import styles from "./_css/mainPage.module.css";
import CategoryTabs from "./_parts/CategoryTabs";
import Sidebar from "./_parts/Sidebar";
import PaginatedArticleList from "./_parts/PaginatedArticleList";

export default async function ArticlesPage() {
  const articles = await getSortedArticlesData();

  return (
    <main className={styles.mainContainer}>
      <section className={styles.articlesSection}>
        {/* スマホ対応カテゴリー横スクロールタブ */}
        <CategoryTabs current="すべて" />

        <h1 className={styles.title}>記事一覧</h1>

        <Suspense fallback={<p className={styles.noArticles}>読み込み中...</p>}>
          <PaginatedArticleList articles={articles} basePath="" />
        </Suspense>
      </section>

      {/* サイドバー（PC時は右側、スマホ時は記事下部に表示） */}
      <Sidebar />
    </main>
  );
}