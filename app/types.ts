export type Article = {
  content: string
  data: ArticleFrontMatter
}
export type ArticleFrontMatter = {
  id: string
  slug: string
  createdAt: string
  summary: string
  title: string
  author: string
}
