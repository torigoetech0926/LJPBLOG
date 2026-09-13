// app/economy/page.tsx
import React from "react";
import Link from "next/link";
import { getSortedArticlesData } from "@/app/_parts/posts";
import styles from "../_css/mainPage.module.css";
import ArticleImage from "../_parts/ArticleImage";
import Sidebar from "../_parts/Sidebar";

// 1ページあたりの表示件数を設定
const ITEMS_PER_PAGE = 18;

interface PageProps {
  searchParams: Promise<{ page?: string }> | { page?: string };
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  // 全記事を取得後、「経済」タグを含む記事のみ抽出
  const allArticles = await getSortedArticlesData();
  const techArticles = allArticles.filter((article) =>
    article.tags?.includes("経済")
  );

  const totalArticles = techArticles.length;
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = techArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <main className={styles.mainContainer}>
      <section className={styles.articlesSection}>

        <h1 className={styles.title}>経済 記事一覧</h1>

        {paginatedArticles.length === 0 ? (
          <p className={styles.noArticles}>経済に関する記事が見つかりませんでした。</p>
        ) : (
          <>
            <ul className={styles.articleList}>
              {paginatedArticles.map(({ slug, title, date, imageURL }) => (
                <li key={slug} className={styles.articleItem}>
                  <Link
                    href={`/articles/${slug}`}
                    className={styles.articleCardLink}
                  >
                    <div className={styles.imageWrapper}>
                      <ArticleImage
                        src={imageURL}
                        alt={title}
                        className={styles.articleImage}
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <h2 className={styles.articleTitle}>{title}</h2>
                      {date && (
                        <time className={styles.articleDate}>
                          <i className="fa-regular fa-calendar"></i>
                          {date}
                        </time>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* ページネーション UI */}
            {totalPages > 1 && (
              <nav className={styles.pagination} aria-label="ページ送り">
                {currentPage > 1 && (
                  <Link
                    href={`/economy?page=${currentPage - 1}`}
                    className={styles.paginationLink}
                  >
                    &laquo; 前へ
                  </Link>
                )}

                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={`/economy?page=${page}`}
                        className={`${styles.pageNumber} ${
                          page === currentPage ? styles.activePage : ""
                        }`}
                      >
                        {page}
                      </Link>
                    )
                  )}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/economy?page=${currentPage + 1}`}
                    className={styles.paginationLink}
                  >
                    次へ &raquo;
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </section>

      {/* サイドバー */}
      <Sidebar currentCategory="経済" />
    </main>
  );
}