# Plan 08a: Workspace UI Bridge
**Status:** 📋 PLANNED — implement BEFORE Phase 8 Sprint 1  
**Prerequisite to:** `08-advanced-pro-features.md`  
**Goal:** Replace the `/app` page's marketing header+footer with a professional sidebar workspace UI that is pixel-identical to the dashboard, and bridge Projects/Templates from the dashboard into the live workspace.

---

## Problem Statement

The `/app` page currently lives inside the global marketing layout: `ConditionalLayout → <Header> → content → <Footer>`. It is visually disconnected from the dashboard and forces professionals to context-switch between `/dashboard` (management) and `/app` (work). This becomes worse with every Phase 8 feature we add.

**Reference tools with this pattern:**
- **Lightroom** — Left sidebar (library), center (grid/canvas), right (editing panel)
- **Capture One** — Persistent sidebar with sessions/albums, workspace is full-height
- **Figma** — Sidebar with files/pages, canvas is the entire viewport
- **Adobe Bridge** — Folder tree sidebar, center asset grid, metadata panel

The common pattern: **sidebar owns navigation/context, the full viewport height is the workspace.**

---

## Architecture Changes

### Current `/app` flow
```
RootLayout
  └─ ConditionalLayout
       ├─ <Header />          ← marketing header, consumes vertical space
       ├─ <main id="main-content">
       │    └─ AppPage (pt-20 to clear header)
       └─ <Footer />
```

### Target `/app` flow
```
RootLayout
  └─ ConditionalLayout         ← excludes /app from header/footer
       └─ <main id="main-content">
            └─ /app/layout.tsx  (new — parallel to /dashboard/layout.tsx)
                 └─ WorkspaceLayout
                      ├─ WorkspaceSidebar (fixed, collapsible — matches DashboardLayout exactly)
                      └─ <main workspace content>
                           └─ AppPage (no pt-20 offset, full height)
```

---

## Design Spec: WorkspaceSidebar

### Visual Identity Rules (non-negotiable)
Every pixel must match `DashboardLayout.tsx`:
- Same widths: `SIDEBAR_EXPANDED = 256px`, `SIDEBAR_COLLAPSED = 64px`
- Same animation: `duration: 0.3, ease: [0.4, 0, 0.2, 1]`
- Same background: `bg-white/3 backdrop-blur-xl border-r border-white/10`
- Same logo block: `logo-icon.webp` + animated `logo-name.webp` (AnimatePresence, same timing)
- Same nav item style: `py-3 rounded-xl gap-3 px-3`, active state gradient
- Same collapse toggle: `ChevronsLeft`, same rotation animation
- Same tooltip: shown on icon hover when collapsed
- Same localStorage key: `sidebar-collapsed` (synced between both — collapsing in one collapses the other)
- Same mobile pattern: hamburger → full-screen drawer

### WorkspaceSidebar Content

```
┌─────────────────────────────┐  ← 256px expanded / 64px collapsed
│  [logo-icon] [logo-name]   │  ← identical to DashboardLayout
│                             │
│  ── Session ──              │
│  📄  Untitled Session  [✏️] │  ← project name (editable inline)
│  [💾 Save Project] (Pro)    │  ← disabled/upgrade for free users
│  [+ New Session]            │
│                             │
│  ── Templates ──            │
│  📋  template-name-1        │  ← click to quick-apply
│  📋  template-name-2        │
│  [Browse All →]             │  ← links to /dashboard/templates
│     (empty state if none)   │
│                             │
│  ── Stats ──                │
│  Images:    12 / 20  ████░  │  ← progress bar, real-time from store
│  Products:  3               │
│  Configured: 8 / 12         │
│                             │
├─────────────────────────────│
│  [⚡ Upgrade to Pro]        │  ← only if free + authenticated
│  [🏠 Dashboard]             │  ← /dashboard (if authenticated)
│  [🔑 Sign In]               │  ← /login (if unauthenticated)
│  [◀ Collapse]               │  ← same as DashboardLayout
└─────────────────────────────┘
```

**Collapsed state:** Section labels and text hidden, icons remain, tooltips on hover.

**Unauthenticated users:** Full workspace usable. Sidebar shows:
- Session section (no save button — shows upgrade inline)
- No Templates section
- Stats (from local store)
- "Sign In to save your work" CTA at bottom

---

## Store Changes (useAssetStore)

Add to `AssetStore` interface and implementation:

```ts
// New state
currentProject: { id: string; name: string } | null

// New actions
setCurrentProject: (project: { id: string; name: string } | null) => void
loadProject: (project: { id: string; name: string; images: Json; groups: Json }) => void
renameCurrentSession: (name: string) => void
```

`loadProject` populates the store from a saved project's data. Note: images in a project are stored as metadata (not the actual `File` objects, which can't be serialized). Loading a project should restore SKU/descriptor assignments and display a "project loaded" toast.

> **Important constraint:** Browser `File` objects cannot be stored in Supabase. Projects save metadata (filename, SKU, descriptor, alt text) not binary file data. When loading a project, users re-upload the files and the project auto-maps them by filename.

