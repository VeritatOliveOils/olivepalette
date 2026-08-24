/**
 * The Olive Vine — Veritat's journal.
 * Add new posts to the top of the array. Body is an array of blocks so posts
 * stay easy to edit without touching page code.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export interface Post {
  slug: string;
  title: string;
  /** Shown in search results and on the journal index. Keep under ~155 chars. */
  description: string;
  excerpt: string;
  date: string; // ISO
  displayDate: string;
  readingMinutes: number;
  keywords: string[];
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: "veritat-returns",
    title: "Veritat returns — and this time it's a buyer's guide",
    description:
      "After tariffs, a pandemic and a life rebuilt, Veritat is back — no longer importing olive oil, but certifying it. Why every bottle now needs a harvest date.",
    excerpt:
      "After tariffs, a pandemic and a life rebuilt, Veritat is back — not importing olive oil this time, but certifying it.",
    date: "2026-08-16",
    displayDate: "16 August 2026",
    readingMinutes: 4,
    keywords: [
      "real extra virgin olive oil",
      "olive oil buyers guide",
      "olive oil harvest date",
      "Priorat olive oil",
      "how to buy olive oil",
      "olive oil sommelier",
    ],
    body: [
      {
        type: "p",
        text: "Dear friends and fellow olive oil lovers — after a long, unexpected and restorative pause, I am back. And Veritat is back with me, in a form I think is more useful than the one you knew.",
      },
      {
        type: "p",
        text: "For those who have been here since the beginning: you know how much I cared about every harvest and every bottle. In 2019 everything shifted almost overnight, when tariffs on European olive oil jumped from 2% to 25%. Then came the pandemic, which unravelled supply chains and put a new obstacle in the road every month. Life took me in other directions too — through divorce, rediscovery and the busy grace of single motherhood. What I missed most was not the olive oil. It was the connection: the meals, the questions, the people.",
      },
      { type: "h2", text: "What Veritat is now" },
      {
        type: "p",
        text: "Veritat means truth in Catalan. It began as an import business, bringing Spanish extra virgin olive oil from the Priorat mountains to American kitchens because I could not find anything honest enough on the shelf here. It returns as something different: an olive oil buyer's guide. A directory of oils I certify myself, where every listing tells you what the label usually hides.",
      },
      {
        type: "p",
        text: "I am not selling oil any more. Every bottle on Veritat links straight to the producer who made it. I never touch the sale, the shipping or your details. What I do is check.",
      },
      { type: "h2", text: "The one rule everything rests on" },
      {
        type: "quote",
        text: "No harvest date, no certification. A 'best by' date is not a harvest date.",
      },
      {
        type: "p",
        text: "Extra virgin olive oil is fruit juice. It begins declining the day it is pressed, and it is at its best within twelve to eighteen months of harvest. Yet most bottles will not tell you when the olives were picked — only when a bottler decided the oil should be sold by, which can be two years later and tells you nothing about the oil's real age.",
      },
      {
        type: "p",
        text: "That single omission is how a great deal of tired, blended, anonymous oil reaches American tables wearing the words extra virgin. So it is where I draw the line. If a producer will not state a harvest date, their oil does not appear on Veritat.",
      },
      { type: "h2", text: "What I check before an oil is listed" },
      {
        type: "list",
        items: [
          "A stated harvest date — the month and year the olives were milled",
          "Specific origin — the region and, where possible, the estate or mill",
          "The olive varietals, named",
          "Competition awards, checked against the competition's own published results",
          "A working link to the producer's own shop, so you buy direct",
        ],
      },
      {
        type: "p",
        text: "Nothing is invented and nothing is guessed. If a producer cannot tell me something, the listing simply leaves it blank. An honest gap is better than a confident fiction — that is rather the whole point of a company named truth.",
      },
      { type: "h2", text: "What The Olive Vine will bring you" },
      {
        type: "list",
        items: [
          "Producer stories — the families, the groves, the mills, and why their oil tastes the way it does",
          "How to taste — fruitiness, bitterness and pungency, explained so you can judge a bottle yourself",
          "Label literacy — what 'cold-pressed', 'Product of Italy' and 'first press' actually mean, and what they don't",
          "New harvest news — who has pressed, what is fresh, what is worth ordering now",
          "Recipes and pairings from my own kitchen, where all of this started",
        ],
      },
      {
        type: "p",
        text: "Whether you have been buying good oil for twenty years or you have just discovered that supermarket bottles taste of nothing, you are welcome here. I will keep chasing facts rather than fads, and I will keep telling you when something is not worth your money.",
      },
      { type: "h2", text: "Come and taste with me" },
      {
        type: "p",
        text: "The first certified oils are live now, with more arriving through this harvest. Go and look at the harvest dates. Then go and look at the bottle in your own kitchen, and see whether it can tell you the same.",
      },
      {
        type: "p",
        text: "Reply and tell me your favourite olive oil memory, or the bottle that first made you realise what real oil tastes like. That exchange — that is what I missed most.",
      },
      { type: "p", text: "With warmth and gratitude,\nJulie" },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
