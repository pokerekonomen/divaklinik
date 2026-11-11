import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentView } from "@/components/content-view";
import { descriptionOf, getDoc, publicDocs, titleOf } from "@/lib/content";

const reserved = new Set(["behandlingar", "blogg", "kontakt", "boka", "admin"]);

export function generateStaticParams() {
  return publicDocs()
    .filter((doc) => !reserved.has(doc.slug))
    .map((doc) => ({ slug: doc.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return {
    title: titleOf(doc),
    description: descriptionOf(doc),
    alternates: { canonical: `/${slug}` },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc || reserved.has(slug)) notFound();
  return <ContentView doc={doc} />;
}
