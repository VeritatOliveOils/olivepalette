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
    slug: "olio-nuovo-season",
    title: "Olive oil autumn: what olio nuovo is, and why you drink it fast",
    description:
      "New-harvest olive oil arrives cloudy, green and fierce — and it does not wait. What olio nuovo is, how to buy it, how to roast with it, and why the smoke-point myth is wrong.",
    excerpt:
      "New-harvest oil arrives cloudy, green and fierce. It is the best olive oil you will taste all year, and it does not wait for you.",
    date: "2026-08-18",
    displayDate: "18 August 2026",
    readingMinutes: 5,
    keywords: [
      "olio nuovo",
      "new harvest olive oil",
      "limited harvest olive oil",
      "unfiltered olive oil",
      "olive oil smoke point",
      "roasting vegetables olive oil",
      "can you cook with extra virgin olive oil",
    ],
    body: [
      {
        type: "quote",
        text: "Autumn is a second spring when every leaf is a flower. — Albert Camus",
      },
      {
        type: "p",
        text: "Everyone else gets excited about autumn for the leaves. In our world, autumn means one thing: harvest. From roughly October through December, across Spain, Italy, Greece, Turkey, California and everywhere else olives grow, the trees are stripped and the mills run around the clock. And for a few short weeks afterwards, something remarkable becomes available.",
      },
      { type: "h2", text: "What olio nuovo actually is" },
      {
        type: "p",
        text: "Olio nuovo — new oil — is extra virgin olive oil straight from the first pressing, usually unfiltered, bottled within days or even hours of milling. Producers release it in small quantities, often on pre-order, and it sells out.",
      },
      {
        type: "p",
        text: "It looks different: cloudy, sometimes almost opaque, an intense green. Those suspended particles of olive flesh are exactly what makes it taste so alive — grassy, peppery, bitter, occasionally aggressive enough to make you cough twice. It is olive oil with the volume turned all the way up.",
      },
      {
        type: "quote",
        text: "Filtered oil is a portrait. Olio nuovo is the person walking into the room.",
      },
      { type: "h2", text: "Drink it fast — faster than they tell you" },
      {
        type: "p",
        text: "Here is my one piece of firm advice. Producers will often say olio nuovo keeps for six months. Technically true. But those same particles that make it extraordinary also make it fragile — they carry moisture and plant matter, and they push the oil towards decline far quicker than a filtered bottle.",
      },
      {
        type: "p",
        text: "Buy it, and use it within about a month. Do not save it for a special occasion; the special occasion is now. Pour it on everything — soup, roasted squash, warm bread, beans, a fried egg, plain rice. If you find yourself rationing it, you have missed the point.",
      },
      { type: "h2", text: "A pro tip for autumn roasting" },
      {
        type: "p",
        text: "When you roast autumn vegetables, season them first, then toss with olive oil. Not the other way round.",
      },
      {
        type: "p",
        text: "Salt, pepper and herbs go on the dry vegetable; the oil goes on afterwards and carries all of it into every surface, while giving the herbs something to cling to. Do it in the other order and your seasoning slides off into the pan. It is a small change to the sequence and it transforms carrots, parsnips and sweet potatoes. You are welcome.",
      },
      { type: "h2", text: "Mythbusting: yes, you can cook with it" },
      {
        type: "p",
        text: "The internet keeps insisting that extra virgin olive oil should never be heated. It is wrong, and it has probably ruined more dinners than any other food myth.",
      },
      {
        type: "p",
        text: "Good extra virgin olive oil smokes somewhere around 375–410°F (190–210°C), depending on its quality and freshness — comfortably above what sautéing and roasting require. Its antioxidants also make it more stable under heat than many refined oils, which is precisely why Mediterranean cooks have fried in it for centuries.",
      },
      {
        type: "list",
        items: [
          "Sautéing — medium-high, around 325–375°F (163–190°C)",
          "Roasting vegetables — 400°F (200°C) is perfectly fine",
          "Deep frying — close to 375°F (190°C)",
          "If the oil is smoking, it is already too late — pull the pan",
        ],
      },
      {
        type: "p",
        text: "Save your finest bottles for finishing, where the flavour is visible. But cook with good oil. That is what it is for.",
      },
      { type: "h2", text: "Roasted squash medley with garlic and olive oil" },
      {
        type: "p",
        text: "Simple, forgiving, and built to show off a good oil. Serve it beside roast chicken or fold it into a grain bowl.",
      },
      {
        type: "list",
        items: [
          "2 small yellow squash and 2 small zucchini, halved lengthways and cut into 1-inch pieces",
          "1 medium onion, diced",
          "1 package button mushrooms, halved",
          "3–4 tablespoons extra virgin olive oil — be generous",
          "2–3 garlic cloves, minced",
          "Kosher salt and fresh cracked black pepper",
          "Optional: Italian herbs, fresh parsley, or parmesan to finish",
        ],
      },
      {
        type: "p",
        text: "Heat the oven to 400°F (200°C). Season the vegetables, then toss them with the oil and garlic until everything is coated. Let them sit for thirty minutes if you have the time. Spread in a single layer on a rimmed baking sheet — crowd them and they steam rather than roast — and roast for about 30 minutes, stirring halfway, until golden and tender. Finish with parsley or parmesan, and a last drizzle of your best oil off the heat.",
      },
      {
        type: "p",
        text: "That final drizzle is not optional. Cooking mutes the delicate aromatics; a raw spoonful at the end puts them back.",
      },
      { type: "h2", text: "How to buy well this season" },
      {
        type: "list",
        items: [
          "Look for the harvest date, not a 'best by' date — new-harvest oil should say so plainly",
          "Expect cloudiness in unfiltered oil; it is a feature, not a fault",
          "Buy a size you can finish in a month, not a year",
          "Order direct from the producer where you can — it is fresher and they keep more of your money",
          "Store it away from heat and light, cap closed tight",
        ],
      },
      {
        type: "p",
        text: "Every oil in the Veritat directory states its harvest date, so you can see at a glance what is genuinely new. When the first bottles of this year's pressing arrive, that is where they will be.",
      },
      {
        type: "p",
        text: "Here's to an autumn drizzled with flavour, health and discovery.\n\nWarmest wishes,\nJulie",
      },
    ],
  },
  {
    slug: "how-to-taste-olive-oil",
    title: "How to taste olive oil: the four S's",
    description:
      "Swirl, sniff, sip, savor — how to taste extra virgin olive oil like a sommelier, what the aromas mean, why the peppery cough is good news, and how to spot a rancid bottle.",
    excerpt:
      "Swirl, sniff, sip, savor. You will look faintly ridiculous doing it, and you will never buy olive oil the same way again.",
    date: "2026-08-17",
    displayDate: "17 August 2026",
    readingMinutes: 6,
    keywords: [
      "how to taste olive oil",
      "olive oil tasting",
      "olive oil tasting glass",
      "extra virgin olive oil flavor",
      "rancid olive oil",
      "olive oil polyphenols",
      "olive oil defects",
      "peppery olive oil",
    ],
    body: [
      {
        type: "p",
        text: "Most people have never actually tasted olive oil. They have poured it, cooked with it, dipped bread in it — but never sat down and paid attention to it the way you would a wine. Ten minutes from now, you will know how. And I promise you will never look at a salad the same way again.",
      },
      {
        type: "p",
        text: "Professionals use four steps. Swirl, sniff, sip, savor. Here is exactly how each one works, and what you are looking for.",
      },
      { type: "h2", text: "1. Swirl — warm it, and hide the colour" },
      {
        type: "p",
        text: "The most glamorous tool in our world is a small cobalt blue glass. It is not decoration. It is engineered to hide the oil's colour entirely, because colour tells you nothing about flavour or quality — and left to ourselves, we all judge with our eyes. Green looks fresh, gold looks tired, and both assumptions are wrong. The blue glass makes you blissfully unbiased.",
      },
      {
        type: "p",
        text: "No blue glass? Improvise. A wine glass works beautifully: pour in a tablespoon or so, cup one hand over the top, and cradle the bowl in the other to warm it. The warmth lifts the aromatics; the cupped hand traps them. Even a spoon will do — just move quickly and sniff while the aromas are still rising.",
      },
      {
        type: "quote",
        text: "Colour means nothing. Warmth and containment are everything.",
      },
      { type: "h2", text: "2. Sniff — let your nose do the talking" },
      {
        type: "p",
        text: "Uncover the glass, put your nose right in, and inhale — long, slow, unhurried. Then do it again. The first breath tells you whether the oil is alive; the second starts giving you detail.",
      },
      {
        type: "p",
        text: "You are hunting for green, fresh, living smells. Here is the vocabulary tasters use — borrow it freely:",
      },
      {
        type: "list",
        items: [
          "Green and vegetal — grass, tomato leaf, artichoke, arugula",
          "Fruit — green apple, unripe banana, citrus peel",
          "Nuts — almond, walnut, pine",
          "Herbs and flowers — sage, mint, basil, rose, chamomile",
          "Earthy — mushroom, hay, fresh-cut wood, soil after rain",
          "And that unmistakable black pepper",
        ],
      },
      {
        type: "p",
        text: "Every oil has its own aromatic personality — an early-harvest Picual bellows where a delicate Arbequina murmurs. There is no wrong answer. If it smells of something, and that something is fresh, you are already in good territory.",
      },
      { type: "h2", text: "3. Sip — and pull a very silly face" },
      {
        type: "p",
        text: "Take a small sip — about a teaspoon — and hold it in the front of your mouth. Now make a not-quite-smile, teeth slightly apart, and suck air in over the oil. It will hiss. Do it three times, letting the oil spread over your tongue, your cheeks, and back towards your throat.",
      },
      {
        type: "p",
        text: "You will look absolutely ridiculous. Every sommelier in the world looks ridiculous doing this. Embrace it.",
      },
      {
        type: "p",
        text: "The technique is called strippaggio, and it works: aerating the oil volatilises the aromatic compounds and carries them up into your nose from behind, which is where most of what we call taste actually happens. Flavours arrive in waves — green and fruity first, then a bitterness in the middle of the tongue, and finally, just as you swallow, a peppery catch at the back of the throat.",
      },
      {
        type: "p",
        text: "If it makes you cough, congratulations. That is oleocanthal, a natural anti-inflammatory compound, and it means the oil is rich in polyphenols. In parts of Spain they measure oils in coughs: one cough, two coughs, three. A cougher is a keeper.",
      },
      { type: "h2", text: "4. Savor — let it linger and tell you the truth" },
      {
        type: "p",
        text: "Pause. Don't reach for water. Let the oil finish speaking, and ask yourself four questions:",
      },
      {
        type: "list",
        items: [
          "Does my mouth feel clean — not greasy, not coated, not waxy?",
          "Did I taste layers, rather than one flat note? Green fruit, bitter almond, artichoke, pepper?",
          "Was there a tickle or burn at the back of the throat?",
          "Do my lips feel fresh rather than filmed over?",
        ],
      },
      {
        type: "p",
        text: "Four yeses and you have just tasted a living extra virgin olive oil. Fresh oil says hello and goodbye — it arrives with fruit and departs with pepper, and the whole conversation lasts about thirty seconds.",
      },
      { type: "h2", text: "And if it is past its best" },
      {
        type: "p",
        text: "Old oil, or oil blended with previous years' stock, tastes unmistakably different once you know the signs:",
      },
      {
        type: "list",
        items: [
          "Flat, fatty or greasy — it coats rather than cleanses",
          "Waxy, leaving a film on the lips",
          "Rancid — crayons, stale walnuts, old peanuts, greasy coins",
          "Musty, dusty or faded, like a room that has been shut up too long",
          "No pepper, no bitterness, no layers — nothing at the finish",
        ],
      },
      {
        type: "p",
        text: "Do not feel bad about it; almost every kitchen has a bottle like this. It is not unsafe, simply lifeless. Use it up on high-heat roasting where subtlety is wasted, or put it to work outside the kitchen — seasoning a cast-iron pan, polishing wooden boards, softening dry hands. Just do not waste your good bread on it.",
      },
      { type: "h2", text: "Why this matters more than any label" },
      {
        type: "p",
        text: "Here is the uncomfortable truth: no label can tell you whether an oil is alive. A harvest date tells you how old it is, provenance tells you where it came from, and both are essential — it is why Veritat will not certify an oil without them. But only your own nose and throat can tell you whether the oil in front of you still has something to say.",
      },
      {
        type: "p",
        text: "So pour a little of whatever is in your cupboard right now. Swirl it, sniff it, pull the silly face. If it comes back flat, you have learned something valuable — and you know exactly what to look for next time.",
      },
      {
        type: "p",
        text: "Now channel your inner Ruth Reichl and taste every glorious drop. Your taste buds will thank you.\n\nHappy tasting,\nJulie",
      },
    ],
  },
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
