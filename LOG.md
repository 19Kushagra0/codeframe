# CodeFrame — Live Learning & Build Log (`LOG.md`)

> **How this log works:** We only put the **current round** we are actively working on here (plus the rounds we've already finished). As soon as you finish and test a round, we tick the checkboxes `[x]`, write a 1-line summary of what you learned, and add the next round below!

---

## 📍 Current Bookmark (Where We Are Right Now)

- **Current Task:** Task 2 — Extension Setup & Popup UI (`apps/extension`)
- **Current Round:** **Task 2 — Round 2** (Waiting on **Your Turn**: import `ExternalLink` + add the "Open Study Dashboard" link)
- **Active File:** `apps/extension/entrypoints/popup/App.tsx`
- **Status:** "I Show" done (`Zap` icon added). Waiting for you to do "You Do" and test in Chrome.

---

## ✅ Completed Rounds

### ✅ Task 1 — Round 1: Monorepo & Shared Data Types (`packages/shared`)
- [x] Explored Turborepo (`create-turbo`) and ran `pnpm dev` to see how a monorepo runs multiple apps
- [x] Updated `.gitignore` to ignore extension builds (`.wxt`, `.output`) and local data (`.data`)
- [x] Created `packages/shared` (`@codeframe/shared`) with our 4 shared TypeScript interfaces (`ExtractCodeRequest`, `SnippetDTO`, `ExtractCodeResponse`, `GetSnippetsResponse`)
- [x] Added plain-English comments above each interface explaining whether the Extension, Next.js, or Both use it
- [x] Verified `pnpm check-types` passes with zero errors
- **💡 What you learned:** Turborepo is a **monorepo build system / task runner** (not an app framework), and `packages/shared` lets our Extension and Next.js backend share the exact same TypeScript data blueprints from one single file.

---

### ✅ Task 2 — Round 0: Exploring WXT & the 3 Extension Consoles (`apps/extension`)
- [x] Created the WXT React + TypeScript starter inside `apps/extension`
- [x] Fixed the nested hidden `.git` folder issue so GitHub Desktop tracks `apps/extension` files normally
- [x] Ran the starter extension in Chrome and located the Background Service Worker Console
- **💡 What you learned:** A Chrome Extension runs in **3 separate worlds** (each with its own Console):
  1. **`popup`** = Toolbar mini-UI (closes when you click away)
  2. **`content`** = Runs inside a single webpage tab (reads/edits that page & draws our YouTube sidebar)
  3. **`background`** = Invisible behind-the-scenes worker (handles browser-level jobs & safe API calls to Next.js)

---

### ✅ Task 2 — Round 1: Extension Toolkit Setup & First Popup Console Logs
- [x] **Setup (AI):** Renamed package to `"extension"`, installed Tailwind CSS + icons (`lucide-react`) + `@codeframe/shared`, and added YouTube & `localhost:3000` permissions in `wxt.config.ts`
- [x] **I Show (AI):** Added the first `console.log` inside `entrypoints/popup/App.tsx` that prints when the popup opens
- [x] **You Do (You):** Created `const appName = "CodeFrame"` inside `App.tsx` and logged it inside `handleTestClick`
- [x] **We Test:** Opened the Popup Console in Chrome, clicked **"Test Popup Log"**, and watched `CodeFrame` print live (`App.tsx:15`)!
- **💡 What you learned:** How `postcss.config.js`, `tailwind.config.js`, `wxt.config.ts`, `export default`, and `@codeframe/shared` fit together—and how React button clicks (`onClick`) trigger your own JavaScript inside the Popup Console.

---

## ⏳ Active Round (Up Next)

### ⬜ Task 2 — Round 2: Adding Icons (`lucide-react`) & the "Open Study Dashboard" Button
- [x] **I Show (AI):** Import one icon into `App.tsx`, place it next to the `CodeFrame` title, and explain how Tailwind sizes and colors it
- [ ] **You Do (You):** Import a second icon using my line as a guide, and add an **"Open Study Dashboard"** button linking to `http://localhost:3000/dashboard`
- [ ] **We Test:** Inspect the new icons in Chrome, click the dashboard button, and run `pnpm --filter extension build` to finish **Task 2**!
- **💡 What you learned:** *(We will fill this in once Round 2 is ticked off!)*
