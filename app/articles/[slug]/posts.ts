// app/articles/[slug]/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleData {
  slug: string;
  title: string;
  original_title?: string;
  author?: string;
  source_blog?: string;
  source_url?: string;
  date?: string;
  license?: string;
  themes?: string[];
  image?: string;
  content: string;
}

// process.cwd() は my-app 直下を指すため、content/article が正確なパス
const postsDirectory = path.join(process.cwd(), 'content/article');

export async function getArticleData(slug: string): Promise<ArticleData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  return {
    slug,
    title: (data.title as string) || '無題',
    original_title: data.original_title as string,
    author: data.author as string,
    source_blog: data.source_blog as string,
    source_url: data.source_url as string,
    date: data.date ? String(data.date) : '',
    license: data.license as string,
    themes: data.themes as string[],
    image: data.image as string,
    content,
  };
}

/**
 * 全記事の slug 一覧を取得する関数
 */
export function getAllArticleSlugs() {
  console.log('[DEBUG] Target postsDirectory:', postsDirectory);

  if (!fs.existsSync(postsDirectory)) {
    console.error('[ERROR] Directory does not exist:', postsDirectory);
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const slugs = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));

  console.log(`[DEBUG] Found ${slugs.length} articles.`);
  return slugs;
}