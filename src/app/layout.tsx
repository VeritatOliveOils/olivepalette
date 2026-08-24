import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Veritat — The Olive Oil Buyer's Guide",
  description:
    "Find real extra virgin olive oil. Every bottle certified by an olive oil sommelier — harvest date verified, provenance checked — and sold direct by the producer. Veritat means truth.",
  keywords: [
    "olive oil buyers guide",
    "how to buy real olive oil",
    "certified extra virgin olive oil",
    "olive oil harvest date",
    "buy olive oil direct from producer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-4 sm:pb-20 sm:pt-6">
          {children}
        </main>
        <footer className="border-t border-olive-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div className="max-w-sm">
                <p className="font-serif text-2xl font-bold text-olive-900">Veritat</p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive-500">
                  The Olive Oil Buyer&apos;s Guide
                </p>
                <p className="mt-3 text-sm leading-relaxed text-olive-600">
                  <em>Veritat</em> means truth. Every oil listed here is certified by an
                  olive oil sommelier — harvest date verified, provenance checked, sold
                  direct by the people who made it.
                </p>
              </div>
              <div className="flex gap-12 text-sm">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-olive-500">
                    Explore
                  </p>
                  <ul className="space-y-1.5 text-olive-700">
                    <li>
                      <a href="/discover" className="hover:underline">
                        Discover oils
                      </a>
                    </li>
                    <li>
                      <a href="/producers" className="hover:underline">
                        Producers
                      </a>
                    </li>
                    <li>
                      <a href="/faq" className="hover:underline">
                        Olive oil guide
                      </a>
                    </li>
                    <li>
                      <a href="/journal" className="hover:underline">
                        The Olive Vine
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-olive-500">
                    Producers
                  </p>
                  <ul className="space-y-1.5 text-olive-700">
                    <li>
                      <a href="/login?mode=signup" className="hover:underline">
                        List your oil
                      </a>
                    </li>
                    <li>
                      <a href="/example" className="hover:underline">
                        Sample listing
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="mt-10 border-t border-olive-100 pt-6 text-xs text-olive-400">
              © {new Date().getFullYear()} Veritat · the truth behind every bottle
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
