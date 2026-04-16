# Plan 08: Advanced Pro Features — Bulk Operations & AI Suite

**Status:** 📋 PLANNED  
**Phase:** 8 of 05-premium-saas-transformation  
**Created:** April 16, 2026  
**Goal:** Enterprise-grade bulk operations + AI-powered SEO descriptor suite to decisively win the e-commerce professional market.

---

## Strategic Context

### Why This Phase Matters

From competitive analysis:
- **Renamify** (primary competitor) charges $10/month and offers generic AI renaming with no e-commerce specialization.
- Our gap: CSV workflows, platform naming conventions, professional bulk tools.
- Their gap: No SKU system, no templates, likely no RAW support, no e-commerce focus.

**Winning strategy:** Own the professional e-commerce workflow end-to-end.
The professional workflow is: *receive photos → organize by SKU → name consistently → add SEO metadata → upload to platform → track in catalog CSV.*
We should touch every step of that chain.

### Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Multi-select | **FREE for all plans** | Table-stakes feature. Gating it hurts perceived value and conversions more than it drives upgrades. Professionals need it to evaluate the tool. |
| Bulk Operations | **Pro tier** | Power workflows that replace expensive agency tools |
| AI Features | **Pro tier** | API costs + competitive differentiator |
| CSV Export | **Pro tier** | Core professional workflow feature |
| CSV Import | **Pro tier** | High complexity, saves hours for professionals |
| Platform Presets | **Free (3 presets) / Pro (all)** | Taste of value on free, full suite on Pro |

---

## Scope

### ✅ Part A — Free Tier Correction (Quick Fix)

**Multi-select is already FREE in code.** Remove it from the Pro-only list in docs and plan. It was incorrectly planned as Pro-only. No code changes needed.

**Platform Naming Presets (3 basic ones free):**
- Generic SKU-based (current default)
- Simple numbered sequence
- Dated prefix (YYYYMMDD-name)

---

### 🔥 Part B — Pro Bulk Operations Suite

#### B1. CSV Export Manifest
**What it does:** After configuring all images, export a structured CSV containing every file's metadata.

**CSV columns:**
```
original_filename, new_filename, sku, descriptor, alt_text, group, file_size_kb, file_type
```

**User workflow:**
1. Configure images as usual (SKUs, descriptors, alt text)
2. Click "Export CSV" in ExportControls
3. Download `renamerly-manifest-[timestamp].csv`
4. Use CSV to update product catalog, upload to Shopify/Etsy, or audit the rename

**Value proposition:** "Download your full product catalog update in one click"

---

#### B2. CSV Import — Bulk Auto-Assign
**What it does:** Upload a product catalog CSV → Renamerly matches image filenames to CSV rows and auto-assigns SKUs, descriptors, and names.

**CSV format accepted (flexible):**
```
image_filename (or pattern), sku, descriptor, alt_text
IMG_1234.jpg, NIKE-001, front, "Nike Air Force 1 White Front View"
IMG_1235.jpg, NIKE-001, side, "Nike Air Force 1 White Side View"
```

**Matching logic:**
- Exact filename match
- Pattern match (e.g., `*1234*` matches `IMG_1234.jpg`)
- Manual review for unmatched images (shown in a table)

**User workflow:**
1. Prepare CSV with product data (or export existing catalog from Shopify/etc.)
2. Upload images + upload CSV
3. Renamerly auto-maps everything
4. Review matches in a confirmation table
5. Confirm → all images get their SKUs/descriptors applied

---

#### B3. Platform Naming Presets (Pro — Full Suite)
Pre-configured naming conventions for major platforms.

| Platform | Format | Example |
|---|---|---|
| **Shopify** | `{product-handle}-{variant}-{position}` | `nike-air-001-white-1.jpg` |
| **Amazon** | `{ASIN}_{view}_{variant}` | `B01N5IB20Q_MAIN_WHITE.jpg` |
| **Etsy** | `{shop-name}-{product}-{number}` | `mytshop-vintage-tee-1.jpg` |
| **WooCommerce** | `{product-slug}-{attribute}` | `air-force-1-white-front.jpg` |
| **Generic SKU** | `{sku}-{descriptor}` | `NIKE-001-front.jpg` (current default) |
| **Custom** | User-defined pattern | Any pattern with tokens |

Each preset applies at the session level — choose a platform, all filenames preview in that format.

---

