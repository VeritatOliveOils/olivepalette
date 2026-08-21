import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServerSupabase } from "@/lib/supabase";
import { FLAVOR_TAGS } from "@/lib/constants";

export const maxDuration = 60;

const SYSTEM = `You extract structured olive oil product data from text taken from a producer's website, label, or spec sheet (any language).

HARVEST DATE RULE: harvest_year and harvest_date must come from an explicit harvest/milling/crush statement ("2025 harvest", "harvested November 2024", "raccolta 2025", "cosecha 2024"). NEVER derive them from a "best by", "best before", "expiry", "bottled on", or "sell by" date, and never from a copyright year or the current year. If no harvest information is stated, omit both fields.

CRITICAL RULE — NEVER INVENT DATA. Only return a field if the information is explicitly stated in, or unambiguously implied by, the supplied text. If the text does not mention the region, do NOT guess a region. If it does not name the varietals, do NOT guess varietals. An omitted field is always correct; an invented field is a serious error. If the supplied text contains no real product information at all, return an empty JSON object: {}

Return ONLY a JSON object (no markdown fences, no commentary) with any of these keys you can determine from the text:

{
  "name": string,                 // product name, without producer name if separable
  "description": string,          // 1-3 sentence marketing description, cleaned up
  "category": string,             // e.g. "extra virgin", "flavored / infused"
  "varietals": string[],          // olive cultivars e.g. ["Picual", "Arbequina"]
  "region": string,               // growing region e.g. "Andalusia", "Sonoma County"
  "country": string,
  "farm_name": string,            // farm/estate name if stated
  "harvest_year": number,       // the year the olives were HARVESTED/milled — never a "best by" or expiry year
  "harvest_date": string,       // fuller harvest date if stated, e.g. "November 2025" or "12 Nov 2025"
  "intensity": "delicate" | "medium" | "robust",
  "flavor_tags": string[],        // prefer from: ${FLAVOR_TAGS.join(", ")}; add others only if clearly stated
  "tasting_notes": string,        // sensory description as prose
  "pairings": string[],           // e.g. ["grilled fish", "burrata"]
  "fruitiness": number,           // 0-10, ONLY if stated or strongly implied
  "bitterness": number,           // 0-10
  "pungency": number,             // 0-10
  "polyphenols_ppm": number,      // mg/kg (ppm) if stated
  "size_ml": number,              // convert oz to ml if needed (1 oz = 29.57 ml)
  "packaging": string,            // "glass", "tin", or "bag-in-box" if stated
  "price_usd": number,
  "buy_url": string,              // full URL if present
  "organic": boolean,             // true ONLY if explicitly certified/stated
  "awards_json": [                // competition awards, one object each
    { "competition": string,      // e.g. "NYIOOC World Olive Oil Competition"
      "year": number,
      "category": string,         // class/varietal/country if stated
      "award": string,            // "Gold", "Silver", "3 stars", "Best in Class"…
      "url": string }             // link to the result ONLY if the page gives one
  ],
  "awards": string,               // any recognition that doesn't fit above
  "acidity": string               // e.g. "0.2%"
}`;

/** Pull the main product image from page metadata (og:image etc.). */
function extractImage(html: string, base: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      try {
        return new URL(m[1], base).toString();
      } catch {
        /* ignore */
      }
    }
  }
  return null;
}

/**
 * Read schema.org Product data that most shop platforms (Shopify, WooCommerce…)
 * embed as JSON-LD. This gives us exact price/currency/image without guessing.
 */
