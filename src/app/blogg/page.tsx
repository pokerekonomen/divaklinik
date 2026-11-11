import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { descriptionOf, posts } from "@/lib/content";
import { clinic } from "@/lib/clinic";
import { guideImages } from "@/lib/guide-images";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageSeo.blogg.title,
  description: pageSeo.blogg.description,
  alternates: { canonical: "/blogg" },
};

function written(date: string) {
  return new Date(date).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });
}

function minutes(chars: number) {
  return Math.max(1, Math.round(chars / 900));
}

export default function BlogPage() {
  const items = posts();
  const [first, ...rest] = items;
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Tandvårdsguider",
    url: `${clinic.url}/blogg`,
    blogPost: items.map((post) => ({
      "@type": "BlogPosting",
      headline: post.h1,
      datePublished: post.date,
      url: `${clinic.url}/${post.slug}`,
    })),
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
      <p className="kicker">Klinikens texter</p>
      <h1 className="mt-3 font-serif text-4xl leading-[1.08] md:text-6xl">Tandvårdsguider</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Texterna från klinikens blogg, samlade som guider. De handlar om vad som händer vid ett besök, vanliga besvär och hur stöd och val kan se ut.
      </p>
      {first ? (
        <Link href={`/${first.slug}`} className="enter lift group mt-10 grid overflow-hidden rounded-[28px] border border-line bg-paper md:grid-cols-[1.15fr_.85fr]">
          {guideImages[first.slug] ? (
            <img src={guideImages[first.slug]} alt="" className="h-56 w-full object-cover md:h-full md:min-h-72" />
          ) : null}
          <span className="block p-6 md:p-8">
            <time className="kicker" dateTime={first.date}>
              {written(first.date)} · {minutes(first.chars)} min
            </time>
            <h2 className="mt-3 font-serif text-3xl text-balance md:text-4xl">{first.h1}</h2>
            <p className="mt-3 text-muted">{descriptionOf(first)}</p>
            <span className="nudge mt-5 text-sm text-rose-deep">Läs guiden →</span>
          </span>
        </Link>
      ) : null}
      <Reveal>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {rest.map((post) => (
          <li key={post.slug}>
            <Link href={`/${post.slug}`} className="lift group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper">
              {guideImages[post.slug] ? <img src={guideImages[post.slug]} alt="" className="h-44 w-full object-cover" /> : null}
              <span className="flex flex-1 flex-col p-5">
                <time className="kicker" dateTime={post.date}>
                  {written(post.date)} · {minutes(post.chars)} min
                </time>
                <h2 className="mt-2 font-serif text-2xl text-balance">{post.h1}</h2>
                <p className="mt-2 text-sm text-ink">{descriptionOf(post)}</p>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      </Reveal>
    </div>
  );
}
