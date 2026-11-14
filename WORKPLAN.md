# CodeFrame MVP — Master Execution Workplan (`WORKPLAN.md`)

## ⚠️ STRICT AGENT EXECUTION PROTOCOL (READ FIRST)
1. **ONE TASK AT A TIME:** You must execute **ONLY ONE TASK** per turn.
2. **NO JUMPING AHEAD:** Never create files or run commands for Task `N+1` while working on Task `N`.
3. **MANDATORY STOP & VERIFY:** At the end of each task, run the specified verification command, report the output, display the **Verification Checkpoint** instructions to the user, and **STOP IMMEDIATELY**. Wait for the user to reply `"Next task"` or `"Approved"` before proceeding.
4. **NO PLACEHOLDER CODE:** Write complete, working, strictly-typed TypeScript code for every file specified.

---

## Architecture Overview
- **Monorepo Root (`codeframe/`):** Turborepo + `pnpm` workspaces
- **Shared Package (`packages/shared`):** `@codeframe/shared` — Shared TypeScript interfaces for API payloads and database DTOs.
- **Backend & Web Dashboard (`apps/web`):** Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM (PostgreSQL), and `@google/generative-ai` (`gemini-2.5-flash`). Runs on `http://localhost:3000`.
- **Chrome Extension (`apps/extension`):** WXT Framework (Manifest V3), React, TypeScript, Tailwind CSS, injected into `[https://www.youtube.com/watch](https://www.youtube.com/watch)*` via an isolated Shadow DOM root.

---

## Task 1: Initialize Turborepo Monorepo & Shared Types Package (`packages/shared`)

### Goal
Scaffold the `pnpm` workspace, root `turbo.json`, and the `@codeframe/shared` TypeScript package containing all request/response contracts shared between the Chrome Extension and Next.js backend.

### Exact Commands / Files
Create the following root and shared package files:
1. `package.json`
2. `pnpm-workspace.yaml`
3. `turbo.json`
4. `.gitignore`
5. `packages/shared/package.json`
6. `packages/shared/tsconfig.json`
7. `packages/shared/src/index.ts`

### Implementation Specs
- **`pnpm-workspace.yaml`**:
  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
  ```
- **Root `package.json`**:
  - Set `"name": "codeframe"`, `"private": true`, `"packageManager": "pnpm@9.15.0"`.
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
    videoUrl: string;
    videoTitle: string;
    timestamp: number; // in seconds
    frameBase64: string; // data:image/png;base64,...
    userNote?: string;
  }

  export interface SnippetDTO {
    id: string;
    videoId: string;
    videoUrl: string;
    videoTitle: string;
    timestamp: number;
    extractedCode: string;
    language: string;
    explanation: string;
    userNote: string | null;
    createdAt: string;
  }

  export interface ExtractCodeResponse {
    success: boolean;
    snippet?: SnippetDTO;
    error?: string;
  }
  ```
- Run `pnpm install` at the root.

### Verification Checkpoint
1. Run `pnpm --filter @codeframe/shared typecheck` in the terminal.
2. Confirm it exits with code `0` and zero TypeScript errors.
3. **STOP and ask the user to confirm before starting Task 2.**

---

## Task 2: Scaffold Next.js App (`apps/web`) & Health-Check API with CORS

### Goal
Initialize the Next.js App Router application inside `apps/web`, connect `@codeframe/shared`, and configure CORS headers so the Chrome Extension can make requests to `http://localhost:3000/api/*`.

### Exact Commands / Files
1. Scaffold Next.js in `apps/web`:
   ```bash
   pnpm create next-app@latest apps/web --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes
   ```
2. Edit `apps/web/package.json`
3. Edit `apps/web/next.config.ts` (or `next.config.mjs`)
4. Create `apps/web/src/app/api/health/route.ts`

### Implementation Specs
- Add `"@codeframe/shared": "workspace:*"` to `dependencies` in `apps/web/package.json` and run `pnpm install`.
- In `apps/web/next.config.ts` (or `.mjs`), configure `headers()` for `source: "/api/:path*"` returning:
  - `Access-Control-Allow-Origin: "*"`
  - `Access-Control-Allow-Methods: "GET, POST, PUT, DELETE, OPTIONS"`
  - `Access-Control-Allow-Headers: "Content-Type, Authorization"`
