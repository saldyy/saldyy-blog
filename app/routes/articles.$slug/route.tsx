import { json, useLoaderData, } from "@remix-run/react"
import Markdown from "react-markdown"
import { getArticlesBySlug } from "~/.server/data/articles"
import { getDisplayDate } from "~/utils"


export async function loader({ params }: { params: { slug: string } }) {
  const { slug } = params
  const article = await getArticlesBySlug(slug)
  return json(article)
}

export default function ArticlePage() {
  const article = useLoaderData<typeof getArticlesBySlug>()
  const { data, content } = article
  console.log(content, 'content')

  return (
    <main className="w-100">
      <div className="mb-5">
        <h1 className="text-4xl font-bold text-primary mb-2">Article</h1>
        <p>{getDisplayDate(new Date(data.createdAt)) }</p>
      </div>
      <div className="prose">
      <Markdown>{content}</Markdown>
      </div>
    </main>
  )

}