function extractJsonLd(
  html: string,
  base: string
): { price?: number; currency?: string; image?: string; name?: string } {
  const out: { price?: number; currency?: string; image?: string; name?: string } = {};
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );

  const visit = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const obj = node as Record<string, unknown>;
    const type = obj["@type"];
    const isProduct =
      type === "Product" || (Array.isArray(type) && type.includes("Product"));
    if (isProduct) {
      if (typeof obj.name === "string" && !out.name) out.name = obj.name;
      const img = obj.image;
      if (!out.image) {
        const raw =
          typeof img === "string"
            ? img
            : Array.isArray(img) && typeof img[0] === "string"
              ? (img[0] as string)
              : typeof img === "object" && img !== null
                ? ((img as Record<string, unknown>).url as string | undefined)
                : undefined;
        if (raw) {
          try {
            out.image = new URL(raw, base).toString();
          } catch {
            /* ignore */
          }
        }
      }
      const offers = obj.offers;
      const offerList = Array.isArray(offers) ? offers : offers ? [offers] : [];
      for (const o of offerList) {
        if (!o || typeof o !== "object") continue;
        const offer = o as Record<string, unknown>;
        const p = offer.price ?? offer.lowPrice;
        const n = typeof p === "string" ? parseFloat(p) : typeof p === "number" ? p : NaN;
        if (!Number.isNaN(n) && out.price === undefined) {
          out.price = n;
          if (typeof offer.priceCurrency === "string") out.currency = offer.priceCurrency;
        }
      }
    }
    Object.values(obj).forEach(visit);
  };

  for (const b of blocks) {
    try {
      visit(JSON.parse(b[1].trim()));
    } catch {
      /* skip malformed blocks */
    }
  }
  return out;
}

