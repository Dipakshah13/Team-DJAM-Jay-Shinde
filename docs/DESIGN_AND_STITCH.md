# Design System & Stitch Prompts

## 1. Design Tokens
| Token | Value | Use |
|---|---|---|
| `--c-primary` | `#0F2A4A` (deep navy) | Headers, primary buttons |
| `--c-accent` | `#F59E0B` (saffron) | CTAs, highlights, price |
| `--c-verified` | `#16A34A` | Verified badge, success |
| `--c-vouched` | `#2563EB` | Vouched badge |
| `--c-danger` | `#DC2626` | Decline, report |
| `--c-bg` | `#F8FAFC` | App background |
| `--c-card` | `#FFFFFF` | Cards |
| `--c-text` / `--c-muted` | `#0F172A` / `#64748B` | Text |

Typography: **Inter** + **Noto Sans Devanagari**, body ≥16px. Radius: cards `rounded-2xl`, buttons `rounded-full`. Shadow: soft `0 8px 24px rgba(15,42,74,.08)`. Motion: 200–300ms ease-out, slide/fade between screens.
Style words: *trustworthy, warm, clean, Indian-local, large icons, low-text, friendly*.

## 2. Workflow: Stitch → Antigravity
1. Paste **Master Prompt** into Stitch (mobile app, 390px) to set the style.
2. Generate each screen with the prompts below (one at a time, iterate with "make it more…").
3. Export/screenshot each final screen into `docs/design/` (name `01-signin.png` …). Use Stitch's code/HTML export if available as extra reference.
4. In Antigravity, attach the screenshot + say: *"Implement this screen in Next.js + Tailwind per AGENT.md, using existing ui primitives and i18n."*
5. Don't pixel-match obsessively — match layout, spacing, hierarchy, colours.

## 3. Master Prompt (paste first)
> Design a **mobile app UI (390×844)** for **"Book My Service"**, a hyperlocal on-demand platform in India that connects households with nearby plumbers, electricians, painters, cleaners, maids and cooks. Style: trustworthy, warm, clean and modern. Deep navy (#0F2A4A) primary, saffron (#F59E0B) accent, green (#16A34A) for verified, soft off-white background (#F8FAFC), white rounded cards (24px radius) with soft shadows, pill-shaped buttons, large friendly icons with short labels (low-literacy friendly), Inter font. Support English, Marathi and Hindi. Show small "Sample data" chips where lists are mock. Keep consistent bottom navigation and header across screens.

## 4. Screen Prompts
1. **Splash + Sign-in** — Logo, tagline "Trusted help, nearby", phone number field (+91), "Send OTP" button, OTP 4-box input state, language chips EN | मराठी | हिंदी.
2. **Tutorial (3 slides)** — Illustrations: "Choose a service", "Compare & agree on a price", "Safe job with OTP". Dots, Skip, Next.
3. **Role choice** — Two big cards: "I need a service" (customer) and "I offer a service" (worker).
4. **Customer Home** — Greeting, search bar, 2×3 grid of service icon cards (Plumber, Electrician, Painter, Cleaner, Maid, Cook), "Recent bookings" strip, bottom nav.
5. **Booking details** — Selected service header, description textarea with mic button, **landmark note** field ("opposite the blue temple"), "Find workers" CTA.
6. **Worker list** — Cards with avatar, name, service, **trust badge (Verified/Vouched/New)**, distance, "about 20 min" ETA, base fare, "Sample data" chip; best match tagged "Top match".
7. **Quote & negotiation** — Price breakdown (labour/parts), estimate total in saffron, "Make a counter-offer" input (one time), status timeline, "Confirm price" button.
8. **Live job (customer)** — Status stepper, **Start OTP** large digits, worker mini-profile, **extra charge approval bottom sheet** (reason, amount, Approve / Decline), Help & Report links.
9. **Receipt & feedback** — Success check, itemised bill with platform fee line, "Pay cash to worker", 1–5 emoji feedback, tags, "Report/Block" link.
10. **Worker Home** — Big Online/Offline toggle, today's earnings card, incoming request cards with Accept/Decline, bottom nav.
11. **Worker Job screen** — Customer landmark note highlighted, enter Start OTP, "Raise extra charge" sheet, "End job" OTP.
12. **Skill Passport** — Profile header with trust badge, skill chips with job counts, "Admin-checked" tags, empty slot "Earn this certificate after 10 jobs", "Share Vouch link" button.
13. **Vouch page (public)** — Worker photo, "Was Ramesh reliable?", big "Yes, reliable" button, note "This is a reference, not verification".
14. **Admin dashboard (desktop)** — Tabs: Workers (Approve/Verify toggles + what was checked), Bookings, Complaints; clean data tables.

## 5. Polish Prompts (use after generation)
- "Increase tap target sizes and spacing; make primary action more prominent."
- "Make trust badges more distinctive; add a shield icon for Verified."
- "Reduce text; replace sentences with icons + 2-word labels."
- "Make this screen feel premium: subtle gradients, consistent 24px radius, better hierarchy."
