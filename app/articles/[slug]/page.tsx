// app/articles/[slug]/page.tsx
import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getArticleData } from "./posts";
import styles from "@/app/_css/article.module.css";
import ArticleImage from "@/app/_parts/ArticleImage";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleData(slug);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        {/* テーマ・タグ */}
        {article.themes && (
          <div className={styles.tags}>
            {article.themes.map((theme: string) => (
              <span key={theme} className={styles.tag}>
                {theme}
              </span>
            ))}
          </div>
        )}

        {/* 記事タイトル */}
        <h1 className={styles.title}>{article.title}</h1>

        {/* 原題 */}
        {article.original_title && (
          <p className={styles.originalTitle}>
            原題: {article.original_title}
          </p>
        )}

        {/* 動的なメタ情報 ＆ 転載元URLリンク */}
        <div className={styles.metaMeta}>
          {article.date && <time>公開日: {article.date}</time>}

          {/* source_url が設定されていれば動的に外部リンクを表示 */}
          {article.source_url ? (
            <span>
              出所:{" "}
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                {article.source_blog || "元記事を見る"}
              </a>
            </span>
          ) : (
            article.source_blog && <span>出所: {article.source_blog}</span>
          )}

          {article.license && <span>ライセンス: {article.license}</span>}
        </div>
      </header>

      {/* サムネイル画像（画像がない・読み込めない場合は自動的にデフォルト画像を表示） */}
      <div className={styles.mainImageWrapper}>
        <ArticleImage
          src={article.image}
          alt={article.title}
          className={styles.mainImage}
        />
      </div>

      {/* 本文 */}
      <article className={styles.articleBody}>
        <ReactMarkdown
          components={{
            a: ({ href, children }) => {
              const isExternal = href?.startsWith("http");
              return (
                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {article.content}
        </ReactMarkdown>
      </article>

      {/* 記事一覧へ戻る */}
      <div className={styles.backNav}>
        <Link href="/" className={styles.backButton}>
          <i className="fa-solid fa-arrow-left"></i>
          記事一覧に戻る
        </Link>
      </div>
    </main>
  );
}