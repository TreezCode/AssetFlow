# Feature: Landing Page

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files etc.

## Feature Description

Build a complete, conversion-optimized landing page for AssetFlow that communicates the product value proposition within 5 seconds, demonstrates the before/after transformation, explains the 3-step workflow, showcases features, presents clear pricing, and drives users to try the product for free — all with Build With Treez design system compliance, Framer Motion animations, and mobile-first responsive design.

## User Story

As a potential user visiting AssetFlow for the first time,  
I want to immediately understand what the product does, how it works, and what it costs,  
So that I can decide to try it within seconds and start renaming my product images.

## Problem Statement

E-commerce sellers waste hours renaming product images manually. They need to discover AssetFlow exists, understand its value instantly, and be compelled to try it — all from a single landing page that builds trust and drives action.

## Solution Statement

A 5-section landing page with: (1) Hero with headline + before/after demo + CTA, (2) How It Works 3-step visual, (3) Feature cards, (4) Free vs Pro pricing table, (5) Final CTA. All sections use scroll-triggered Framer Motion animations, glass morphism design, and brand color palette.

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: High  
**Primary Systems Affected**: Landing page (`src/app/page.tsx`), landing components (`src/components/landing/`)  
**Dependencies**: Framer Motion (animations), Lucide React (icons), Plan 1 complete (layout, design system, Button component)

**Prerequisite**: Plan 1 (Project Foundation) must be complete.

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING!

These files will exist after Plan 1 is complete:

- `src/app/layout.tsx` — Root layout with Header/Footer (wraps landing page)
- `src/app/globals.css` — Design system tokens (@theme block with brand colors)
- `src/components/ui/Button.tsx` — Reusable button component (primary, secondary, ghost)
- `src/components/layout/Header.tsx` — Navigation header (has links to landing sections)
- `src/lib/constants.ts` — `APP_NAME`, `MAX_FREE_IMAGES`, `DEFAULT_DESCRIPTORS`
- `docs/context.md` (lines 206-220) — Landing page requirements
- `docs/BUILD_WITH_TREEZ_DESIGN_SYSTEM.md` — Full design system reference
- `docs/PRD.md` (Section 7.7) — Landing page feature specification

### New Files to Create

```
src/components/landing/
├── Hero.tsx              # Hero section: headline, subheadline, before/after, CTA
├── HowItWorks.tsx        # 3-step visual workflow explanation
├── Features.tsx          # 6 feature cards in responsive grid
├── Pricing.tsx           # Free vs Pro comparison table
├── CallToAction.tsx      # Final CTA section driving to /app
└── BeforeAfter.tsx       # Reusable before/after filename transformation demo
```

### Files to Update

- `src/app/page.tsx` — Replace placeholder with landing page sections

### Relevant Documentation

- [Framer Motion whileInView](https://motion.dev/docs/react-animation#scroll-triggered) — Scroll-triggered entrance animations
- [Framer Motion Variants](https://motion.dev/docs/react-animation#variants) — Staggered children animations
- [Lucide Icons](https://lucide.dev/icons/) — Icon reference for feature cards
- `/docs/BUILD_WITH_TREEZ_DESIGN_SYSTEM.md` — Animation standards, glass morphism, responsive patterns

### Patterns to Follow

**Scroll-Triggered Animation (from design system):**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8 }}
>
  {/* Content */}
</motion.div>
```

**Stagger Children (from design system):**
```tsx
<motion.div
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  variants={{
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    />
  ))}
</motion.div>
```

**Glass Morphism Card:**
```tsx
className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
```

**Section Container:**
```tsx
className="py-16 sm:py-20 md:py-28 lg:py-32"
// Inner container:
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

**Responsive Typography:**
```tsx
// Section heading
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
// Section subheading
className="text-base sm:text-lg md:text-xl text-gray-400"
```

---

## IMPLEMENTATION PLAN

### Phase 1: Shared Components & Animations

Create reusable animation wrappers and the BeforeAfter demo component.

**Tasks:**
- Create animation variant objects as shared constants
- Build `BeforeAfter.tsx` component showing filename transformation

### Phase 2: Hero Section

The most critical section — users decide to stay or leave here.

**Tasks:**
- Headline with gradient text
- Subheadline
- BeforeAfter transformation demo
- Primary + Secondary CTA buttons
- Optional: subtle sacred geometry background accent

### Phase 3: How It Works

Visual 3-step explanation with icons and connecting flow.

**Tasks:**
- 3 step cards: Upload → Organize → Export
- Number indicators and icons
- Connecting visual (line or arrow between steps)
- Staggered entrance animation

### Phase 4: Features

Capability showcase with glass morphism cards.

