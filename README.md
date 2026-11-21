# CodeFrame — Guided Learning & Build Guide (`README.md`)

> **What this file is for:** This holds our **Learn-by-Building Rules** and our **Live Bookmark** so we always teach, build, and pause/resume in the exact same way. *(For the task checklist itself, see [WORKPLAN.md](./WORKPLAN.md).)*

---

## 📍 Current Bookmark (Where We Are Right Now)

- **Active Task:** Task 2 — Extension Setup & Popup UI (`apps/extension`)
- **Exact Spot:** Ready to start **Task 2, Round 1** (setting up Tailwind/icons + our first *"I Show One $\rightarrow$ You Do One"* exercise in `entrypoints/popup/App.tsx`)
- **Last Completed:** Task 1 (`packages/shared` shared types) + initialized WXT starter in `apps/extension`

---

## 🎓 How We Learn & Build Together (Core Protocol)

### 1. Speak Like a Human
- Explain one idea at a time in plain, everyday English.
- Use simple visual diagrams (`──►`) instead of dumping long lists of filenames or code tags.
- Always state clearly what was added, changed, or removed so it's easy to track.

### 2. Never Build Everything at Once (Tiny Building Blocks)
- Don't dump a finished complex file all at once, and never ask you to write code with zero reference.
- Break every feature into small steps that build on each other (for example: *first log a plain message $\rightarrow$ next log a variable $\rightarrow$ finally combine values and log the result*).

### 3. The "I Show One $\rightarrow$ You Do One $\rightarrow$ We Test" Loop
For every code feature in the project:
1. **I Show One:** I write or show **one tiny working piece** (for example, importing one icon or adding one button/log) and explain how it works in plain words.
2. **You Do One:** You write the **next small piece** yourself using my example right above yours as a reference.
3. **We Test Live:** I give you the exact click + Console check in Chrome to see your code working. If anything fails or shows an error, I read your file, explain why, and help you fix it.

### 4. The `📍 Bookmark` Rule for Side Questions
Whenever you pause to ask a question (*"Wait, what does that line do?"* or *"Why do we do it this way?"*):
1. We save our exact stopping point in **`📍 Current Bookmark`** at the top of this file (and note it in chat).
2. We explore and answer your question completely.
3. When you're ready to continue, I read the bookmark and your current code/logs so we pick up from the exact line where we left off.

---

## 📝 Reusable Guided-Learning Prompt

> *"Switch to Guided Learning Mode for this project: don't build whole files for me all at once, and don't ask me to code from scratch with zero reference. Break each project feature into tiny building blocks using an **'I Show One $\rightarrow$ You Do One $\rightarrow$ We Test'** loop (for example, you import one icon or write one log and explain it simply, then I add the next one and test it in the Console). Whenever I ask a side question, save a **Bookmark** of where we paused, answer my question in plain human language, and then use the bookmark and my code/logs to resume from that exact spot."*

---

## ⚡ Quick Project Commands (Run from `codeframe/`)

- **Install / link all packages:** `pnpm install`
- **Run everything together (Web + Extension):** `pnpm dev`
- **Run only the Website (`localhost:3000`):** `pnpm --filter web dev`
- **Run only the Chrome Extension:** `pnpm --filter wxt-react-starter dev` *(will become `pnpm --filter extension dev` in Task 2)*
- **Check TypeScript across everything:** `pnpm check-types`

---

<details>
<summary><strong>Original Turborepo Starter Notes (Reference)</strong></summary>

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `extension`: a [WXT](https://wxt.dev/) Chrome Extension
- `@codeframe/shared`: shared TypeScript types across `web` and `extension`
- `@repo/ui`: a stub React component library
- `@repo/eslint-config`: `eslint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Build & Develop

```sh
pnpm build
pnpm dev
pnpm check-types
```

</details>
