---
name: book-my-service
description: Recipes for extending the Book My Service Next.js prototype — adding screens, store actions, i18n keys, seed data, booking transitions, and design-consistent UI. Use when building or modifying any feature in this repo.
---

# Book My Service — Project Skill

## When to use
Any time you add or change a screen, store action, label, worker/service data, or pricing/matching logic in this repo.

## Recipe 1 — Add a new screen
1. Create `app/<role>/<route>/page.js` with `'use client'`.
2. Wrap content in `<Screen title={t('...')} back>` (from `components/ui/Screen.js`).
3. Read state with `useAppStore(selector)`; call actions, never mutate state directly.
4. Add loading + empty states; use `components/ui/Skeleton`.
5. Add all text keys to `en.js`, `mr.js`, `hi.js`.
6. Use `Button`, `Card`, `Badge`, `Sheet` primitives — do not restyle from scratch.
7. Add a transition via `<PageTransition>`.

## Recipe 2 — Add a store action
1. In `store/useAppStore.js`, add the action inside the `create(persist(...))` block.
2. If it changes `booking.status`, validate with `canTransition(from, to)` from `lib/jobMachine.js`.
3. Return new objects (immutable updates); trigger `toast` in the component, not the store.
4. Update `docs/TRD.md` data-model section if the shape changed.

## Recipe 3 — Add an i18n key
Add the same key to all three files:
```js
// en.js  'job.start':'Start job'
// mr.js  'job.start':'काम सुरू करा'
// hi.js  'job.start':'काम शुरू करें'
```
Use `const t = useT(); t('job.start')`. Keep strings short for Devanagari layout.

## Recipe 4 — Add / edit seed data
Edit `data/workers.js` or `data/services.js` only. Each worker needs: `id, name, services, baseFare, online, distanceKm, experienceYears, verified, checks, vouches, jobsDone, area, approved`. Vary distance (0.8–6 km), include 1–2 offline and 1 unapproved worker so admin and matching have something to show.

## Recipe 5 — Change pricing or matching
Edit only `lib/pricing.js` / `lib/matching.js` (pure functions). Keep constants in `lib/constants.js` (`FEE_RATE`, weights). Re-run the manual test script in `docs/TRD.md §12`.

## Design rules (tokens)
- Primary navy `--c-primary`, accent saffron `--c-accent`, success green `--c-verified`, danger red `--c-danger`.
- Radius `rounded-2xl` for cards, `rounded-full` for chips/buttons. Soft shadow `shadow-card`.
- Font: Inter + Noto Sans Devanagari. Body 16px min. Headings semi-bold.
- Trust badges: Verified (green + shield), Vouched (blue + handshake), New (grey + sparkle).

## Pre-commit checklist
- [ ] `npm run build` passes · [ ] lint clean · [ ] no console errors
- [ ] EN/MR/HI checked · [ ] sample-data badge present · [ ] FEATURES.md updated
