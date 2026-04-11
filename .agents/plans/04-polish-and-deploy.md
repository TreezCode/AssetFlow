# Feature: Polish, Optimization & Deployment

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

## Feature Description

Final refinement pass across the entire AssetFlow application: responsive audit, animation polish, error handling hardening, accessibility compliance, performance optimization, SEO metadata, and production deployment. This plan transforms the functional application into a polished, portfolio-quality product.

## User Story

As a portfolio reviewer or potential employer,  
I want to see a polished, performant, accessible application with professional attention to detail,  
So that I can assess the developer's ability to ship production-quality software.

## Problem Statement

Plans 1-3 produce a functional application, but production readiness requires systematic polish: responsive edge cases, animation smoothness, error handling, accessibility compliance, SEO metadata, performance tuning, and deployment configuration.

## Solution Statement

Systematic audit and refinement across all components, followed by production deployment to Netlify or Vercel. Each audit area has specific checklists and validation criteria.

## Feature Metadata

**Feature Type**: Enhancement  
**Estimated Complexity**: Medium  
**Primary Systems Affected**: All components, metadata, deployment config  
**Dependencies**: Plans 1-3 complete

**Prerequisite**: Plans 1, 2, and 3 must all be complete.

---

## CONTEXT REFERENCES

### Relevant Documentation

- `docs/BUILD_WITH_TREEZ_DESIGN_SYSTEM.md` — Accessibility standards, responsive patterns, animation timing
- `docs/context.md` (lines 253-260) — Performance requirements
- `docs/PRD.md` (Section 12, 13) — Success criteria, acceptance criteria

### Files to Audit / Update

Every file in `src/` is subject to this audit. Key areas:

- `src/app/layout.tsx` — Metadata, OG image, structured data
- `src/app/globals.css` — Utility classes, reduced motion
- `src/components/landing/*` — Responsive, animations, accessibility
- `src/components/app/*` — Error states, edge cases, responsive
- `src/components/layout/*` — Header/Footer responsive, keyboard nav
- `src/components/ui/*` — Focus states, disabled states

### New Files to Create

```
src/
├── app/
│   ├── opengraph-image.tsx     # Dynamic OG image generation
│   ├── robots.ts               # robots.txt generation
│   └── sitemap.ts              # sitemap.xml generation
```

---

## IMPLEMENTATION PLAN

### Phase 1: Responsive Audit
### Phase 2: Animation Polish
### Phase 3: Error Handling & Edge Cases
### Phase 4: Accessibility Audit
### Phase 5: Performance Optimization
### Phase 6: SEO & Metadata
### Phase 7: Deployment

---

## STEP-BY-STEP TASKS

---

### Task 1: AUDIT Responsive Design (All Breakpoints)

- **IMPLEMENT**: Test every page at 375px, 768px, 1024px, 1280px, 1536px
- **CHECK**:
  - [ ] No horizontal overflow at any breakpoint
  - [ ] Text readable without zoom at 375px
  - [ ] Touch targets ≥ 44px on mobile
  - [ ] Grids stack appropriately on small screens
  - [ ] Header hamburger works, menu slides out
  - [ ] Upload zone is usable on mobile
  - [ ] Image cards don't overflow
  - [ ] Export button accessible on all sizes
  - [ ] Pricing cards stack on mobile
  - [ ] Footer wraps correctly
- **FIX**: Any issues found during audit
- **VALIDATE**: Visual check at all 5 breakpoints

---

### Task 2: AUDIT Animation Consistency

- **IMPLEMENT**: Verify all animations follow design system timing
- **CHECK**:
  - [ ] All scroll-triggered animations use `viewport={{ once: true }}`
  - [ ] No animation replays on scroll back
  - [ ] Transition durations: 300ms (interactions), 800ms (entrances)
  - [ ] Hover effects: scale(1.05) with 300ms ease
  - [ ] No janky animations (test on throttled CPU in dev tools)
  - [ ] Animations don't cause layout shifts
