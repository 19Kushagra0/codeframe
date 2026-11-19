# CodeFrame MVP — Project Workplan (`WORKPLAN.md`)

> **What we are building:** A Chrome Extension that lets you pause any YouTube coding tutorial, grab a screenshot + timestamp + note, and save/search those code snippets in a clean Study Dashboard website.
>
> **How Phase 1 works:** We build the Chrome Extension first and connect it to a local Next.js backend that saves snippets into a simple JSON file (`.data/snippets.json`) with a placeholder AI extractor. That way, the whole app works end-to-end without needing a database or API keys yet.

---

## 📊 Quick Progress Tracker

- [x] **Task 1:** Clean up starter repo & create shared data types (`packages/shared`)
- [ ] **Task 2:** Create the base Chrome Extension (`apps/extension`)
- [ ] **Task 3:** Show a floating CodeFrame sidebar on YouTube videos
- [ ] **Task 4:** Capture video screenshots, skip ads & jump to saved timestamps
- [ ] **Task 5:** Set up the Next.js backend API, local file saving & placeholder AI (`apps/web`)
- [ ] **Task 6:** Connect the YouTube sidebar to the Next.js backend
- [ ] **Task 7:** Build the searchable Study Dashboard webpage (`apps/web`)

---

## 🧭 Big Picture Map

```text
codeframe/
├── apps/
│   ├── web/        ──► Next.js app (Study Dashboard website + Backend API)
│   └── extension/  ──► Chrome Extension (runs inside YouTube video pages)
└── packages/
    ├── shared/     ──► Shared TypeScript data shapes (so Extension & Web match)
    ├── ui/         ──► Starter shared React components
    ├── typescript-config/ & eslint-config/  ──► Shared code rules
```

---

## 🚦 Rules for Building (Read First)

1. **One task at a time:** Only work on the current task—never jump ahead to the next task.
2. **Real, complete code only:** No placeholders or half-finished TypeScript files.
3. **Always verify & stop:** At the end of each task, run the check, show the results, tick the completed boxes in this file, and **wait for your approval** (`"Next task"` or `"Approved"`) before moving on.
4. **Never wipe existing files:** Append or update cleanly (like `.gitignore` and `package.json`).

---

## ✅ Task 1: Clean Up Starter Repo & Create Shared Types (`packages/shared`)

**In plain words:** Remove the unused `docs` demo app, tell Git to ignore build/data folders, and create a shared folder (`@codeframe/shared`) that defines the exact shape of a captured snippet so the extension and website speak the same language.

### Checklist
- [x] Delete the unused `apps/docs` starter folder (keep `apps/web` and `packages/*`)
- [x] Append `.wxt`, `.output`, and `.data` to `.gitignore` without erasing existing entries
- [x] Create `packages/shared/package.json` (`@codeframe/shared`, with `"check-types": "tsc --noEmit"`)
- [x] Create `packages/shared/tsconfig.json` (extending `@repo/typescript-config/base.json`)
- [x] Create `packages/shared/src/index.ts` with our 4 shared TypeScript types:
  - `ExtractCodeRequest` (`videoId`, `videoUrl`, `videoTitle`, `timestamp`, `frameBase64`, optional `userNote` & `manualCodeOverride`)
  - `SnippetDTO` (`id`, `videoId`, `videoUrl`, `videoTitle`, `timestamp`, optional `frameBase64`, `extractedCode`, `language`, `explanation`, `userNote`, `createdAt`)
  - `ExtractCodeResponse` (`success`, optional `snippet` & `error`)
  - `GetSnippetsResponse` (`success`, `snippets`, optional `error`)
- [x] Run `pnpm install` at the root to link `@codeframe/shared`

### Verification
- [x] Run `pnpm --filter @codeframe/shared check-types` and `pnpm check-types` $\rightarrow$ both passed with `0` errors.

---

## ⬜ Task 2: Create the Base Chrome Extension (`apps/extension`)

**In plain words:** Set up the Chrome Extension skeleton using the **WXT** framework (Manifest V3) with React, TypeScript, Tailwind CSS, a background script, and a simple popup menu.

### Checklist
- [ ] Create `apps/extension/package.json` (`name: "extension"`, React 19, `lucide-react`, `@codeframe/shared`, `wxt`, `@wxt-dev/module-react`, Tailwind v3, `"check-types": "tsc --noEmit"`, `"postinstall": "wxt prepare"`)
- [ ] Create `apps/extension/tsconfig.json`, `tailwind.config.js`, and `postcss.config.js`
- [ ] Create `apps/extension/wxt.config.ts`:
  - Permissions: `["activeTab", "storage"]`
  - Host permissions: `["*://*.youtube.com/*", "http://localhost:3000/*"]`
