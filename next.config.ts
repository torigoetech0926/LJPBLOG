import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pagesで画像の最適化機能（next/image）が使えないため無効化
  images: {
    unoptimized: true,
  },
};

export default nextConfig;