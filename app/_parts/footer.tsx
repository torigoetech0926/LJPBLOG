import React from "react";
import style from "../_css/footer.module.css";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footerInner}>
        <ul className={style.footerList}>
          <li>
            <Link href="/aboutus" className={style.footerLink}>
              LJPBLOGについて
            </Link>
          </li>
          <li>
            <Link href="/privacy-policy" className={style.footerLink}>
              プライバシーポリシー・免責事項
            </Link>
          </li>
          <li>
            <Link href="/contact-admin" className={style.footerLink}>
              お問い合わせ
            </Link>
          </li>
        </ul>
        <div className={style.copyright}>&copy; 2026 LJPBLOG</div>
      </div>
    </footer>
  );
};

export default Footer;
