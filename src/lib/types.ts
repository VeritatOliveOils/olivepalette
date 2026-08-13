export type Intensity = "delicate" | "medium" | "robust";
export type ProductStatus = "pending" | "approved" | "rejected";

export interface Producer {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  story: string | null;
  website: string | null;
  instagram_url: string | null;
  logo_url: string | null;
  is_women_led: boolean;
  shipping_regions: string[];
  certifications_text: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  producer_id: string;
  status: ProductStatus;
  name: string;
  description: string | null;
  category: string | null;
  varietals: string[];
  region: string | null;
  country: string | null;
  farm_name: string | null;
  harvest_year: number | null;
  harvest_date: string | null;
  intensity: Intensity | null;
  flavor_tags: string[];
  tasting_notes: string | null;
  pairings: string[];
  fruitiness: number | null;
  bitterness: number | null;
  pungency: number | null;
  polyphenols_ppm: number | null;
  size_ml: number | null;
  packaging: string | null;
  price_usd: number | null;
  buy_url: string | null;
  image_url: string | null;
  organic: boolean;
  awards: string | null;
  acidity: string | null;
  created_at: string;
  producers?: Producer;
}

export interface ClickEvent {
  id: string;
  product_id: string;
  producer_id: string;
  clicked_at: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  products?: { name: string };
  producers?: { name: string };
}

/** Shape returned by the Smart Paste parser — everything optional. */
export interface ParsedProduct {
  name?: string;
  description?: string;
  category?: string;
  varietals?: string[];
  region?: string;
  country?: string;
  farm_name?: string;
  harvest_year?: number;
  harvest_date?: string;
  intensity?: Intensity;
  flavor_tags?: string[];
  tasting_notes?: string;
  pairings?: string[];
  fruitiness?: number;
  bitterness?: number;
  pungency?: number;
  polyphenols_ppm?: number;
  size_ml?: number;
  packaging?: string;
  price_usd?: number;
  buy_url?: string;
  image_url?: string;
  organic?: boolean;
  awards?: string;
  acidity?: string;
}