- [ ] Create `apps/extension/entrypoints/background.ts` (basic `defineBackground` setup)
- [ ] Create `apps/extension/entrypoints/popup/index.html` & `main.tsx` (status + quick button to open `http://localhost:3000/dashboard`)
- [ ] Run `pnpm install`

### Verification
- [ ] Run `pnpm --filter extension build` and confirm `apps/extension/.output/chrome-mv3/manifest.json` builds with zero errors.
- [ ] **STOP and wait for your approval before Task 3.**

---

## ⬜ Task 3: Add the Floating CodeFrame Sidebar to YouTube (`apps/extension`)

**In plain words:** Show a floating **CodeFrame ⚡** button on YouTube video pages that opens a dark-mode sidebar. Using a **Shadow DOM** keeps YouTube's styles from breaking our buttons and layout.

### Checklist
- [ ] Create `apps/extension/entrypoints/youtube.content/style.css` with Tailwind directives
- [ ] Create `apps/extension/entrypoints/youtube.content/index.tsx` matching `*://*.youtube.com/*` using `createShadowRootUi` (`cssInjectionMode: 'ui'`)
- [ ] Create `apps/extension/entrypoints/youtube.content/Sidebar.tsx`:
  - Show only when on a `/watch` page with a valid `v` video ID
  - Cleanly build the canonical URL (`https://www.youtube.com/watch?v=${videoId}`)
  - Read the video title from YouTube's page header (with tab-title fallback)
  - Auto-update when clicking to another video (`yt-navigate-finish` & `popstate`)
  - Render a collapsible right-side drawer (`w-[380px]`) with video title, ID badge, and a **"Capture Current Frame"** button

### Verification
- [ ] Build with `pnpm --filter extension build`
- [ ] Load `apps/extension/.output/chrome-mv3` in Chrome (`chrome://extensions` $\rightarrow$ Developer mode $\rightarrow$ Load unpacked)
- [ ] Open a YouTube video, toggle **CodeFrame ⚡**, click another video, and confirm the title & ID update.
- [ ] **STOP and wait for your approval before Task 4.**

---

## ⬜ Task 4: Capture Video Screenshots, Skip Ads & Jump to Timestamps (`apps/extension`)

**In plain words:** Make the **"Capture Current Frame"** button pause the YouTube video, grab a lightweight screenshot + exact timestamp, block captures during ads, and let you click any saved `[MM:SS]` badge to jump the video right back to that second.

### Checklist
- [ ] Create `apps/extension/src/utils/captureFrame.ts`:
  - `captureYouTubeFrame()`:
    - Block with a friendly message if a YouTube ad is playing (`.ad-showing`)
    - Find the `<video>`, pause it, resize down to max width `1280px` (to keep payload ~80–150 KB), draw to an offscreen `<canvas>` inside `try/catch`, and export WebP (`image/webp`, quality `0.85`)
    - Return `{ ok: true, frameBase64, timestamp }` or `{ ok: false, error }`
  - `formatTimestamp(seconds)` (e.g., `125` $\rightarrow$ `"02:05"`)
  - `seekYouTubeVideo(seconds)` (jumps video to `seconds` and plays)
- [ ] Update `Sidebar.tsx`:
  - Show the captured thumbnail preview, clickable `[MM:SS]` badge, `"Quick Note"` input, optional `"Paste/Edit Code"` box, and **"Save Snippet"** button (saved temporarily in `chrome.storage.local` until Task 6)

### Verification
- [ ] Rebuild & reload the extension in Chrome
- [ ] Capture a frame on any YouTube video $\rightarrow$ confirm it pauses and shows the thumbnail + `[MM:SS]` badge
- [ ] Save a test snippet, scrub the video somewhere else, and click `[MM:SS]` to confirm it jumps right back.
- [ ] **STOP and wait for your approval before Task 5.**

---

## ⬜ Task 5: Wire Up Next.js Backend, Local File Storage & Placeholder AI (`apps/web`)

**In plain words:** Prepare our existing `apps/web` Next.js app so the extension can send captures to it. Instead of locking into one database or AI provider right now, we create swappable **adapters** that save to a local JSON file (`.data/snippets.json`) and use a placeholder extractor until you pick your DB and AI later.

