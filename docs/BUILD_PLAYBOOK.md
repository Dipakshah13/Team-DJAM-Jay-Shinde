# Build Playbook — Antigravity, aligned to push windows

| Milestone | Window (IST) | Must be pushed |
|---|---|---|
| Start | 24 Oct, 9:00 AM | — |
| **Push 1** | 24 Oct, 12:00–3:00 PM | Scaffold, design system, store+seed, sign-in/role/tutorial, customer home, booking + worker list |
| **Push 2** | 24 Oct, 8:00–10:00 PM | Full happy path: pricing, worker mode, OTP job, extra charge, receipt, passport, admin |
| **Final push** | 25 Oct, 7:00–9:00 AM | Polish, vouch, i18n pass, README, screenshots, deploy |
| **Submit** | 25 Oct, 9:00 AM–12:00 PM | GitHub link, 2-min video, 5-slide PPT |

> Commit early and often. Each push must run (`npm run build`), even if features are incomplete.

## Setup (10 min)
```bash
npx create-next-app@latest book-my-service --js --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd book-my-service
npm i zustand framer-motion lucide-react sonner clsx
```
Copy `AGENT.md`, `docs/`, and `.agent/skills/` into the repo. Open the folder in Antigravity.

## Prompt Sequence (copy-paste into Antigravity)

**P0 — Context**
> Read AGENT.md, docs/PRD.md, docs/TRD.md, docs/FEATURES.md and the skill in .agent/skills. Summarise the plan in 10 bullets, then wait.

**P1 — Foundations** *(→ Push 1)*
> Set up design tokens from docs/DESIGN_AND_STITCH.md in Tailwind/globals.css, fonts (Inter + Noto Sans Devanagari via next/font), `PhoneFrame`, `Screen`, `Button`, `Card`, `Badge`, `Sheet`, `Skeleton`, `PageTransition`, toaster. Create `lib/constants.js`, i18n files (en/mr/hi) with `useT`, and `store/useAppStore.js` with persist. No feature screens yet.

**P2 — Data + logic**
> Create `data/services.js` (6 services) and `data/workers.js` (8 sample workers incl. offline & unapproved), then `lib/matching.js`, `lib/pricing.js`, `lib/otp.js`, `lib/jobMachine.js`, `lib/passport.js` exactly as in TRD §5–6. Add unit-style sanity checks in a dev-only `lib/__checks__.js`.

**P3 — Onboarding** *(Push 1)*
> Build /signin (OTP 1234), /tutorial, /role, language switcher, using the attached Stitch screenshots.

**P4 — Customer booking** *(Push 1)*
> Build /customer/home, /customer/book/[serviceId] (with landmark), /customer/workers with ranked cards, trust badges, ETA labels and Sample-data badge.

**P5 — Pricing & worker mode** *(Push 2)*
> Build /customer/quote/[id] (estimate, one counter-offer, confirm) and worker side: /worker/setup, /worker/home (online toggle, request inbox, accept/decline, respond to counter).

**P6 — Job lifecycle**
> Build /customer/job/[id] and /worker/job/[id]: start OTP, extra-charge request + approval sheet, end OTP, receipt with platform fee, /customer/rate/[id] with report/block, /help.

**P7 — Passport + Admin** *(Push 2)*
> Build /worker/passport (auto from completed jobs + admin-checked) and /admin with Workers/Bookings/Complaints tabs and Verified toggle with "what was checked".

**P8 — Extras & polish** *(Final push)*
> Add /vouch/[workerId] + WhatsApp share, demo control panel (reset/switch role), cross-tab sync, skeletons and transitions, PWA manifest. Run through TRD §12 and fix bugs.

**P9 — Release**
> Generate README per template, verify `npm run build`, fix lint, and list any known issues.

## Time Savers
- Ask Antigravity to **run the app in its browser and self-test** the flow after P6 and P8.
- Keep one long-lived conversation per milestone; paste AGENT.md rules again if it drifts.
- If voice booking misbehaves for >20 min → drop it, use before/after card.
- Record the video with **demo control panel → Reset**, using a pre-signed-in state (don't show login).
