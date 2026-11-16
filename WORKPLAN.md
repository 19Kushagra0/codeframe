# CodeFrame MVP — Extension-First & Pluggable AI/DB Workplan (`WORKPLAN.md`)

## ⚠️ STRICT AGENT EXECUTION PROTOCOL (READ FIRST)

1. **ONE TASK AT A TIME:** Execute **ONLY ONE TASK** per turn.
2. **NO JUMPING AHEAD:** Never create files or run commands for Task `N+1` while working on Task `N`.
3. **MANDATORY STOP & VERIFY:** At the end of each task, run the specified verification command, report the output, display the **Verification Checkpoint** instructions to the user, and **STOP IMMEDIATELY**. Wait for the user to reply `"Next task"` or `"Approved"` before proceeding.
4. **NO PLACEHOLDER CODE:** Write complete, working, strictly-typed TypeScript code for every file specified.
5. **PRESERVE EXISTING FILES:** Do NOT overwrite existing root files like `.gitignore`—append missing entries cleanly.

---

## Architecture Overview (Extension-First, DB & AI Agnostic)

- **Monorepo Root (`codeframe/`):** Turborepo + `pnpm` workspaces (`pnpm@11.14.0`).
- **Shared Package (`packages/shared`):** `@codeframe/shared` — Shared TypeScript interfaces for requests, responses, and `SnippetDTO`.
- **Chrome Extension (`apps/extension`):** Built FIRST (Tasks 2–4). WXT Framework (Manifest V3), React 19, TypeScript, Tailwind CSS, injected into YouTube via an isolated Shadow DOM root.
- **Backend & Web Dashboard (`apps/web`):** Built SECOND (Tasks 5–7). Next.js (App Router), TypeScript, Tailwind CSS. Uses a **Pluggable Storage Adapter** (defaults to zero-config local `.data/snippets.json` until a database is chosen) and a **Pluggable AI Adapter** (defaults to a mock/manual code extractor until an LLM provider is chosen).

---

## Task 1: Initialize Turborepo Monorepo & Shared Types Package (`packages/shared`)

### Goal

Scaffold the `pnpm` workspace, root `turbo.json`, and the `@codeframe/shared` TypeScript package containing all request/response contracts shared between the Chrome Extension and Next.js app.

### Exact Commands / Files

1. Create `package.json`
2. Create `pnpm-workspace.yaml`
3. Create `turbo.json`
4. Append to existing `.gitignore`
5. Create `packages/shared/package.json`
6. Create `packages/shared/tsconfig.json`
7. Create `packages/shared/src/index.ts`

### Implementation Specs

- **Append to `.gitignore`**:
  Ensure `.turbo`, `.wxt`, `.output`, and `.data` are appended if not already present. Do NOT overwrite existing lines.
