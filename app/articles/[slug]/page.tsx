import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { getArticleData, getAllArticleSlugs } from "./posts";
import styles from "@/app/_css/article.module.css";
import ArticleImage from "@/app/_parts/ArticleImage";

// ▼▼▼ ここだけ書き換えてください ▼▼▼
const SITE_URL = "https://torigoetech0926.github.io/LJPBLOG/"; // 例: https://myblog.github.io/myrepo
const SITE_NAME = "LJPBLOG";
// ▲▲▲

const DEFAULT_OGP_IMAGE = `${SITE_URL}/default.jpg`;

// 本文（マークダウン）からOGP用の説明文を生成
function createDescription(content: string, maxLength = 120): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`~\-|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength)}…` : plain;
}

// SSG（Static Export）用にすべての記事 slug を事前に取得して Next.js に教える
export async function generateStaticParams() {
  const articles = await getAllArticleSlugs();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// X（Twitter）やSNSシェア用のOGPメタデータをビルド時に生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleData(slug);

  const title = article.title || SITE_NAME;
  const description = createDescription(article.content ?? "");
  const image = article.image || DEFAULT_OGP_IMAGE;
  const url = `${SITE_URL}/articles/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, alt: title }],
      locale: "ja_JP",
      type: "article",
      publishedTime: article.date || undefined,
    },
    twitter: {
      card: "summary_large_image", // Xで画像を大きく表示するカード
      title,
      description,
      images: [image],
    },
  };
}

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

      {/* サムネイル画像 */}
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