---

## File Changes

### New Files
| File | Purpose |
|---|---|
| `src/app/app/layout.tsx` | Route layout for `/app/*` — reads auth (optional), renders WorkspaceLayout |
| `src/components/app/WorkspaceLayout.tsx` | Wraps content with WorkspaceSidebar (desktop) + mobile header |
| `src/components/app/WorkspaceSidebar.tsx` | The sidebar component |

### Modified Files
| File | Change |
|---|---|
| `src/components/layout/ConditionalLayout.tsx` | Also exclude `/app` from global Header/Footer |
| `src/app/app/page.tsx` | Remove `pt-20` (no longer needed without top header), add `?project` param loading |
| `src/stores/useAssetStore.ts` | Add `currentProject`, `loadProject`, `setCurrentProject` |
| `src/types/index.ts` | Add new store fields to `AssetStore` interface |
| `src/components/dashboard/ProjectsLibrary.tsx` | Add "Open in Workspace" button to each project card |

---

## Implementation Plan

### Phase A: Layout Shell (session 1, part 1)
**Goal:** Get the workspace sidebar visible and pixel-matched. No functional features yet.

- [ ] `ConditionalLayout.tsx` — add `/app` to the exclusion list (alongside `/dashboard`)
- [ ] `src/app/app/layout.tsx` — new file, reads optional auth, passes to WorkspaceLayout
- [ ] `WorkspaceLayout.tsx` — full layout component with sidebar + content area
- [ ] `WorkspaceSidebar.tsx` — sidebar with static placeholder content (real data in Phase B/C)
- [ ] `src/app/app/page.tsx` — remove `pt-20` and `pb-6` offset, adjust padding for sidebar layout
- [ ] Verify: Sidebar collapses/expands identically to dashboard, `sidebar-collapsed` localStorage shared, logo identical

---

### Phase B: Project Bridge (session 1, part 2)
**Goal:** Dashboard Projects can open into the workspace. Workspace can save current session.

- [ ] `useAssetStore.ts` — add `currentProject`, `setCurrentProject`, `loadProject`
- [ ] `types/index.ts` — update `AssetStore` interface
- [ ] `src/app/app/page.tsx` — read `?project=id` query param → fetch project → call `loadProject`
- [ ] `ProjectsLibrary.tsx` — add "Open in Workspace" button → `router.push('/app?project={id}')`
- [ ] `WorkspaceSidebar.tsx` — show project name from store, editable inline
- [ ] `WorkspaceSidebar.tsx` — "Save Project" button calls `useCreateProject`/`useUpdateProject` (Pro only, UpgradeModal for free)

---

### Phase C: Templates & Live Stats (session 1, part 3)
**Goal:** Templates accessible without leaving workspace. Session stats live in sidebar.

- [ ] `WorkspaceSidebar.tsx` — fetch user's templates (if authenticated), list top 5
- [ ] Template click → apply template: sets `descriptors` pattern on all unassigned images in current session
- [ ] "Browse All" → links to `/dashboard/templates`
- [ ] `WorkspaceSidebar.tsx` — live stats from `useAssetStore`: image count, products, configured count
- [ ] Stats progress bar (animated, matches brand colors)
- [ ] Mobile: session info and stats accessible from the drawer

---

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Shared localStorage key for collapse | Yes (`sidebar-collapsed`) | State is consistent — collapsing dashboard collapses workspace too, feels like one product |
| Auth required for `/app`? | No — fully accessible to guests | Free tier must work with no account |
| `File` objects in saved projects | Not stored — metadata only | Browser `File` objects can't be serialized/stored |
| Project loading UX | Toast notification + auto-map by filename | Clear feedback; user still uploads files |
| "Save" for free users | Show `UpgradeModal` | Consistent with existing gate pattern |
| Mobile sidebar | Drawer (hamburger) | Same as dashboard mobile — no new patterns |
| Footer in `/app` | Remove entirely | Professional tools don't have marketing footers in the workspace |

---

## Success Criteria

| Criteria | Pass Condition |
|---|---|
| Visual parity | Sidebar is indistinguishable in design from dashboard sidebar |
| Collapse sync | Collapsing in app also affects dashboard (shared localStorage) |
| Logo rendering | Identical logo pattern, no flash, same animation timing |
| Mobile | Hamburger → drawer works, no layout breaks |
| Free user | Full workspace functional without account |
| Auth user | Project name shown, save button works (Pro) or shows upgrade modal (free) |
| Project bridge | Clicking "Open in Workspace" on dashboard project correctly loads data |
| No regressions | Existing `/app` page functionality unchanged |
| No marketing chrome | No `<Header>` or `<Footer>` visible on `/app` |

---

## Out of Scope for This Plan

- ❌ Right-side editing panel (Phase 8 AI features will decide this)
- ❌ Project versioning / undo history
- ❌ Collaborative cursors
- ❌ Drag-and-drop project loading
- ❌ Custom sidebar themes
