import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "OlivePalette — Discover & Taste Extra Virgin Olive Oil",
  description:
    "Explore certified artisanal olive oils by taste profile, meet the makers, and buy direct. Producers: list your oils in under a minute with Smart Paste.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto min-h-screen max-w-6xl px-4 pb-20 pt-6">
          {children}
        </main>
        <footer className="border-t border-olive-200 bg-white py-8 text-center text-sm text-olive-500">
          OlivePalette — taste, discover, buy direct from the makers.
        </footer>
      </body>
    </html>
  );
}