#### B4. Naming Preview Table (Pre-Export Review)
**What it does:** Before exporting files, show a spreadsheet-style table of all images with their final names, SKU, descriptor, and status (complete/incomplete).

Columns: Thumbnail | Original Name | New Name | SKU | Descriptor | Status | Alt Text (if AI enabled)

- Sortable by column
- Filter by status (complete/incomplete)
- Inline edit any row
- "Fix All Incomplete" quick action
- Export table as CSV (integrates with B1)

This replaces the existing export-ready check and gives professionals a final audit view.

---

### 🤖 Part C — AI Descriptor & SEO Suite (Pro)

#### Architecture

```
Browser → Supabase Edge Function (analyze-image) → OpenAI Vision API
                                                  ↓
                                    { descriptor, altText, confidence }
```

- **No images stored:** Base64 sent to edge function, analyzed, discarded immediately
- **Privacy notice:** Shown before first AI use, requires acknowledgment
- **Rate limit:** 20 AI requests per session (prevents runaway API costs)
- **API key:** `OPENAI_API_KEY` stored as Supabase Edge Function secret
- **Model:** `gpt-4o-mini` for cost efficiency (~$0.003/image analysis)

---

#### C1. AI Descriptor Suggestions

**What it does:** Analyze an image → suggest the most accurate descriptor from the standard list.

**Prompt strategy:**
```
You are an expert e-commerce product photographer. Analyze this image and identify 
the primary view/angle. Respond with ONLY one of these descriptors: 
front, rear, side, diag1, diag2, zoom1, zoom2, folded, tag, thickness, topdown, lifestyle.

Context: SKU = {sku}, Product = {productHint}

Respond with JSON: { "descriptor": "front", "confidence": 0.95, "reasoning": "..." }
```

**UI:**
- ✨ AI icon button on each image card
- Sparkle animation while processing
- Shows suggestion with confidence %
- One-click accept or dismiss
- "Apply AI to all unassigned" bulk button (selection-aware)

---

#### C2. SEO Alt Text Generator

**What it does:** Generate platform-optimized alt text for each image.

Alt text is critical for:
- Screen readers (accessibility compliance)
- Google Image Search ranking
- Platform SEO (Shopify, Etsy all index alt text)

**Prompt strategy:**
```
Generate SEO-optimized alt text for this product image.

Context:
- SKU/Product: {sku}
- Descriptor/View: {descriptor}
- Platform: {platform} (Shopify/Etsy/Amazon/Generic)

Rules:
- 50-125 characters (optimal for SEO)
- Include: product name, key visual attributes, view angle
- Natural language, not keyword-stuffed
- Platform-specific format if specified

Respond with JSON: { "altText": "...", "characterCount": 87, "seoScore": 0.88 }
```

**Output examples:**
- Shopify: `"Nike Air Force 1 Low White Sneaker - Front View on White Background"`
- Etsy: `"Vintage Handmade Ceramic Mug Blue Glazed - Studio Photography"`
- Generic: `"NIKE-001 White Low-Top Athletic Shoe Front Profile View"`

**UI:**
- Alt text field on each image card (hidden by default, shown when focused or AI-generated)
- SEO score indicator (colored bar: red/yellow/green)
- "Generate all alt texts" bulk button
- Alt text included in CSV export manifest

---

#### C3. SEO Filename Quality Score

**What it does:** Rate each configured filename for SEO effectiveness.

**Scoring factors:**
- Length (optimal: 3-5 words, 20-60 chars)
- Word separator style (hyphens preferred over underscores for SEO)
- Keyword presence (SKU included: ✅)
- Descriptor specificity (generic "img" vs "front-view": ✅)
- No sequential numbers without context (product-1.jpg vs nike-001-front.jpg)

**UI:** Small badge on each configured image card: 🟢 SEO Good / 🟡 Could Improve / 🔴 Needs Work

**Value prop:** "Don't just rename — name for Google"

---

### 📊 Part D — Professional Workflow Improvements

#### D1. Group-Level Bulk Actions
Expand the current per-image actions to group-level:
- Apply descriptor to entire group at once
- Apply template to entire group
- Reorder images within a group (drag handles)
- Duplicate a group (copy all settings to new SKU)

#### D2. Export Per-Group
Currently exports all images at once. Add:
- Export single group as ZIP (for platform uploads per product)
- Export all groups as separate ZIPs (one per SKU)
- Flat export (current) + structured export (`/sku/` folders)

