"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "../_css/mainPage.module.css";
import ArticleImage from "./ArticleImage";
import { ArticleMetaData } from "./posts";

interface PaginatedArticleListProps {
  articles: ArticleMetaData[];
  basePath?: string;
  itemsPerPage?: number;
  emptyMessage?: string;
}

export default function PaginatedArticleList({
  articles,
  basePath = "",
  itemsPerPage = 18,
  emptyMessage = "記事が見つかりませんでした。",
}: PaginatedArticleListProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = articles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPageUrl = (page: number) => {
    const prefix = basePath || "/";
    if (page === 1) {
      return prefix;
    }
    return `${prefix.includes("?") ? prefix + "&" : prefix + "?"}page=${page}`;
  };

  if (articles.length === 0) {
    return <p className={styles.noArticles}>{emptyMessage}</p>;
  }

  return (
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
          {/* 前へボタン */}
          {currentPage > 1 && (
            <Link
              href={getPageUrl(currentPage - 1)}
              className={styles.paginationLink}
            >
              &laquo; 前へ
            </Link>
          )}

          {/* ページ番号一覧 */}
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={getPageUrl(page)}
                className={`${styles.pageNumber} ${
                  page === currentPage ? styles.activePage : ""
                }`}
              >
                {page}
              </Link>
            ))}
          </div>

          {/* 次へボタン */}
          {currentPage < totalPages && (
            <Link
              href={getPageUrl(currentPage + 1)}
              className={styles.paginationLink}
            >
              次へ &raquo;
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
