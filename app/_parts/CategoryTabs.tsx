import React from "react";
import Link from "next/link";
import styles from "../_css/mainPage.module.css";

interface CategoryTabsProps {
  current?: string;
}

const CATEGORIES = [
  { label: "すべて", href: "/" },
  { label: "AI", href: "/ai" },
  { label: "テクノロジー", href: "/technology" },
  { label: "社会", href: "/society" },
  { label: "政治", href: "/politics" },
  { label: "経済", href: "/economy" },
];

export default function CategoryTabs({ current = "すべて" }: CategoryTabsProps) {
  return (
    <div className={styles.categoryTabsContainer}>
      <nav className={styles.categoryTabsNav} aria-label="カテゴリー一覧">
        {CATEGORIES.map((cat) => {
          const isActive = cat.label === current;
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`${styles.categoryTab} ${
                isActive ? styles.categoryTabActive : ""
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
