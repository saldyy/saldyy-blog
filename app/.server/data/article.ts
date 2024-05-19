import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';


const articles: any = []

export const getAticles = async () => {
  if (articles.length !== 0) {
    console.log('cache')
    return {
      data: articles
    }
  }
  const result = fs.readFileSync(path.resolve('app/assets/blogs/01.md'), 'utf8');
  const article = matter(result);
  articles.push(article);
  return { data: articles };
}
