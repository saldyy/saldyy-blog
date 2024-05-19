import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

const ARTICLE_RELATIVE_DIR = 'app/assets/blogs'
const cacheArticles: any = []

export const getArticles = async () => {
  if (cacheArticles.length !== 0 && false) {
    return {
      data: cacheArticles
    }
  }
  const allFiles = getAllArticlFiles()
  allFiles.forEach((file) => {
    const article = parseArticle(file)
    cacheArticles.push(article)
  })
  console.log(cacheArticles, 'cacheArticles')

  return { data: cacheArticles }
}

export const getArticlesBySlug = async (slug: string) => {
  const { data: articles } = await getArticles()

  return articles.find((article: any) => article.data.slug === slug)
}

const getAllArticlFiles = (): Dirent[] => {
  const files = fs.readdirSync(path.resolve(ARTICLE_RELATIVE_DIR), { withFileTypes: true })
  files.filter((file: Dirent) => {
    return path.extname(file.name) === '.md'
  })
  return files
}

const parseArticle = (file: Dirent) => {
  const f = fs.readFileSync(path.resolve(ARTICLE_RELATIVE_DIR, file.name), 'utf-8')
  const article = matter(f)
  return article
}
