# CodeFrame MVP — Learn-by-Building Workplan (`WORKPLAN.md`)

> **What we are building:** A Chrome Extension that lets you pause any YouTube coding video, capture a screenshot + timestamp + note, and review/search everything in a clean Study Dashboard website.
>
> **How we will build it (UI $\rightarrow$ Functionality $\rightarrow$ API):**
> 1. **UI First:** Build the Popup UI, then the YouTube Sidebar UI so you can *see* it right away.
> 2. **One Feature at a Time:** Grab **just the video image** first, then add timestamps, seeking, and notes.
> 3. **Backend & Background Relay Last:** Build the Next.js API, then connect `Content` $\rightarrow$ `Background` $\rightarrow$ `Next.js` and watch the data travel across all 3 consoles!
> 4. **Logs & Guided Checks at Every Step:** Every task includes clear `console.log(...)` messages and step-by-step instructions telling you where to click and which console to open so you understand *how* it works under the hood.

---

## 📊 Quick Progress Tracker

- [x] **Task 1:** Shared data types (`packages/shared`) & `.gitignore`
- [ ] **Task 2:** Extension setup + **Popup UI** + Popup Console logs (`apps/extension`)
- [ ] **Task 3:** YouTube **Sidebar UI** (Content Script + Shadow DOM) (`apps/extension`)
- [ ] **Task 4:** Grab **just the video screenshot image** + preview & logs (`apps/extension`)
- [ ] **Task 5:** Add **timestamp, video seek, ad-guard & notes** (`apps/extension`)
- [ ] **Task 6:** Build the **Next.js Backend API**, local JSON storage & placeholder AI (`apps/web`)
- [ ] **Task 7:** Connect **Content $\rightarrow$ Background $\rightarrow$ Next.js API** & watch the live relay (`apps/extension`)
- [ ] **Task 8:** Build the searchable **Study Dashboard** website (`apps/web`)

---

## 🧭 Big Picture Map

```text
  Extension (Built in Tasks 2-5 & 7)                Next.js Web App (Tasks 6 & 8)
  ──────────────────────────────────                ─────────────────────────────
  1. popup/        ──► Toolbar mini-UI              apps/web/
  2. youtube.content/ ─► YouTube Sidebar + Capture  ├── app/api/*    (Backend API + .data JSON)
  3. background.ts ──► Safe API middleman ─────────►└── app/dashboard (Study Dashboard UI)

  Both share the exact same TypeScript types from:  packages/shared/
```

---

## 🚦 Rules for Building (Read First)

1. **One task at a time:** Execute **only one task** per turn—never jump ahead.
2. **Explain & log everything:** Include clean, readable `console.log` tags (`[CodeFrame Popup]`, `[CodeFrame Content]`, `[CodeFrame Background]`, `[CodeFrame API]`) so you can watch data move step by step.
3. **Guided verification & stop:** At the end of every task, run the build/type check, tick the completed checkboxes here, give clear **"Try It Yourself"** steps telling you what to click and where to look, and **STOP** until you reply `"Next task"` or `"Approved"`.
4. **Never wipe existing files:** Edit or append cleanly (`.gitignore`, `package.json`, existing `apps/web`).

---

## ✅ Task 1: Shared Types Package (`packages/shared`) & `.gitignore`

**What you learned:** Why monorepos keep shared TypeScript interfaces (`ExtractCodeRequest`, `SnippetDTO`, `ExtractCodeResponse`, `GetSnippetsResponse`) in one place so both the Extension and Next.js agree on exact field names.

### Checklist
- [x] Append `.wxt`, `.output`, and `.data` to root `.gitignore`
- [x] Create `packages/shared/package.json`, `tsconfig.json`, and `src/index.ts` (with plain-English comments above each interface)
- [x] Run `pnpm install` and verify `pnpm --filter @codeframe/shared check-types` passes with `0` errors

---

## ⬜ Task 2: Extension Setup & Popup UI (`apps/extension` — Step 1: Popup)

