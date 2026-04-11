# Feature: Core Application — Upload, Group, Name, Export

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files etc.

## Feature Description

Build the complete AssetFlow application tool — the core product that enables users to upload product images, organize them into product groups, assign SKUs and descriptors, see live filename previews, and export renamed files as a ZIP. This is a fully client-side application with no server uploads or authentication.

## User Story

As an e-commerce seller,  
I want to drag my product images into a tool, assign SKUs and angles, and download a ZIP of perfectly named files,  
So that I can prepare store-ready images in seconds instead of hours.

## Problem Statement

Users have dozens of messy product images (`IMG_2045.jpg`, `DSC_0892.png`) that need to be renamed to a clean, consistent format (`63755-front.jpg`) before uploading to their store. Manual renaming is tedious, error-prone, and wastes valuable time.

## Solution Statement

A single-page application at `/app` that provides: (1) drag-and-drop upload zone with thumbnail previews, (2) product group management with SKU input, (3) descriptor assignment with duplicate prevention, (4) real-time filename preview, and (5) one-click ZIP export. All processing is client-side via File API, Canvas, and JSZip.

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: High  
**Primary Systems Affected**: App page, all `/components/app/` components, Zustand store, export utilities  
**Dependencies**: JSZip (ZIP generation), Zustand (state), Plan 1 (types, utilities, store, design system)

**Prerequisite**: Plan 1 (Project Foundation) must be complete. Plan 2 (Landing Page) is NOT required.

---

## CONTEXT REFERENCES

### Relevant Codebase Files — MUST READ BEFORE IMPLEMENTING!

These files exist after Plan 1:

- `src/types/index.ts` — `AssetImage`, `ProductGroup`, `ResolvedFilename`, `DescriptorOption`, `AssetStore`
- `src/stores/useAssetStore.ts` — Full Zustand store with actions and computed getters
- `src/lib/filename.ts` — `sanitizeString()`, `generateFilename()`, `getFileExtension()`, `isFilenameComplete()`
- `src/lib/constants.ts` — `MAX_FREE_IMAGES`, `DEFAULT_DESCRIPTORS`, `ACCEPTED_FILE_TYPES`, `APP_NAME`
- `src/components/ui/Button.tsx` — Reusable button (primary, secondary, ghost)
- `src/app/globals.css` — Design tokens (@theme)
- `docs/context.md` (lines 49-97) — Core workflow, naming rules, descriptor system
- `docs/PRD.md` (Sections 7.1-7.6) — Feature specifications
- `docs/BUILD_WITH_TREEZ_DESIGN_SYSTEM.md` — Glass morphism, forms, cards, responsive patterns

### New Files to Create

```
src/
├── components/app/
│   ├── UploadZone.tsx          # Drag-and-drop upload area
│   ├── ImageCard.tsx           # Single image thumbnail with descriptor
│   ├── ProductGroup.tsx        # Group container with SKU input + images
│   ├── GroupManager.tsx        # Product group creation and management
│   ├── DescriptorSelect.tsx    # Dropdown for descriptor assignment
│   ├── FilenamePreview.tsx     # Live filename display
│   ├── ExportControls.tsx      # Export button + validation + progress
│   └── AppToolbar.tsx          # Top toolbar with image count + reset
├── lib/
│   └── export.ts               # ZIP generation logic using JSZip
└── hooks/
    └── useDropzone.ts          # Custom hook for drag-and-drop logic
```

### Files to Update

- `src/app/app/page.tsx` — Replace placeholder with full application UI

### Relevant Documentation

