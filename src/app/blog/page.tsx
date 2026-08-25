import Link from "next/link";
import type { Metadata } from "next";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Olive Oil Blog — The Olive Vine | Veritat",
  description:
    "Producer stories, how to taste olive oil, what labels really mean, and new-harvest news. Written by an olive oil sommelier.",
  keywords: [
    "olive oil blog",
    "olive oil producer stories",
    "how to taste olive oil",
    "new harvest olive oil",
    "olive oil education",
  ],
  alternates: { canonical: "https://veritat.com/blog" },
};

export default function BlogPage() {
  return (
    <div className="mt-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-olive-500">
          The Olive Vine
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-olive-900 sm:text-5xl">
          Stories from the grove
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-olive-600">
          The people behind the bottles, how to taste like an expert, and what olive oil
          labels really mean — from Veritat, The Olive Oil Buyer&apos;s Guide.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-5">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card card-hover block p-7"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-olive-500">
              {post.displayDate} · {post.readingMinutes} min read
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-olive-900">
              {post.title}
            </h2>
            <p className="mt-2 leading-relaxed text-olive-600">{post.excerpt}</p>
            <p className="mt-3 text-sm font-semibold text-olive-700">Read on →</p>
          </Link>
        ))}
      </div>

      <section className="mx-auto mt-16 max-w-3xl rounded-[2rem] border border-olive-200 bg-white px-8 py-12 text-center">
        <h2 className="font-serif text-2xl font-bold text-olive-900">
          Find an oil worth writing about
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-olive-600">
          Every bottle in our directory states its harvest date and its origin — checked
          by hand before it appears.
        </p>
        <Link href="/discover" className="btn-primary mt-6">
          Explore certified oils
        </Link>
      </section>
    </div>
  );
}