**Tasks:**
- 6 feature cards in responsive grid
- Icons from Lucide React
- Glass morphism styling with hover effects
- Staggered animation

### Phase 5: Pricing

Clear Free vs Pro comparison.

**Tasks:**
- Two pricing cards side-by-side
- Feature lists with check/x icons
- Highlighted "recommended" card (Pro)
- CTA buttons on each card

### Phase 6: Final CTA

Strong closing section driving action.

**Tasks:**
- Compelling headline
- Primary CTA button linking to `/app`
- Background accent or gradient

### Phase 7: Page Assembly

Wire all sections together in `page.tsx`.

**Tasks:**
- Import and render all sections in order
- Add section IDs for header navigation scroll
- Verify responsive layout end-to-end

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom.

---

### Task 1: CREATE `src/components/landing/BeforeAfter.tsx`

- **IMPLEMENT**: Visual before/after filename transformation demo
- **CONTENT**: Show 3-4 messy filenames on the left transforming to clean filenames on the right
- **EXAMPLES**:
  ```
  IMG_2045.jpg     →   63755-front.jpg
  DSC_0892.png     →   63755-rear.png
  photo (3).jpeg   →   63755-zoom1.jpeg
  ```
- **STYLING**: 
  - Two columns (or stacked on mobile) with glass morphism cards
  - Left card: red-tinted border (`border-error/30`), messy filenames in monospace
  - Right card: green-tinted border (`border-success/30`), clean filenames in monospace
  - Arrow or "→" between them
  - Animate: left card slides in from left, right card slides in from right
- **IMPORTS**: `motion` from framer-motion
- **VALIDATE**: Component renders the transformation demo with animation

---

### Task 2: CREATE `src/components/landing/Hero.tsx`

- **IMPLEMENT**: Hero section — the first thing users see
- **CONTENT**:
  - **Badge**: "Product Image Renaming Tool" — small status badge at top
  - **Headline**: "Stop Wasting Hours Renaming Product Images" — gradient text (purple → cyan)
  - **Subheadline**: "Convert unstructured image files into clean, store-ready assets in seconds. No signup required."
  - **BeforeAfter Demo**: The transformation component from Task 1
  - **CTAs**: 
    - Primary: "Try It Free — No Signup" → links to `/app`
    - Secondary: "See Pricing" → scrolls to pricing section
- **STYLING**:
  - Full viewport height (min-h-screen) or generous padding
  - Centered content
  - Gradient text: `bg-gradient-to-r from-treez-purple via-treez-cyan to-treez-pink bg-clip-text text-transparent`
  - Sacred geometry accent (optional): subtle radial gradient or geometric SVG in background at low opacity
- **ANIMATION**:
  - Headline: fade in + slide up (0.8s)
  - Subheadline: fade in + slide up (0.8s, 0.2s delay)
  - BeforeAfter: fade in (0.8s, 0.4s delay)
  - CTAs: fade in + slide up (0.8s, 0.6s delay)
- **IMPORTS**: `motion` from framer-motion, `Button` from ui, `BeforeAfter`, `Link` from next/link, `ArrowRight` from lucide-react
- **GOTCHA**: "See Pricing" button should use `document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })` — NOT a Next.js Link
- **VALIDATE**: Hero renders with headline, demo, and CTAs. Animation plays on load.

---

### Task 3: CREATE `src/components/landing/HowItWorks.tsx`

- **IMPLEMENT**: 3-step visual workflow explanation
- **CONTENT**:
  - Section heading: "How It Works" + subheading: "Three simple steps to perfectly named product images"
  - **Step 1**: Upload — "Drag and drop your product images" — Upload icon
  - **Step 2**: Organize — "Group images, assign SKUs and descriptors" — FolderOpen or Layers icon
  - **Step 3**: Export — "Download your renamed files as a ZIP" — Download icon
- **STYLING**:
  - Section ID: `id="how-it-works"`
  - 3-column grid on desktop, stacked on mobile
  - Each step: number badge (01, 02, 03), icon in glass card, title, description
  - Step number: large, gradient text
  - Connecting line between steps (horizontal on desktop, vertical on mobile) — use a subtle dashed border or gradient line
- **ANIMATION**: Stagger children (0.15s) with slide-up entrance, triggered on scroll into view
- **IMPORTS**: `motion` from framer-motion, icons from lucide-react (`Upload`, `FolderOpen`, `Download`)
- **VALIDATE**: Section renders 3 steps with icons, responsive grid, staggered animation

---

### Task 4: CREATE `src/components/landing/Features.tsx`

