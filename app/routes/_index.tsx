import type { MetaFunction } from "@remix-run/node";
import ArticleItem from "~/components/ArticileItem";
import { json, useLoaderData } from "@remix-run/react";
import { getArticles } from "~/.server/data/articles";

import { GithubIcon, LinkedInIcon } from "~/components/icons";

export const meta: MetaFunction = () => {
  return [
    { title: "A blog by Saldyy" },
    { name: "A blog by saldyy", content: "Welcome to my blog" },
  ];
};


export async function loader() {
  const result = await getArticles();
  return json(result)
}

export default function Index() {
  const { data: articles } = useLoaderData<typeof getArticles>()

  return (
    <main className="w-100">
      <div className="my-5">
        <div>
          <p>Hello there, I&apos;m Phillip Nguyen, a full-stack developer and this is my personal blog.</p>
          <p>My main techstack: #Javascript, #Typescript, #Golang, #React</p>
        </div>
        <div className="flex flex-row justify-start items-center">
          <p className="mr-2">{"You can find me on: "}</p>
          <a className="mr-2" href="https://www.linkedin.com/in/phillip-nguyen-798998160" target="_blank" rel="noreferrer">
            <LinkedInIcon width={20} height={20} />
          </a>
          <a href="https://github.com/saldyy" target="_blank" rel="noreferrer">
            <GithubIcon width={20} height={20} />
          </a>
        </div>

      </div>
      <div>
        {Array.isArray(articles) && articles?.map((val, index: number) => {
          return <ArticleItem key={index} data={{
            id: val.data?.id,
            title: val.data.title,
            summary: val.data.summary,
            createdAt: val.data.createdAt,
            slug: val.data.slug,
            author: val.data.author
          }} />
        })}
      </div>
    </main>
  );
}
