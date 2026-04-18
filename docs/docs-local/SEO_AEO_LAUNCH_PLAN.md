# Renamerly SEO + AEO Launch Plan

**Canonical domain:** `https://renamerly.com`
**Stack:** Next.js (App Router) on Vercel, Supabase, Stripe
**Goal:** Rank on Google/Bing for product-image-renaming intents AND surface in AI answers (ChatGPT, Perplexity, Google AI Overviews, Claude, Gemini).

This doc is execution-oriented. Work top-to-bottom. Check boxes as you go.

---

## 0. Pre-flight audit (what already exists)

Already in place — do not duplicate:

- `@/src/app/layout.tsx:21-105` — root `Metadata` (title template, OG, Twitter, robots, keywords, icons, manifest).
- `@/src/app/layout.tsx:112-135` — `SoftwareApplication` JSON-LD.
- `@/src/app/opengraph-image.tsx` — dynamic OG image.
- `@/src/app/sitemap.ts` — basic sitemap (2 URLs).
- `@/src/app/robots.ts` — robots with `/api/` disallow.
- `@vercel/analytics` wired in `@/src/app/layout.tsx:159`.

**Known gaps to fix first (tracked in Phase 2):**

1. `@/src/app/sitemap.ts:4-6` and `@/src/app/robots.ts:4-6` prefer `VERCEL_URL` (which is the *preview* URL, e.g. `renamerly-git-xyz.vercel.app`). In production this produces sitemaps/robots that point at the preview host. Fix: prefer `NEXT_PUBLIC_SITE_URL` / hard-code `https://renamerly.com` when `VERCEL_ENV === 'production'`.
2. Sitemap only lists 2 URLs. Needs `/pricing`, `/auth/login`, `/auth/signup` (no-index these), blog posts (future).
3. JSON-LD `aggregateRating` (`@/src/app/layout.tsx:130-134`) has `"ratingCount": "1"` — **remove** until you have real reviews. Google can flag this as spammy structured data and suppress rich results site-wide.
4. No per-page `Metadata` on `/pricing`, `/app`, `/auth/*`. Each needs unique title + description + canonical.
5. No `BreadcrumbList`, `FAQPage`, `Organization`, or `WebSite` (with `SearchAction`) schema.
6. No Google Analytics 4 (only Vercel Analytics, which ≠ GA4 for Search Console/conversion tracking).

---

## Phase 1 — Verify domain & wire up Search Console (Day 1, ~30 min)

### 1.1 Google Search Console (GSC)

1. Go to <https://search.google.com/search-console>.
2. Add property → **Domain** property (not URL-prefix). Enter `renamerly.com`.
3. Verify via DNS TXT record (at your registrar, e.g. Cloudflare/Namecheap):
   - Type: `TXT`
   - Host: `@`
   - Value: `google-site-verification=<token-from-GSC>`
   - TTL: Auto / 3600
4. Click Verify in GSC. Domain property covers `www.`, `http/https`, and all subdomains (incl. `auth.renamerly.com` if you set up the Supabase custom domain).
5. **Submit sitemap:** GSC → Sitemaps → add `https://renamerly.com/sitemap.xml`.
6. **URL Inspection:** paste `https://renamerly.com/` → Request indexing.

### 1.2 Bing Webmaster Tools

1. <https://www.bing.com/webmasters> → Add site `https://renamerly.com`.
2. Easiest: **Import from GSC** (one click). Otherwise verify via DNS TXT or `BingSiteAuth.xml`.
3. Submit sitemap.
4. Bing powers DuckDuckGo, Yahoo, **and ChatGPT search** — do not skip.

### 1.3 IndexNow (optional but high ROI)

- Generate a key at <https://www.indexnow.org/>.
- Host it at `https://renamerly.com/<key>.txt` (place in `/public/`).
- Ping `https://api.indexnow.org/indexnow?url=...&key=<key>` whenever you publish/update a page. Bing + Yandex pick up within minutes. Cloudflare has a one-click integration.

### 1.4 Other engines

- **Yandex Webmaster** (low priority unless targeting RU).
- **Naver / Baidu** — skip unless targeting KR/CN.

---

## Phase 2 — Technical SEO hardening (Day 1–2)

### 2.1 Fix sitemap + robots base URL