- **IMPLEMENT**: Feature capability cards
- **CONTENT** (6 features):
  1. **Drag & Drop Upload** — "Drop your images and start instantly" — `MousePointerClick` icon
  2. **Smart Grouping** — "Organize images into product sets effortlessly" — `LayoutGrid` icon
  3. **Live Preview** — "See filenames update as you type" — `Eye` icon
  4. **Custom Descriptors** — "Use defaults or create your own naming scheme" — `Tag` icon
  5. **Instant Export** — "Download all renamed files as a single ZIP" — `Archive` icon
  6. **No Signup Required** — "Start using immediately — no account needed" — `Zap` icon
- **STYLING**:
  - Section ID: `id="features"`
  - Section heading: "Powerful Features" + subheading
  - 3-column grid (1 mobile, 2 tablet, 3 desktop)
  - Each card: glass morphism, icon with brand color, title, description
  - Hover: scale(1.05), border color shift to purple, glow shadow
- **ANIMATION**: Stagger children (0.1s) with scale + fade entrance
- **IMPORTS**: `motion` from framer-motion, icons from lucide-react
- **VALIDATE**: 6 cards render in responsive grid with hover effects and animation

---

### Task 5: CREATE `src/components/landing/Pricing.tsx`

- **IMPLEMENT**: Free vs Pro pricing comparison
- **CONTENT**:
  - Section heading: "Simple Pricing" + subheading: "Start free, upgrade when you need more"
  - Section ID: `id="pricing"`
  - **Free Card**:
    - Price: "$0" / "Free forever"
    - Features: ✅ Up to 20 images per session, ✅ Full core workflow, ✅ Drag-and-drop upload, ✅ Live filename preview, ✅ ZIP export, ✅ No signup required
    - CTA: "Get Started Free" → `/app`
  - **Pro Card** (highlighted):
    - Price: "$9/mo" (or "Coming Soon")
    - Badge: "Most Popular" or "Coming Soon"
    - Features: ✅ Everything in Free, ✅ Unlimited images, ✅ Saved templates, ✅ Persistent data, ✅ Priority support
    - CTA: "Coming Soon" (disabled) or "Upgrade to Pro"
- **STYLING**:
  - Two cards side-by-side (stacked on mobile)
  - Free: standard glass card
  - Pro: glass card with purple border glow, slightly elevated (scale or shadow), "recommended" badge
  - Feature list: check icons in green (✅) for included
  - Price text: large, bold
- **ANIMATION**: Cards fade in + scale up, staggered
- **IMPORTS**: `motion` from framer-motion, `Button` from ui, `Check` from lucide-react, `Link` from next/link
- **GOTCHA**: Pro features are post-MVP. Mark the Pro CTA as "Coming Soon" with disabled state, or use a waitlist approach. Do NOT implement billing.
- **VALIDATE**: Both cards render, responsive layout, Pro card highlighted

---

### Task 6: CREATE `src/components/landing/CallToAction.tsx`

- **IMPLEMENT**: Strong closing CTA section
- **CONTENT**:
  - Headline: "Ready to Streamline Your Product Images?"
  - Subheadline: "Join thousands of sellers who save hours every week with AssetFlow."
  - Primary CTA: "Try It Free — No Signup" → `/app`
- **STYLING**:
  - Background: subtle gradient (deep-space to cosmic-gray) or glass morphism card
  - Centered content with generous padding
  - Optional: decorative border (gradient top border)
- **ANIMATION**: Fade in + slight scale on scroll into view
- **IMPORTS**: `motion` from framer-motion, `Button` from ui, `Link` from next/link, `ArrowRight` from lucide-react
- **VALIDATE**: CTA renders with compelling copy and button

---

### Task 7: UPDATE `src/app/page.tsx` — Assemble Landing Page

- **IMPLEMENT**: Replace placeholder with all landing sections in order
- **CONTENT**:
  ```tsx
  import { Hero } from '@/components/landing/Hero'
  import { HowItWorks } from '@/components/landing/HowItWorks'
  import { Features } from '@/components/landing/Features'
  import { Pricing } from '@/components/landing/Pricing'
  import { CallToAction } from '@/components/landing/CallToAction'
  
  export default function LandingPage() {
    return (
      <>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <CallToAction />
      </>
    )
  }
  ```
- **GOTCHA**: This page can be a Server Component (no `'use client'`) if individual sections handle their own client-side logic. However, if scroll-to-section logic is needed at the page level, mark as client.
- **VALIDATE**: Full landing page renders with all 5 sections in order

---

### Task 8: UPDATE Header navigation scroll targets

