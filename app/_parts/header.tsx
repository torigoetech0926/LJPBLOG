"use client";

import React, { useState } from "react";
import style from "../_css/header.module.css";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={style.headerContainer}>
      <nav className={style.header}>
        <Link href="/" className={style.logoLink} onClick={closeMenu}>
          <h1 className={style.title}>LJPBLOG</h1>
        </Link>

        {/* PC向けナビゲーション */}
        <ul className={style.sectionList}>
          <li>
            <Link href="/ai" className={style.navLink}>
              AI
            </Link>
          </li>
          <li>
            <Link href="/technology" className={style.navLink}>
              テクノロジー
            </Link>
          </li>
          <li>
            <Link href="/society" className={style.navLink}>
              社会
            </Link>
          </li>
          <li>
            <Link href="/politics" className={style.navLink}>
              政治
            </Link>
          </li>
          <li>
            <Link href="/economy" className={style.navLink}>
              経済
            </Link>
          </li>
        </ul>

        {/* スマホ用ハンバーガーボタン */}
        <button
          type="button"
          className={`${style.hamburger} ${isMenuOpen ? style.open : ""}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMenuOpen}
        >
          <span className={style.bar}></span>
          <span className={style.bar}></span>
          <span className={style.bar}></span>
        </button>
      </nav>

      {/* スマホ用ドロワーメニュー */}
      <div
        className={`${style.mobileDrawer} ${isMenuOpen ? style.drawerOpen : ""}`}
      >
        <div className={style.drawerContent}>
          <div className={style.drawerSection}>
            <p className={style.drawerHeading}>カテゴリー</p>
            <ul className={style.drawerList}>
              <li>
                <Link href="/ai" className={style.drawerLink} onClick={closeMenu}>
                  AI
                </Link>
              </li>
              <li>
                <Link
                  href="/technology"
                  className={style.drawerLink}
                  onClick={closeMenu}
                >
                  テクノロジー
                </Link>
              </li>
              <li>
                <Link
                  href="/society"
                  className={style.drawerLink}
                  onClick={closeMenu}
                >
                  社会
                </Link>
              </li>
              <li>
                <Link
                  href="/politics"
                  className={style.drawerLink}
                  onClick={closeMenu}
                >
                  政治
                </Link>
              </li>
              <li>
                <Link
                  href="/economy"
                  className={style.drawerLink}
                  onClick={closeMenu}
                >
                  経済
                </Link>
              </li>
            </ul>
          </div>

          <div className={style.drawerSection}>
            <p className={style.drawerHeading}>インフォメーション</p>
            <ul className={style.drawerList}>
              <li>
                <Link
                  href="/aboutus"
                  className={style.drawerLink}
                  onClick={closeMenu}
                >
                  LJPBLOGについて
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className={style.drawerLink}
                  onClick={closeMenu}
                >
                  プライバシーポリシー・免責事項
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-admin"
                  className={style.drawerLink}
                  onClick={closeMenu}
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          <div className={style.drawerSocials}>
            <a
              href="https://x.com/ljpblog"
              target="_blank"
              rel="noopener noreferrer"
              className={style.drawerSocialLink}
              aria-label="X (旧Twitter)"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <Link
              href="/contact-admin"
              className={style.drawerSocialLink}
              onClick={closeMenu}
              aria-label="お問い合わせ"
            >
              <i className="fa-solid fa-envelope"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* ドロワー表示時の背景オーバーレイ */}
      {isMenuOpen && (
        <div className={style.overlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </header>
  );
};

export default Header;
