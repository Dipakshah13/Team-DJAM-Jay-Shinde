<div align="center">

# 🛠️ Book My Service

**Trusted local help, fairly priced — in minutes, in your language.**

Hyperlocal on-demand blue-collar services platform · *Vecnaverse National Level Hackathon — Social Impact*

[Live Demo Placeholder (Deploy on Vercel)](#-live-demo-deployment) · [GitHub Repo](https://github.com/Dipakshah13/Team-DJAM-Social_Impact.git) · [PRD](docs/PRD.md) · [TRD](docs/TRD.md) · [Pitch](docs/PITCH.md)

</div>

---

## 🎯 Problem
Finding reliable, affordable and available plumbers, electricians, painters, cleaners, maids and cooks is hard. Customers face opaque prices and safety worries; local workers struggle with inconsistent work, limited reach and no digital proof of skill.

## 💡 Solution
Book My Service connects customers with **nearby skilled workers** through:
- **Negotiable, transparent pricing** — workers set rates, customers counter once, price locks before work.
- **No-surprise bills** — extra charges require customer in-app approval.
- **Honest trust signals** — `New` · `Vouched` · `Verified` (no inflated stars).
- **Safe jobs** — Start/End OTP, two-way feedback, report/block, safety protocols.
- **Skill Passport** — portable digital proof of skill, earned automatically through completed jobs.
- **Local languages** — 100% parity across English, मराठी (Marathi), and हिंदी (Hindi).

---

## 🚀 Getting Started

```bash
git clone https://github.com/Dipakshah13/Team-DJAM-Social_Impact.git
cd Team-DJAM-Social_Impact/book-my-service
npm install
npm run dev
# open http://localhost:3000
```

### 🔑 Demo Credentials
- **Mobile Number:** Any 10-digit number (e.g. `9820194820`)
- **Demo Verification Code:** `1234`
- **Demo Panel:** Floating pill at bottom allows instant role-switching (`Customer`, `Worker`, `Admin`) and live data resets.
- **Multi-Tab Live Sync:** Open Customer in Tab A and Worker in Tab B — status changes and counter-negotiations sync live via BroadcastChannel & LocalStorage events.

---

## 🎬 Demo Script (2 min video walkthrough)

1. **Sign-In & Role Select:**
   - Go to `/signin`, choose **"I'm a Customer"**, enter phone number, fill demo OTP `1234`.
2. **Find a Pro:**
   - Tap **Plumber**, enter description *"Leaking kitchen pipe"* and landmark *"Opposite Jain Temple, Gate 2"*.
   - Tap **Find Nearby Workers** → see ranked list with real distance, ETA, and `TrustBadge`.
   - Select **Santosh Shinde** (w2).
3. **Price Negotiation & Lock:**
   - In quote page, send a counter offer (e.g. ₹280) or send request at estimate.
   - Switch to **Worker view** via Demo Panel → Santosh's dispatch stream shows the incoming request.
   - Worker accepts → Customer screen displays **"Price locked 🔒"** and auto-opens the live tracking job screen.
4. **Job Execution & Safety:**
   - Customer job screen displays the **4-digit Start OTP**.
   - Worker enters Start OTP → timer starts.
   - Worker raises an extra charge for replacement part (₹120) → Customer reviews & approves in real-time.
5. **Completion & Receipt:**
   - Worker requests **End OTP** from customer and enters it.
   - Detailed breakdown receipt is shown: labour + parts + approved extra - 8% platform fee (Cash on completion).
6. **Skill Passport & Vouch:**
   - Customer submits rating & feedback.
   - Worker Passport automatically increments completed job count (+1) and updates verified skill mastery.
   - Shareable Vouch page increments public vouches.

---

## 📸 Stitch UI Designs & Screenshots

| Screen | Description | Design Artifact |
|---|---|---|
| Customer Home | Master canopy, service categories, live bookings | `docs/design/01_customer_home.png` |
| Worker Matching | Hyperlocal pro ranking, TrustBadge, ETA | `docs/design/02_worker_matching.png` |
| Quote & Counter | Transparent pricing, single counter, price lock | `docs/design/03_quote_negotiation.png` |
| Job Terminal | Live GPS tracker, OTP verification, extra charges | `docs/design/04_job_terminal.png` |
| Worker Dispatch | Live radar stream, status stepper, earnings | `docs/design/05_worker_home.png` |
| Skill Passport | Verifiable digital credentials, police verification | `docs/design/06_skill_passport.png` |
| Public Vouch Page | Society references, trust breakdown, QR share | `docs/design/07_vouch_page.png` |
| Admin Console | Worker approval, verified badge toggling, complaints | `docs/design/08_admin_console.png` |

---

## 🌐 Live Demo Deployment

To deploy your own live instance on Vercel:
```bash
npx vercel
```
Or connect the repository `https://github.com/Dipakshah13/Team-DJAM-Social_Impact` on [Vercel](https://vercel.com/new).

---

## ⚠️ Known Limitations

1. **Frontend-Only Prototype:** Pure client-side simulation using Zustand and `localStorage` persistence with cross-tab live synchronization. No backend server or permanent database.
2. **Sample Data:** Worker profiles, locations, and pricing benchmarks are representative sample data for the Mumbai region (Khar/Bandra/Andheri).
3. **Instant Payout:** Instant UPI wallet payout is a **roadmap preview** demonstrating UI flows and fee calculations; payments in the demo are cash on completion.
4. **Vouch Links:** Peer vouches simulate society references, not legal background verification.

---

## 👥 Team DJAM
- **Dipak Shah** — Product & Full-Stack Development
- Built for **Vecnaverse National Level Hackathon — Social Impact Track**

## 📄 License
[MIT](LICENSE)