- **`pnpm-workspace.yaml`**:
  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
  ```
- **Root `package.json`**:
  - Set `"name": "codeframe"`, `"private": true`, `"packageManager": "pnpm@11.14.0"`.
  - Add scripts: `"dev": "turbo run dev"`, `"build": "turbo run build"`, `"typecheck": "turbo run typecheck"`.
  - Add `devDependencies`: `"turbo": "^2.3.0"`, `"typescript": "^5.7.0"`.
- **`turbo.json`**:
  - Configure tasks for `build` (`dependsOn: ["^build"]`), `dev` (`cache: false`, `persistent: true`), and `typecheck`.
- **`packages/shared/package.json`**:
  - Set `"name": "@codeframe/shared"`, `"version": "0.0.1"`, `"private": true`, `"main": "./src/index.ts"`, `"types": "./src/index.ts"`.
  - Add script `"typecheck": "tsc --noEmit"`.
- **`packages/shared/src/index.ts`**:
  Export the following strict interfaces:

  ```typescript
  export interface ExtractCodeRequest {
    videoId: string;
    videoUrl: string; // Canonical: https://www.youtube.com/watch?v={videoId}
    videoTitle: string;
    timestamp: number; // in seconds
    frameBase64: string; // data:image/webp;base64,...
    userNote?: string;
    manualCodeOverride?: string; // Optional manual code input while AI is in mock mode
  }

  export interface SnippetDTO {
    id: string;
    videoId: string;
    videoUrl: string;
    videoTitle: string;
    timestamp: number;
    frameBase64?: string;
    extractedCode: string;
    language: string;
    explanation: string;
    userNote: string | null;
    createdAt: string; // ISO 8601 string
  }

  export interface ExtractCodeResponse {
    success: boolean;
    snippet?: SnippetDTO;
    error?: string;
  }

  export interface GetSnippetsResponse {
    success: boolean;
    snippets: SnippetDTO[];
    error?: string;
  }
  ```

- Run `pnpm install` at the root.

### Verification Checkpoint

1. Run `pnpm --filter @codeframe/shared typecheck`.
2. Confirm it exits with code `0` and zero TypeScript errors.
3. **STOP and ask the user to confirm before starting Task 2.**

---

## Task 2: Scaffold WXT Chrome Extension Base (`apps/extension`)

### Goal

Create the WXT Manifest V3 Chrome Extension inside `apps/extension` with React, TypeScript, Tailwind CSS, and `@codeframe/shared` wired up.

### Exact Commands / Files

1. Create `apps/extension/package.json`
2. Create `apps/extension/tsconfig.json`
3. Create `apps/extension/wxt.config.ts`
4. Create `apps/extension/tailwind.config.js` & `apps/extension/postcss.config.js`
5. Create `apps/extension/entrypoints/background.ts`
6. Create `apps/extension/entrypoints/popup/index.html` & `apps/extension/entrypoints/popup/main.tsx`

### Implementation Specs

- **`apps/extension/package.json`**:
  - Set `"name": "extension"`, `"private": true`.
  - Scripts: `"dev": "wxt"`, `"build": "wxt build"`, `"typecheck": "tsc --noEmit"`.
  - Dependencies: `"react": "^19.0.0"`, `"react-dom": "^19.0.0"`, `"@codeframe/shared": "workspace:*"`, `"lucide-react": "^0.460.0"`.
  - DevDependencies: `"wxt": "^0.19.0"`, `"@wxt-dev/module-react": "^1.1.0"`, `"tailwindcss": "^3.4.15"`, `"postcss": "^8.4.49"`, `"autoprefixer": "^10.4.20"`, `"@types/react": "^19.0.0"`, `"@types/react-dom": "^19.0.0"`.
- **`apps/extension/wxt.config.ts`**:
  - Configure `@wxt-dev/module-react`.
  - Set `manifest`:
    - `name`: `"CodeFrame — YouTube Study & Code Extractor"`
    - `version`: `"0.1.0"`
    - `permissions`: `["activeTab", "storage"]`
    - `host_permissions`: `["*://*[.youtube.com/](https://.youtube.com/)*", "http://localhost:3000/*"]`
- **`apps/extension/entrypoints/background.ts`**:
  - Define basic `defineBackground(() => { console.log("CodeFrame background worker ready"); })`.
- Run `pnpm install` and `pnpm --filter extension build`.

### Verification Checkpoint

1. Run `pnpm --filter extension build` and verify that `apps/extension/.output/chrome-mv3/manifest.json` is generated cleanly without errors.
2. **STOP and ask the user to confirm before starting Task 3.**

---

## Task 3: Inject Shadow DOM Sidebar onto YouTube (`apps/extension`)

### Goal

Inject a collapsible, Shadow-DOM-isolated React sidebar onto YouTube pages that tracks SPA video navigation (`yt-navigate-finish`) and isolates Tailwind styles from YouTube's CSS.

### Exact Commands / Files

1. Create `apps/extension/entrypoints/youtube.content/style.css`
2. Create `apps/extension/entrypoints/youtube.content/Sidebar.tsx`
3. Create `apps/extension/entrypoints/youtube.content/index.tsx`

### Implementation Specs

- **`style.css`**: Include `@tailwind base; @tailwind components; @tailwind utilities;`.
- **`index.tsx`**:
  - Use `defineContentScript` with `matches: ['*://*[.youtube.com/](https://.youtube.com/)*']` and `cssInjectionMode: 'ui'`.
  - Inside `main(ctx)`, mount a Shadow DOM UI via `createShadowRootUi(ctx, { name: 'codeframe-sidebar', position: 'inline', anchor: 'body', onMount: (container) => { ... } })`.
- **`Sidebar.tsx`**:
  - Only show the floating toggle button (`CodeFrame ⚡`) and drawer when `window.location.pathname === '/watch'` and a valid `v` query parameter exists.
  - Normalize the canonical URL as `[https://www.youtube.com/watch?v=$](https://www.youtube.com/watch?v=$){videoId}` (stripping extra `&t=` or playlist params).
  - Read the video title from `document.querySelector('h1.ytd-watch-metadata yt-formatted-string')?.textContent` with a fallback to `document.title.replace(/^\(\d+\)\s*/, '').replace(' - YouTube', '')`.
  - Listen to `yt-navigate-finish` and URL changes so switching videos updates `videoId` and `videoTitle` reliably.
  - Render a sleek dark-mode collapsible panel (`fixed top-16 right-4 z-[9999] w-[380px]`) displaying the current video title, `videoId` badge, and a placeholder **"Capture Current Frame"** button.

### Verification Checkpoint

1. Run `pnpm --filter extension build`.
2. In Chrome, open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select `apps/extension/.output/chrome-mv3`.
3. Open any YouTube video and verify the **CodeFrame ⚡** button toggles the dark-mode sidebar cleanly, and clicking another video updates the title and video ID.
4. **STOP and ask the user to confirm before starting Task 4.**

---

## Task 4: Build `<video>` Frame Capture, Ad-Guard & Timestamp Seek Engine (`apps/extension`)

### Goal

Capture downscaled WebP screenshots and exact timestamps from YouTube's HTML5 `<video>` element, guard against pre-roll ads, and allow clicking any saved timestamp to jump the video player to that exact second.

### Exact Commands / Files

1. Create `apps/extension/src/utils/captureFrame.ts`
2. Update `apps/extension/entrypoints/youtube.content/Sidebar.tsx`

### Implementation Specs

- **`apps/extension/src/utils/captureFrame.ts`**:
  - Export `captureYouTubeFrame()` returning `{ ok: true; frameBase64: string; timestamp: number } | { ok: false; error: string }`:
    1. Check if `.ad-showing` exists on `#movie_player` (`document.querySelector('.ad-showing')`). If true, return `{ ok: false, error: 'Please wait for the YouTube ad to finish before capturing.' }`.
    2. Query `const video = document.querySelector<HTMLVideoElement>('video.html5-main-video') || document.querySelector('video')`.
    3. If `!video || video.videoWidth === 0`, return `{ ok: false, error: 'No active video stream found.' }`.
    4. Pause the video (`video.pause()`).
    5. Compute target dimensions capped at `maxWidth = 1280` (preserving aspect ratio) so the Base64 payload stays small and fast (~80–150KB).
    6. Create an offscreen `<canvas>`, wrap `ctx.drawImage(video, 0, 0, width, height)` in a `try/catch` (to catch CORS/DRM taint errors gracefully), and export `canvas.toDataURL('image/webp', 0.85)`.
    7. Return `{ ok: true, frameBase64, timestamp: Math.floor(video.currentTime) }`.
  - Export `formatTimestamp(seconds: number): string` (e.g., `125` $\rightarrow$ `"02:05"`).
  - Export `seekYouTubeVideo(seconds: number): void` which sets `video.currentTime = seconds` and calls `video.play()`.
- **Update `Sidebar.tsx`**:
  - Wire **"Capture Current Frame"** to `captureYouTubeFrame()`.
  - Display the captured WebP thumbnail preview, formatted `[MM:SS]` badge (clickable to test `seekYouTubeVideo`), a `"Quick Note"` input, an optional `"Paste/Edit Code (Optional)"` textarea, and a **"Save Snippet"** button (temporarily saving to `chrome.storage.local` until Task 6 connects the Next.js backend).

### Verification Checkpoint

1. Run `pnpm --filter extension build` and reload the extension in Chrome.
2. Open a YouTube coding video, click **"Capture Current Frame"**, and verify the video pauses and displays the captured screenshot preview and `[MM:SS]` timestamp badge inside the sidebar.
3. Save a test snippet locally, scrub the YouTube video to a different time, and click the `[MM:SS]` badge to verify the video immediately seeks back to the captured second.
4. **STOP and ask the user to confirm before starting Task 5.**

---

## Task 5: Scaffold Next.js App (`apps/web`) with Pluggable Storage & AI Adapters

### Goal

Initialize Next.js in `apps/web` with CORS and build clean **Adapter Interfaces** for Storage and AI Extraction so the entire pipeline works immediately with zero database or API keys, while keeping the architecture 100% ready for any Database or LLM later.

### Exact Commands / Files

1. Scaffold Next.js in `apps/web`:
   ```bash
   pnpm create next-app@latest apps/web --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes
   ```
2. Update `apps/web/package.json` & `apps/web/next.config.ts`
3. Create `apps/web/src/lib/storage-adapter.ts`
4. Create `apps/web/src/lib/ai-adapter.ts`
5. Create `apps/web/src/app/api/health/route.ts`
6. Create `apps/web/src/app/api/extract/route.ts`
7. Create `apps/web/src/app/api/snippets/route.ts`

### Implementation Specs

- Add `"@codeframe/shared": "workspace:*"` to `apps/web/package.json` and run `pnpm install`.
- **`apps/web/next.config.ts`**:
  - Add `transpilePackages: ["@codeframe/shared"]`.
  - Configure `headers()` for `/api/:path*` with `Access-Control-Allow-Origin: "*"`, `Access-Control-Allow-Methods: "GET, POST, DELETE, OPTIONS"`, and `Access-Control-Allow-Headers: "Content-Type, Authorization"`.
- **`apps/web/src/lib/storage-adapter.ts` (Database-Agnostic Adapter)**:
  - Define interface `StorageAdapter`:
    - `saveSnippet(snippet: Omit<SnippetDTO, 'id' | 'createdAt'>): Promise<SnippetDTO>`
    - `getSnippets(videoId?: string): Promise<SnippetDTO[]>`
    - `deleteSnippet(id: string): Promise<boolean>`
  - Implement `LocalJsonStorageAdapter` using Node `fs/promises` that reads/writes to `apps/web/.data/snippets.json` (auto-creating the `.data` folder if missing).
  - Add a clear comment showing where Prisma/Supabase/MongoDB can be swapped in later with a 1-line export change.
- **`apps/web/src/lib/ai-adapter.ts` (AI-Agnostic Adapter)**:
  - Define interface `AIExtractorAdapter`:
    - `extractFromFrame(input: { frameBase64: string; videoTitle: string; userNote?: string; manualCodeOverride?: string }): Promise<{ extractedCode: string; language: string; explanation: string }>`
  - Implement `PlaceholderAIAdapter`:
    - If `manualCodeOverride` is provided, use it. Otherwise return a clean placeholder snippet containing the video title and timestamp note (`// [AI Provider Not Connected Yet]\n// Frame captured from: ${videoTitle}\n// Connect Gemini, Grok, or OpenAI in apps/web/src/lib/ai-adapter.ts`) so the user can test the full workflow without needing an API key today.
- **API Routes (`/api/health`, `/api/extract`, `/api/snippets`)**:
  - Wire `POST /api/extract` to call `aiAdapter.extractFromFrame(...)` followed by `storageAdapter.saveSnippet(...)` and return `ExtractCodeResponse`.
  - Wire `GET /api/snippets` to call `storageAdapter.getSnippets(videoId)` and return `GetSnippetsResponse`.

### Verification Checkpoint

1. Start Next.js (`pnpm --filter web dev`) and test `curl -i http://localhost:3000/api/health` and `curl http://localhost:3000/api/snippets`.
2. Confirm both return HTTP `200 OK` with CORS headers and `{"success":true,"snippets":[]}`.
3. **STOP and ask the user to confirm before starting Task 6.**

---

## Task 6: Connect Chrome Extension to Next.js API via Background Worker (`apps/extension`)

### Goal

Route the Chrome Extension's **"Save / Extract Snippet"** and **"Load Snippets"** actions through `background.ts` to the Next.js backend (`http://localhost:3000/api/*`) and display saved snippets inside the YouTube sidebar.

### Exact Commands / Files

1. Update `apps/extension/entrypoints/background.ts`
2. Update `apps/extension/entrypoints/youtube.content/Sidebar.tsx`

### Implementation Specs

- **`apps/extension/entrypoints/background.ts`**:
  - Listen to `chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => { ... return true; })`.
  - Handle `EXTRACT_CODE`: sends `POST http://localhost:3000/api/extract` with `ExtractCodeRequest` payload and returns `ExtractCodeResponse`.
  - Handle `GET_SNIPPETS`: sends `GET http://localhost:3000/api/snippets?videoId=${message.videoId}` and returns `GetSnippetsResponse`.
- **Update `Sidebar.tsx`**:
  - On video load (`videoId` change), request `GET_SNIPPETS` from the background worker and display existing snippets sorted by timestamp.
  - When **"Save & Extract Snippet"** is clicked, send `EXTRACT_CODE` to the background worker, prepend the returned `SnippetDTO` to the list, and clear the capture form.
  - For each snippet card in the sidebar:
    - Render a clickable `[MM:SS]` button that calls `seekYouTubeVideo(snippet.timestamp)`.
    - Render a **"Copy Code"** button with `"Copied! ✓"` feedback.
    - Render a link at the bottom: **"Open Full Study Dashboard ↗"** (`http://localhost:3000/dashboard`).

### Verification Checkpoint

1. Ensure `pnpm --filter web dev` is running on `http://localhost:3000` and rebuild the extension (`pnpm --filter extension build`).
2. Capture a frame on YouTube, add a quick note, and click **"Save & Extract Snippet"**.
3. Confirm the snippet appears in the sidebar, persists when you refresh the YouTube page, and saves inside `apps/web/.data/snippets.json`.
4. **STOP and ask the user to confirm before starting Task 7.**

---

## Task 7: Build the Next.js Web Study Dashboard with Search (`apps/web`)

### Goal

Build the `/dashboard` page in Next.js where users can view their captured YouTube screenshots, notes, and code snippets grouped by video, filter them via a live search bar, and jump back to the exact YouTube timestamp in one click.

### Exact Commands / Files

1. Create `apps/web/src/components/SnippetCard.tsx`
2. Create `apps/web/src/components/DashboardClient.tsx`
3. Create `apps/web/src/app/dashboard/page.tsx`
4. Update `apps/web/src/app/page.tsx` (redirect or link cleanly to `/dashboard`)

### Implementation Specs

- **`apps/web/src/components/SnippetCard.tsx`** (`"use client"`):
  - Displays the captured video frame thumbnail (`frameBase64` if present), language badge, clickable timestamp badge linking to `${snippet.videoUrl}&t=${snippet.timestamp}s`, user note, explanation, dark-themed `<pre><code>` block, and a **"Copy Snippet"** button.
- **`apps/web/src/components/DashboardClient.tsx`** (`"use client"`):
  - Accepts `initialSnippets: SnippetDTO[]`.
  - Includes a search input that filters snippets in real time by `videoTitle`, `userNote`, `extractedCode`, or `language`.
  - Groups matching snippets by `videoId` so each YouTube tutorial appears as a structured study card with all its captured timestamps in chronological order.
- **`apps/web/src/app/dashboard/page.tsx`**:
  - Server Component (`export const dynamic = "force-dynamic"`).
  - Loads snippets via `storageAdapter.getSnippets()` and renders `<DashboardClient initialSnippets="{snippets}"/>`.

### Verification Checkpoint

1. Open `http://localhost:3000/dashboard` in Chrome.
2. Verify all snippets captured from the YouTube extension appear grouped by video, including their captured frame thumbnails, notes, code blocks, and working search bar.
3. Click any `[MM:SS]` timestamp link on the dashboard and confirm it opens the YouTube video at that exact second.
4. **Report Phase 1 Prototype completion to the user, Ready for Phase 2 (choosing Database & AI provider).**