- [File API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/File_API) — Reading files client-side
- [DataTransfer API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) — Drag-and-drop file handling
- [Canvas API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) — Thumbnail generation
- [JSZip Documentation](https://stuk.github.io/jszip/) — Client-side ZIP creation
- [Blob URL (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static) — Download trigger

### Patterns to Follow

**Form Input (from design system):**
```tsx
<input className="w-full px-4 py-3 
  bg-white/5 backdrop-blur-sm 
  border border-white/10 
  rounded-lg text-white 
  placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[#915eff] 
  transition-all duration-300"
/>
```

**Card (from design system):**
```tsx
<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
```

**Zustand Usage:**
```tsx
const { images, addImages, removeImage } = useAssetStore()
// OR for selectors:
const images = useAssetStore((state) => state.images)
```

---

## IMPLEMENTATION PLAN

### Phase 1: Upload System

Build the drag-and-drop upload zone with thumbnail generation.

**Tasks:**
- Custom `useDropzone` hook for drag-and-drop logic
- `UploadZone` component with visual states
- Thumbnail generation via Canvas
- Integration with Zustand store's `addImages` action

### Phase 2: Image Display

Show uploaded images with their metadata.

**Tasks:**
- `ImageCard` component showing thumbnail, original name, descriptor dropdown, filename preview
- Image removal functionality
- Empty state when no images

### Phase 3: Product Grouping

Enable organizing images into product sets.

**Tasks:**
- `GroupManager` for creating/deleting groups
- `ProductGroup` container with SKU input and assigned images
- Mechanism to assign images to groups (dropdown or drag)

### Phase 4: Descriptor Assignment

Let users assign naming descriptors to each image.

**Tasks:**
- `DescriptorSelect` dropdown with default + custom options
- Duplicate prevention within groups
- Custom descriptor text input
- Integration with store

### Phase 5: Live Preview & Validation

Real-time filename preview and export readiness.

**Tasks:**
- `FilenamePreview` component showing computed filename
- Visual indicators for incomplete images (missing SKU or descriptor)
- `AppToolbar` with image count and reset button

### Phase 6: Export System

ZIP generation and download.

**Tasks:**
- `export.ts` utility using JSZip
- `ExportControls` component with validation, progress, and download
- Error handling for incomplete images

### Phase 7: Page Assembly

Wire everything together in the app page.

**Tasks:**
- Compose all components in `app/page.tsx`
- Layout: toolbar top, upload zone, groups with images, export controls bottom
- Responsive layout

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom.

---

### Task 1: CREATE `src/hooks/useDropzone.ts`

- **IMPLEMENT**: Custom hook encapsulating drag-and-drop file handling
- **RETURNS**: `{ isDragOver, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileSelect, inputRef }`
- **LOGIC**:
  - `handleDragEnter/Leave`: Toggle `isDragOver` state for visual feedback
  - `handleDragOver`: `e.preventDefault()` to allow drop
  - `handleDrop`: Extract files from `e.dataTransfer.files`, filter by accepted types, call `onFiles` callback
  - `handleFileSelect`: For click-to-browse via hidden `<input type="file">`
  - File type validation: Only accept types in `ACCEPTED_FILE_TYPES`
- **IMPORTS**: `useState`, `useRef`, `useCallback` from React, `ACCEPTED_FILE_TYPES` from constants
- **GOTCHA**: Safari handles `dataTransfer` differently — always check `e.dataTransfer.files` not `e.dataTransfer.items`. Prevent default on dragover to enable drop.
- **VALIDATE**: Hook compiles without type errors

---

### Task 2: CREATE `src/components/app/UploadZone.tsx`

- **IMPLEMENT**: Drop zone UI component with 4 states
- **STATES**:
  - **Empty**: Large dashed border area with upload icon, "Drag & drop images here" text, "or click to browse" link
  - **Drag Over**: Border color changes to cyan/purple, background highlights
  - **Limit Reached**: Warning message "Free tier limit: 20 images" with upgrade prompt
  - **Has Images**: Compact upload zone at top (smaller) with count indicator "5 / 20 images"
- **STYLING**: 
  - Dashed border: `border-2 border-dashed border-white/20 hover:border-treez-purple/50 rounded-xl`
  - Drag over: `border-treez-cyan bg-treez-cyan/5`
  - Centered content with icon and text
  - Hidden `<input type="file" multiple accept="image/*" />`
- **IMPORTS**: `useDropzone` hook, `useAssetStore`, `Upload` icon from lucide-react, `MAX_FREE_IMAGES` from constants
- **GOTCHA**: The hidden input must accept the same file types. Use `accept="image/jpeg,image/png,image/webp,image/gif"`.
- **VALIDATE**: Drop zone renders, responds to drag events, files are added to store

---

### Task 3: CREATE `src/components/app/DescriptorSelect.tsx`

- **IMPLEMENT**: Dropdown for assigning descriptors to images
- **PROPS**: `imageId: string`, `groupId: string | null`, `currentDescriptor: string | null`, `currentCustom: string | null`
- **LOGIC**:
  - Get used descriptors for the group from store (`getUsedDescriptors`)
  - Map `DEFAULT_DESCRIPTORS` to options, disabling any already used (except current image's)
  - When "custom" is selected, show a text input for custom descriptor
  - On change: call `setImageDescriptor` action
  - On custom text change: call `setCustomDescriptor` action
- **STYLING**: Design system select/input pattern — glass morphism background, purple focus ring
- **IMPORTS**: `useAssetStore`, `DEFAULT_DESCRIPTORS` from constants, types
- **GOTCHA**: The `<select>` element on dark backgrounds needs explicit text color styling. Custom descriptor input should appear inline or below the select.
- **VALIDATE**: Dropdown shows all descriptors, used ones are disabled, custom input appears

---

### Task 4: CREATE `src/components/app/FilenamePreview.tsx`

- **IMPLEMENT**: Shows the computed filename for an image
- **PROPS**: `sku: string`, `descriptor: string | null`, `customDescriptor: string | null`, `originalFilename: string`
- **LOGIC**:
  - Compute filename using `generateFilename()` from `@/lib/filename`
  - Determine if complete using `isFilenameComplete()`
  - Show computed filename if complete, or warning state if incomplete
- **STYLING**:
  - Complete: monospace font, green/cyan text, subtle background
  - Incomplete: yellow/orange text, "Missing SKU" or "Missing descriptor" indicator
  - Small text size (`text-xs` or `text-sm`)
- **IMPORTS**: `generateFilename`, `isFilenameComplete` from `@/lib/filename`
- **VALIDATE**: Shows correct filename, shows warning for incomplete

---

### Task 5: CREATE `src/components/app/ImageCard.tsx`

- **IMPLEMENT**: Individual image card showing thumbnail, controls, and filename preview
- **PROPS**: `image: AssetImage`, `sku: string` (from parent group)
- **CONTENT**:
  - Thumbnail image (from `image.thumbnail` base64 data URL)
  - Original filename (truncated if long)
  - `DescriptorSelect` component
  - `FilenamePreview` component
  - Remove button (X icon, top-right corner)
- **STYLING**: Glass morphism card, compact layout, hover border glow
- **LAYOUT**:
  - Thumbnail on left (fixed width, aspect-ratio maintained)
  - Controls on right (descriptor select, filename preview)
  - Remove button absolutely positioned
- **IMPORTS**: `DescriptorSelect`, `FilenamePreview`, `useAssetStore`, `X` from lucide-react
- **VALIDATE**: Card shows thumbnail, descriptor dropdown, live filename, remove button

---

### Task 6: CREATE `src/components/app/ProductGroup.tsx`

- **IMPLEMENT**: Container for a product group with SKU input and image cards
- **PROPS**: `group: ProductGroup`
- **CONTENT**:
  - Group header with name and delete button
  - SKU input field
  - Grid of `ImageCard` components for images in this group
  - Empty state if no images assigned
  - Collapse/expand toggle (optional)
- **LOGIC**:
  - Get images for this group from store (`getGroupImages`)
  - SKU input calls `setGroupSku` on change (debounced or direct)
  - Delete group calls `deleteGroup` (images return to ungrouped)
- **STYLING**: Large glass morphism card, SKU input follows form pattern, image cards in grid
- **IMPORTS**: `ImageCard`, `useAssetStore`, `Button`, `Trash2` icon, types
- **GOTCHA**: Images not assigned to any group should appear in a special "Ungrouped" section. The `ProductGroup` component handles named groups; ungrouped images need separate handling in the page.
- **VALIDATE**: Group renders with SKU input and image cards

---

### Task 7: CREATE `src/components/app/GroupManager.tsx`

- **IMPLEMENT**: Controls for creating new groups and assigning images
- **CONTENT**:
  - "Create Group" button with text input for group name
  - Group selector for moving images between groups (simple dropdown per image, or batch select)
- **LOGIC**:
  - Create: validate name not empty, call `createGroup`
  - Assign: dropdown on each ungrouped image to select target group, call `assignImageToGroup`
- **STYLING**: Inline form (input + button), glass morphism, purple accent
- **IMPORTS**: `useAssetStore`, `Button`, `Plus` icon from lucide-react
- **GOTCHA**: Keep this simple for MVP. A text input + "Create" button is sufficient. No drag-and-drop between groups needed.
- **VALIDATE**: Can create groups, assign images to groups

---

### Task 8: CREATE `src/lib/export.ts` — ZIP Generation

- **IMPLEMENT**: Client-side ZIP generation using JSZip
- **FUNCTION**: `exportAsZip(images: AssetImage[], getFilename: (image: AssetImage) => string, onProgress?: (percent: number) => void): Promise<void>`
- **LOGIC**:
  1. Create new JSZip instance
  2. For each image: read `image.file` as ArrayBuffer, add to zip with renamed filename
  3. Generate ZIP blob with `zip.generateAsync({ type: 'blob' }, (metadata) => onProgress?.(metadata.percent))`
  4. Create Blob URL and trigger download via temporary `<a>` element
  5. Clean up Blob URL with `URL.revokeObjectURL()`
- **FILENAME**: `assetflow-export.zip` (or use first SKU: `{sku}-export.zip`)
- **IMPORTS**: `JSZip` from jszip
- **GOTCHA**: `generateAsync` is async — must await it. The progress callback receives `{ percent, currentFile }`. Memory: for very large files, consider streaming, but for MVP with 20-image limit this is fine.
- **VALIDATE**: Function compiles without errors

---

### Task 9: CREATE `src/components/app/ExportControls.tsx`

- **IMPLEMENT**: Export button with validation and progress
- **CONTENT**:
  - Export button: "Export ZIP" with Download icon
  - Validation message: "X of Y images ready" or "All images ready!"
  - Progress bar during export (0-100%)
  - Error state: "Complete all filenames before exporting"
  - Success state: "Export complete!" (brief flash)
- **LOGIC**:
  - Check `isExportReady()` from store
  - On click: call `exportAsZip()` with resolved filenames
  - Track progress state during generation
  - Disable button when not ready or during export
- **STYLING**: Primary button (gradient), progress bar with brand gradient, validation text
- **IMPORTS**: `useAssetStore`, `exportAsZip` from `@/lib/export`, `Button`, `Download` icon, `motion` from framer-motion
- **VALIDATE**: Button disabled when incomplete, progress shows during export, ZIP downloads

---

### Task 10: CREATE `src/components/app/AppToolbar.tsx`

- **IMPLEMENT**: Top toolbar showing image count and reset action
- **CONTENT**:
  - Image count badge: "5 / 20 images" with color coding (green when under limit, yellow near limit, red at limit)
  - Group count: "2 groups"
  - Reset button: "Start Over" — clears all state
- **STYLING**: Glass morphism bar, fixed at top of app content area (below header), responsive
- **IMPORTS**: `useAssetStore`, `Button`, `MAX_FREE_IMAGES` from constants, `RefreshCw` icon
- **VALIDATE**: Shows correct counts, reset clears state

---

### Task 11: UPDATE `src/app/app/page.tsx` — Assemble Application

- **IMPLEMENT**: Full application page layout
- **LAYOUT**:
  ```
  ┌─────────────────────────────────┐
  │         AppToolbar              │  (image count, reset)
  ├─────────────────────────────────┤
  │         UploadZone              │  (drag-and-drop)
  ├─────────────────────────────────┤
  │         GroupManager            │  (create group button)
  ├─────────────────────────────────┤
  │    Ungrouped Images             │  (images not in any group)
  │    ┌──────┐ ┌──────┐ ┌──────┐  │
  │    │Card 1│ │Card 2│ │Card 3│  │
  │    └──────┘ └──────┘ └──────┘  │
  ├─────────────────────────────────┤
  │    ProductGroup: "Sneakers"     │
  │    SKU: [63755          ]       │
  │    ┌──────┐ ┌──────┐           │
  │    │Card 1│ │Card 2│           │
  │    └──────┘ └──────┘           │
  ├─────────────────────────────────┤
  │    ProductGroup: "Hoodies"      │
  │    ...                          │
  ├─────────────────────────────────┤
  │        ExportControls           │  (export button + validation)
  └─────────────────────────────────┘
  ```
- **GOTCHA**: Must be `'use client'` — entire app page is client-side. Ungrouped images (where `groupId === null`) should render in a default section with a generic SKU input.
- **STYLING**: Max width container, section spacing, responsive padding
- **VALIDATE**: Full workflow renders, all components connected

---

### Task 12: END-TO-END Workflow Validation

- **VALIDATE**: Complete workflow test:
  1. Navigate to `/app`
  2. Drag 3 images into upload zone → thumbnails appear
  3. Create a product group "Test Product"
  4. Assign images to the group
  5. Enter SKU "12345"
  6. Assign descriptors: front, rear, zoom1
  7. Verify filename previews: `12345-front.jpg`, `12345-rear.jpg`, `12345-zoom1.jpg`
  8. Click "Export ZIP" → ZIP downloads
  9. Verify ZIP contains 3 files with correct names
  10. Click "Start Over" → all state resets
- **VALIDATE**: `npm run build` — zero errors

---

## TESTING STRATEGY

### Unit Tests

Filename utilities are already tested in Plan 1. Key manual tests:

| Action | Expected Result |
|--------|----------------|
| Drop 3 JPGs | 3 image cards appear with thumbnails |
| Drop non-image file | File is rejected, error message shown |
| Drop 21 images | Only 20 accepted, limit warning shown |
| Enter SKU "AB 100" | Filename preview shows "ab-100-{descriptor}" |
| Assign "front" | Descriptor dropdown disables "front" for other images in group |
| Select "custom" | Text input appears for custom descriptor |
| All images complete | Export button enabled, "All ready!" message |
| Click Export | ZIP downloads with correct filenames |
| Click Reset | All images, groups, and state cleared |

### Edge Cases

- Upload 0 images then try to export → button disabled, validation message
- Create group with empty name → validation prevents creation
- Assign all descriptors in a group → all options disabled except custom
- Remove an image with assigned descriptor → descriptor freed for others
- Delete a group with images → images return to ungrouped
- Very long SKU → display truncates but filename is correct
- Image with no extension → handled gracefully
- Same image uploaded twice → both accepted (different IDs)

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

Full E2E workflow as described in Task 12.

---

## ACCEPTANCE CRITERIA

- [ ] `npm run build` passes with zero errors
- [ ] Drag-and-drop upload works with thumbnail previews
- [ ] Click-to-browse fallback works
- [ ] Free tier limit (20 images) enforced with visual feedback
- [ ] Product groups can be created and deleted
- [ ] Images can be assigned to groups
- [ ] SKU input works with real-time sanitization preview
- [ ] Descriptor dropdown works with duplicate prevention
- [ ] Custom descriptors supported
- [ ] Live filename preview updates in real time
- [ ] Incomplete filenames show warning state
- [ ] Export validates all filenames are complete
- [ ] ZIP export generates and downloads correctly
- [ ] ZIP contains correctly renamed files
- [ ] Reset clears all state
- [ ] Responsive layout at mobile, tablet, desktop
- [ ] Design system compliance (glass morphism, colors, buttons, inputs)

---

## COMPLETION CHECKLIST

- [ ] All 12 tasks completed in order
- [ ] Each task validation passed
- [ ] Full E2E workflow tested
- [ ] `npm run build` passes
- [ ] ZIP export verified with correct filenames
- [ ] Responsive at 3 breakpoints
- [ ] Design system compliance
- [ ] Ready for Plan 4 (Polish & Deploy) execution

---

## NOTES

- **Client-Only**: Zero server-side processing. All files stay in the browser's memory. No uploads, no API calls.
- **Performance**: With 20-image limit, Canvas thumbnail generation should be instant. No need for Web Workers in MVP.
- **File Persistence**: Files are lost on page refresh. This is intentional for MVP. Persistence is a Pro feature (SaaS phase).
- **Grouping UX**: Keep it simple — dropdown assignment rather than drag-between-groups. Drag-and-drop grouping can be a post-MVP enhancement.
- **JSZip**: Already installed in Plan 1. Import as `import JSZip from 'jszip'`.
- **Thumbnail Size**: Generate at max 200px on longest dimension. Store as base64 data URL in Zustand state. The original `File` reference is kept for ZIP export.

**Confidence Score: 8/10** — Well-defined requirements and existing utilities. Main risks: drag-and-drop cross-browser quirks, Canvas thumbnail edge cases, and JSZip async handling. All manageable with careful implementation.