- In `apps/web/src/app/api/health/route.ts`:
  - Export `GET()` returning `NextResponse.json({ status: "ok", service: "codeframe-web" })`.
  - Export `OPTIONS()` returning `new NextResponse(null, { status: 204 })`.

### Verification Checkpoint
1. Start the server or test route compilation, and run `curl -i http://localhost:3000/api/health`.
2. Confirm HTTP `200 OK`, JSON `{"status":"ok","service":"codeframe-web"}`, and the `Access-Control-Allow-Origin: *` header.
3. **STOP and ask the user to confirm before starting Task 3.**

---

## Task 3: Configure Prisma ORM & Database Schema (`apps/web`)

### Goal
Set up Prisma in `apps/web` with a `Snippet` model to store captured YouTube metadata, timestamps, AI-extracted code, and user notes.

### Exact Commands / Files
1. Install Prisma in `apps/web`:
   ```bash
   pnpm --filter web add @prisma/client
   pnpm --filter web add -D prisma
   ```
2. Create `apps/web/prisma/schema.prisma`
3. Create `apps/web/src/lib/prisma.ts`
4. Create `apps/web/.env.example` and configure `apps/web/.env`

### Implementation Specs
- **`apps/web/prisma/schema.prisma`**:
  - Use PostgreSQL (`provider = "postgresql"`, `url = env("DATABASE_URL")`). *(Note: If the user prefers zero-config local testing before plugging in Supabase/Postgres, ask if they want PostgreSQL or local SQLite `file:./dev.db` for immediate prototyping, defaulting to PostgreSQL if `DATABASE_URL` is provided).*
  - Define the `Snippet` model:
    ```prisma
    model Snippet {
      id            String   @id @default(cuid())
      videoId       String
      videoUrl      String
      videoTitle    String
      timestamp     Int
      extractedCode String   @db.Text
      language      String   @default("plaintext")
      explanation   String   @db.Text
      userNote      String?  @db.Text
      createdAt     DateTime @default(now())

      @@index([videoId])
    }
    ```
- **`apps/web/src/lib/prisma.ts`**:
  - Implement standard Next.js `globalForPrisma` singleton pattern exporting `prisma`.
- Run `pnpm --filter web npx prisma generate` and `pnpm --filter web npx prisma db push`.

### Verification Checkpoint
1. Confirm `prisma generate` and `prisma db push` succeed without errors.
2. **STOP and ask the user to confirm before starting Task 4.**

---

## Task 4: Build Gemini Vision Extraction & Snippets API (`apps/web`)

### Goal
Create `POST /api/extract` to send the Base64 video frame to Gemini Vision (`gemini-2.5-flash`), parse the extracted code and explanation, save it to Prisma, and expose `GET /api/snippets` to fetch saved snippets.

### Exact Commands / Files
1. Install Gemini SDK in `apps/web`:
   ```bash
   pnpm --filter web add @google/generative-ai
   ```
2. Create `apps/web/src/app/api/extract/route.ts`
3. Create `apps/web/src/app/api/snippets/route.ts`

### Implementation Specs
- Ensure `GEMINI_API_KEY` is read from `process.env.GEMINI_API_KEY` in `apps/web/.env`.
- **`apps/web/src/app/api/extract/route.ts`**:
  - Export `OPTIONS()` returning status `204` for CORS preflight.
  - Export `POST(req: Request)`:
    1. Parse body as `ExtractCodeRequest` from `@codeframe/shared`.
    2. Validate required fields (`videoId`, `videoUrl`, `timestamp`, `frameBase64`).
    3. Strip the data URL prefix (`frameBase64.replace(/^data:image\/\w+;base64,/, "")`).
    4. Call `@google/generative-ai` using model `"gemini-2.5-flash"` with `generationConfig: { responseMimeType: "application/json" }`.
    5. Prompt Gemini:
       *"Extract all visible source code from this video tutorial screenshot. Fix obvious OCR typos while preserving exact logic and indentation. If no code is visible, set code to '// No code detected in frame'. Return strict JSON: { \"code\": string, \"language\": string, \"explanation\": string (1-2 concise sentences explaining what the code does) }."*
    6. Save the result into `prisma.snippet.create({...})`.
    7. Return `NextResponse.json<ExtractCodeResponse>({ success: true, snippet })`.
