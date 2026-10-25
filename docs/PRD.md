# Product Requirements Document — Book My Service

**Version:** 1.0 (hackathon prototype) · **Track:** Social Impact · **Problem Statement:** Hyperlocal On-Demand Blue-Collar Services Platform

---

## 1. Overview
Book My Service connects households with nearby plumbers, electricians, painters, cleaners, maids, cooks and other local workers — with **transparent, negotiable pricing**, **visible trust signals**, and **no-surprise billing**. Workers set their own rates and get consistent local work; customers get a verified, nearby professional quickly (ETA-based, "about 20 min").

## 2. Problem (from the problem statement)
| Side | Pain |
|---|---|
| Customers | Hard to find reliable, affordable, available workers nearby; prices are opaque; fear of hidden charges and unsafe strangers |
| Workers | Inconsistent work, limited reach to nearby customers, hard to compete digitally, no portable proof of skill |

## 3. Vision & Goals
**Vision:** Every local skilled worker gets steady, fairly-priced work and a trusted digital identity; every household gets help in minutes.

| Goal | Prototype proof |
|---|---|
| Find nearby workers fast | Ranked list with ETA label |
| Flexible, transparent pricing | Worker sets base fare; customer counter-offers; price locked before work |
| Zero bill shock | Extra charges need in-app customer approval |
| Trust & safety | Verified/Vouched/New labels, start/end OTP, report/block |
| Worker empowerment | Online toggle, own rates, auto-built Skill Passport |

**Non-goals (this build):** real payments, real KYC (Aadhaar/police), live GPS tracking, full scheduling, demand-prediction AI, insurance, loans, native apps.

## 4. Personas
1. **Sunita (Customer)** — 34, working professional in Mumbai, needs a plumber today, worried about being overcharged.
2. **Ramesh (Worker)** — 29, skilled plumber, mostly Marathi-speaking, gets work by word of mouth, wants steady jobs and to set his own price.
3. **Admin** — platform ops; approves workers, toggles Verified, reviews complaints.

## 5. Key User Stories
**Customer**
- C1 As a customer I pick a service by icon and describe my need (+ landmark note) so the worker finds me.
- C2 I see nearby workers ranked by fit, with a trust label and ETA.
- C3 I see an estimate (labour/parts split) and can send **one** counter-offer.
- C4 I confirm the final price before work begins.
- C5 I approve/decline any extra charge in-app.
- C6 I share an OTP to start/end the job, rate the worker, and can report/block.

**Worker**
- W1 I sign in, choose Worker, and set services + base fare.
- W2 I toggle Online/Offline and accept/decline requests.
- W3 I can accept, reject, or hold my price on a counter-offer.
- W4 I raise an extra charge with a reason.
- W5 My Skill Passport updates after each completed job.

**Admin**
- A1 I approve workers and toggle Verified with a record of what was checked.
- A2 I see bookings and complaints.

## 6. Functional Requirements (traceable to Feature List)
| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Phone sign-in with demo OTP; Customer/Worker role choice; 3-slide tutorial | P0 |
| FR-02 | Language switch EN (default) / MR / HI via label file for main screens | P0 |
| FR-03 | Worker mode: online/offline, services, base fare, accept/decline | P0 |
| FR-04 | Booking via service icons; ranked sample workers (skill, availability, distance, verified); ETA label | P0 |
| FR-05 | Pricing: estimate, labour/parts split, one counter-offer round, locked final price | P0 |
| FR-06 | No-surprise bill: extra-charge request → customer approve/decline | P0 |
| FR-07 | Verification badges showing exactly what was checked (phone, ID, skill evidence) | P0 |
| FR-08 | Job safety: start/end OTP, two-way feedback, report/block, static help screen | P0 |
| FR-09 | Skill Passport auto-built from completed + admin-checked skills; no unearned certificates | P0 |
| FR-10 | Admin page: approve workers, bookings, complaints | P0 |
| FR-11 | Payment: cash on completion; receipt screen showing platform fee | P0 |
| FR-12 | Vouch link: reference from previous customer → "Vouched by N people" | P1 (Extra #1) |
| FR-13 | Voice booking via browser speech recognition, customer confirms | P2 (Extra #2, conditional) |
| FR-14 | Before/after job card (2 photos + checklist) | P2 (fallback) |
| FR-15 | Landmark note, honest trust labels, sample-data badge | P1 (small touches) |

## 7. Business Rules
- **Platform fee:** flat 8% of the final labour amount, deducted from worker earnings and shown on receipt (sample figure — configurable constant).
- **Payment:** cash on completion. Receipt: labour, parts, approved extras, platform fee, total.
- **Counter-offer:** customer may counter **once**; worker accepts, declines (customer may accept the original or cancel). No further rounds.
- **Trust labels:** `New` (no jobs) → `Vouched` (≥1 vouch) → `Verified` (admin toggled). Never show fake star inflation.
- **Skill Passport:** only shows skills from completed jobs or admin-checked evidence.
- **ETA:** label only ("about 20 min"); not a live-tracking promise.

## 8. Core Flows
1. **Booking:** Service → details + landmark → ranked workers → pick → estimate → counter (optional) → price locked → worker accepts.
2. **Job:** Worker arrives → customer shares **Start OTP** → work → optional **extra charge** → approve/decline → **End OTP** → receipt → feedback → Skill Passport updates.
3. **Trust:** Vouch link shared (WhatsApp) → "Yes, reliable" → profile label updates.

## 9. Success Metrics (prototype)
- Full demo flow completes in **< 2 minutes** without errors.
- A judge understands "what's different" within 30 seconds (no-surprise bill + trust labels + Skill Passport).
- Works on mobile viewport and desktop; EN/MR/HI switch has no layout break.

## 10. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Two-role demo is confusing | Role switcher + persisted shared state; optional two-tab sync |
| Voice API fails on some devices | Keep optional; record backup video; confirm-before-submit |
| Fake data looks like real claims | "Sample data" badge on worker lists and price ranges |
| Time overrun | Strict P0 → P1 → P2 order; freeze features at final-push window |

## 11. Problem-Statement Traceability
| PS requirement | Where it's met |
|---|---|
| Connect customers with nearby skilled workers | FR-04 |
| On-demand and scheduled jobs | On-demand built; scheduling shown as ETA label + roadmap |
| Workers set own rates; customers negotiate | FR-03, FR-05 |
| ~30 minute availability | ETA label, distance-weighted ranking |
| Worker verification | FR-07 |
| Service quality | Feedback, Skill Passport |
| Fair pricing | Estimate split + counter-offer + extra-charge approval |
| Safety & trust | FR-08, report/block, help screen, vouch |