- **ADD**: `prefers-reduced-motion` support in globals.css:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- **VALIDATE**: Animations smooth at 60fps, reduced motion respected

---

### Task 3: HARDEN Error Handling

- **IMPLEMENT**: Add graceful error states throughout
- **CHECK / ADD**:
  - [ ] Upload: reject non-image files with toast/message
  - [ ] Upload: handle File API errors (permissions, corrupt files)
  - [ ] Thumbnail: fallback for Canvas errors (show placeholder)
  - [ ] Export: try/catch around JSZip with user-friendly error message
  - [ ] Export: handle empty export (no images)
  - [ ] SKU input: visual feedback for invalid characters
  - [ ] Group creation: prevent empty names, duplicate names
  - [ ] Descriptor: prevent assignment without group/SKU
- **PATTERN**: Use design system error message pattern (`bg-red-500/10 border border-red-500/30`)
- **VALIDATE**: Each error scenario tested manually

---

### Task 4: AUDIT Accessibility

- **IMPLEMENT**: Full WCAG AA compliance check
- **CHECK / ADD**:
  - [ ] All `<img>` tags have `alt` text (thumbnails: original filename)
  - [ ] All buttons have accessible labels (`aria-label` for icon-only buttons)
  - [ ] Form inputs have associated `<label>` elements
  - [ ] Focus order is logical (tab through upload → groups → export)
  - [ ] Focus indicators visible on all interactive elements (`:focus-visible` ring)
  - [ ] Color contrast meets 4.5:1 for normal text, 3:1 for large text
  - [ ] Semantic HTML: `<main>`, `<section>`, `<nav>`, `<footer>`, `<article>`
  - [ ] Upload zone is keyboard accessible (Enter/Space to trigger file picker)
  - [ ] Skip-to-content link on landing page
  - [ ] Screen reader announcements for dynamic content (export progress)
  - [ ] `role="alert"` for error messages
- **VALIDATE**: Tab through entire app with keyboard only — everything accessible

---

### Task 5: OPTIMIZE Performance

- **IMPLEMENT**: Performance optimizations
- **CHECK / ADD**:
  - [ ] Landing page components use `whileInView` (lazy animation, no eager computation)
  - [ ] No unnecessary re-renders in image cards (use Zustand selectors, not full store)
  - [ ] Thumbnail generation doesn't block UI (already async from Plan 1)
  - [ ] Images use `loading="lazy"` where applicable
  - [ ] No large bundle imports (check with `npm run build` output)
  - [ ] Dynamic import for JSZip: `const JSZip = (await import('jszip')).default`
  - [ ] Avoid layout thrashing in animations (use transform/opacity only)
  - [ ] Memoize computed values where beneficial (`useMemo` for resolved filenames)
- **VALIDATE**: Lighthouse Performance score ≥ 90

---

### Task 6: CREATE SEO Metadata

- **IMPLEMENT**: Complete SEO configuration
- **UPDATE** `src/app/layout.tsx`:
  - metadataBase URL
  - Title: "AssetFlow — Product Image Renaming Tool | Build With Treez"
  - Description: compelling 150-160 char description
  - Keywords
  - OpenGraph metadata
  - Twitter card metadata
  - Schema.org structured data (SoftwareApplication)
- **CREATE** `src/app/opengraph-image.tsx`:
  - Dynamic OG image (1200×630)
  - Brand gradient background
  - "AssetFlow" + tagline
  - Build With Treez branding
- **CREATE** `src/app/robots.ts`:
  - Allow all crawlers
  - Reference sitemap
- **CREATE** `src/app/sitemap.ts`:
  - Include `/` and `/app` routes
  - Set appropriate changeFrequency and priority
- **VALIDATE**: OG image generates correctly, metadata renders in HTML head

---

### Task 7: DEPLOY to Production

