// app/aboutus/page.tsx
import { getPostData } from './posts';
import ReactMarkdown from 'react-markdown';
import styles from '../_css/aboutus.module.css';

export default async function AboutUsPage() {
  const post = await getPostData();

  return (
    <div className={styles.container}>
      <main className={styles.card}>
        
        {/* タイトルヘッダー */}
        {post.title && (
          <header className={styles.header}>
            <h1 className={styles.mainTitle}>{post.title}</h1>
            <p className={styles.subTitle}>LJPBLOG ガイドライン</p>
          </header>
        )}

        {/* Markdown本文のレンダリング */}
        <article>
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className={styles.h2}>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className={styles.h3}>{children}</h3>
              ),
              p: ({ children }) => (
                <p className={styles.paragraph}>{children}</p>
              ),
              ul: ({ children }) => (
                <ul className={styles.list}>{children}</ul>
              ),
              li: ({ children }) => (
                <li className={styles.listItem}>
                  <span className={styles.bullet} />
                  <div>{children}</div>
                </li>
              ),
              strong: ({ children }) => (
                <strong className={styles.strong}>{children}</strong>
              ),
              hr: () => (
                <hr className={styles.hr} />
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

      </main>
    </div>
  );
}