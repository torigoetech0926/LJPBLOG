'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import defaultImage from '@/public/default.jpg';

interface ArticleImageProps {
  src?: string;
  /** 代替画像候補(frontmatter の image_fallbacks など)。src が死んでいた場合に順に試す */
  fallbackSrcs?: string[];
  alt: string;
  className?: string;
  /** 1候補あたりの読み込みタイムアウト(ms)。無応答のサーバー(Wayback等)からの脱出用 */
  timeoutMs?: number;
}

const WAYBACK_RE = /web\.archive\.org\/web\/\d+(?:im_|id_)?\//i;

function proxyUrl(url: string): string {
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&n=-1`;
}

function originalFromWayback(url: string): string {
  const m = url.match(/web\.archive\.org\/web\/\d+(?:im_|id_)?\/(.+)$/i);
  return m ? m[1] : '';
}

function dedupe(urls: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    const clean = (u ?? '').trim();
    if (clean === '' || seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
  }
  return out;
}

/**
 * 画像読み込み候補を優先度順に生成する。
 *
 * 1. src / fallbackSrcs(frontmatter の image / image_fallbacks)
 * 2. Wayback(im_)URL の場合は「元URL」と「元URLのプロキシ経由」も併記
 *    → Wayback に画像が未アーカイブで 404 になるケースの救済
 * 3. 各外部URLの直後に wsrv.nl 画像プロキシ経由を併記
 *    → Referer / User-Agent ベースのホットリンク保護・UA拒否を回避する再試行
 * 4. デフォルト画像(最終フォールバック)
 *
 * ※ 相対パス(/images/xxx.jpg など、自己ホストした画像)にはプロキシを挟まない。
 */
function buildCandidates(
  src: string | undefined,
  fallbackSrcs: string[] | undefined,
): string[] {
  const bases = dedupe([src, ...(fallbackSrcs ?? [])]);
  const out: string[] = [];

  for (const base of bases) {
    out.push(base);

    if (WAYBACK_RE.test(base)) {
      // Wayback画像が存在しない(404)場合に備え、元URLとそのプロキシ経由も試す
      const original = originalFromWayback(base);
      if (original && /^https?:\/\//i.test(original)) {
        out.push(original);
        out.push(proxyUrl(original));
      }
    }

    if (/^https?:\/\//i.test(base)) {
      out.push(proxyUrl(base));
    }
  }

  out.push(defaultImage.src);
  return dedupe(out);
}

export default function ArticleImage({
  src,
  fallbackSrcs,
  alt,
  className,
  timeoutMs = 15000,
}: ArticleImageProps) {
  // fallbackSrcs は親で毎レンダー新しい配列になり得るため、依存値には結合文字列を使う
  const fallbackKey = (fallbackSrcs ?? []).join('|');
  const candidates = useMemo(
    () => buildCandidates(src, fallbackSrcs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [src, fallbackKey],
  );

  const [idx, setIdx] = useState(0);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // src / fallbackSrcs が変わったらフォールバック位置をリセット
  useEffect(() => {
    setIdx(0);
  }, [src, fallbackKey]);

  // viewport付近に入るまでタイムアウト計測を始めない。
  // (loading="lazy" の画像は画面外では読み込まれないため、
  //  計測してしまうと一覧ページの下の方のカードが誤ってデフォルト画像に
  //  切り替わってしまう)
  useEffect(() => {
    const el = imgRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 読み込みが滞留した場合(onError すら返ってこない無応答)も次の候補へ進む
  useEffect(() => {
    clearTimer();
    if (!inView) return;
    // 候補の末尾(デフォルト画像)はタイムアウトで遷移させない
    if (idx >= candidates.length - 1) return;
    timerRef.current = setTimeout(() => {
      setIdx((prev) => (prev + 1 < candidates.length ? prev + 1 : prev));
    }, timeoutMs);
    return clearTimer;
  }, [idx, candidates, inView, timeoutMs, clearTimer]);

  const imgSrc =
    candidates[Math.min(idx, candidates.length - 1)] ?? defaultImage.src;

  return (
    <img
      key={imgSrc}
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className={className}
      // Referer 送信を止めることで、WordPress 系 CDN の
      // ホットリンク保護(空 Referer 許可パターン)での 403 を回避しやすくなる
      referrerPolicy="no-referrer"
      onLoad={clearTimer}
      onError={() => {
        clearTimer();
        // 候補の末尾(デフォルト画像)で失敗した場合はそれ以上遷移させ、
        // 無限の onError ループを防止する
        setIdx((prev) => (prev + 1 < candidates.length ? prev + 1 : prev));
      }}
    />
  );
}
