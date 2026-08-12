import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

/**
 * Affiliate click tracker: /go/<product-id>?utm_source=...
 * Logs a click_event, then redirects to the product's buy_url.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getServerSupabase();

  const { data: product } = await supabase
    .from("products")
    .select("id, producer_id, buy_url, status")
    .eq("id", id)
    .maybeSingle();

  if (!product?.buy_url) {
    return NextResponse.redirect(new URL("/discover", req.url));
  }

  const sp = req.nextUrl.searchParams;
  // Fire-and-forget logging; never block the shopper on it
  await supabase.from("click_events").insert({
    product_id: product.id,
    producer_id: product.producer_id,
    referrer: req.headers.get("referer"),
    utm_source: sp.get("utm_source"),
    utm_medium: sp.get("utm_medium"),
    utm_campaign: sp.get("utm_campaign"),
  });

  return NextResponse.redirect(product.buy_url, 302);
}