**What you'll learn:** How the **Popup** UI works, how Tailwind CSS styles a Chrome extension, how permissions work in `wxt.config.ts`, and how to watch logs in the **Popup Console**.

### Checklist
- [x] Initialize WXT React + TypeScript starter inside `apps/extension` *(done by you!)*
- [ ] Rename package in `apps/extension/package.json` from `"wxt-react-starter"` to `"extension"`, add `"check-types": "tsc --noEmit"`, and install `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, and `@codeframe/shared`
- [ ] Configure Tailwind (`tailwind.config.js`, `postcss.config.js`) and update `wxt.config.ts` with CodeFrame's name and permissions (`activeTab`, `storage`, `*://*.youtube.com/*`, `http://localhost:3000/*`)
- [ ] Build CodeFrame's clean dark-mode **Popup UI** (`entrypoints/popup/App.tsx`):
  - Shows extension title/status, a link to open `http://localhost:3000/dashboard`, and a quick **"Test Popup Log"** button that prints `console.log('[CodeFrame Popup] ...')`
- [ ] Run `pnpm install` and `pnpm --filter extension build`

### Try It Yourself & Verify
- [ ] Run `pnpm --filter extension dev` and click the extension icon in Chrome
- [ ] Right-click inside the popup $\rightarrow$ **Inspect** $\rightarrow$ **Console** tab
- [ ] Click the button and watch `[CodeFrame Popup]` print live!
- [ ] **STOP and wait for your approval before Task 3.**

---

## ⬜ Task 3: Floating Sidebar UI on YouTube (`apps/extension` — Step 2: Content UI)

**What you'll learn:** How a **Content Script** injects a React sidebar onto YouTube inside a **Shadow DOM** (so YouTube's CSS can't mess up our styles) and detects YouTube video switches without a page reload (`yt-navigate-finish`).

### Checklist
- [ ] Replace starter `entrypoints/content.ts` with `entrypoints/youtube.content/` (`style.css`, `Sidebar.tsx`, `index.tsx`)
- [ ] Match `*://*.youtube.com/*` using WXT's `createShadowRootUi` (`cssInjectionMode: 'ui'`)
- [ ] Build `Sidebar.tsx`:
  - Only appear on `/watch?v=...` pages (hides cleanly on the YouTube homepage)
  - Floating toggle button (`CodeFrame ⚡`) + sleek collapsible dark-mode drawer (`fixed top-16 right-4 z-[9999] w-[380px]`)
  - Read canonical URL (`https://www.youtube.com/watch?v=${videoId}`) and video title (header DOM element with tab-title fallback)
  - Listen for `yt-navigate-finish` & `popstate` so clicking another video updates the sidebar automatically
  - Log `[CodeFrame Content] Active video changed:` with `{ videoId, videoTitle, videoUrl }` and log when the **"Capture Current Frame"** button is clicked

### Try It Yourself & Verify
- [ ] Run `pnpm --filter extension build` (or watch it auto-reload in `dev`)
- [ ] Open any YouTube video, press `F12` $\rightarrow$ **Console** tab
- [ ] Watch `[CodeFrame Content]` log the video title and ID, click **CodeFrame ⚡** to open/close the sidebar, then click another YouTube video and watch the sidebar & Console log update live!
- [ ] **STOP and wait for your approval before Task 4.**

---

## ⬜ Task 4: Grab Just the Video Screenshot (`apps/extension` — Step 3: One Data Piece First)

**What you'll learn:** How JavaScript grabs a single image out of YouTube's `<video>` player using an invisible HTML5 `<canvas>`, shrinks it so it's fast (~80–150 KB WebP), and displays that image right inside your sidebar.

### Checklist
- [ ] Create `apps/extension/src/utils/captureFrame.ts` focused first on capturing the frame:
  - Block cleanly if a YouTube ad is playing (`.ad-showing`)
  - Find the `<video>` element and pause it (`video.pause()`)
  - Resize down to max width `1280px` (preserving aspect ratio)
  - Draw to an offscreen `<canvas>` inside `try/catch` and export `canvas.toDataURL('image/webp', 0.85)`
  - Log `[CodeFrame Capture] Frame captured:` with `{ width, height, sizeKB, preview: frameBase64.slice(0, 45) }`
