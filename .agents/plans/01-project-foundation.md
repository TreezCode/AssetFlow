# Feature: Project Foundation

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files etc.

## Feature Description

Initialize the AssetFlow project from scratch with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, and the Build With Treez design system. Establish the foundational architecture including layout components, routing, type definitions, utility functions, and Zustand state management.

## User Story

As a developer building AssetFlow,  
I want a solid project foundation with design system, types, utilities, and layout in place,  
So that all subsequent features (landing page, core app) can be built consistently and efficiently.

## Problem Statement

AssetFlow is a greenfield project with no existing code. We need a production-quality scaffold that integrates the Build With Treez design system, establishes TypeScript types for the entire domain model, creates reusable filename sanitization utilities, and sets up the Zustand store — all before any feature work begins.

## Solution Statement

Initialize a Next.js 15 project with TypeScript and Tailwind CSS v4. Configure the design system tokens (colors, fonts, spacing) via Tailwind's CSS-first `@theme` directive. Build the Header and Footer layout components. Define the route structure (`/` for landing, `/app` for tool). Create all TypeScript interfaces, filename utilities with sanitization rules, constants, and the Zustand store skeleton.

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: Medium  
**Primary Systems Affected**: Project scaffold, design system, layout, routing, state management, types, utilities  
**Dependencies**: Next.js 15, TypeScript, Tailwind CSS v4, Zustand 5, Framer Motion 11, JSZip 3, Lucide React

---

## CONTEXT REFERENCES

### Relevant Documentation — YOU MUST READ THESE BEFORE IMPLEMENTING!

- `/docs/context.md` — **Source of truth** for product scope, workflow, naming rules, tech stack, constraints
- `/docs/BUILD_WITH_TREEZ_DESIGN_SYSTEM.md` — **Source of truth** for all visual design: colors, buttons, glass morphism, animations, responsive patterns, component structure
- `/docs/PRD.md` — Product requirements, data models, architecture, directory structure

### External Documentation — READ BEFORE IMPLEMENTING!

