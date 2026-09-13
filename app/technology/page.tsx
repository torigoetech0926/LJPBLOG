// app/technology/page.tsx
import React, { Suspense } from "react";
import { getSortedArticlesData } from "@/app/_parts/posts";
import styles from "../_css/mainPage.module.css";
import CategoryTabs from "../_parts/CategoryTabs";
import Sidebar from "../_parts/Sidebar";
import PaginatedArticleList from "../_parts/PaginatedArticleList";

export default async function ArticlesPage() {
  const allArticles = await getSortedArticlesData();
  const techArticles = allArticles.filter((article) =>
    article.tags?.includes("テクノロジー")
  );

  return (
    <main className={styles.mainContainer}>
      <section className={styles.articlesSection}>
        {/* スマホ対応カテゴリー横スクロールタブ */}
        <CategoryTabs current="テクノロジー" />

        <h1 className={styles.title}>テクノロジー 記事一覧</h1>

        <Suspense fallback={<p className={styles.noArticles}>読み込み中...</p>}>
          <PaginatedArticleList
            articles={techArticles}
            basePath="/technology"
            emptyMessage="テクノロジーに関する記事が見つかりませんでした。"
          />
        </Suspense>
      </section>

      {/* サイドバー */}
      <Sidebar currentCategory="テクノロジー" />
    </main>
  );
}