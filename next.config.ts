import type { NextConfig } from "next";

// GitHub Pages（本番ビルド時）はリポジトリ名 (/LJPBLOG) を basePath に設定
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const isBuild =
  process.env.NODE_ENV === "production" ||
  isGithubActions ||
  process.argv.some((arg) => arg.includes("build"));

const basePath = isBuild ? "/LJPBLOG" : "";
console.log("NEXT_CONFIG_EVAL:", { isGithubActions, isBuild, basePath, argv: process.argv, env_node_env: process.env.NODE_ENV });

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
