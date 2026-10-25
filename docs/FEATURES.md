# Feature & Add-on List — Book My Service

Legend: **P0** must ship · **P1** ship if P0 done · **P2** only if ahead of schedule. Time = realistic build time with Antigravity.

## A. Must-Build (MVP)
| # | Feature | What to build | Time | Done |
|---|---|---|---|---|
| 1 | Sign-in + tutorial | Phone field, demo OTP `1234`, role choice, 3-slide guide | 40 min | ☑ |
| 2 | Languages | EN/MR/HI label files + `useT()` hook + switcher | 30 min | ☑ |
| 3 | Worker mode | Online toggle, services, base fare, request inbox accept/decline | 45 min | ☑ |
| 4 | Booking + matching | Service icon grid, details, ranked workers (score), ETA label | 60 min | ☑ |
| 5 | Pricing | Estimate, labour/parts split, one counter-offer, lock price | 50 min | ☑ |
| 6 | No-surprise bill | Worker raises extra → customer approves/declines | 35 min | ☑ |
| 7 | Verification badges | Admin toggle; "what was checked" sheet | 25 min | ☑ |
| 8 | Job safety | Start/End OTP, rating both ways, report/block, help screen | 45 min | ☑ |
| 9 | Skill Passport | Auto-built from jobs + admin-checked skills | 30 min | ☑ |
| 10 | Admin page | Approve workers, bookings, complaints | 30 min | ☑ |
| 11 | Receipt | Cash on completion, platform fee line | 20 min | ☑ |

## B. Add-ons & 60% Milestone Features
| Priority | Feature / Add-on | Notes | Status |
|---|---|---|---|
| **P1 — core** | **Vouch link** | `/vouch/[workerId]` page, "Yes, reliable" → "Vouched by N people". WhatsApp share via `wa.me` link | ☑ Done |
| **P2 — voice** | **Voice booking** | Browser `SpeechRecognition` fills request text with audio visualizer | ☑ Done |
| **P2 — proof** | **Before/after job card** | Photographic proof before & after work + interactive 3-step quality checklist | ☑ Done |
| **P1 — timing** | **Schedule for Later** | Date picker (Today/Tomorrow/Day After) + slot selection (Morning/Afternoon/Evening) | ☑ Done |
| **P1 — finance** | **Worker Wallet & Instant Payout** | Gross earnings, 8% platform fee breakdown, net balance, instant UPI transfer | ☑ Done |
| **P1 — finance** | **UPI / Dynamic QR Code Payment** | Cash vs UPI mode toggle, simulated QR code, GPay/PhonePe launchers & online receipt | ☑ Done |

## C. Small touches that feel unique (10–15 min each)
- ☑ Landmark note on booking ("opposite the blue temple") shown to worker
- ☑ Honest trust labels: `New` / `Vouched` / `Verified` (no inflated stars)
- ☑ **Sample data** badge on worker list and price ranges
- ☑ Skill Passport as the **closing demo screen**, updating live after the job

## D. Smart-work extras (cheap, high polish)
| Extra | Why | Time |
|---|---|---|
| **Demo control panel** (Reset data, Switch role, Jump to step) | Re-record video quickly, never get stuck | 15 min |
| **Phone-frame layout on desktop** | Looks professional on judges' laptops | 10 min |
| **Skeletons + toasts + page transitions** (framer-motion, sonner) | "Smooth" feel without extra features | 20 min |
| **PWA manifest + icons** | "Install app" in demo, zero logic | 10 min |
| **Seeded realistic sample data** (8 workers, 6 services) | Demo never looks empty | 20 min |
| **Deployed on Vercel** | Judges can open a live link | 10 min |

## E. Pitch-only roadmap (say it, don't build it)
Apprentice Pairing (earn while you learn) · Instant payout / wage advance · Real hourly earnings · Season Radar · Missed-call booking · Digital Gate Pass · Hold-to-Talk Translator · Picture Skill Test · Digital Hajeri · Gap Jobs · Neighbour Add-on · Full scheduled jobs.
**Deferred:** Aadhaar/police checks, insurance, micro-loans, demand AI, live tracking.
**Dropped:** Sealed-Bid Pricing, Parts Price Shield (needs market data; itemised quote covers it).

## F. Cut-line rule
At **final push window (7–9 AM, 25 Oct)** → feature freeze. Only bug fixes, README, screenshots, video.