- **IMPLEMENT**: Deploy to Netlify or Vercel
- **STEPS**:
  1. `npm run build` — verify zero errors
  2. Initialize git if not done: `git init && git add . && git commit -m "Initial commit: AssetFlow MVP"`
  3. Push to GitHub repository
  4. Connect to Netlify/Vercel
  5. Configure build settings (Next.js auto-detected)
  6. Deploy
  7. Verify production URL works
  8. Test OG image on social media validators
- **VALIDATE**: Production site loads, full workflow works, OG image correct

---

### Task 8: FINAL Design System Compliance Check

- **IMPLEMENT**: Side-by-side comparison with design system doc
- **CHECK**:
  - [ ] Brand colors used correctly (#915eff, #00d4ff, #ff6b9d)
  - [ ] Glass morphism on cards and overlays
  - [ ] Buttons follow 3-tier system
  - [ ] Hover effects: scale + glow (300ms)
  - [ ] Focus states: purple ring (buttons), purple ring (form inputs)
  - [ ] Typography scales across breakpoints
  - [ ] Spacing follows design system scale
  - [ ] Sacred geometry accent present (landing page)
  - [ ] Dark theme consistently applied
  - [ ] Footer and Header match design system patterns
- **VALIDATE**: Visual inspection matches design system documentation

---

## VALIDATION COMMANDS

### Level 1: Build

```bash
npm run build
npx tsc --noEmit
npm run lint
```

### Level 2: Lighthouse

```bash
# Run in Chrome DevTools → Lighthouse tab
# Target: Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+
```

### Level 3: Manual Testing

**Responsive:**
- [ ] 375px: Landing + App fully functional
- [ ] 768px: Layouts adjust correctly  
- [ ] 1280px: Full desktop experience

**Accessibility:**
- [ ] Full keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] Focus indicators visible

**Cross-Browser:**
- [ ] Chrome: Full functionality
- [ ] Firefox: Full functionality
- [ ] Safari: Full functionality (especially drag-and-drop)
- [ ] Edge: Full functionality

**E2E Workflow:**
- [ ] Landing → click CTA → Upload → Group → Name → Export → ZIP correct

---

## ACCEPTANCE CRITERIA

- [ ] `npm run build` passes with zero errors and warnings
- [ ] Lighthouse scores: Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+
- [ ] Responsive at all breakpoints (no overflow, no cut-off content)
- [ ] All animations smooth, respect prefers-reduced-motion
- [ ] Error states handle all edge cases gracefully
- [ ] WCAG AA accessibility compliance
- [ ] Full keyboard navigation functional
- [ ] OG image generates correctly
- [ ] Site deployed to production URL
- [ ] Full workflow works on production
- [ ] Design system compliance verified
- [ ] Cross-browser testing passed (Chrome, Firefox, Safari, Edge)

---

## COMPLETION CHECKLIST

- [ ] All 8 tasks completed
- [ ] Lighthouse audit passed
- [ ] Responsive audit passed
- [ ] Accessibility audit passed
- [ ] Performance optimizations applied
- [ ] SEO metadata configured
- [ ] OG image working
- [ ] Deployed to production
- [ ] Cross-browser tested
- [ ] Design system compliance final check
- [ ] **AssetFlow MVP is SHIPPED** 🚀

---

## NOTES

- **Priority Order**: If time is limited, prioritize: (1) Error handling, (2) Responsive fixes, (3) Accessibility, (4) SEO, (5) Animation polish, (6) Performance.
- **Lighthouse**: Don't chase 100/100 — 90+ across all categories is the target. Focus on real user experience over synthetic scores.
- **OG Image**: Follow the pattern from the portfolio (opengraph-image.tsx with ImageResponse). Brand it properly.
- **Deployment**: Vercel is recommended for Next.js (zero-config). Netlify works too with `@netlify/plugin-nextjs`.
- **Post-Deploy**: Test OG images with Facebook Debugger and Twitter Card Validator.

**Confidence Score: 9/10** — Polish tasks are well-defined and systematic. Main variable is time allocation — each audit can expand if many issues are found.
