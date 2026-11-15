import {client} from "@/sanity/client";
import {defineQuery} from "next-sanity";
import Link from "next/link";

const PAGES_QUERY = defineQuery(
  `*[_type == "page" && defined(slug.current)] | order(_createdAt desc){ _id, title, slug }`,
);

const options = {cache: "no-store" as const};

export default async function PagesPage() {
  const pages = await client.fetch(PAGES_QUERY, {}, options);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <p className="text-sm text-zinc-500">Diva</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Sidor</h1>
      {pages.length ? (
        <ul className="mt-8 space-y-3">
          {pages.map((page) => (
            <li key={page._id}>
              <Link href={`/${page.slug?.current}`} className="text-lg underline">
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-zinc-600">Inga sidor publicerade ännu. Lägg till en sida i Studion.</p>
      )}
    </main>
  );
}
