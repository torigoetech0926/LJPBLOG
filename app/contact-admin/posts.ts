import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getPostData() {
  // posts.ts の位置から相対パスで `../content/aboutus/aboutus.md` を指定
  // （または process.cwd() を起点にする）
  const fullPath = path.join(process.cwd(), 'content/contact-admin/contact-admin.md');

  // ファイルが存在するか事前に安全チェック
  if (!fs.existsSync(fullPath)) {
    throw new Error(`ファイルが見つかりません: ${fullPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // matter でフロントマター（メタデータ）と本文を分離
  const { data, content } = matter(fileContents);

  return {
    title: data.title as string,
    content,
  };
}