- [Next.js 15 App Router Installation](https://nextjs.org/docs/app/getting-started/installation) — Project initialization with create-next-app
- [Next.js 15 Routing](https://nextjs.org/docs/app/building-your-application/routing) — App Router file-based routing
- [Next.js 15 Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) — SEO metadata API
- [Next.js 15 Fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) — next/font for self-hosted fonts
- [Tailwind CSS v4 Installation](https://tailwindcss.com/docs/installation) — CSS-first config with `@import "tailwindcss"` and `@theme`
- [Zustand v5 TypeScript Guide](https://zustand.docs.pmnd.rs/guides/typescript) — Typed store creation with `create<State>()()`
- [Framer Motion](https://motion.dev/docs) — Animation patterns for React

### New Files to Create

```
src/
├── app/
│   ├── globals.css                # Tailwind imports + @theme design tokens
│   ├── layout.tsx                 # Root layout (fonts, metadata, dark theme)
│   ├── page.tsx                   # Landing page placeholder (renders Plan 2 content)
│   └── app/
│       └── page.tsx               # Application page placeholder (renders Plan 3 content)
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Navigation header with logo, links, CTA
│   │   └── Footer.tsx             # Footer with brand, links, copyright
│   └── ui/
│       └── Button.tsx             # Reusable button component (primary, secondary, ghost)
├── stores/
│   └── useAssetStore.ts           # Zustand store with full typed interface
├── lib/
│   ├── filename.ts                # Filename sanitization and generation
│   └── constants.ts               # Descriptors, limits, config values
├── types/
│   └── index.ts                   # All TypeScript interfaces
└── hooks/
    (empty — created in Plan 3)
```

### Patterns to Follow

**Component Structure** (from design system):
```tsx
'use client'

// External imports
import { motion } from 'framer-motion'

// Internal imports
import { Button } from '@/components/ui/Button'

// Types
interface ComponentProps {
  title: string
}

// Component
export function ComponentName({ title }: ComponentProps) {
  return <section>{/* Content */}</section>
}
```

**Naming Conventions:**
- Components: PascalCase (`Button.tsx`, `Header.tsx`)
- Utilities: camelCase functions in kebab-case files (`filename.ts` → `sanitizeFilename()`)
- Constants: UPPER_SNAKE_CASE (`MAX_FREE_IMAGES`)
- Types: PascalCase interfaces (`AssetImage`, `ProductGroup`)
- CSS: Tailwind utilities

**Glass Morphism Pattern:**
```tsx
className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
```

**Button Tiers:**
- Primary: `bg-gradient-to-r from-[#915eff] to-[#ff6b9d]` with reverse hover
- Secondary: `border-2 border-[#00d4ff]` with cyan glow
- Ghost: `border border-white/10 hover:border-[#915eff]`

---

## IMPLEMENTATION PLAN

### Phase 1: Project Initialization

Initialize Next.js 15 with TypeScript, Tailwind CSS v4, App Router, and `src/` directory.

**Tasks:**
- Run `create-next-app` with appropriate flags
- Verify project runs with `npm run dev`
- Clean out default boilerplate (default page content, styles)

### Phase 2: Design System Integration

Configure Tailwind CSS v4 with Build With Treez design tokens using CSS-first `@theme` directive.

**Tasks:**
- Replace `globals.css` with Tailwind imports and `@theme` block
- Define all brand colors, semantic colors, fonts, spacing as CSS custom properties
- Add utility classes for glass morphism, gradients, transitions
- Set dark theme as default (`bg-[#0a0a0a] text-white` on body)

### Phase 3: TypeScript Interfaces

Define all domain types before any component work.

**Tasks:**
- Create `AssetImage`, `ProductGroup`, `ResolvedFilename`, `DescriptorOption` interfaces
- Create `AssetStore` interface with state and actions
- Export all types from `types/index.ts`

### Phase 4: Utility Functions & Constants

Build filename sanitization logic and constants.

**Tasks:**
- Implement `sanitizeString()` — lowercase, trim, replace spaces, strip invalid chars, collapse hyphens
- Implement `generateFilename()` — combine SKU + descriptor + extension
- Implement `getFileExtension()` — extract and lowercase extension
- Define `DEFAULT_DESCRIPTORS` array
- Define `MAX_FREE_IMAGES`, `ACCEPTED_FILE_TYPES`, `APP_NAME` constants

### Phase 5: Zustand Store

Create the typed Zustand store with all state and actions.

**Tasks:**
- Define store with `create<AssetStore>()()`
- Implement all actions: `addImages`, `removeImage`, `createGroup`, `deleteGroup`, `assignImageToGroup`, `setGroupSku`, `setImageDescriptor`, `setCustomDescriptor`, `reset`
- Implement computed getters: `getResolvedFilenames`, `getGroupImages`, `getUsedDescriptors`, `isExportReady`
- Use `crypto.randomUUID()` for IDs

### Phase 6: Layout Components

Build Header and Footer using design system patterns.

**Tasks:**
- Create Header with logo text, navigation links (Home, Pricing, App), and primary CTA button
- Create Footer with brand name, quick links, and copyright
- Create Button component (primary, secondary, ghost variants)
- Integrate Header/Footer into root layout
- Ensure responsive behavior

### Phase 7: Route Structure

Set up the two-page routing structure.

**Tasks:**
- Landing page (`/`) — placeholder with "Landing Page — Plan 2" message
- App page (`/app`) — placeholder with "Application — Plan 3" message
- Root layout wraps both with Header and Footer
- Verify navigation between routes

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### Task 1: CREATE Next.js Project

- **IMPLEMENT**: Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"` in the AssetFlow directory
- **GOTCHA**: The project directory already has `/docs` and `/.agents` — `create-next-app` should work in an existing directory with `--yes` or by answering prompts. If it fails, initialize in a temp directory and move files.
- **VALIDATE**: `npm run dev` starts without errors

---

### Task 2: CREATE `src/app/globals.css` — Design System Tokens

- **IMPLEMENT**: Replace default globals.css with Tailwind v4 CSS-first config
- **PATTERN**: Use `@import "tailwindcss"` then `@theme` block for all design tokens
- **IMPORTS**: No JS imports — pure CSS
- **CONTENT**:
  ```css
  @import "tailwindcss";

  @theme {
    --color-treez-purple: #915eff;
    --color-treez-cyan: #00d4ff;
    --color-treez-pink: #ff6b9d;
    
    --color-deep-space: #0a0a0a;
    --color-cosmic-gray: #1a1a2e;
    
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: #3b82f6;
  }
  ```
- **GOTCHA**: Tailwind CSS v4 uses `@theme` NOT `tailwind.config.js` for custom tokens. Do NOT create a tailwind.config.js file unless absolutely necessary for plugin compatibility.
- **VALIDATE**: `npm run dev` — no CSS errors, custom colors available as utilities (e.g., `bg-treez-purple`)

---

### Task 3: CREATE `src/types/index.ts` — Domain Types

- **IMPLEMENT**: All TypeScript interfaces for the entire application
- **CONTENT**: Define `AssetImage`, `ProductGroup`, `ResolvedFilename`, `DescriptorOption`, `AssetStore`, and `ButtonVariant` type
- **PATTERN**: Use `interface` for object shapes, `type` for unions
- **GOTCHA**: `AssetImage.file` is `File` type (Web API) — this means the store must be client-side only
- **VALIDATE**: `npx tsc --noEmit` — zero type errors

---

### Task 4: CREATE `src/lib/constants.ts` — Application Constants

- **IMPLEMENT**: All application constants
- **CONTENT**:
  - `APP_NAME = 'AssetFlow'`
  - `MAX_FREE_IMAGES = 20`
  - `ACCEPTED_FILE_TYPES` — object with MIME types and extensions for jpg, jpeg, png, webp, gif
  - `DEFAULT_DESCRIPTORS` — array of `{ value, label }` objects matching the descriptor table in PRD
  - `FILENAME_REGEX` — `/[^a-z0-9-]/g` for sanitization
- **VALIDATE**: File imports correctly in other files

---

### Task 5: CREATE `src/lib/filename.ts` — Filename Utilities

- **IMPLEMENT**: Pure functions for filename generation and sanitization
- **FUNCTIONS**:
  - `sanitizeString(input: string): string` — lowercase, trim, replace spaces with hyphens, strip invalid chars, collapse consecutive hyphens, trim leading/trailing hyphens
  - `getFileExtension(filename: string): string` — extract extension, lowercase, include dot
  - `generateFilename(sku: string, descriptor: string, originalFilename: string): string` — combine sanitized SKU + descriptor + extension
  - `isFilenameComplete(sku: string, descriptor: string): boolean` — both non-empty after sanitization
- **IMPORTS**: `FILENAME_REGEX` from `@/lib/constants`
- **GOTCHA**: Handle edge cases — empty strings, strings that sanitize to empty, files without extensions, multiple dots in filename
- **VALIDATE**: Manual verification of edge cases:
  - `sanitizeString("AB 100")` → `"ab-100"`
  - `sanitizeString("  abc@#$  ")` → `"abc"`
  - `sanitizeString("abc--def")` → `"abc-def"`
  - `generateFilename("63755", "front", "IMG_2045.JPG")` → `"63755-front.jpg"`

---

### Task 6: CREATE `src/stores/useAssetStore.ts` — Zustand Store

- **IMPLEMENT**: Typed Zustand store with full state and actions
- **PATTERN**: `create<AssetStore>()((set, get) => ({...}))` — curried form for TypeScript
- **IMPORTS**: `create` from `zustand`, types from `@/types`, utilities from `@/lib/filename`, constants from `@/lib/constants`
- **STATE**: `images: AssetImage[]`, `groups: ProductGroup[]`
- **ACTIONS**: All actions from the `AssetStore` interface
- **COMPUTED GETTERS**: `getResolvedFilenames()`, `getGroupImages()`, `getUsedDescriptors()`, `isExportReady()`
- **GOTCHA**: `addImages` must generate thumbnails asynchronously using FileReader. Use `crypto.randomUUID()` for IDs. The `addImages` action should enforce `MAX_FREE_IMAGES` limit.
- **GOTCHA**: For thumbnail generation, create a helper function that returns a Promise<string> (base64 data URL). Use canvas to resize thumbnails to max 200px dimension for performance.
- **VALIDATE**: `npx tsc --noEmit` — zero type errors

---

### Task 7: CREATE `src/components/ui/Button.tsx` — Reusable Button

- **IMPLEMENT**: Button component with primary, secondary, and ghost variants
- **PATTERN**: Follow design system button tiers exactly
- **IMPORTS**: `ButtonVariant` type, `motion` from framer-motion (for hover scale)
- **PROPS**: `variant: 'primary' | 'secondary' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `children`, `className`, `disabled`, plus native button props
- **GOTCHA**: Primary button needs the reverse gradient overlay on hover (absolutely positioned div). Use `group` class for hover coordination.
- **VALIDATE**: Renders correctly with all 3 variants in browser

---

### Task 8: CREATE `src/components/layout/Header.tsx` — Navigation Header

- **IMPLEMENT**: Fixed header with logo, navigation, and CTA
- **PATTERN**: Design system navigation header pattern — `fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10`
- **IMPORTS**: `Button` from `@/components/ui/Button`, `Link` from `next/link`
- **CONTENT**:
  - Logo: "AssetFlow" text with gradient or brand styling
  - Nav links (desktop): Home, Features, Pricing (scroll to sections on landing), App (link to `/app`)
  - CTA: "Try It Free" button (links to `/app`)
  - Mobile: Hamburger menu with slide-out navigation
- **GOTCHA**: Use `'use client'` — needed for mobile menu state. Landing page links should use `scrollIntoView` pattern (not Next.js Link for same-page nav). `/app` link should use Next.js Link.
- **VALIDATE**: Header renders, fixed position, responsive (hamburger on mobile)

---

### Task 9: CREATE `src/components/layout/Footer.tsx` — Footer

- **IMPLEMENT**: Footer with brand, quick links, and copyright
- **PATTERN**: Design system footer pattern — `bg-[#0a0a0a] border-t border-white/10`
- **CONTENT**:
  - Brand: "AssetFlow" with tagline "Product Image Renaming Tool"
  - Quick links: Home, Features, Pricing, App
  - Built by: "Build With Treez" with link
  - Copyright: `© {year} AssetFlow. All rights reserved.`
- **GOTCHA**: Quick links on landing page use scroll behavior; `/app` link uses Next.js Link
- **VALIDATE**: Footer renders correctly, responsive layout

---

### Task 10: UPDATE `src/app/layout.tsx` — Root Layout

- **IMPLEMENT**: Configure root layout with fonts, metadata, dark theme, Header, and Footer
- **IMPORTS**: `Inter` and `Space_Grotesk` (or `Geist_Sans`) from `next/font/google`, Header, Footer, globals.css
- **CONTENT**:
  - Font loading with `display: 'swap'`
  - Metadata: title, description, OpenGraph basics
  - Dark theme: `className="bg-deep-space text-white"` on `<html>` or `<body>`
  - Structure: `<Header />`, `<main>{children}</main>`, `<Footer />`
- **GOTCHA**: `globals.css` must be imported here. Font className applied to `<html>` element.
- **VALIDATE**: `npm run dev` — layout renders with Header, main, Footer. Font loads correctly.

---

### Task 11: CREATE `src/app/page.tsx` — Landing Page Placeholder

- **IMPLEMENT**: Simple placeholder indicating Plan 2 content goes here
- **CONTENT**: Centered text: "AssetFlow — Landing Page (Plan 2)" with a CTA button linking to `/app`
- **VALIDATE**: Route `/` renders placeholder

---

### Task 12: CREATE `src/app/app/page.tsx` — Application Placeholder

- **IMPLEMENT**: Simple placeholder indicating Plan 3 content goes here
- **CONTENT**: Centered text: "AssetFlow — Application (Plan 3)" with a link back to `/`
- **GOTCHA**: This is `src/app/app/page.tsx` (nested route). Add `'use client'` since the app will be fully client-side.
- **VALIDATE**: Route `/app` renders placeholder

---

### Task 13: VALIDATE Full Build

- **IMPLEMENT**: Run full build to verify zero errors
- **VALIDATE**: `npm run build` — zero errors, zero warnings
- **VALIDATE**: `npm run dev` — both routes work, navigation functional, design system renders

---

## TESTING STRATEGY

### Unit Tests

Not required for Plan 1. Testing infrastructure will be established if needed in Plan 4.

**However**, the filename utilities (`src/lib/filename.ts`) should be manually verified with these test cases:

| Input | Function | Expected Output |
|-------|----------|-----------------|
| `"AB 100"` | `sanitizeString` | `"ab-100"` |
| `"  abc@#$  "` | `sanitizeString` | `"abc"` |
| `"abc--def"` | `sanitizeString` | `"abc-def"` |
| `"-abc-"` | `sanitizeString` | `"abc"` |
| `""` | `sanitizeString` | `""` |
| `"IMG_2045.JPG"` | `getFileExtension` | `".jpg"` |
| `"photo.test.png"` | `getFileExtension` | `".png"` |
| `"noextension"` | `getFileExtension` | `""` |
| `"63755", "front", "IMG.JPG"` | `generateFilename` | `"63755-front.jpg"` |
| `"AB 100", "Zoom 1", "photo.PNG"` | `generateFilename` | `"ab-100-zoom-1.png"` |

### Integration Tests

Not applicable for Plan 1.

### Edge Cases

- Empty strings in sanitization
- Files without extensions
- Files with multiple dots
- Extremely long SKU strings
- Special characters in all fields
- Zustand store initial state correctness

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

1. `npm run dev` → Visit `http://localhost:3000`
   - [ ] Header renders with logo, nav links, CTA button
   - [ ] Footer renders with brand, links, copyright
   - [ ] Dark theme applied (dark background, light text)
   - [ ] Design system colors visible (purple CTA, cyan accents)
   
2. Visit `http://localhost:3000/app`
   - [ ] App placeholder renders
   - [ ] Header/Footer present
   - [ ] Navigation between `/` and `/app` works

3. Responsive check (browser dev tools):
   - [ ] Mobile (375px): Header shows hamburger, content stacks
   - [ ] Tablet (768px): Layout adjusts appropriately
   - [ ] Desktop (1280px): Full navigation visible

---

## ACCEPTANCE CRITERIA

- [ ] `npm run build` passes with zero errors
- [ ] `npx tsc --noEmit` passes with zero type errors
- [ ] Root layout renders Header + main + Footer
- [ ] `/` route shows landing placeholder
- [ ] `/app` route shows application placeholder
- [ ] Navigation between routes works
- [ ] Design system colors render correctly (purple, cyan, pink)
- [ ] Glass morphism effects visible on relevant elements
- [ ] Header is fixed, blurred, responsive
- [ ] Footer is styled per design system
- [ ] Button component renders all 3 variants
- [ ] TypeScript types compile without errors
- [ ] Filename utilities produce correct output for all test cases
- [ ] Zustand store initializes with correct default state
- [ ] Mobile responsive (hamburger menu, stacked layout)

---

## COMPLETION CHECKLIST

- [ ] All 13 tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] `npm run build` passes
- [ ] Manual testing confirms routes, layout, and design
- [ ] Code follows Build With Treez design system
- [ ] No linting or type checking errors
- [ ] Ready for Plan 2 (Landing Page) execution

---

## NOTES

- **Font Choice**: Inter (body) + Space Grotesk (headings) provide a modern SaaS feel. If the design system specifies different fonts, use those instead.
- **Tailwind v4**: Uses CSS-first `@theme` — do NOT create `tailwind.config.js` unless a plugin requires it.
- **Zustand v5**: Uses curried `create<Type>()(...)` syntax for TypeScript.
- **Dark Theme**: This is a dark-first application. No light mode toggle for MVP.
- **Framer Motion**: Installed in this phase but used minimally (Button hover). Heavy animation usage is in Plan 2.
- **JSZip**: Installed in this phase but used in Plan 3. Include it in dependencies now to avoid mid-plan dependency changes.
- **Thumbnail Generation**: The `addImages` action in the Zustand store generates thumbnails via Canvas. This is async and client-side only.

**Confidence Score: 9/10** — Greenfield project with clear requirements and well-documented design system. Only risk is Tailwind v4 `@theme` syntax nuances.