- **`apps/web/src/app/api/snippets/route.ts`**:
  - Export `GET(req: Request)`:
    1. Check optional query param `?videoId=...`.
    2. Query `prisma.snippet.findMany({ where: videoId ? { videoId } : undefined, orderBy: { timestamp: "asc" } })`.
    3. Return JSON `{ success: true, snippets }`.

### Verification Checkpoint
1. Test `GET http://localhost:3000/api/snippets` and confirm it returns `{"success":true,"snippets":[]}`.
2. Test `POST http://localhost:3000/api/extract` with a sample JSON payload containing a small Base64 PNG and verify Gemini responds and saves a record in Prisma.
3. **STOP and ask the user to confirm before starting Task 5.**

---

## Task 5: Scaffold WXT Chrome Extension (`apps/extension`)

### Goal
Create the WXT Manifest V3 Chrome Extension inside `apps/extension` with React, TypeScript, Tailwind CSS, and `@codeframe/shared` wired up.

### Exact Commands / Files
1. Create `apps/extension/package.json`
2. Create `apps/extension/tsconfig.json`
3. Create `apps/extension/wxt.config.ts`
4. Create `apps/extension/tailwind.config.js` & `apps/extension/postcss.config.js`
5. Create `apps/extension/entrypoints/background.ts`
6. Create `apps/extension/entrypoints/popup/index.html` & `main.tsx`

### Implementation Specs
- **`apps/extension/package.json`**:
  - Set `"name": "extension"`, `"private": true`.
  - Scripts: `"dev": "wxt"`, `"build": "wxt build"`, `"typecheck": "tsc --noEmit"`.
  - Dependencies: `"react": "^19.0.0"`, `"react-dom": "^19.0.0"`, `"@codeframe/shared": "workspace:*"`, `"lucide-react": "^0.460.0"`.
  - DevDependencies: `"wxt": "^0.19.0"`, `"@wxt-dev/module-react": "^1.1.0"`, `"tailwindcss": "^3.4.15"`, `"postcss": "^8.4.49"`, `"autoprefixer": "^10.4.20"`, `"@types/react": "^19.0.0"`, `"@types/react-dom": "^19.0.0"`.
- **`apps/extension/wxt.config.ts`**:
  ```typescript
  import { defineConfig } from 'wxt';

  export default defineConfig({
    modules: ['@wxt-dev/module-react'],
    manifest: {
      name: 'CodeFrame — YouTube Code Extractor',
      description: 'Grab code snippets and timestamped notes directly from YouTube video frames.',
      version: '0.1.0',
      permissions: ['activeTab', 'storage'],
      host_permissions: ['*://*.youtube.com/*', 'http://localhost:3000/*'],
    },
  });
  ```
- Run `pnpm install` and `pnpm --filter extension build`.

### Verification Checkpoint
1. Run `pnpm --filter extension build` and verify that `apps/extension/.output/chrome-mv3/manifest.json` is generated without errors.
2. **STOP and ask the user to confirm before starting Task 6.**

---

## Task 6: Inject Shadow DOM Sidebar onto YouTube Watch Pages (`apps/extension`)

### Goal
Inject a collapsible, Shadow-DOM-isolated React sidebar onto `[https://www.youtube.com/watch](https://www.youtube.com/watch)*` so YouTube's global CSS never collides with CodeFrame's Tailwind styles.

### Exact Commands / Files
1. Create `apps/extension/entrypoints/youtube.content/style.css`
2. Create `apps/extension/entrypoints/youtube.content/Sidebar.tsx`
3. Create `apps/extension/entrypoints/youtube.content/index.tsx`

### Implementation Specs
- **`style.css`**: Include `@tailwind base; @tailwind components; @tailwind utilities;`.
- **`index.tsx`**:
  - Use `defineContentScript` matching `['*://*[.youtube.com/](https://.youtube.com/)*']` with `cssInjectionMode: 'ui'`.
  - Inside `main(ctx)`, use `createShadowRootUi(ctx, { name: 'codeframe-sidebar', position: 'inline', anchor: 'body', onMount: (container) => { ... } })`.
  - Render `<Sidebar/>` inside a fixed right-hand drawer (`fixed top-14 right-4 z-[9999] w-[380px]`) with a sleek floating toggle button (`CodeFrame ⚡`) so it works reliably on both Default and Theater YouTube layouts and survives YouTube SPA route transitions.
