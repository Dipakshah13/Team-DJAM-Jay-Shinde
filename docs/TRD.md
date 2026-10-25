# Technical Requirements Document — Book My Service

## 1. Principles ("smart work, not hard work")
1. **Frontend-only prototype.** No real backend; a persisted client store simulates the platform. Zero infra risk, deployable in minutes.
2. **One source of truth:** a single Zustand store (persisted to `localStorage`) drives Customer, Worker and Admin views — so the demo "just works" across roles.
3. **Config over code:** services, workers, labels, fee %, and trust rules live in `data/` and `lib/constants.js`.
4. **Mobile-first**, rendered inside a phone frame on desktop.

## 2. Tech Stack
| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js (App Router), JavaScript** | File routing, instant Vercel deploy |
| UI | **React** + **Tailwind CSS** | Fast, consistent styling |
| State | **Zustand** + `persist` middleware | Tiny, no boilerplate |
| Animation | **framer-motion** | Smooth transitions |
| Icons | **lucide-react** | Clean service/UI icons |
| Toasts | **sonner** | Polished feedback |
| Utils | `clsx` | Conditional classes |
| i18n | Custom label files + `useT()` | Lighter than next-intl for 3 languages |
| Deploy | **Vercel** | Live link for judges |
| Design | **Google Stitch** (screens) → **Antigravity** (code) | Fast pro UI |

## 3. Architecture
```
Browser
 ├─ Next.js App Router pages (customer / worker / admin / vouch)
 ├─ Shared UI components (components/ui, components/domain)
 ├─ Zustand store (store/useAppStore.js)  ←→  localStorage ("bms-v1")
 ├─ Pure logic (lib/matching.js, lib/pricing.js, lib/otp.js, lib/jobMachine.js)
 ├─ Static data (data/services.js, data/workers.js)
 └─ i18n (lib/i18n/{en,mr,hi}.js + hooks/useT.js)
```
**Cross-tab sync (optional, 10 min):** listen to the `storage` event and call `useAppStore.persist.rehydrate()` so a Customer tab and a Worker tab update live.

## 4. Data Models (JS shapes)
```js
// Service
{ id:'plumber', icon:'Wrench', labelKey:'svc.plumber', baseRange:[300,900] }

// Worker
{ id:'w1', name:'Ramesh Pawar', services:['plumber'], baseFare:350,
  online:true, distanceKm:1.8, experienceYears:6,
  verified:true, checks:{ phone:true, id:true, skillEvidence:true },
  vouches:2, jobsDone:41, area:'Andheri East', approved:true,
  passport:{ skills:[{ name:'Plumbing', source:'jobs', count:41 }, { name:'Pipe fitting', source:'admin-checked' }] } }

// Booking
{ id:'b1', customerId:'c1', workerId:'w1', serviceId:'plumber',
  description:'Kitchen tap leaking', landmark:'Opposite the blue temple',
  status:'REQUESTED', estimate:{ labour:350, parts:150 },
  counter:{ offered:380, response:null }, finalPrice:null,
  startOtp:'4821', endOtp:'7390', extras:[], createdAt:Date.now(),
  feedback:{ customer:null, worker:null } }

// ExtraCharge
{ id:'e1', reason:'Replacement washer', amount:120, status:'PENDING|APPROVED|DECLINED' }

// Complaint
{ id:'k1', bookingId:'b1', by:'customer', reason:'...', status:'OPEN' }
```
Sample worker/price data **must** be flagged with the "Sample data" badge.

## 5. Booking State Machine (`lib/jobMachine.js`)
```
DRAFT → REQUESTED → (COUNTERED) → CONFIRMED → STARTED → (EXTRA_PENDING ↔ STARTED) → COMPLETED → RATED
              ↘ DECLINED / CANCELLED (from REQUESTED, COUNTERED, CONFIRMED)
```
Rules: only the allowed transitions in a `TRANSITIONS` map may run; every store action calls `canTransition(from, to)` first. `finalPrice` is set at CONFIRMED and **immutable** afterwards; changes only via approved extras.

