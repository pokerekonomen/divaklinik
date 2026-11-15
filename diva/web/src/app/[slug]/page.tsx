import {client} from "@/sanity/client";
import {defineQuery} from "next-sanity";
import {notFound} from "next/navigation";

const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  title,
  h1,
  lead,
  sections[]{ heading, paragraphs, subsections[]{ heading, paragraphs } }
}`);

type CmsPage = {
  title?: string;
  h1?: string;
  lead?: string[];
  sections?: Array<{heading?: string; paragraphs?: string[]}>;
};

export default async function Page({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const page = await client.fetch(PAGE_QUERY, {slug}, {cache: "no-store"}) as CmsPage | null;

  if (!page) return notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{page.h1 || page.title}</h1>
      {page.lead?.map((line) => (
        <p key={line} className="mt-4 text-lg leading-8">{line}</p>
      ))}
      {page.sections?.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-2xl font-semibold">{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-3 leading-7">{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