### Checklist
- [ ] Install `@codeframe/shared` and Tailwind CSS (`tailwindcss`, `@tailwindcss/postcss`, `postcss`) in `apps/web`
- [ ] Configure `apps/web/postcss.config.mjs` and update `apps/web/app/globals.css` with Tailwind
- [ ] Update `apps/web/next.config.js` (`transpilePackages: ["@codeframe/shared"]` + CORS headers for `/api/:path*`) and `apps/web/tsconfig.json` (`@/*` path alias if needed)
- [ ] Create `apps/web/lib/storage-adapter.ts` (`StorageAdapter` interface + `LocalJsonStorageAdapter` saving to `apps/web/.data/snippets.json`)
- [ ] Create `apps/web/lib/ai-adapter.ts` (`AIExtractorAdapter` interface + `PlaceholderAIAdapter` supporting `manualCodeOverride` or returning a clean placeholder block)
- [ ] Create API routes inside `apps/web/app/api/`:
  - `health/route.ts` (`GET` + `OPTIONS`)
  - `extract/route.ts` (`POST` + `OPTIONS` $\rightarrow$ runs AI adapter $\rightarrow$ saves via Storage adapter)
  - `snippets/route.ts` (`GET` with `force-dynamic` + `OPTIONS` $\rightarrow$ returns saved snippets, filterable by `?videoId=`)

### Verification
- [ ] Start `pnpm --filter web dev`
- [ ] Confirm `http://localhost:3000/api/health` and `http://localhost:3000/api/snippets` both return HTTP `200 OK` with CORS headers.
- [ ] **STOP and wait for your approval before Task 6.**

---

## ⬜ Task 6: Connect the YouTube Sidebar to the Next.js Backend (`apps/extension`)

**In plain words:** Replace the extension's temporary local storage with real API calls to `http://localhost:3000/api/*`. Routing requests through `background.ts` prevents Chrome from blocking `https://youtube.com` talking to `http://localhost:3000`.

### Checklist
- [ ] Update `apps/extension/entrypoints/background.ts` to handle `EXTRACT_CODE` (`POST /api/extract`) and `GET_SNIPPETS` (`GET /api/snippets?videoId=...`)
- [ ] Update `apps/extension/entrypoints/youtube.content/Sidebar.tsx`:
  - Remove Task 4's temporary `chrome.storage.local` storage so snippets live in one place
  - Load saved snippets automatically when opening or switching YouTube videos
  - Send captures through **"Save & Extract Snippet"** and prepend the saved snippet to the list
  - Show clickable `[MM:SS]` seek buttons, **"Copy Code"** (`"Copied! ✓"`), and an **"Open Full Study Dashboard ↗"** link

### Verification
- [ ] Run `pnpm --filter web dev`, rebuild & reload the extension
- [ ] Capture a frame with a note on YouTube and click **"Save & Extract Snippet"**
- [ ] Refresh the YouTube page and verify the snippet stays visible and is saved in `apps/web/.data/snippets.json`.
- [ ] **STOP and wait for your approval before Task 7.**

---

## ⬜ Task 7: Build the Searchable Study Dashboard (`apps/web`)

**In plain words:** Build the `/dashboard` webpage where all your saved YouTube screenshots, notes, and code blocks are grouped by video, searchable in real time, and linked straight back to the exact second in each video.

### Checklist
- [ ] Create `apps/web/components/SnippetCard.tsx` (shows screenshot thumbnail, language badge, clickable `[MM:SS]` YouTube timestamp link, user note, explanation, dark code block, and **"Copy Snippet"** button)
- [ ] Create `apps/web/components/DashboardClient.tsx` (live search bar filtering by title, note, code, or language + snippets grouped by video in timestamp order)
- [ ] Create `apps/web/app/dashboard/page.tsx` (`force-dynamic` server page loading snippets from `storageAdapter.getSnippets()` into `<DashboardClient initialSnippets={snippets} />`)
- [ ] Update `apps/web/app/page.tsx` to redirect or link cleanly to `/dashboard`

### Verification
- [ ] Open `http://localhost:3000/dashboard` in Chrome
- [ ] Confirm captured snippets appear grouped by video with thumbnails, notes, code blocks, and live search working
- [ ] Click a `[MM:SS]` link and confirm YouTube opens at that exact second (`&t=Xs`).
- [ ] **Phase 1 Prototype Complete — ready for Phase 2 (choosing Database & AI provider).**