- [ ] Update `Sidebar.tsx`:
  - Wire **"Capture Current Frame"** to `captureYouTubeFrame()`
  - Display the captured screenshot preview image (and clear/retake button) right in the sidebar

### Try It Yourself & Verify
- [ ] Open a YouTube coding video and press `F12` $\rightarrow$ **Console**
- [ ] Click **"Capture Current Frame"** $\rightarrow$ confirm the video pauses, the exact frozen frame appears inside the sidebar, and `[CodeFrame Capture]` prints the image width, height, and KB size in the Console!
- [ ] **STOP and wait for your approval before Task 5.**

---

## ⬜ Task 5: Timestamps, Video Seek & Notes (`apps/extension` — Step 4: Full Sidebar Functionality)

**What you'll learn:** How to read `video.currentTime`, jump YouTube back to any saved second, and temporarily save cards in `chrome.storage.local` so you can test the whole sidebar UX before wiring up the backend.

### Checklist
- [ ] Add `formatTimestamp(seconds)` (e.g., `125` $\rightarrow$ `"02:05"`) and `seekYouTubeVideo(seconds)` (sets `video.currentTime` & plays + logs `[CodeFrame Seek]`) to `captureFrame.ts`
- [ ] Update `Sidebar.tsx`:
  - Show the formatted `[MM:SS]` timestamp badge next to the captured screenshot
  - Add a `"Quick Note"` input, optional `"Paste/Edit Code"` textarea, and **"Save Snippet"** button
  - Temporarily store saved cards in `chrome.storage.local` (logging `[CodeFrame Storage] Saved locally:` with the snippet object)
  - Render saved cards for the current video with clickable `[MM:SS]` buttons that jump the YouTube player straight back to that second

### Try It Yourself & Verify
- [ ] Capture a frame on YouTube, type a quick note, and click **"Save Snippet"**
- [ ] Scrub the YouTube video to a totally different time
- [ ] Click your saved `[MM:SS]` badge $\rightarrow$ watch YouTube jump right back to that second and check `[CodeFrame Seek]` in the Console!
- [ ] **STOP and wait for your approval before Task 6.**

---

## ⬜ Task 6: Next.js Backend API, Local File Save & Mock AI (`apps/web` — Step 5: The Server)

**What you'll learn:** How Next.js API routes handle HTTP requests, why CORS headers are needed, and how **Adapters** let us save to a simple JSON file (`.data/snippets.json`) and mock AI now so we can plug in any real DB or AI later in 1 line.

### Checklist
- [ ] Inside our **existing** `apps/web` (no `create-next-app`), install `@codeframe/shared` and Tailwind CSS (`tailwindcss`, `@tailwindcss/postcss`, `postcss`)
- [ ] Configure `apps/web/postcss.config.mjs`, `apps/web/app/globals.css`, `apps/web/tsconfig.json` (`@/*` alias), and `apps/web/next.config.js` (`transpilePackages: ["@codeframe/shared"]` + CORS headers for `/api/:path*`)
- [ ] Create `apps/web/lib/storage-adapter.ts` (`StorageAdapter` interface + `LocalJsonStorageAdapter` saving to `apps/web/.data/snippets.json`, logging `[CodeFrame Storage]` in the terminal)
- [ ] Create `apps/web/lib/ai-adapter.ts` (`AIExtractorAdapter` interface + `PlaceholderAIAdapter` supporting `manualCodeOverride`, logging `[CodeFrame AI]` in the terminal)
- [ ] Create API routes in `apps/web/app/api/`:
  - `health/route.ts` (`GET` + `OPTIONS`)
  - `extract/route.ts` (`POST` + `OPTIONS` $\rightarrow$ logs incoming capture, runs AI adapter, saves via Storage adapter)
  - `snippets/route.ts` (`GET` with `force-dynamic` + `OPTIONS` $\rightarrow$ returns saved snippets, filterable by `?videoId=`)

