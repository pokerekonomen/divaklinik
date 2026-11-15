import documents from "@/content/documents.json";
import { pageSeo } from "@/lib/seo";

export type Subsection = { heading: string; level: number; paragraphs: string[] };
export type Section = { heading: string; paragraphs: string[]; subsections: Subsection[] };
export type Doc = {
  id: number;
  slug: string;
  kind: string;
  title: string;
  link: string;
  date: string;
  modified: string;
  h1: string;
  lead: string[];
  sections: Section[];
  chars: number;
  fromSanity?: boolean;
  imageUrl?: string;
};

const docs = documents as Doc[];

export function allDocs() {
  return docs;
}

export function getDoc(slug: string) {
  return docs.find((doc) => doc.slug === slug);
}

export function posts() {
  return docs
    .filter((doc) => doc.kind === "post")
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function treatments() {
  return docs.filter((doc) => doc.kind === "treatment");
}

export function publicDocs() {
  return docs.filter((doc) => !["home", "booking"].includes(doc.kind));
}

export function leadOf(doc: Doc) {
  const lines = doc.lead.filter((line) => line.length > 42 || !line.includes("·"));
  if (doc.fromSanity) return lines.length ? lines : doc.lead;
  const extra = pageSeo[doc.slug]?.extra;
  return extra ? [extra, ...lines] : lines;
}

export function headingOf(doc: Doc) {
  if (doc.fromSanity && doc.h1) return doc.h1;
  return pageSeo[doc.slug]?.h1 ?? doc.h1;
}

export function descriptionOf(doc: Doc) {
  if (doc.fromSanity) {
    const line = leadOf(doc).find((item) => item.length > 40) ?? doc.h1;
    return line.length > 155 ? `${line.slice(0, 152)}…` : line;
  }
  if (pageSeo[doc.slug]?.description) return pageSeo[doc.slug].description;
  const line = leadOf(doc).find((item) => item.length > 40) ?? doc.h1;
  return line.length > 155 ? `${line.slice(0, 152)}…` : line;
}

export function titleOf(doc: Doc) {
  if (doc.fromSanity && doc.title) return doc.title;
  return pageSeo[doc.slug]?.title ?? doc.h1;
}

export function faqsOf(doc: Doc) {
  const section = doc.sections.find((item) => /frågor/i.test(item.heading));
  if (!section) return [];
  return section.subsections
    .filter((item) => item.paragraphs.length > 0)
    .map((item) => ({ question: item.heading, answer: item.paragraphs.join(" ") }));
}

export function bodySections(doc: Doc) {
  return doc.sections.filter((item) => !/frågor/i.test(item.heading));
}
