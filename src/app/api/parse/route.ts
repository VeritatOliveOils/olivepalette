import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServerSupabase } from "@/lib/supabase";
import { FLAVOR_TAGS } from "@/lib/constants";

export const maxDuration = 60;

const SYSTEM = `You extract structured olive oil product data from text taken from a producer's website, label, or spec sheet (any language).

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
  "harvest_year": number,
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
  "awards": string,               // awards/medals mentioned, comma-separated
  "acidity": string               // e.g. "0.2%"
}`;

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
async function maybeFetchUrl(
  input: string
): Promise<{ text: string; fetchedFrom?: string; error?: string }> {
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
        "User-Agent":
          "Mozilla/5.0 (compatible; VeritatBot/1.0; +https://veritat.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) {
      return { text: input, error: `That page returned an error (${res.status}).` };
    }
    const html = await res.text();
    const text = htmlToText(html);
    if (text.length < 200) {
      return {
        text: input,
        error:
          "That page didn't give us readable text (many shop pages load content with JavaScript).",
      };
    }
    return { text: text.slice(0, 30000), fetchedFrom: target.toString() };
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

  const { text } = await req.json();
  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return NextResponse.json(
      { error: "Paste at least a sentence or two about the product." },
      { status: 400 }
    );
  }

  // If they pasted a link, read the page for them
  const { text: sourceText, fetchedFrom, error: fetchError } = await maybeFetchUrl(text);

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
            ? `The following text was extracted from ${fetchedFrom}. Extract only what is actually stated here.\n\n${sourceText}`
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

    return NextResponse.json({ parsed, fetchedFrom: fetchedFrom ?? null });
  } catch (e) {
    console.error("Parse error:", e);
    return NextResponse.json(
      { error: "Could not parse that text. You can still fill the form manually." },
      { status: 500 }
    );
  }
}
