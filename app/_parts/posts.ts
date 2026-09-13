// lib/articles.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMetaData {
  slug: string;
  title: string;
  date: string;
  imageURL?: string;
  tags?: string[];
}

const articlesDirectory = path.join(process.cwd(), './content/article');

export function getSortedArticlesData(): ArticleMetaData[] {
  if (!fs.existsSync(articlesDirectory)) {
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

      const rawTags = data.tags || data.themes || [];
      const tags = Array.isArray(rawTags) ? rawTags : [rawTags];

      return {
        slug,
        title: typeof data.title === 'string' ? data.title.trim() : '',
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        imageURL: data.image || undefined,
        tags,
      };
    })
    .filter((article) => article.title !== '');

  return allArticlesData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 指定したタグが含まれる記事のみを取得する関数
 */
export function getArticlesByTag(targetTag: string): ArticleMetaData[] {
  const allArticles = getSortedArticlesData();
  return allArticles.filter((article) => article.tags?.includes(targetTag));
}