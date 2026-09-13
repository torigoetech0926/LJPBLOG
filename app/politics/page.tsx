// app/politics/page.tsx
import React, { Suspense } from "react";
import { getSortedArticlesData } from "@/app/_parts/posts";
import styles from "../_css/mainPage.module.css";
import CategoryTabs from "../_parts/CategoryTabs";
import Sidebar from "../_parts/Sidebar";
import PaginatedArticleList from "../_parts/PaginatedArticleList";

export default async function ArticlesPage() {
  const allArticles = await getSortedArticlesData();
  const politicsArticles = allArticles.filter((article) =>
    article.tags?.includes("政治")
  );

  return (
    <main className={styles.mainContainer}>
      <section className={styles.articlesSection}>
        {/* スマホ対応カテゴリー横スクロールタブ */}
        <CategoryTabs current="政治" />

        <h1 className={styles.title}>政治 記事一覧</h1>

        <Suspense fallback={<p className={styles.noArticles}>読み込み中...</p>}>
          <PaginatedArticleList
            articles={politicsArticles}
            basePath="/politics"
            emptyMessage="政治に関する記事が見つかりませんでした。"
          />
        </Suspense>
      </section>

      {/* サイドバー */}
      <Sidebar currentCategory="政治" />
    </main>
  );
}