- **IMPLEMENT**: Ensure Header nav links scroll to correct section IDs
- **SECTIONS**: `#hero` (or top), `#how-it-works`, `#features`, `#pricing`
- **GOTCHA**: These links should only use scrollIntoView when on the landing page (`/`). When on `/app`, they should navigate back to landing first. Use conditional logic or keep it simple by always scrolling.
- **VALIDATE**: Clicking "Features" in header scrolls to features section smoothly

---

### Task 9: VALIDATE Full Landing Page

- **IMPLEMENT**: Comprehensive testing of the complete landing page
- **VALIDATE**: `npm run build` — zero errors
- **VALIDATE**: All 5 sections render correctly
- **VALIDATE**: Animations trigger on scroll
- **VALIDATE**: All CTAs link to correct destinations
- **VALIDATE**: Responsive at 375px, 768px, 1280px
- **VALIDATE**: Design system compliance (colors, fonts, glass morphism, buttons)

---

## TESTING STRATEGY

### Unit Tests

Not required for landing page. Visual components are best tested manually and with screenshots.

### Integration Tests

Not applicable for static marketing content.

### Edge Cases

- Very small screens (320px width)
- Very large screens (2560px width)
- Slow scroll speed (animations should still trigger)
- Fast scroll (animations shouldn't break)
- Browser back/forward after section scroll
- Reduced motion preference (respect `prefers-reduced-motion`)

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
npx tsc --noEmit
npm run lint
```

### Level 2: Build

```bash
npm run build
```

### Level 3: Manual Validation

**Hero Section:**
- [ ] Gradient headline renders correctly
- [ ] Before/After demo shows transformation
- [ ] "Try It Free" button links to `/app`
- [ ] "See Pricing" button scrolls to pricing
- [ ] Animation plays on page load

**How It Works:**
- [ ] 3 steps render with icons and descriptions
- [ ] Responsive: stacks on mobile, 3-col on desktop
- [ ] Stagger animation on scroll

**Features:**
- [ ] 6 cards render in responsive grid
- [ ] Hover effects work (scale, glow)
- [ ] Icons display correctly
- [ ] Stagger animation on scroll

**Pricing:**
- [ ] Free and Pro cards render
- [ ] Pro card is highlighted/elevated
- [ ] Feature lists have check icons
- [ ] "Get Started Free" links to `/app`
- [ ] "Coming Soon" is properly disabled

**Final CTA:**
- [ ] Compelling copy renders
- [ ] CTA button links to `/app`

**Responsive:**
- [ ] 375px (mobile): Everything stacks, readable, no overflow
- [ ] 768px (tablet): Grid adjusts, spacing correct
- [ ] 1280px (desktop): Full layout, proper spacing

---

## ACCEPTANCE CRITERIA

- [ ] `npm run build` passes with zero errors
- [ ] All 5 landing sections render in correct order
- [ ] Value proposition is clear within 5 seconds
- [ ] Before/After demo shows filename transformation
- [ ] 3-step workflow is visually clear
- [ ] 6 feature cards with glass morphism and hover effects
- [ ] Pricing table shows Free vs Pro clearly
- [ ] All CTAs link to `/app` correctly
- [ ] Framer Motion animations trigger on scroll (once per element)
- [ ] Responsive at mobile, tablet, and desktop breakpoints
- [ ] Design system compliance: brand colors, glass morphism, button variants, typography scale
- [ ] Header section navigation scrolls to correct sections
- [ ] Sacred geometry accent present (subtle, non-distracting)

---

## COMPLETION CHECKLIST

- [ ] All 9 tasks completed in order
- [ ] Each task validation passed
- [ ] `npm run build` passes
- [ ] Full responsive check at 3 breakpoints
- [ ] All animations smooth and non-janky
- [ ] Design system compliance verified
- [ ] Landing page communicates value in < 5 seconds
- [ ] Ready for Plan 3 (Core Application) execution

---

## NOTES

- **Animation Restraint**: The design system says "Framer Motion (minimal usage)" and context.md says "Avoid heavy animation, unnecessary effects." Keep animations subtle — fade + slide up is the primary pattern. No particle effects, no complex transitions.
- **Sacred Geometry**: Keep it to ONE subtle element — a faint radial gradient or geometric SVG in the hero background at 3-7% opacity. Do not overdo it.
- **Pro Pricing**: Since billing is post-MVP, the Pro card should clearly show "Coming Soon" to set expectations without killing the pricing section's usefulness.
- **Content First**: The copy matters more than the visuals. Nail the headlines and descriptions before polishing animations.
- **Performance**: No heavy images. The before/after demo is text-based (code/filename display), not image-based. Keep the landing page fast.

**Confidence Score: 9/10** — Clear design system, established component patterns from Plan 1, well-defined section requirements. Main risk is visual polish iteration.
