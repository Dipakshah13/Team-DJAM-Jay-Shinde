# Perfect Repo Structure

```
book-my-service/
├── AGENT.md
├── README.md
├── LICENSE
├── package.json
├── jsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── .gitignore
├── .agent/
│   └── skills/book-my-service/SKILL.md
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── FEATURES.md
│   ├── DESIGN_AND_STITCH.md
│   ├── BUILD_PLAYBOOK.md
│   ├── PITCH_AND_DEMO.md
│   ├── REPO_STRUCTURE.md
│   └── design/                  # 01-signin.png … 14-admin.png
├── public/
│   ├── manifest.json
│   ├── icons/                   # PWA + service icons
│   └── workers/                 # sample avatars
├── app/
│   ├── layout.js                # fonts, PhoneFrame, Toaster, DemoPanel
│   ├── globals.css              # tokens
│   ├── page.js                  # splash → /signin
│   ├── signin/page.js
│   ├── tutorial/page.js
│   ├── role/page.js
│   ├── help/page.js
│   ├── customer/
│   │   ├── home/page.js
│   │   ├── book/[serviceId]/page.js
│   │   ├── workers/page.js
│   │   ├── quote/[bookingId]/page.js
│   │   ├── job/[bookingId]/page.js
│   │   └── rate/[bookingId]/page.js
│   ├── worker/
│   │   ├── home/page.js
│   │   ├── setup/page.js
│   │   ├── job/[bookingId]/page.js
│   │   └── passport/page.js
│   ├── admin/page.js
│   └── vouch/[workerId]/page.js
├── components/
│   ├── ui/                      # Button, Card, Badge, Sheet, Skeleton, Screen, OtpInput, Toggle
│   ├── domain/                  # ServiceTile, WorkerCard, TrustBadge, PriceBreakdown,
│   │                            # ExtraChargeSheet, Receipt, PassportCard, StatusStepper
│   └── layout/                  # PhoneFrame, BottomNav, DemoPanel, LanguageSwitch, PageTransition
├── data/
│   ├── services.js
│   └── workers.js
├── lib/
│   ├── constants.js             # FEE_RATE, weights, OTP_DEMO
│   ├── matching.js
│   ├── pricing.js
│   ├── otp.js
│   ├── jobMachine.js
│   ├── passport.js
│   └── i18n/{en,mr,hi}.js
├── hooks/
│   ├── useT.js
│   └── useMounted.js
└── store/
    └── useAppStore.js
```
**Branching:** `main` only (hackathon) — commit small, push at each window. Tag releases `v0.1-push1`, `v0.2-push2`, `v1.0-final`.