### Try It Yourself & Verify
- [ ] Start `pnpm --filter web dev`
- [ ] Open `http://localhost:3000/api/health` and `http://localhost:3000/api/snippets` in your browser (or `curl`)
- [ ] Confirm both return `200 OK` JSON and watch `[CodeFrame API]` print in your VS Code terminal!
- [ ] **STOP and wait for your approval before Task 7.**

---

## ⬜ Task 7: Connect Content $\rightarrow$ Background $\rightarrow$ Next.js API (`apps/extension` — Step 6: Background Relay)

**What you'll learn:** Seeing all 3 pieces talk together! Why `content` sends the screenshot to `background.ts`, and how `background.ts` forwards it safely to `http://localhost:3000/api/*` and sends the saved card back.

### Checklist
- [ ] Update `apps/extension/entrypoints/background.ts`:
  - Listen for `EXTRACT_CODE` (`POST http://localhost:3000/api/extract`) and `GET_SNIPPETS` (`GET http://localhost:3000/api/snippets?videoId=...`)
  - Log `[CodeFrame Background] Received message:` and `[CodeFrame Background] Backend replied:` so you can watch the relay live in the Service Worker Console
- [ ] Update `Sidebar.tsx`:
  - Replace Task 5's temporary `chrome.storage.local` storage with `chrome.runtime.sendMessage(...)` calls to `background.ts`
  - Auto-load existing snippets whenever you open or switch YouTube videos
  - Add a **"Copy Code"** button (`"Copied! ✓"`) and an **"Open Full Study Dashboard ↗"** link (`http://localhost:3000/dashboard`)

### Try It Yourself & Verify (Watch all 3 Consoles Light Up!)
- [ ] Run `pnpm dev` so **both** `web` (`localhost:3000`) and `extension` are running
- [ ] Open the **YouTube Tab Console** (`F12`), the **Service Worker Console** (`chrome://extensions` $\rightarrow$ `service worker`), and look at your **VS Code Terminal**
- [ ] Capture a frame on YouTube, add a note, and click **"Save & Extract Snippet"** $\rightarrow$ watch the message hop:
  `YouTube Console` $\rightarrow$ `Service Worker Console` $\rightarrow$ `VS Code Terminal (Next.js)` $\rightarrow$ saved inside `apps/web/.data/snippets.json`!
- [ ] Refresh YouTube and verify your saved snippet reloads automatically.
- [ ] **STOP and wait for your approval before Task 8.**

---

## ⬜ Task 8: Build the Searchable Study Dashboard (`apps/web` — Step 7: Web UI)

**What you'll learn:** How a Next.js Server Component loads saved snippets from our storage adapter and hands them to an interactive Client Component with live search, video grouping, copy buttons, and timestamp jump links.

### Checklist
- [ ] Create `apps/web/components/SnippetCard.tsx` (captured frame thumbnail, language badge, clickable `[MM:SS]` YouTube link `${videoUrl}&t=${timestamp}s`, note, explanation, dark `<pre><code>` viewer, **"Copy Snippet"** button)
- [ ] Create `apps/web/components/DashboardClient.tsx` (live search bar filtering by title, note, code, or language + snippets grouped by video in chronological order)
- [ ] Create `apps/web/app/dashboard/page.tsx` (`force-dynamic` Server Component loading snippets via `storageAdapter.getSnippets()` into `<DashboardClient initialSnippets={snippets} />`)
- [ ] Update `apps/web/app/page.tsx` to redirect or link cleanly to `/dashboard`

### Try It Yourself & Verify
- [ ] Open `http://localhost:3000/dashboard` in Chrome
- [ ] Confirm your captured YouTube screenshots, notes, and code blocks appear grouped by video
- [ ] Type into the search bar to test live filtering, click **"Copy Snippet"**, and click any `[MM:SS]` link to jump straight to that exact second on YouTube!
- [ ] **Phase 1 Complete — ready for Phase 2 (choosing your real Database & AI provider)!**
