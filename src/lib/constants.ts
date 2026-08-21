export const FLAVOR_TAGS = [
  "grassy",
  "peppery",
  "buttery",
  "fruity",
  "nutty",
  "herbaceous",
  "artichoke",
  "green apple",
  "tomato leaf",
  "almond",
  "citrus",
  "floral",
  "earthy",
  "spicy",
] as const;

export const INTENSITIES = ["delicate", "medium", "robust"] as const;

export const INTENSITY_LABELS: Record<string, string> = {
  delicate: "Delicate — smooth, mild, buttery",
  medium: "Medium — balanced fruit and pepper",
  robust: "Robust — bold, bitter, peppery",
};

export const CATEGORIES = ["extra virgin", "flavored / infused", "organic blend", "late harvest"] as const;

export const PACKAGING_OPTIONS = ["glass", "tin", "bag-in-box"] as const;

export const SHIPPING_REGIONS = [
  "US",
  "Canada",
  "Mexico",
  "Caribbean",
  "Central America",
  "South America",
  "EU",
  "UK",
  "Middle East",
  "Africa",
  "Asia",
  "Australia / NZ",
  "Worldwide",
] as const;

/** A producer who ships "Worldwide" matches every ships-to filter. */
export function shipsTo(regions: string[] | null | undefined, target: string): boolean {
  if (!regions || regions.length === 0) return false;
  const lower = regions.map((r) => r.toLowerCase());
  return lower.includes("worldwide") || lower.includes(target.toLowerCase());
}

/** Oils at or above this polyphenol level count as "high-polyphenol" (mg/kg). */
export const HIGH_POLYPHENOL_THRESHOLD = 250;

/** Suggestions only — producers can type any competition name. */
export const COMPETITIONS = [
  "NYIOOC World Olive Oil Competition",
  "London International Olive Oil Competition",
  "Olive Japan International",
  "EVO IOOC Italy",
  "Athena International Olive Oil Competition",
  "Mario Solinas Quality Award",
  "Sol d'Oro",
  "Terraolivo",
  "Japan Olive Oil Prize (JOOP)",
  "Berlin Global Olive Oil Awards",
  "Der Feinschmecker Olio Award",
  "Great Taste Awards",
  "Domina IOOC",
  "Dubai Olive Oil Competition",
  "AVPA Paris",
] as const;

/** Award levels vary by competition — these are just quick picks. */
export const AWARD_LEVELS = [
  "Gold",
  "Silver",
  "Bronze",
  "Best in Class",
  "Double Gold",
  "Grand Prestige",
  "1 star",
  "2 stars",
  "3 stars",
] as const;
