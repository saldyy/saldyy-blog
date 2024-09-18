import fs from 'fs'
import type { Dirent } from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { Article } from '~/types'

const ARTICLE_RELATIVE_DIR = 'app/assets/blogs'
const cacheArticles: Article[] = []

export const getArticles = async () => {
  if (cacheArticles.length !== 0) {
    return {
      data: cacheArticles
    }
  }
  const allFiles = getAllArticleFiles()

  allFiles.forEach((file) => {
    const article = parseArticle(file)
    cacheArticles.push(article)
  })

  return { data: cacheArticles }
}

export const getArticlesBySlug = async (slug: string) => {
  const { data: articles } = await getArticles()

  return articles.find((article: Article) => article.data.slug === slug)
}

const getAllArticleFiles = (): Dirent[] => {
  const files = fs.readdirSync(path.resolve(ARTICLE_RELATIVE_DIR), { withFileTypes: true })
  files.filter((file: Dirent) => {
    return path.extname(file.name) === '.md'
  })
  return files
}

const parseArticle = (file: Dirent): Article => {
  const f = fs.readFileSync(path.resolve(ARTICLE_RELATIVE_DIR, file.name), 'utf-8')
  const article = matter(f)

  return article as unknown as Article
}