- **`Sidebar.tsx`**:
  - Detect current YouTube video ID (`new URLSearchParams(window.location.search).get('v')`) and title (`document.title.replace(' - YouTube', '')`).
  - Listen for `yt-navigate-finish` on `window` to update the active `videoId` when the user clicks another YouTube video without a full page reload.
  - Display the dark-mode shell header, active Video ID badge, and a placeholder "Capture Frame" button.

### Verification Checkpoint
1. Run `pnpm --filter extension build`.
2. Open Chrome $\rightarrow$ `chrome://extensions` $\rightarrow$ Enable **Developer mode** $\rightarrow$ Click **Load unpacked** $\rightarrow$ Select `apps/extension/.output/chrome-mv3`.
3. Open any YouTube video (`[https://www.youtube.com/watch?v=](https://www.youtube.com/watch?v=)...`) and verify the floating **CodeFrame** sidebar opens cleanly on the right side of the screen.
4. **STOP and ask the user to confirm before starting Task 7.**

---

## Task 7: Build the HTML5 `<video>` Frame Capture & Timestamp Engine (`apps/extension`)

### Goal
Capture the exact current frame of YouTube's `<video>` player into a Base64 PNG image along with the current playback timestamp (`MM:SS`) whenever the user clicks **"Capture Frame"**.

### Exact Commands / Files
1. Create `apps/extension/src/utils/captureFrame.ts`
2. Update `apps/extension/entrypoints/youtube.content/Sidebar.tsx`

### Implementation Specs
- **`apps/extension/src/utils/captureFrame.ts`**:
  - Export `captureYouTubeFrame()` returning `{ frameBase64: string; timestamp: number } | null`:
    1. Query `const video = document.querySelector<HTMLVideoElement>('video.html5-main-video') || document.querySelector('video')`.
    2. If `!video || video.videoWidth === 0`, return `null`.
    3. Pause the video (`video.pause()`) so the user can comfortably add a note.
    4. Create an offscreen `<canvas>`, set `canvas.width = video.videoWidth` and `canvas.height = video.videoHeight`.
    5. Draw the video frame: `ctx.drawImage(video, 0, 0, canvas.width, canvas.height)`.
    6. Convert to Base64: `const frameBase64 = canvas.toDataURL('image/png')`.
    7. Read `const timestamp = Math.floor(video.currentTime)`.
    8. Return `{ frameBase64, timestamp }`.
  - Export helper `formatTimestamp(seconds: number): string` (e.g., `125` $\rightarrow$ `"02:05"`).
  - Export helper `seekYouTubeVideo(seconds: number): void` which finds the `<video>` element, sets `video.currentTime = seconds`, and calls `video.play()`.
- **Update `Sidebar.tsx`**:
  - When the user clicks **"Capture Current Frame"**, call `captureYouTubeFrame()`.
  - Render the captured screenshot preview thumbnail, formatted timestamp badge (`[02:05]`), an optional `"Add a quick note..."` input field, and an **"Extract Code with AI"** button.

### Verification Checkpoint
1. Rebuild/reload the extension and open any YouTube coding video.
2. Play the video to any timestamp showing code, click **"Capture Current Frame"**, and verify the video pauses and displays the exact screenshot thumbnail and `[MM:SS]` timestamp inside the CodeFrame sidebar.
3. **STOP and ask the user to confirm before starting Task 8.**

---

## Task 8: Wire Background API Messaging, AI Code Extraction & Video Seeking (`apps/extension`)

### Goal
Connect the sidebar's **"Extract Code with AI"** button to `POST http://localhost:3000/api/extract` via the Background Service Worker, display the extracted code with a 1-click **Copy Code** button, and list saved snippets for the current video with clickable `[MM:SS]` seek buttons.

### Exact Commands / Files
1. Update `apps/extension/entrypoints/background.ts`
2. Update `apps/extension/entrypoints/youtube.content/Sidebar.tsx`

