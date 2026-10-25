# AGENT.md — Rules for AI coding agents (Antigravity)

You are building **Book My Service**, a hackathon prototype of a hyperlocal on-demand blue-collar services platform. Read `docs/PRD.md`, `docs/TRD.md`, and `docs/FEATURES.md` before coding. If a request conflicts with them, ask or follow the docs.

## 1. Mission
Ship a **polished, demo-ready, frontend-only** prototype fast. Priority: P0 features → smooth UI → P1 → P2. Never sacrifice a working happy path for an extra.

## 2. Stack (do not substitute)
Next.js (App Router, **JavaScript only — no TypeScript**), React, Tailwind CSS, Zustand (+persist), framer-motion, lucide-react, sonner, clsx. No backend, no database, no external API keys.

## 3. Commands
```
npm install
npm run dev      # http://localhost:3000
npm run build    # must pass before every commit
npm run lint
```

## 4. Hard Rules
- **Single store:** all app state in `store/useAppStore.js`. Pages never hold cross-screen state locally.
- **Pure logic in `lib/`** (matching, pricing, otp, jobMachine, passport). No business logic inside components.
- **All user-facing text through `t('key')`** and added to `en.js`, `mr.js`, `hi.js` together. No hard-coded strings.
- **Data from `data/`** — never inline sample workers in components.
- Mark every page using hooks/store/localStorage with `'use client'`; avoid hydration mismatches (render store-dependent UI after mount).
- **Mobile-first (390px)**; wrap app in `PhoneFrame` on desktop.
- Use **design tokens** in `tailwind` theme / `globals.css`; never hard-code random hex values.
- Every screen needs: loading/empty state, ≥44px tap targets, icon + text labels, sample-data badge where data is fake.
- Booking transitions only via `lib/jobMachine.js`. `finalPrice` is immutable after confirmation.
- Trust labels are `New` / `Vouched` / `Verified` — **never** invent star ratings or unearned certificates.
- Vouch = "reference", **not** verification. Say so in UI copy.
- Payment = **cash on completion**; show a receipt with platform fee. No payment gateway.

## 5. Do Not
- Add dependencies without necessity (justify any new one in the commit message).
- Build roadmap items (see `FEATURES.md §E`) — mention them in the pitch only.
- Use TypeScript, CSS-in-JS, Redux, or UI kits that fight Tailwind.
- Leave `console.log`, dead code, or TODOs in committed code.
- Rewrite working files wholesale; make minimal, targeted edits.

## 6. Code Style
- Functional components, small files (<200 lines), named exports for components, default export for pages.
- Folder by role: `components/ui` (generic), `components/domain` (WorkerCard, PriceBreakdown, OtpInput…).
- Tailwind classes ordered: layout → spacing → typography → color → effects. Use `clsx` for conditionals.
- Commit messages: `feat: …`, `fix: …`, `style: …`, `docs: …`, `chore: …`.

## 7. Definition of Done (per feature)
1. Works on the happy path **and** one failure path (e.g., decline).
2. Visible in EN, MR, HI without layout break.
3. `npm run build` + `lint` pass; no console errors.
4. Matches the Stitch screen (`docs/design/`) within reason.
5. Checkbox ticked in `docs/FEATURES.md`.

## 8. Working Method
- Plan briefly → implement → run build → summarise what changed and what to test.
- Work in the order of `docs/BUILD_PLAYBOOK.md`. Stop at each push milestone and report status.
- If a spec is ambiguous, choose the simplest option that keeps the demo flow working and note the assumption.

## 9. Skills
Use `.agent/skills/book-my-service/SKILL.md` for step-by-step recipes (new screen, store action, i18n key, seed data).
