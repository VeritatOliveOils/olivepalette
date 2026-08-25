import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, POSTS } from "@/lib/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found — Veritat" };
  return {
    title: `${post.title} — Veritat Olive Oil Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `https://veritat.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["Julie Harnish"],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Article structured data — helps search engines and AI assistants cite the piece.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Julie Harnish",
      jobTitle: "Olive oil sommelier",
      url: "https://veritat.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Veritat — The Olive Oil Buyer's Guide",
      url: "https://veritat.com",
    },
    mainEntityOfPage: `https://veritat.com/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
  };

  return (
    <article className="mt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-olive-600 hover:underline"
        >
          ← Back to the blog
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-olive-500">
          {post.displayDate} · {post.readingMinutes} min read
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.15] text-olive-900 sm:text-5xl">
          {post.title}
        </h1>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-olive-800">
          {post.body.map((block, i) => {
            if (block.type === "h2")
              return (
                <h2
                  key={i}
                  className="!mt-10 font-serif text-2xl font-bold text-olive-900"
                >
                  {block.text}
                </h2>
              );
            if (block.type === "quote")
              return (
                <blockquote
                  key={i}
                  className="!my-8 border-l-4 border-gold bg-gold/5 py-4 pl-5 pr-4 font-serif text-2xl italic leading-snug text-olive-900"
                >
                  {block.text}
                </blockquote>
              );
            if (block.type === "list")
              return (
                <ul key={i} className="!mt-4 space-y-2 pl-1">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="text-gold">
                        🫒
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            return (
              <p key={i} className="whitespace-pre-line">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-olive-200 bg-white p-7 text-center">
          <p className="font-serif text-xl font-bold text-olive-900">
            Every oil we list states its harvest date.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-olive-600">
            Certified by an olive oil sommelier, sold direct by the people who made it.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/discover" className="btn-primary">
              Explore certified oils
            </Link>
            <Link href="/faq" className="btn-secondary">
              Olive oil FAQs
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