Edit `@/src/app/sitemap.ts` and `@/src/app/robots.ts` to use a resolver that prefers the canonical production domain:

```ts
const baseUrl =
  process.env.VERCEL_ENV === 'production'
    ? 'https://renamerly.com'
    : process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
```

### 2.2 Expand sitemap

Add entries for every public, indexable route. Mark auth pages as `noindex` via per-page `robots` metadata (don't include in sitemap at all). Target entries:

- `/` (priority 1.0, monthly)
- `/app` (0.8, weekly)
- `/pricing` (0.9, monthly)
- `/blog` + `/blog/[slug]` once blog exists (0.7, weekly)
- `/changelog`, `/about`, `/contact`, `/privacy`, `/terms` (0.3–0.5)

### 2.3 Per-page metadata

For each route, export a `Metadata` object (or `generateMetadata`) with:

- Unique `title` (50–60 chars, primary keyword first)
- Unique `description` (140–160 chars, includes value prop + CTA verb)
- `alternates.canonical` → absolute URL
- `openGraph` overrides when the page deserves a unique OG image

**Auth + dashboard pages:** add `robots: { index: false, follow: false }` to metadata.

### 2.4 Structured data (JSON-LD)

Add to `@/src/app/layout.tsx` or per-page `<script type="application/ld+json">`:

- **Organization** (sitewide): name, url, logo, sameAs (Twitter, LinkedIn, GitHub, YouTube).
- **WebSite** with `SearchAction` (sitelinks search box — only if you add site search).
- **SoftwareApplication** — keep, but **remove fake `aggregateRating`**. Add back only when you have ≥5 real reviews with schema on a reviews page.
- **BreadcrumbList** on nested pages.
- **FAQPage** on landing + pricing (huge for AI answer surfaces).
- **Product** + **Offer** on `/pricing` for each plan.
- **HowTo** on any "how to rename product images" tutorial pages.

Validate everything at <https://validator.schema.org/> and <https://search.google.com/test/rich-results>.

### 2.5 Core Web Vitals

Target (GSC "Core Web Vitals" report):

- **LCP** < 2.5s — ensure hero image uses `next/image` with `priority`.
- **INP** < 200ms — defer non-critical JS; audit heavy client components under `@/src/components/app/`.
- **CLS** < 0.1 — reserve dimensions on all images/embeds.

Run `npx @unlighthouse/cli --site https://renamerly.com` weekly. Also check GSC → Experience → Core Web Vitals.

### 2.6 Crawlability checklist

- `https://renamerly.com/robots.txt` resolves and lists sitemap ✅
- `https://renamerly.com/sitemap.xml` resolves and contains all public URLs
- No `noindex` on public pages (check rendered HTML, not just source)
- `hreflang` — only if you add locales
- 301 redirect `www.renamerly.com` → `renamerly.com` (or vice versa) — pick one canonical host; configure in Vercel → Domains
- 301 redirect `http://` → `https://` (Vercel does this automatically)
- Custom 404 page at `@/src/app/not-found.tsx` (create if missing)

### 2.7 Performance quick wins

- Preload the primary web font (already done in `@/src/app/layout.tsx:143-149`).
- `next/font` with `display: 'swap'` (already done).
- Image optimization: every `<img>` → `next/image` with explicit `width`/`height`.
- Lazy-load below-the-fold heavy components via `dynamic(() => import(...), { ssr: false })`.

---

## Phase 3 — Analytics & measurement (Day 2)

### 3.1 Google Analytics 4

1. <https://analytics.google.com/> → Admin → Create property "Renamerly".
2. Add a Web data stream for `https://renamerly.com` → copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. Install via `@next/third-parties` (official, zero-config, SSR-safe):

   ```bash
   npm i @next/third-parties
   ```

   In `@/src/app/layout.tsx` inside `<body>`:

   ```tsx
   import { GoogleAnalytics } from '@next/third-parties/google'
   // ...
   <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
   ```

4. Add `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` to Vercel env (Production + Preview).
5. In GA4 → Admin → **Link to Search Console** (Product links). Enables organic-query reports.
6. Mark conversions in GA4 → Admin → Events: `sign_up`, `subscribe`, `checkout_completed`, `file_exported`.

### 3.2 Google Tag Manager (optional but recommended)

- Use GTM if you expect to layer on LinkedIn/Reddit/Twitter pixels, hotjar, Clarity, etc. Otherwise GA4 direct is fine.

### 3.3 Microsoft Clarity (free heatmaps + session recordings)

- <https://clarity.microsoft.com/> → create project → drop the script via `<Script>` in `@/src/app/layout.tsx`.

### 3.4 Vercel Analytics

- Already installed (`@/src/app/layout.tsx:159`). Keep — gives RUM Core Web Vitals without sampling. Consider also `@vercel/speed-insights` for per-route CWV.

### 3.5 Product analytics (PostHog or similar) — optional Phase 5

- Self-hosted PostHog or cloud. Tracks funnel: landing → signup → first export → subscribe.

### 3.6 UTM hygiene

- All outbound links (social, email, ads) → tag with `utm_source`, `utm_medium`, `utm_campaign`. Use the GA4 campaign builder.

---

## Phase 4 — Content + on-page SEO (Week 1–4)

### 4.1 Keyword strategy

Primary cluster (high intent, moderate difficulty):

- "rename product images for shopify"
- "batch rename photos for etsy"
- "seo friendly image file names"
- "product photo naming convention"
- "bulk image rename tool online"

Use Google Keyword Planner (free with any Google Ads account, even $0 spend), Ahrefs Free Webmaster Tools, or <https://keywordseverywhere.com>. Target **long-tail** first; you will not rank for "image rename" against Adobe.

### 4.2 Content map (minimum viable blog)

Create `/blog` with these posts in order (each 1,500–2,500 words, one primary keyword):

1. "How to Rename Product Images for Shopify (The SEO-Friendly Way)"
2. "Etsy Product Photo File Names: What Actually Helps You Rank"
3. "Bulk Rename Images Without Losing EXIF Data — Complete Guide"
4. "Image SEO in 2026: File Names, Alt Text, and Structured Data"
5. "Shopify vs Etsy vs Amazon: Image Naming Requirements Compared"

Each post ships with:

- Canonical URL, unique OG image
- `Article` + `BreadcrumbList` JSON-LD
- `FAQPage` JSON-LD at the bottom (3–5 Qs pulled from "People Also Ask")
- Internal links to `/app` and `/pricing`
- At least one original screenshot or diagram

### 4.3 Landing page on-page

Audit `@/src/app/page.tsx` and landing components:

- H1 contains primary keyword ("Rename Product Images in Seconds" or similar)
- Exactly one H1, logical H2/H3 hierarchy
- First 100 words explain *what it is* and *who it's for*
- FAQ section with 5–8 Qs, wrapped in `FAQPage` schema
- Social proof (logos, testimonials) — real only
- Clear primary CTA above fold

### 4.4 Internal linking

- Every blog post links to `/app` and at least 2 other posts.
- Footer links to all top-level pages.
- Breadcrumbs on nested routes.

### 4.5 Image SEO

- Every image has descriptive `alt` (keyword-relevant, not stuffed).
- File names are kebab-case and descriptive (`renamerly-batch-rename-demo.png`, not `IMG_4821.png`).
- Serve WebP/AVIF via `next/image`.

---

## Phase 5 — Off-page / authority (Week 2+)

### 5.1 Backlinks (white hat only)

- **Product Hunt launch** — single biggest day-1 backlink + traffic spike.
- **AppSumo / BetaList / Indie Hackers / Hacker News Show HN** — submit staggered.
- **Shopify app ecosystem directories**, Etsy seller communities (Reddit, Facebook groups — no spam, genuine help).
- Guest posts on e-commerce blogs (Oberlo-style, shopify.com/blog guest program).
- **HARO / Qwoted / SourceBottle** — respond to journalist queries weekly.

### 5.2 Brand entities

Create consistent profiles (for "sameAs" in Organization schema):

- Twitter/X: `@buildwithtreez` (already in metadata)
- LinkedIn Company Page
- GitHub org
- YouTube channel (even 3 short demos help)
- Crunchbase profile
- G2 / Capterra / Product Hunt / AlternativeTo listings

### 5.3 Digital PR

- Pitch niche e-commerce newsletters (2PM, Lean Luxe, Modern Retail).
- Sponsor small e-com podcasts if budget allows (link in show notes).

---

## Phase 6 — AEO (Answer Engine Optimization) for LLMs

**Why AEO matters now:** ~15% of Google searches already show AI Overviews, ChatGPT's search index pulls from Bing, Perplexity cites its sources inline, and Claude/Gemini increasingly cite web sources. Ranking ≠ being cited.

### 6.1 Make the site machine-readable

- **Clean HTML semantics:** `<article>`, `<section>`, `<h1>`–`<h3>` hierarchy. LLMs parse the DOM; sloppy markup hurts extraction.
- **Structured data everywhere** (Phase 2.4) — FAQPage, HowTo, Product, Organization are the big ones that LLMs use as ground truth.
- **Plain-language summaries at the top** of every page. A `<p>` right under the H1 that answers "what is this + who it's for + what it costs" in ≤50 words. LLMs extract this as the "snippet".
- **Definitive, quotable sentences.** LLMs reward short declarative statements over marketing fluff. "Renamerly renames up to 500 product images per batch in under 10 seconds" > "Blazing fast rename power".

### 6.2 llms.txt (emerging standard)

Create `@/public/llms.txt` — a plain-text site index for LLMs, modeled on robots.txt. Format spec: <https://llmstxt.org/>.

```
# Renamerly
> SEO-friendly batch renaming for Shopify and Etsy product images.

## Docs
- [How it works](https://renamerly.com/how-it-works): step-by-step flow
- [Pricing](https://renamerly.com/pricing): Free, Pro ($X/mo), Team ($Y/mo)
- [API](https://renamerly.com/docs/api): REST endpoints (if exposed)

## Blog
- [Shopify image naming guide](https://renamerly.com/blog/shopify-image-naming)
- ...
```

Also consider `llms-full.txt` with expanded content. Anthropic, OpenAI, and Perplexity have all signaled support.

### 6.3 Allow AI crawlers (deliberately)

Decide your stance and bake it into `@/src/app/robots.ts`. To appear in AI answers, you generally want to **allow** these bots:

- `GPTBot` (OpenAI training) — allow if you want training influence
- `OAI-SearchBot` (ChatGPT search) — **allow** (required for citations in ChatGPT)
- `ChatGPT-User` (on-demand fetch when a user asks ChatGPT about you) — allow
- `PerplexityBot` — **allow**
- `Perplexity-User` — allow
- `Google-Extended` (Gemini/AI Overviews training) — allow
- `ClaudeBot` / `anthropic-ai` — allow
- `Applebot-Extended` — allow
- `CCBot` (Common Crawl, powers many models) — allow

Example additions to `robots.ts`:

```ts
rules: [
  { userAgent: '*', allow: '/', disallow: '/api/' },
  { userAgent: 'GPTBot', allow: '/' },
  { userAgent: 'OAI-SearchBot', allow: '/' },
  { userAgent: 'ChatGPT-User', allow: '/' },
  { userAgent: 'PerplexityBot', allow: '/' },
  { userAgent: 'Google-Extended', allow: '/' },
  { userAgent: 'ClaudeBot', allow: '/' },
  { userAgent: 'anthropic-ai', allow: '/' },
  { userAgent: 'Applebot-Extended', allow: '/' },
  { userAgent: 'CCBot', allow: '/' },
],
```

If you want to block training but allow retrieval (common for paid-content sites), disallow `GPTBot`/`Google-Extended`/`ClaudeBot` and allow the `*-User`/`*-SearchBot` variants.

### 6.4 Content shape that gets cited

LLMs preferentially cite:

- **Listicles with explicit H2 headings matching the question** ("Best tools to rename product images in 2026")
- **Comparison tables** (markdown-style, simple)
- **"How to X" articles** with numbered steps + HowTo schema
- **FAQ sections** at the bottom of every page
- **Stats + sources** — original data (your own usage stats, anonymized) is highly citable

Write at least one "vs competitor" page per major competitor (Bulk Rename Utility, NameChanger, Adobe Bridge). LLMs love these for comparative queries.

### 6.5 Track AEO visibility

- **Peec AI**, **Profound**, **AthenaHQ**, **Otterly.AI**, **Evertune**, **SE Ranking's AI visibility** — paid tools that track citations across ChatGPT/Perplexity/Gemini/Claude.
- **Free method:** weekly, manually query ChatGPT, Perplexity, Google AI Mode, Claude with 5 seed prompts:
  - "best tool to rename product images for shopify"
  - "how do I batch rename etsy product photos"
  - "seo-friendly image file names for ecommerce"
  - "alternatives to bulk rename utility for mac"
  - "what is Renamerly"
- Log which sources get cited. Reverse-engineer their page structure.

### 6.6 Reddit + YouTube + Quora

LLMs lean heavily on Reddit (OpenAI has a paid licensing deal; Google indexes Reddit prominently). Genuine, non-spammy participation in `r/shopify`, `r/etsy`, `r/ecommerce`, `r/entrepreneur` pays back in AI citations months later.

YouTube transcripts are in training sets. A 2-minute demo video on YouTube with a keyword-rich title + description + timestamps is cheap AEO.

---

## Phase 7 — Ongoing ops (monthly cadence)

### Weekly

- GSC → Performance: track impressions, CTR, avg position for top 20 queries
- GSC → Pages → check for new errors (404s, soft 404s, redirect chains)
- Vercel Analytics / GA4 → top landing pages + conversion funnel
- AI citation spot-check (Phase 6.5)

### Monthly

- Publish 2–4 blog posts
- Refresh one existing post (update stats, add FAQs, re-submit to GSC)
- Backlink audit (Ahrefs Webmaster Tools free tier)
- Core Web Vitals report (GSC + PageSpeed Insights)
- Run <https://www.seobility.net> free audit
- Check for new AI crawlers and update `robots.ts`

### Quarterly

- Re-run keyword research — intent drifts
- Competitor audit (who is ranking above you for your top 10 keywords; what content do they have that you don't)
- Structured data validation run across all templates
- Refresh OG images if branding shifts

---

## Execution checklist (copy to your tracker)

### Day 1
- [ ] Verify `renamerly.com` in Google Search Console (DNS TXT)
- [ ] Submit `sitemap.xml` in GSC
- [ ] Verify + submit sitemap in Bing Webmaster Tools
- [ ] Fix `sitemap.ts` / `robots.ts` base URL resolver
- [ ] Remove fake `aggregateRating` from JSON-LD
- [ ] Add GA4 via `@next/third-parties`; set `NEXT_PUBLIC_GA_ID`
- [ ] Link GA4 ↔ Search Console

### Week 1
- [ ] Per-page `Metadata` on `/`, `/pricing`, `/app`, `/auth/*` (with canonical + robots directives)
- [ ] Add `Organization`, `WebSite`, `FAQPage`, `BreadcrumbList` JSON-LD
- [ ] Create `/public/llms.txt`
- [ ] Update `robots.ts` with explicit AI-crawler rules
- [ ] Install Microsoft Clarity
- [ ] Create `not-found.tsx` 404 page
- [ ] Submit IndexNow key
- [ ] Create social profiles (LinkedIn, YouTube, G2, Capterra, Product Hunt, AlternativeTo)

### Week 2–4
- [ ] Publish first 3 blog posts (see Phase 4.2)
- [ ] Product Hunt launch prep (hunter, assets, teaser list)
- [ ] One "vs competitor" page
- [ ] Record and publish 2-min YouTube demo
- [ ] Begin HARO/Qwoted responses (2/week)

### Ongoing
- [ ] Weekly GSC + AI citation check
- [ ] Monthly content cadence (2–4 posts)
- [ ] Quarterly competitor + keyword refresh

---

## Reference URLs

- Google Search Console: <https://search.google.com/search-console>
- Bing Webmaster: <https://www.bing.com/webmasters>
- GA4: <https://analytics.google.com/>
- Schema validator: <https://validator.schema.org/>
- Rich Results Test: <https://search.google.com/test/rich-results>
- PageSpeed Insights: <https://pagespeed.web.dev/>
- IndexNow: <https://www.indexnow.org/>
- llms.txt spec: <https://llmstxt.org/>
- Robots tester: <https://support.google.com/webmasters/answer/6062598>

---

## Notes on ownership

This is a living doc. Treat Phase 1–3 as **blocking for launch**. Phase 4+ is the flywheel — execute consistently, not perfectly. AEO (Phase 6) compounds slowly; the sites being cited in ChatGPT today published their cornerstone content 12–24 months ago.