/** Strip HTML down to readable text for the model. */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** If the pasted input is essentially just a link, pull the page text ourselves. */
async function maybeFetchUrl(input: string): Promise<{
  text: string;
  fetchedFrom?: string;
  error?: string;
  image?: string;
  price?: number;
  currency?: string;
}> {
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/https?:\/\/[^\s]+/);
  const looksLikeJustAUrl =
    urlMatch && trimmed.replace(urlMatch[0], "").trim().length < 40;

  if (!looksLikeJustAUrl || !urlMatch) return { text: input };

  let target: URL;
  try {
    target = new URL(urlMatch[0]);
  } catch {
    return { text: input };
  }
  // Only public http(s); never touch local/private addresses
  if (!/^https?:$/.test(target.protocol)) return { text: input };
  if (
    /^(localhost$|127\.|10\.|192\.168\.|169\.254\.|0\.)/i.test(target.hostname) ||
    target.hostname.endsWith(".local")
  ) {
    return { text: input, error: "That address can't be read." };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(target.toString(), {
      signal: controller.signal,
      headers: {
        // Many shop platforms (Shopify especially) reject unfamiliar bots,
        // so we identify as a normal browser fetching a page.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) {
      return {
        text: input,
        error: `That page wouldn't open for us (error ${res.status}).`,
      };
    }
    const html = await res.text();
    const finalUrl = res.url || target.toString();
    const text = htmlToText(html);
    const jsonLd = extractJsonLd(html, finalUrl);
    const image = jsonLd.image ?? extractImage(html, finalUrl) ?? undefined;

    if (text.length < 200) {
      return {
        text: input,
        error:
          "That page didn't give us readable text (many shop pages load content with JavaScript).",
      };
    }
    return {
      text: text.slice(0, 30000),
      fetchedFrom: finalUrl,
      image,
      price: jsonLd.price,
      currency: jsonLd.currency,
    };
  } catch {
    return {
      text: input,
      error: "We couldn't open that link.",
    };
  }
}

export async function POST(req: NextRequest) {
  // Require a logged-in producer
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const supabase = getServerSupabase();
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const text: unknown = body?.text;
  const images: unknown = body?.images;

  const imageList: { media_type: string; data: string }[] = Array.isArray(images)
    ? images
        .filter(
          (i): i is { media_type: string; data: string } =>
            !!i &&
            typeof i === "object" &&
            typeof (i as { data?: unknown }).data === "string" &&
            typeof (i as { media_type?: unknown }).media_type === "string"
        )
        .slice(0, 3)
    : [];

  const hasText = typeof text === "string" && text.trim().length >= 10;

  if (!hasText && imageList.length === 0) {
    return NextResponse.json(
      { error: "Paste some product text or add a photo of the label." },
      { status: 400 }
    );
  }

  // ---- Label photo path: read the bottle itself ----
  if (imageList.length > 0) {
    const anthropicVision = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    try {
      const msg = await anthropicVision.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        system:
          SYSTEM +
          `\n\nYou are being shown photographs of an olive oil bottle's label(s). Read ONLY what is actually printed on the label. Labels may be in any language — translate field values into English where sensible (e.g. "raccolta" = harvest, "acidità" = acidity). If a value is blurry or unreadable, omit that field rather than guessing. Pay special attention to the harvest/milling date, acidity, polyphenol content, lot number, volume, and cultivar names.`,
        messages: [
          {
            role: "user",
            content: [
              ...imageList.map((img) => ({
                type: "image" as const,
                source: {
                  type: "base64" as const,
                  media_type: img.media_type as
                    | "image/jpeg"
                    | "image/png"
                    | "image/gif"
                    | "image/webp",
                  data: img.data,
                },
              })),
              {
                type: "text" as const,
                text: hasText
                  ? `Extract the product data from these label photos. The producer also supplied this text, which you may use as supporting context:\n\n${(text as string).slice(0, 10000)}`
                  : "Extract the product data from these label photos.",
              },
            ],
          },
        ],
      });

      const raw = msg.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("");
      const parsed = JSON.parse(
        raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "")
      );

      if (!parsed || Object.keys(parsed).length === 0) {
        return NextResponse.json(
          {
            error:
              "We couldn't read details from that photo. Try a sharper, well-lit close-up of the back label.",
          },
          { status: 422 }
        );
      }
      return NextResponse.json({ parsed, fetchedFrom: null, fromLabel: true });
    } catch (e) {
      console.error("Label vision error:", e);
      return NextResponse.json(
        { error: "Could not read that photo. You can still fill the form manually." },
        { status: 500 }
      );
    }
  }

  // If they pasted a link, read the page for them
  const {
    text: sourceText,
    fetchedFrom,
    error: fetchError,
    image: pageImage,
    price: pagePrice,
    currency: pageCurrency,
  } = await maybeFetchUrl(text as string);

  if (fetchError) {
    return NextResponse.json(
      {
        error: `${fetchError} Please copy the product description text from the page and paste that instead — we never guess details we can't read.`,
      },
      { status: 422 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: fetchedFrom
            ? [
                `The following text was extracted from ${fetchedFrom}. Extract only what is actually stated here.`,
                pagePrice !== undefined
                  ? `The page's structured data lists the price as ${pagePrice}${
                      pageCurrency ? ` ${pageCurrency}` : ""
                    } — use it (convert to USD only if it is already a USD figure; otherwise omit price_usd).`
                  : "",
                "",
                sourceText,
              ]
                .filter(Boolean)
                .join("\n")
            : sourceText.slice(0, 30000),
        },
      ],
    });

    const raw = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const jsonText = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(jsonText);

    if (!parsed || Object.keys(parsed).length === 0) {
      return NextResponse.json(
        {
          error:
            "We couldn't find product details in that text. Try pasting the product description itself (name, olives, region, tasting notes, price).",
        },
        { status: 422 }
      );
    }

    // If we fetched a page, keep the original link as the buy URL when none was found
    if (fetchedFrom && !parsed.buy_url) parsed.buy_url = fetchedFrom;
    // Product photo and price come straight from the page's own metadata — no guessing
    if (pageImage && !parsed.image_url) parsed.image_url = pageImage;
    if (
      pagePrice !== undefined &&
      parsed.price_usd === undefined &&
      (!pageCurrency || pageCurrency.toUpperCase() === "USD")
    ) {
      parsed.price_usd = pagePrice;
    }

    return NextResponse.json({ parsed, fetchedFrom: fetchedFrom ?? null });
  } catch (e) {
    console.error("Parse error:", e);
    return NextResponse.json(
      { error: "Could not parse that text. You can still fill the form manually." },
      { status: 500 }
    );
  }
}
