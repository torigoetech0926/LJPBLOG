import React from "react";
import Link from "next/link";
import styles from "../_css/mainPage.module.css";

interface SidebarProps {
  currentCategory?: string;
}

const CATEGORIES = [
  { label: "AI", href: "/ai" },
  { label: "テクノロジー", href: "/technology" },
  { label: "社会", href: "/society" },
  { label: "政治", href: "/politics" },
  { label: "経済", href: "/economy" },
];

export default function Sidebar({ currentCategory }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      {/* SNSアイコン */}
      <section className={styles.socialSection}>
        <h3 className={styles.sidebarTitle}>SNS / お問い合わせ</h3>
        <ul className={styles.iconsList}>
          <li className={styles.icon}>
            <a
              href="https://x.com/ljpblog"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconURL}
              aria-label="公式Xアカウント"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </li>
          <li className={styles.icon}>
            <Link
              href="/contact-admin"
              className={styles.iconURL}
              aria-label="管理者へのお問い合わせ"
            >
              <i className="fa-solid fa-envelope"></i>
            </Link>
          </li>
        </ul>
      </section>

      {/* カテゴリー一覧 */}
      <section className={styles.categorySection}>
        <h3 className={styles.sidebarTitle}>カテゴリー</h3>
        <ul className={styles.categoryList}>
          {CATEGORIES.map((cat) => (
            <li key={cat.href} className={styles.categoryListItem}>
              <Link
                href={cat.href}
                className={`${styles.categoryLink} ${
                  currentCategory === cat.label ? styles.activeCategoryLink : ""
                }`}
              >
                <span>{cat.label}</span>
                <i className="fa-solid fa-chevron-right"></i>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
