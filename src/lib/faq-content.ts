import type { QA } from "@/components/Faq";

/**
 * Consumer questions, chosen from what people actually search:
 * "how to tell if olive oil is real", "does olive oil expire",
 * "can you cook with extra virgin olive oil", "is product of italy really italian",
 * "fridge test olive oil", "is green olive oil better", "what is cold pressed".
 */
export const BUYER_FAQ: QA[] = [
  {
    q: "How can I tell if olive oil is real extra virgin?",
    a: "Check the label for four things: a harvest date (not merely a 'best by' date), the specific region or estate where the olives grew, the olive varietals, and the producer's name. An oil that answers all four has nothing to hide. Then taste it. Real extra virgin olive oil smells green and alive — cut grass, tomato leaf, green apple — and leaves a peppery catch at the back of your throat. If it smells of nothing, or of crayons, wet cardboard or stale nuts, it is old or defective whatever the front label claims.",
  },
  {
    q: "Does the fridge test tell you if olive oil is fake?",
    a: "No. The popular claim that real olive oil solidifies in the refrigerator and fake oil stays liquid is not true. Different olive varieties and different fatty-acid profiles thicken at different temperatures, and some adulterated oils solidify perfectly well. There is no reliable home test for adulteration — it takes laboratory analysis. Provenance, harvest date and taste are the practical tools available to a shopper.",
  },
  {
    q: "Why does the harvest date matter more than the 'best by' date?",
    a: "Olive oil is a fruit juice and starts declining the day it is pressed. A 'best by' date is a bottler's estimate, often set two years after the olives were picked, and it can be printed on oil that was already old when bottled. The harvest date tells you the oil's actual age. Most extra virgin olive oil is at its best within 12 to 18 months of harvest. Veritat does not certify any oil that fails to state one.",
  },
  {
    q: "Does 'Product of Italy' mean the olives are Italian?",
    a: "Not necessarily. Labelling rules allow an oil to be described by the country where it was bottled or blended, even when the olives were grown elsewhere and shipped in. Phrases like 'Bottled in Italy' or 'Product of the EU' can cover a blend from several countries. It is not always deceptive, but it sounds far more specific than it is. Ask where the olives grew — the region, ideally the mill.",
  },
  {
    q: "Can you cook with extra virgin olive oil?",
    a: "Yes. The belief that extra virgin olive oil is unsuitable for cooking is a myth. Its smoke point sits comfortably above normal sautéing and roasting temperatures, and its natural antioxidants make it more stable under heat than many refined oils. Mediterranean households fry with it daily. Keep your finest bottles for finishing, where the flavour is visible, but cooking with good oil is entirely normal.",
  },
  {
    q: "How long does olive oil last, and how should I store it?",
    a: "Aim to use it within 12 to 18 months of harvest, and within about two months of opening. It does not become unsafe, it becomes dull — rancid oil smells waxy or like old nuts. Store it away from heat, light and air: a cupboard rather than beside the hob, dark glass or tin rather than clear glass, cap firmly closed. Refrigeration is unnecessary, and cloudiness in the cold is harmless.",
  },
  {
    q: "Is greener olive oil better?",
    a: "No. Colour tells you about the olive variety and how early it was picked, not about quality. Professional tasters assess oil in coloured glasses precisely so that colour cannot bias their judgement. A pale golden oil can be superb and a vivid green one can be defective. Judge by aroma, taste and provenance instead.",
  },
  {
    q: "What does 'cold-pressed' actually mean?",
    a: "It means the oil was extracted without heating the paste above roughly 27°C, preserving aroma and antioxidants. In practice almost all modern extra virgin olive oil is produced this way, so the phrase carries less weight than it appears to — it is closer to a baseline than a distinction. Harvest date, varietal and origin tell you far more.",
  },
  {
    q: "What are polyphenols and why do they matter?",
    a: "Polyphenols are the natural antioxidants that give olive oil its bitterness and peppery finish, and they are behind many of its health benefits. They also preserve the oil, slowing the decline. Levels are measured in milligrams per kilogram, and anything above roughly 250 mg/kg counts as high. Polyphenols fade with age, which is one more reason to know your harvest date.",
  },
  {
    q: "Why does good olive oil make me cough?",
    a: "That is oleocanthal, a natural anti-inflammatory compound found in fresh, high-quality extra virgin olive oil. Tasters sometimes grade oils informally by how many coughs they provoke — one cough, two coughs, three. A peppery throat is a sign of quality, not a fault.",
  },
  {
    q: "Is expensive olive oil always better?",
    a: "No, but very cheap olive oil is almost never good. Genuine extra virgin olive oil is costly to make: early harvesting yields less oil per olive, careful milling and cold storage cost more. If a large bottle costs less than everyday cooking oil, something has been cut. Price alone proves nothing — provenance and harvest date are better signals.",
  },
  {
    q: "What does Veritat certification mean?",
    a: "Every oil listed on Veritat is reviewed by an olive oil sommelier before it appears. We confirm a real harvest date is stated, that origin and varietals are specific rather than vague, and that any competition awards can be checked against the competition's own published results. Oils without a harvest date are not certified. We verify what producers publish and link you to their own shop — we never handle the sale.",
  },
];

/** Producer-side questions, shown where producers decide whether to join. */
export const PRODUCER_FAQ: QA[] = [
  {
    q: "What does it cost to list my olive oil?",
    a: "Founding producers list free, permanently — no fees and no commission on sales. After the founding group is full, new producers pay a small annual certification fee. Founding members are never charged, and that promise does not expire.",
  },
  {
    q: "How long does it take to add an oil?",
    a: "About ten minutes. Paste the text from your product page, paste the link itself, or photograph your back label — the listing fills itself in, including harvest date, varietals, acidity and polyphenols where they are stated. You check what has been filled in, correct anything, and submit. A sommelier reviews it before it goes live.",
  },
  {
    q: "Does Veritat take a commission on my sales?",
    a: "No. Every purchase happens on your own website. We never touch the payment, the shipping or your customer relationship. The Buy button on your listing sends the shopper straight to your shop, and we count the click so you can see the traffic we send you.",
  },
  {
    q: "Why do you insist on a harvest date?",
    a: "Because it is the clearest signal of a real, fresh oil, and because shoppers have no other reliable way to judge age. A 'best by' date tells them nothing about when the olives were picked. Requiring it is what makes certification worth something — and it distinguishes serious producers from bulk blenders.",
  },
  {
    q: "How are competition awards verified?",
    a: "You add the competition, year, category and award level, plus a link to the result on the competition's own website. We check the link before marking the award verified, and verified awards carry a tick on your listing. Awards without a working link still appear, simply without the tick.",
  },
  {
    q: "Can shops and importers find me for wholesale?",
    a: "Yes. Tick the wholesale option on your profile, add a trade contact address and any terms — minimum order quantities, private label availability — and buyers can filter the producer directory for wholesale, origin and shipping region, then contact you directly.",
  },
  {
    q: "Do I need a website to be listed?",
    a: "It helps, because the Buy button needs somewhere to send shoppers, but it is not essential. If you sell through a marketplace or take orders by email, we can link there instead. What matters is that a buyer can actually reach you.",
  },
];
