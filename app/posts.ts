// lib/articles.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMetaData {
  slug: string;
  title: string;
  date: string;
  imageURL?: string; // 画像URLをオプションとして追加
}

// content/article フォルダの絶対パスを取得
const articlesDirectory = path.join(process.cwd(), './content/article');

export function getSortedArticlesData(): ArticleMetaData[] {
  if (!fs.existsSync(articlesDirectory)) {
    console.log(`Directory not found: ${articlesDirectory}`);
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);

  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: typeof data.title === 'string' ? data.title.trim() : '',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        imageURL: data.image || undefined,
      };
    })
    // タイトルが空（または設定されていない）記事を除外
    .filter((article) => article.title !== '');

  return allArticlesData.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}