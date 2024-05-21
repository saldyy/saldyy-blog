import { Link } from "@remix-run/react";
import { ArticleFrontMatter } from "~/types";
import { getDisplayDate } from "~/utils";

export type ArticleItemProps = {
  data: ArticleFrontMatter
}
export default function ArticleItem({ data }: ArticleItemProps) {
  const { title, summary, createdAt, slug } = data
  return (
    <Link to={`/articles/${slug}`}>
      <article className="w-100 mb-5">
        <h1 className="text-2xl text-primary font-bold">{title}</h1>
        <p className="text-sm">{getDisplayDate(new Date(createdAt))}</p>
        <p className="text-lg">{summary}</p>
      </article>
    </Link>
  );
}
