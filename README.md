# CodeFrame — Guided Learning & Build Guide (`README.md`)

> **How our 3 guide files work together:**
> - **[README.md](./README.md) (this file):** Our **Guided Learning Rules** and quick terminal commands.
> - **[WORKPLAN.md](./WORKPLAN.md):** The **Big-Picture Roadmap** (Tasks 1–8).
> - **[LOG.md](./LOG.md):** Our **Live Round-by-Round Journal & Bookmark** (tracks only the current micro-round we are building, with `[x]` checkboxes as we go).

---

## 📍 Current Bookmark (See [LOG.md](./LOG.md) for Live Round Details)

- **Active Task:** Task 2 — Extension Setup & Popup UI (`apps/extension`)
- **Current Round:** **Task 2, Round 2** (Icons & "Open Study Dashboard" button in `entrypoints/popup/App.tsx`)
- **Last Completed:** Task 2, Round 1 (Tailwind/permissions setup + Popup Console logs)

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

### 4. Track Every Round in `LOG.md`
- Instead of writing 20 future rounds in advance, we **only add the current round** we are working on to **[LOG.md](./LOG.md)**.
- Each round in `LOG.md` has checkboxes for **I Show**, **You Do**, and **We Test**, plus a 1-sentence **"What you learned"** takeaway.
- As soon as a round passes testing, we tick its boxes `[x]` in `LOG.md` and add the next round below it.

### 5. The `📍 Bookmark` Rule for Side Questions
Whenever you pause to ask a question (*"Wait, what does that line do?"* or *"Why do we do it this way?"*):
1. We save our exact stopping point in **`📍 Current Bookmark`** inside **[LOG.md](./LOG.md)** (and note it in chat).
2. We explore and answer your question completely.
3. When you're ready to continue, I read `LOG.md` and your current code/logs so we pick up from the exact line where we left off.

---

## 📝 Reusable Guided-Learning Prompt

> *"Switch to Guided Learning Mode for this project: don't build whole files for me all at once, and don't ask me to code from scratch with zero reference. Break each project feature into tiny building blocks using an **'I Show One $\rightarrow$ You Do One $\rightarrow$ We Test'** loop, and track each active round with checkboxes inside **`LOG.md`**. Whenever I ask a side question, save a **Bookmark** of where we paused in `LOG.md`, answer my question in plain human language, and then use `LOG.md` and my code/logs to resume from that exact spot."*

---

## ⚡ Quick Project Commands (Run from `codeframe/`)

- **Install / link all packages:** `pnpm install`
- **Run everything together (Web + Extension):** `pnpm dev`
- **Run only the Website (`localhost:3000`):** `pnpm --filter web dev`
- **Run only the Chrome Extension:** `pnpm --filter extension dev`
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
