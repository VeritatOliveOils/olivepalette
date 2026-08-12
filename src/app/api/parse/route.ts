import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServerSupabase } from "@/lib/supabase";
import { FLAVOR_TAGS } from "@/lib/constants";

export const maxDuration = 30;

const SYSTEM = `You extract structured olive oil product data from messy pasted text (website copy, label text, spec sheets, marketing blurbs — any language).

Return ONLY a JSON object (no markdown fences, no commentary) with any of these keys you can determine. Omit keys you cannot determine — never guess or invent:

{
  "name": string,                 // product name, without producer name if separable
  "description": string,          // 1-3 sentence marketing description, cleaned up
  "category": string,             // e.g. "extra virgin", "flavored / infused"
  "varietals": string[],          // olive cultivars e.g. ["Picual", "Arbequina"]
  "region": string,               // growing region e.g. "Andalusia"
  "country": string,
  "farm_name": string,            // farm/estate name if stated
  "harvest_year": number,
  "intensity": "delicate" | "medium" | "robust",
  "flavor_tags": string[],        // prefer from: ${FLAVOR_TAGS.join(", ")}; add others only if clearly stated
  "tasting_notes": string,        // sensory description as prose
  "pairings": string[],           // e.g. ["grilled fish", "burrata"]
  "fruitiness": number,           // 0-10, only if stated or strongly implied
  "bitterness": number,           // 0-10
  "pungency": number,             // 0-10
  "polyphenols_ppm": number,      // polyphenol content in mg/kg (ppm) if stated
  "size_ml": number,              // convert oz to ml if needed (1 oz = 29.57 ml)
  "packaging": string,            // "glass", "tin", or "bag-in-box" if stated
  "price_usd": number,
  "buy_url": string,              // full URL if present
  "organic": boolean,             // true only if explicitly certified/stated
  "awards": string,               // awards/medals mentioned, comma-separated
  "acidity": string               // e.g. "0.2%"
}`;

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

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system: SYSTEM,
      messages: [{ role: "user", content: text.slice(0, 20000) }],
    });

    const raw = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    // Tolerate accidental code fences
    const jsonText = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    const parsed = JSON.parse(jsonText);

    return NextResponse.json({ parsed });
  } catch (e) {
    console.error("Parse error:", e);
    return NextResponse.json(
      { error: "Could not parse that text. You can still fill the form manually." },
      { status: 500 }
    );
  }
}
