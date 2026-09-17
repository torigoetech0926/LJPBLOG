'use client';

import React, { useEffect, useState } from 'react';
import defaultImage from '@/public/default.jpg';

interface ArticleImageProps {
  src?: string;
  /** 代替候補(frontmatter の image_fallbacks など)。任意。src が死んでいる場合に順に試す */
  fallbackSrcs?: string[];
  alt: string;
  className?: string;
}

// ── basePath 対応(今回の修正核心) ──────────────────────────────────────
// GitHub Pages では next.config.ts の basePath「/LJPBLOG」配下で公開される。
// frontmatter の「/images/article/xxx.jpg」のようなルート相対パスを <img src>
// にそのまま渡すと「https://…github.io/images/article/xxx.jpg」(basePath 抜き)
// を見に行って 404 になり、デフォルト画像にフォールバックしてしまう。
//
// next.config.ts が env で公開している NEXT_PUBLIC_BASE_PATH を先頭に付けて
// 「/LJPBLOG/images/article/xxx.jpg」に補正する。
//
// ※ 静的 import(default.jpg)は Next.js が自動で basePath を付与するため触らない。
// ※ 外部URL(http/https)もそのまま。
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');

function withBasePath(path: string): string {
  if (!BASE_PATH) return path; // ローカル開発(basePath 無し)では何もしない
  if (!path.startsWith('/')) return path; // 外部URL・相対パスはそのまま
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) {
    return path; // 既に basePath が付いている場合は二重付与しない
  }
  return `${BASE_PATH}${path}`;
}

/**
 * 画像読み込み候補を優先度順に生成する。
 *
 * 1. 指定された src(frontmatter の image。自己ホスト相対パスは basePath 補正)
 * 2. fallbackSrcs(image_fallbacks: mshots 変換URL・元URLなど)
 *    - 外部画像の場合のみ wsrv.nl 画像プロキシ経由の再試行も追加
 *      → Referer / User-Agent ベースのホットリンク保護・UA拒否を回避する
 * 3. デフォルト画像(最終フォールバック)
 *
 * ※ 自己ホストした相対パス(/images/xxx.jpg)にはプロキシを挟まない。
 */
function buildCandidates(
  src: string | undefined,
  fallbackSrcs?: string[],
): string[] {
  const candidates: string[] = [];

  const push = (raw?: string) => {
    if (!raw || raw.trim() === '') return;
    const trimmed = raw.trim();
    candidates.push(withBasePath(trimmed));
    // 外部画像のみプロキシ再試行を追加
    if (/^https?:\/\//i.test(trimmed)) {
      candidates.push(
        `https://wsrv.nl/?url=${encodeURIComponent(trimmed)}&n=-1`,
      );
    }
  };

  push(src);
  (fallbackSrcs ?? []).forEach(push);
  candidates.push(defaultImage.src);
  return candidates;
}

export default function ArticleImage({
  src,
  fallbackSrcs,
  alt,
  className,
}: ArticleImageProps) {
  const candidates = React.useMemo(
    () => buildCandidates(src, fallbackSrcs),
    [src, fallbackSrcs],
  );
  const [idx, setIdx] = useState(0);

  // src が変わったらフォールバック位置をリセット
  useEffect(() => {
    setIdx(0);
  }, [src, fallbackSrcs]);

  const imgSrc =
    candidates[Math.min(idx, candidates.length - 1)] ?? defaultImage.src;

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className={className}
      // Referer 送信を止めることで、WordPress 系 CDN の
      // ホットリンク保護(空 Referer 許可パターン)での 403 を回避しやすくなる
      referrerPolicy="no-referrer"
      onError={() => {
        // 候補の末尾(デフォルト画像)で失敗した場合はそれ以上遷移させ、
        // 無限の onError ループを防止する
        setIdx((prev) => (prev + 1 < candidates.length ? prev + 1 : prev));
      }}
    />
  );
}