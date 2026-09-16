'use client';

import React, { useEffect, useState } from 'react';
import defaultImage from '@/public/default.jpg';

interface ArticleImageProps {
  src?: string;
  alt: string;
  className?: string;
}

/**
 * 画像読み込み候補を優先度順に生成する。
 *
 * 1. 指定された src（frontmatter の image / ローカルパス or リモートURL）
 * 2. 外部画像の場合のみ wsrv.nl 画像プロキシ経由
 *    → Referer / User-Agent ベースのホットリンク保護・UA拒否を回避する再試行
 * 3. デフォルト画像（最終フォールバック）
 *
 * ※ 相対パス（/images/xxx.jpg など、自己ホストした画像）にはプロキシを挟まない。
 */
function buildCandidates(src: string | undefined): string[] {
  const candidates: string[] = [];

  if (src && src.trim() !== '') {
    const trimmed = src.trim();
    candidates.push(trimmed);

    if (/^https?:\/\//i.test(trimmed)) {
      candidates.push(
        `https://wsrv.nl/?url=${encodeURIComponent(trimmed)}&n=-1`,
      );
    }
  }

  candidates.push(defaultImage.src);
  return candidates;
}

export default function ArticleImage({ src, alt, className }: ArticleImageProps) {
  const candidates = React.useMemo(() => buildCandidates(src), [src]);
  const [idx, setIdx] = useState(0);

  // src が変わったらフォールバック位置をリセット
  useEffect(() => {
    setIdx(0);
  }, [src]);

  const imgSrc = candidates[Math.min(idx, candidates.length - 1)] ?? defaultImage.src;

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className={className}
      // Referer 送信を止めることで、WordPress 系 CDN の
      // ホットリンク保護（空 Referer 許可パターン）での 403 を回避しやすくなる
      referrerPolicy="no-referrer"
      onError={() => {
        // 候補の末尾（デフォルト画像）で失敗した場合はそれ以上遷移させ、
        // 無限の onError ループを防止する
        setIdx((prev) => (prev + 1 < candidates.length ? prev + 1 : prev));
      }}
    />
  );
}
