import React from 'react'
import type { Metadata } from 'next' // 1. Metadata型をインポート
import Header from './_parts/header'
import Footer from './_parts/footer'
import './_css/globals.css'

// 2. メタデータ（タイトル・説明文・ファビコン）を定義
export const metadata: Metadata = {
  title: 'LJPBLOG',
  description: 'ロンドン・スクール・オブ・エコノミクス（LSE）が公開している社会科学の解説ブログ群であるLSE Blogsを日本人向けに翻訳した非公式サイトです。日本に関係のあるAI・テクノロジー・社会・政治・経済の情報についてまとめています。', // 検索結果に表示される説明文
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        {/* CDNなどの外部CSSリンクは引き続き直接記述可能 */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

export default Layout