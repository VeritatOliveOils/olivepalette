export interface QA {
  q: string;
  a: string;
}

/**
 * Accordion FAQ. Uses native <details> so the answers exist in the HTML —
 * search engines and AI assistants read them even while collapsed.
 * Pass `schema` on ONE page per question set to avoid duplicate structured data.
 */
export default function Faq({
  items,
  schema = false,
}: {
  items: QA[];
  schema?: boolean;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="space-y-2">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {items.map((item) => (
        <details
          key={item.q}
          className="group card overflow-hidden [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-olive-900 hover:bg-olive-50">
            <h3 className="!font-sans text-base">{item.q}</h3>
            <span
              aria-hidden
              className="shrink-0 font-serif text-2xl leading-none text-olive-500 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="border-t border-olive-100 px-5 py-4 leading-relaxed text-olive-700">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
