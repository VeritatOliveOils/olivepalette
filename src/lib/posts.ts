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
      slug: "olive-oil-gift-guide",
      title: "How to give olive oil as a gift, and what to look for",
      description: "A sommelier's guide to giving olive oil as a gift: why new-harvest oil is the bottle to give, what makes a good gift bottle, and how to choose by taste.",
      excerpt: "A good bottle of olive oil is one of the few gifts that gets used to the last drop. Here is how to choose one worth giving.",
      date: "2026-11-14",
      displayDate: "14 November 2026",
      readingMinutes: 4,
      keywords: [
        "olive oil gift",
        "olive oil gift ideas",
        "best olive oil to give as a gift",
        "new harvest olive oil gift",
        "olive oil for food lovers",
      ],
      body: [
        {
          type: "p",
          text: "Olive oil is one of the few gifts that gets used to the last drop. It ends up on the table every day, and it reminds the person of you every time they pour it. But a beautiful bottle is not always a good bottle. Here is how I choose one worth giving.",
        },
        {
          type: "h2",
          text: "Give the new harvest",
        },
        {
          type: "p",
          text: "November is the best month of the year to give olive oil. Across Spain, Italy, Greece and the rest of the Mediterranean, the harvest is under way and the first oil of the season is coming off the mills. It is green, bright and peppery, and it only tastes like this for a short time.",
        },
        {
          type: "p",
          text: "Giving new-harvest oil is like giving the first strawberries of summer. It says you chose something at its peak, not something that has been sitting on a shelf. Look for the harvest month on the label. If it says this autumn, you have found the one.",
        },
        {
          type: "h2",
          text: "What makes a good gift bottle",
        },
        {
          type: "p",
          text: "The prettiest bottle in the shop is often clear glass with a ribbon on it. Clear glass lets light in, and light is one of the things that ages olive oil fastest. Pass it by.",
        },
        {
          type: "list",
          items: [
            "A stated harvest date. Not just a best-by date. The harvest date tells you how fresh the oil really is.",
            "Dark glass or a tin. Both protect the oil from light. A good tin can be as handsome as any bottle.",
            "A size they will finish. A 500 ml bottle used with joy beats a litre that goes stale in the cupboard. If you want to give more, give two different small bottles.",
            "Who made it. A named producer, a named place and, ideally, a named variety of olive. Mystery oil is not a gift.",
          ],
        },
        {
          type: "p",
          text: "And keep it out of a hot car or a sunny window while it waits under the tree.",
        },
        {
          type: "h2",
          text: "Choose by taste, not by price",
        },
        {
          type: "p",
          text: "Olive oils are as different as wines. The best gift matches the person, not the price tag. On Veritat you can filter the oils by intensity, delicate, medium or robust, which makes this easy.",
        },
        {
          type: "list",
          items: [
            "Delicate, for someone new to good olive oil. Soft, buttery, gently fruity. Lovely on fish, eggs and salads, and a gentle introduction for anyone who thinks olive oil is just for cooking.",
            "Medium, for the everyday cook. Fresh and green with a little bitterness and a light peppery finish. It works with almost everything, from roast vegetables to pasta.",
            "Robust, for the food lover who wants a thrill. Grassy, bitter and peppery enough to make you cough. Wonderful over beans, grilled meat, bitter greens and warm bread. This is the one for the friend who already has everything.",
          ],
        },
        {
          type: "p",
          text: "If you cannot decide, give two small bottles of different intensities. Tasting them side by side is half the fun, and it is the quickest way to learn what you like.",
        },
        {
          type: "h2",
          text: "Make it a little ritual",
        },
        {
          type: "p",
          text: "Add a loaf of good bread and a small dish of flaky salt, and the gift becomes an evening. Write the harvest date and the producer's name on the card. It tells them this is not just any oil, and that you know the difference.",
        },
        {
          type: "p",
          text: "Every oil in the Veritat directory shows its harvest date and links straight to the producer's own shop, so your gift money goes to the family who made it.",
        },
        {
          type: "p",
          text: "Wishing you a season of good bread, good oil and good company.\n\nWarmest wishes,\nJulie",
        },
      ],
    },
  {
      slug: "early-harvest-olive-oil",
      title: "Early harvest olive oil: why green olives cost more",
      description: "Early harvest olive oil is pressed from green olives in October. Why it gives less oil, why it tastes peppery, and why only a lab report proves the polyphenols.",
      excerpt: "In October the first olives come off the trees while they are still green. They give less oil, and a very different one. Here is what you are paying for.",
      date: "2026-10-13",
      displayDate: "13 October 2026",
      readingMinutes: 4,
      keywords: [
        "early harvest olive oil",
        "green olives olive oil",
        "high polyphenol olive oil",
        "olive oil lab report",
        "oleocanthal",
      ],
      body: [
        {
          type: "p",
          text: "October is when the harvest starts in Spain, Italy, Greece and the rest of the Northern Hemisphere. Some producers do not wait for the olives to ripen. They pick them green, or just as they start to turn, and press them straight away. That is early harvest olive oil, and it is the most expensive oil many producers make.",
        },
        {
          type: "h2",
          text: "Less oil from the same trees",
        },
        {
          type: "p",
          text: "A green olive holds less oil than a ripe one. So an early harvest gives the producer fewer litres from the same grove, and that cost lands on the price of the bottle.",
        },
        {
          type: "p",
          text: "How much less? One study followed a single orchard in western Turkey and pressed its olives in the same mill twice: once on 4 October 2021 and again on 8 December. The early fruit gave 11.37% oil. The December fruit gave 13.67%. That is roughly one sixth less oil, from the same trees, just by picking two months sooner.",
        },
        {
          type: "h2",
          text: "What it tastes like",
        },
        {
          type: "p",
          text: "Early harvest oil is green in every sense. Expect cut grass, green tomato, artichoke and almond skin, then bitterness on the tongue and a peppery catch at the back of the throat. That catch is linked to oleocanthal, one of the natural compounds in fresh olive oil. If it makes you cough, the oil is doing its job.",
        },
        {
          type: "p",
          text: "In the Turkish study, the tasting panel gave the October oil higher scores for green fruit, bitterness and pepper. Consumers in the same study preferred it too.",
        },
        {
          type: "h2",
          text: "The part the label leaves out",
        },
        {
          type: "p",
          text: "You will often read that early harvest means more polyphenols, the antioxidants behind olive oil's health reputation. Often that is true. But it is not a rule. In that same study, the December oil actually contained more biophenols than the October one. Variety, weather, irrigation and milling all change the result.",
        },
        {
          type: "p",
          text: "So the words early harvest on a label tell you about the style of the oil. They do not prove what is inside. Only a lab report does.",
        },
        {
          type: "h2",
          text: "What a polyphenol number really means",
        },
        {
          type: "p",
          text: "In the European Union, an olive oil can only carry the health claim that its polyphenols help protect blood lipids from oxidative stress if it contains at least 5 mg of hydroxytyrosol and its derivatives per 20 g of oil. That works out to about 250 mg per kilo. The label must also say the benefit comes from 20 g of oil a day.",
        },
        {
          type: "p",
          text: "A high number on a website, with no lab named and no date of analysis, is a marketing figure. A real one comes with a report.",
        },
        {
          type: "h2",
          text: "How to buy early harvest oil well",
        },
        {
          type: "list",
          items: [
            "Check the harvest month. Early harvest from the north should say October or November.",
            "Ask for the lab report: the lab's name, the date of analysis and the polyphenol result.",
            "Buy a small bottle. The pepper and bitterness soften over the months, so drink it young.",
            "Expect to pay more. Less oil per tree is the honest reason why.",
          ],
        },
        {
          type: "p",
          text: "Every oil certified on Veritat states its harvest date. Before I certify an oil, I ask to see the lab report behind any polyphenol figure it claims.",
        },
        {
          type: "p",
          text: "Here is to the first green oil of the season.\n\nWarmest wishes,\nJulie",
        },
      ],
    },
  {
      slug: "september-olive-oil-harvest-date",
      title: "Why September is the hardest month to buy good olive oil",
      description: "In September most olive oil on the shelf is nearly a year old. How to read the harvest date, why best-by misleads, and where to find fresher oil.",
      excerpt: "The new harvest has not started, and last year's oil is at its oldest. A sommelier's guide to buying well in the leanest month of the olive oil year.",
      date: "2026-09-15",
      displayDate: "15 September 2026",
      readingMinutes: 4,
      keywords: [
        "olive oil harvest date",
        "olive oil best by date",
        "fresh olive oil",
        "southern hemisphere olive oil",
        "how to buy olive oil",
      ],
      body: [
        {
          type: "p",
          text: "September is the leanest month of the olive oil year. In Spain, Italy and Greece the olives are still on the trees. The Northern Hemisphere harvest runs from about October to January, so the Mediterranean oil in most shops right now was pressed last autumn. It is close to a year old, and it is as old as it is going to get before the new oil arrives.",
        },
        {
          type: "p",
          text: "That does not mean you cannot buy well. It means you have to read the label more carefully than usual.",
        },
        {
          type: "h2",
          text: "The date that matters",
        },
        {
          type: "p",
          text: "Most bottles show a best-by date. That tells you how long the bottler expects the oil to stay sellable. It does not tell you when the olives were picked, and two bottles with the same best-by date can be very different ages.",
        },
        {
          type: "p",
          text: "The harvest date is the one that matters. Under European Union marketing rules, a harvest year may be shown only if 100% of the oil in the bottle comes from that harvest. Blends of several seasons cannot print one. So when a producer states the harvest clearly, it is a small act of honesty, and worth rewarding.",
        },
        {
          type: "h2",
          text: "Look south in September",
        },
        {
          type: "p",
          text: "Olive trees in Australia, Chile, Argentina and South Africa follow the southern seasons, with harvest roughly between April and June. A bottle pressed there in May is the freshest olive oil you can buy in September.",
        },
        {
          type: "p",
          text: "If you love Mediterranean oil, this is a good month to try something new from the Southern Hemisphere. Look for the same variety you already love from Europe, and taste the two side by side to see how a different climate changes it. Then come back to the Northern Hemisphere when the new harvest arrives.",
        },
        {
          type: "h2",
          text: "Reading a label this month",
        },
        {
          type: "list",
          items: [
            "Harvest date from last autumn: fine, but buy a small bottle and use it soon.",
            "Harvest date from this year, Southern Hemisphere: the freshest option on the shelf.",
            "Only a best-by date: ask the seller when it was pressed. If they cannot tell you, move on.",
            "Dark glass or a tin, kept away from heat and light, always.",
            "Buy a size you will finish quickly once it is open.",
          ],
        },
        {
          type: "h2",
          text: "Trust your nose",
        },
        {
          type: "p",
          text: "Pour a little into a glass, cup it in your hand to warm it, and smell. Fresh oil smells green and fruity. Oil that smells of crayons, putty or old walnuts has gone rancid, whatever the label says. No date can overrule your nose.",
        },
        {
          type: "p",
          text: "This is why Veritat has one rule that never bends: no verified harvest date, no certification. Every oil in the directory shows its harvest, so you can see at a glance how fresh it is.",
        },
        {
          type: "p",
          text: "The new season is only weeks away.\n\nWarmest wishes,\nJulie",
        },
      ],
    },
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