## 6. Core Algorithms
**Matching score (`lib/matching.js`)** — only `online && approved` workers offering the service:
```
score = 0.35*skill + 0.25*availability + 0.25*distance + 0.15*verified
skill        = min(1, 0.6 + experienceYears/20)         // offers service → base 0.6
availability = online ? 1 : 0
distance     = max(0, 1 - distanceKm/10)
verified     = verified ? 1 : 0
```
Sort descending; tie-break by lower distance.
**ETA:** `minutes = 8 + distanceKm*4` → rounded to nearest 5 → label `"about 20 min"` (localised).

**Pricing (`lib/pricing.js`)**
- `estimate = { labour: worker.baseFare, parts: service.defaultParts }`
- `counter` allowed once (`booking.counter.offered === null`).
- Worker response: `accept` → `finalPrice = offered`; `decline` → customer may accept original or cancel.
- `platformFee = round(labourTotal * FEE_RATE)` with `FEE_RATE = 0.08`.
- Receipt: labour + parts + approved extras = total; fee shown separately (deducted from worker side).

**OTP (`lib/otp.js`)** — 4-digit strings generated at CONFIRMED; start OTP shown to customer, entered by worker; end OTP likewise. Demo sign-in OTP fixed at `1234`.

**Skill Passport (`lib/passport.js`)** — derive from `completed bookings` grouped by service + `worker.checks`/admin-checked skills. No certificate unless count threshold met **and** admin-checked.

## 7. Routing
```
/                         splash → redirect to /signin
/signin  /tutorial  /role
/customer/home
/customer/book/[serviceId]        details + landmark (+ voice extra)
/customer/workers                 ranked list
/customer/quote/[bookingId]       estimate + counter + confirm
/customer/job/[bookingId]         live job: OTP, extra approvals, end, receipt
/customer/rate/[bookingId]
/worker/home                      online toggle, requests
/worker/setup                     services + base fare
/worker/job/[bookingId]           start OTP entry, raise extra, end OTP
/worker/passport
/admin                            workers / bookings / complaints tabs
/vouch/[workerId]                 public reference page
/help                             static safety help
```

## 8. i18n
```js
// lib/i18n/en.js
export default { 'home.title':'What do you need today?', 'svc.plumber':'Plumber', 'cta.book':'Book a service' }
// lib/i18n/mr.js → 'cta.book':'सेवा बुक करा'   // lib/i18n/hi.js → 'cta.book':'सेवा बुक करें'
```
`useT()` returns `t(key)`; falls back to English. Language stored in the store. Load **Noto Sans Devanagari** with `next/font`.

## 9. Voice Booking (Extra, optional)
`window.SpeechRecognition || window.webkitSpeechRecognition`, `lang` from current language (`en-IN`, `mr-IN`, `hi-IN`). Fills the description field only; the user must tap **Confirm**. Feature-detect and hide the mic if unsupported.

## 10. Non-Functional
| Area | Requirement |
|---|---|
| Performance | Lighthouse mobile ≥ 85; no heavy libs; images optimised |
| A11y | Tap targets ≥ 44px, contrast AA, icon + text labels (low-literacy friendly), `aria-label`s |
| Resilience | Guard `localStorage` for SSR (`'use client'`, `skipHydration`/mounted check); reset button |
| Security (prototype) | No real PII; sample data only; no secrets; no external API keys |
| Browser | Latest Chrome/Edge/Safari mobile |

## 11. Quality Gate (before each push)
- `npm run build` passes, `npm run lint` clean
- Full happy path manual run (Section 12)
- No console errors; no hydration warnings
- Works at 390×844 and desktop

## 12. Manual Test Script
1. Sign in `1234` → Customer → book plumber (landmark) → ranked list shows Verified first
2. Counter-offer once → worker accepts → price locked
3. Switch to Worker → accept → Start OTP → raise extra ₹120 → switch Customer → approve
4. End OTP → receipt shows fee → rate → Worker Skill Passport count +1
5. Vouch page → "Vouched by N" increments
6. Switch language to Marathi/Hindi on 3 screens — no overflow
7. Admin toggles Verified → badge changes

## 13. Deployment
`vercel` (or GitHub → Vercel import). No env vars needed. Add the live URL to README and submission form.
