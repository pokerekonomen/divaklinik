import { CircleHelp } from "lucide-react";

export type FaqItem = { question: string; answer: string };

function clean(answer: string) {
  return answer.replace(/\s+Relaterat\s*$/i, "").trim();
}

export function FaqList({ heading, items }: { heading: string; items: FaqItem[] }) {
  const faqs = items.map((item) => ({ question: item.question, answer: clean(item.answer) })).filter((item) => item.answer);
  if (!faqs.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  return (
    <section id="fragor">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h2 className="font-serif text-3xl text-balance md:text-4xl">{heading}</h2>
      <div className="mt-6 space-y-3">
        {faqs.map((faq) => (
          <details key={faq.question} className="faq group rounded-[22px] border border-line bg-paper px-4 open:bg-sand/60 md:px-5">
            <summary className="cursor-pointer list-none py-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 flex-1 items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand text-rose transition-colors group-open:bg-paper">
                  <CircleHelp className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 pt-2">{faq.question}</span>
              </span>
            </summary>
            <div className="faq-body">
              <p className="pb-5 pl-[3.25rem] text-[16px] leading-relaxed text-ink">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