#### D3. Quick Session Stats Bar (Free + Pro)
Small stats widget showing:
- Images configured vs total
- Groups with all images named vs total groups
- Estimated export size
- SEO coverage % (if AI enabled)

---

## Implementation Order

### Sprint 1 — Foundation (Estimated 1-2 sessions)
**Goal:** High value, low complexity wins

| Task | File | Complexity |
|---|---|---|
| Remove multi-select from Pro-only docs | Plan docs only | Trivial |
| Naming Preview Table | `NamingPreviewTable.tsx` | Medium |
| CSV Export Manifest | `ExportControls.tsx` + `lib/csv.ts` | Low |
| SEO Filename Quality Score | `lib/seo.ts` + image card | Low |

### Sprint 2 — Platform Presets (Estimated 1 session)
| Task | File | Complexity |
|---|---|---|
| Platform preset config | `lib/platformPresets.ts` | Low |
| Preset selector UI | `AppToolbar.tsx` | Low |
| Apply preset to filename generation | `lib/filename.ts` | Medium |

### Sprint 3 — AI Integration (Estimated 2-3 sessions)
| Task | File | Complexity |
|---|---|---|
| Edge Function: `analyze-image` | Supabase Edge Function | Medium |
| AI descriptor UI (per-image) | Image card component | Medium |
| SEO alt text generation | Edge Function + UI | Medium |
| Bulk AI apply | Selection action bar | Medium |
| Privacy consent modal | `AiConsentModal.tsx` | Low |

### Sprint 4 — CSV Import (Estimated 2 sessions)
| Task | File | Complexity |
|---|---|---|
| CSV parser + mapping logic | `lib/csvImport.ts` | High |
| Import wizard UI (3-step) | `CsvImportWizard.tsx` | High |
| Match review table | `CsvMatchReview.tsx` | Medium |
| Apply matches to store | `useAssetStore.ts` | Medium |

### Sprint 5 — Group Operations (Estimated 1 session)
| Task | File | Complexity |
|---|---|---|
| Group-level bulk actions | `SKUProductGroup.tsx` | Medium |
| Export per-group | `ExportControls.tsx` | Medium |
| Drag reorder within group | `SKUProductGroup.tsx` | Medium |

---

## Dependencies & Requirements

### Technical
- **OpenAI API key** — Required for AI features. User must add `OPENAI_API_KEY` as Supabase Edge Function secret.
- **PapaParse** — CSV parsing library (browser-safe, no server needed): `npm install papaparse @types/papaparse`
- **Supabase Edge Function** — For AI image analysis (keeps API key server-side)

### Business
- Pricing review: Competitive analysis recommends $9/month. Should revisit before AI feature launch as AI cost per user ~$0.50-2.00/month at scale.
- Privacy policy update: Mention that AI analysis temporarily sends image data to OpenAI.

---

## Success Criteria

| Feature | Success Metric |
|---|---|
| CSV Export | Downloads correctly with all columns, opens in Excel/Sheets |
| CSV Import | Maps >90% of images correctly from a standard catalog CSV |
| Platform Presets | Filenames match platform requirements on first try |
| AI Descriptors | Suggests correct descriptor >80% of the time |
| SEO Alt Text | Generated text scores green on 70%+ of images |
| Naming Preview | No surprises on export — what you see = what you get |
| Bulk AI Apply | Processes 20 images in under 30 seconds |

---

## Feature Flags (Gate Against Subscription)

| Feature | Free | Pro |
|---|---|---|
| Multi-select | ✅ | ✅ |
| Naming Preview Table | ✅ (view only) | ✅ (edit) |
| SEO Filename Score | ✅ | ✅ |
| Platform Presets | 3 basic | All + Custom |
| CSV Export | ❌ | ✅ |
| CSV Import | ❌ | ✅ |
| AI Descriptors | ❌ | ✅ |
| SEO Alt Text AI | ❌ | ✅ |
| Export Per-Group | ❌ | ✅ |
| Bulk AI Apply | ❌ | ✅ |

---

## Out of Scope (Phase 9+)

- ❌ Shopify direct upload (OAuth integration)
- ❌ Etsy API upload
- ❌ Background removal (remove.bg integration)
- ❌ Duplicate image detection
- ❌ Image quality scoring (blur/exposure detection)
- ❌ Platform compliance checker (size/format rules)
- ❌ Team collaboration
- ❌ Mobile app
