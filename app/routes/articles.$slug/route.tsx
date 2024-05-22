import { MetaFunction, json, useLoaderData, } from "@remix-run/react";
import Markdown from "react-markdown"
import { getArticlesBySlug } from "~/.server/data/articles"
import { Article, ArticleFrontMatter } from "~/types";
import { getDisplayDate } from "~/utils"

export const meta: MetaFunction = ({ data }) => {
  const articleFrontMatter = (data as Article).data as ArticleFrontMatter
  return [
    { title: articleFrontMatter.title },
    { name: articleFrontMatter.title, content: articleFrontMatter.summary },
  ];
};

export async function loader({ params }: { params: { slug: string } }) {
  const { slug } = params
  const article = await getArticlesBySlug(slug)
  return json(article)
}

export default function ArticlePage() {
  const article = useLoaderData<typeof getArticlesBySlug>()
  const { data, content } = article

  return (
    <main className="w-100 mt-5">
      <div className="mb-5">
        <h1 className="text-4xl font-bold mb-2">Article</h1>
        <p>{getDisplayDate(new Date(data.createdAt))}</p>
      </div>
      <div className="prose">
        <Markdown>{content}</Markdown>
      </div>
    </main>
  )

}
