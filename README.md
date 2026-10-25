<div align="center">

# 🛠️ Book My Service

**Trusted local help, fairly priced — in minutes, in your language.**

Hyperlocal on-demand blue-collar services platform · *Vecnaverse National Level Hackathon — Social Impact*

[Live Demo](#) · [Demo Video](#) · [Pitch Deck](#) · [PRD](docs/PRD.md) · [TRD](docs/TRD.md)

</div>

---

## 🎯 Problem
Finding reliable, affordable and available plumbers, electricians, painters, cleaners, maids and cooks is hard. Customers face opaque prices and safety worries; local workers struggle with inconsistent work, limited reach and no digital proof of skill.

## 💡 Solution
Book My Service connects customers with **nearby skilled workers** through:
- **Negotiable, transparent pricing** — workers set rates, customers counter once, price locks before work.
- **No-surprise bills** — extra charges need in-app customer approval.
- **Honest trust signals** — `New` · `Vouched` · `Verified` (no inflated stars).
- **Safe jobs** — Start/End OTP, two-way feedback, report/block, help screen.
- **Skill Passport** — portable proof of skill, built automatically from completed jobs.
- **Local languages** — English, मराठी, हिंदी.

## ✨ Features
| Customer | Worker | Admin |
|---|---|---|
| Service icons, landmark note | Online/offline toggle | Approve workers |
| Ranked nearby workers + ETA | Set services & base fare | Toggle **Verified** + what was checked |
| Estimate, counter-offer, price lock | Accept / decline / respond to counter | View bookings & complaints |
| Approve/decline extra charges | Raise extra charge | |
| OTP start/end, receipt, feedback | Skill Passport | |
| Report / block, Vouch link | Share Vouch link | |

## 🧱 Tech Stack
Next.js (App Router) · React · Tailwind CSS · JavaScript · Zustand · framer-motion · lucide-react · sonner
UI designed in **Google Stitch**, built with **Antigravity**.

## 🧠 How It Works
- **Matching:** `score = 0.35·skill + 0.25·availability + 0.25·distance + 0.15·verified`
- **Booking state machine:** `REQUESTED → CONFIRMED → STARTED → COMPLETED → RATED` (with counter, extra-charge and decline branches)
- **Payment:** cash on completion; receipt shows platform fee (sample 8%).
- **Prototype note:** frontend-only; a persisted client store simulates the platform. All workers/prices are **sample data**.

## 🚀 Getting Started
```bash
git clone https://github.com/<your-username>/book-my-service.git
cd book-my-service
npm install
npm run dev
# open http://localhost:3000
```
**Demo login:** any phone number · OTP `1234`. Use the floating **Demo panel** to switch role or reset data.

## 🎬 Demo Flow (2 min)
1. Book a plumber (+ landmark) → see ranked workers
2. Counter-offer → worker accepts → price locked
3. Start OTP → worker raises extra charge → customer approves
4. End OTP → receipt → feedback
5. Skill Passport updates → Vouch link

## 📁 Project Structure
```
book-my-service/
├── AGENT.md                 # AI agent rules (Antigravity)
├── .agent/skills/book-my-service/SKILL.md
├── docs/                    # PRD, TRD, FEATURES, DESIGN, PLAYBOOK, PITCH
│   └── design/              # Stitch screenshots
├── app/                     # Next.js routes: customer, worker, admin, vouch
├── components/{ui,domain,layout}/
├── data/                    # services.js, workers.js
├── lib/                     # matching, pricing, otp, jobMachine, passport, i18n
├── store/useAppStore.js
├── hooks/useT.js
└── public/                  # icons, manifest, images
```

## 🗺️ Roadmap
Apprentice Pairing · Instant payout / wage advance · Season Radar · Missed-call booking · Digital Gate Pass · Hold-to-Talk Translator · Picture Skill Test · Scheduled jobs · Aadhaar/police verification partners.

## ⚠️ Honest Limitations
Prototype only: no real payments, KYC, GPS or backend. Vouch links are **references, not verification**. All data is sample data.

## 👥 Team
| Name | Role |
|---|---|
| Dipak Shah | Lead / Full-stack |
| _Add teammates_ | |

## 📄 License
MIT