### Implementation Specs
- **Why Background Service Worker Proxy:** Content scripts running on `[https://www.youtube.com](https://www.youtube.com)` can face Mixed Content / Private Network Access restrictions when calling `http://localhost:3000`. Routing the `fetch` call through `entrypoints/background.ts` via `chrome.runtime.sendMessage` bypasses page-level restrictions cleanly.
- **`apps/extension/entrypoints/background.ts`**:
  - Listen to `chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { ... return true; })`.
  - Handle two message types:
    1. `EXTRACT_CODE`: Calls `POST http://localhost:3000/api/extract` with `message.payload` (`ExtractCodeRequest`) and returns the JSON response.
    2. `GET_SNIPPETS`: Calls `GET http://localhost:3000/api/snippets?videoId=${message.videoId}` and returns saved snippets for that video.
- **Update `Sidebar.tsx`**:
  - When `videoId` changes, fetch existing snippets via `GET_SNIPPETS`.
  - When **"Extract Code with AI"** is clicked:
    1. Show a loading state (`"Extracting code via Gemini..."`).
    2. Send `EXTRACT_CODE` message to background worker.
    3. On success, prepend/insert the returned `SnippetDTO` into the sidebar's snippet list and clear the temporary capture preview.
  - For each snippet in the sidebar:
    1. Render a clickable timestamp button (`[02:05]`) that calls `seekYouTubeVideo(snippet.timestamp)`.
    2. Render a **"Copy Code"** button that copies `snippet.extractedCode` to clipboard and shows `"Copied! ✓"` for 2 seconds.
    3. Render the formatted `<pre><code>` block and Gemini's brief explanation + user note.
    4. Include an **"Open Web Dashboard ↗"** link pointing to `http://localhost:3000/dashboard`.

### Verification Checkpoint
1. Ensure `pnpm --filter web dev` is running on `http://localhost:3000`.
2. Open a YouTube coding tutorial, click **"Capture Current Frame"**, type a short note, and click **"Extract Code with AI"**.
3. Verify the extracted code appears in the sidebar within ~3 seconds, click **"Copy Code"** to test clipboard copy, scrub the YouTube video elsewhere, and click the `[MM:SS]` badge to verify the video jumps back to that exact second.
4. **STOP and ask the user to confirm before starting Task 9.**

---

## Task 9: Build the Next.js Web Study Dashboard (`apps/web`)

### Goal
Build the Next.js web dashboard (`/dashboard`) where users can search all their saved YouTube code snippets, view grouped study notes by video, copy code, or click a timestamp to open the YouTube video at that exact second.

### Exact Commands / Files
1. Create `apps/web/src/components/SnippetCard.tsx`
2. Create `apps/web/src/app/dashboard/page.tsx`
3. Update `apps/web/src/app/page.tsx` (redirect or link cleanly to `/dashboard`)

### Implementation Specs
- **`apps/web/src/components/SnippetCard.tsx`** (`"use client"`):
  - Props: `snippet: SnippetDTO`.
  - Displays language badge, formatted timestamp link (`${snippet.videoUrl}&t=${snippet.timestamp}s` opening in a new tab), user note, AI explanation, dark-themed `<pre><code>` viewer, and a working **"Copy Snippet"** button.
- **`apps/web/src/app/dashboard/page.tsx`**:
  - Server Component (with `export const dynamic = "force-dynamic"`).
  - Queries all snippets via `prisma.snippet.findMany({ orderBy: { createdAt: "desc" } })`.
  - Groups snippets by `videoId` so each YouTube video renders as a clean study module header showing the video title, total snippets captured, and a grid/list of `SnippetCard` components ordered by timestamp.
  - Includes a clean empty state explaining how to capture the first snippet from YouTube using the Chrome Extension.

### Verification Checkpoint
1. Open `http://localhost:3000/dashboard` in Chrome.
2. Confirm all snippets captured from the YouTube extension are displayed, grouped by YouTube video title.
3. Click the **"Copy Snippet"** button and click the `[MM:SS]` link to confirm it opens YouTube at that exact timestamp (`&t=Xs`).
4. **Report MVP completion to the user.**
