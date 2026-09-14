'use client';

import React, { useState } from 'react';
import defaultImage from '@/public/default.jpg';

interface ArticleImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export default function ArticleImage({ src, alt, className }: ArticleImageProps) {
  // srcが未定義、空文字、またはエラー時に defaultImage.src を使用
  const initialSrc = src && src.trim() !== '' ? src : defaultImage.src;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => {
        // 画像の読み込み（404エラー等）に失敗した場合、デフォルト画像に切り替える
        if (imgSrc !== defaultImage.src) {
          setImgSrc(defaultImage.src);
        }
      }}
    />
  );
}