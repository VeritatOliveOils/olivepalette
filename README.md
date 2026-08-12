# 🫒 OlivePalette

A curated, affiliate-based directory that brings EVOO producers and customers together. Producers list their oils in under a minute — **copy, paste, done** — you (the curator) certify each listing, and consumers discover trustworthy oils by taste profile and buy direct from the maker via tracked affiliate links.

Built with Next.js 15 (App Router, TypeScript), Tailwind CSS, Supabase (auth + Postgres), and the Claude API for Smart Paste parsing.

## How it works

**Producers** sign up, paste *anything* — website product page, tech sheet, back-label text — and Smart Paste (Claude) extracts every field: name, category, varietals, region, farm, harvest year, intensity, flavor tags, tasting notes, taste scores, polyphenols, pairings, size, packaging, price, buy link, acidity, awards, organic status. They review the pre-filled form (AI-filled fields highlighted in gold) and submit.

**You (the curator)** review each submission at `/admin`. One click certifies it — the oil goes live with a **✓ Certified** badge — or rejects it. Any producer edit returns the listing to your queue (enforced in the database, not just the UI). The admin page also shows buy-link clicks per oil and per producer for the last 7/30 days — your leverage for affiliate deals.

**Consumers** browse `/discover` with filters for intensity, flavor tags, ships-to-country, women-led 🚺, organic, and high-polyphenol, plus free-text search. Every Buy button routes through `/go/<id>`, which logs a click event (with UTM support) and redirects to the producer's own shop — no cart, no shipping, no payments in the app.

Each oil page also generates a downloadable **QR code** producers can print on labels, linking back to that oil's story page.

## Setup (about 15 minutes)

### 1. Supabase (free tier)

1. Create a project at [supabase.com](https://supabase.com).
2. In the dashboard, open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and run it.
3. Optional but recommended for testing: **Authentication → Providers → Email → disable "Confirm email"** so producer signups work instantly. Re-enable for production.
4. Copy **Project Settings → API → Project URL** and **anon public key**.
5. **Make yourself the curator/admin**: sign up in the app first, then run this in the SQL Editor (with your email):

```sql
insert into public.admin_users (id)
select id from auth.users where email = 'julierharnish@me.com';
```

Then visit `/admin` while logged in with that account.

### 2. Anthropic API key

Create a key at [console.anthropic.com](https://console.anthropic.com). Smart Paste uses Claude Sonnet server-side only; a parse costs a fraction of a cent.

### 3. Environment

```bash
cp .env.example .env.local
# fill in the three values
```

### 4. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sign up as a producer, add a product with Smart Paste, certify it at /admin, then view it on /discover.

### 5. Deploy to Vercel (free tier)

1. Push this folder to a GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the three environment variables from `.env.local` in the Vercel project settings.
4. Deploy. Done.

## Project structure

```
src/
  app/
    page.tsx               Landing + latest certified oils
    discover/page.tsx      Browse: intensity/flavor/ships-to/women-led/organic/polyphenol filters
    oil/[id]/page.tsx      Product detail (badges, taste bars, specs, tracked buy link, QR)
    producer/[id]/page.tsx Public producer profile (logo, story, Instagram, ships-to)
    login/page.tsx         Producer signup / login
    dashboard/page.tsx     Producer dashboard (profile + products with review status)
    dashboard/new/page.tsx Smart Paste → review form → submit for certification
    admin/page.tsx         Curator: approval queue + click analytics (7/30 days)
    go/[id]/route.ts       Affiliate click logger + redirect to producer shop
    api/parse/route.ts     Claude extraction endpoint (auth-gated)
  components/              Nav, ProductCard, TasteProfile, OilQrCode
  lib/                     Supabase clients, types, constants
supabase/schema.sql        Tables + Row Level Security policies + admin role
```

## Security notes

- Row Level Security does the heavy lifting: the public only sees **approved** products; producers can only write their **own** rows, and any producer write is forced back to `pending` status; only accounts in `admin_users` can approve. All enforced in Postgres, not just the UI.
- Click analytics are readable only by admins and the producer they belong to; anyone can log a click (that's how the redirect works).
- The `/api/parse` route requires a valid Supabase session token, so anonymous visitors can't burn your Anthropic credits.
- The Anthropic key lives server-side only (never shipped to the browser).

## Ideas for v2 (from your concept docs)

- Guided tasting experience + consumer tasting journals
- Tasting kits & party mode (live group notes, voting)
- Paid "certified listing" subscriptions / featured placements (Stripe)
- Content pages (choosing olive oil, regional spotlights) for SEO
- Bulk paste (multiple products at once) and paste-a-URL import
- Producer image uploads via Supabase Storage
